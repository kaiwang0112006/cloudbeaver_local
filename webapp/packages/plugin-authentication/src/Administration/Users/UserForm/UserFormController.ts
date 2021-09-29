/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observable, computed } from 'mobx';

import { isLocalUser, RolesResource, UsersResource } from '@cloudbeaver/core-authentication';
import { AdminConnection, ConnectionsResource, DBDriverResource } from '@cloudbeaver/core-connections';
import { injectable, IInitializableController, IDestructibleController } from '@cloudbeaver/core-di';
import { CommonDialogService } from '@cloudbeaver/core-dialogs';
import { NotificationService } from '@cloudbeaver/core-events';
import { ErrorDetailsDialog } from '@cloudbeaver/core-notifications';
import {
  GQLErrorCatcher, AdminConnectionGrantInfo, AdminSubjectType, AdminUserInfo, AdminRoleInfo
} from '@cloudbeaver/core-sdk';

interface IUserCredentials {
  login: string;
  password: string;
  passwordRepeat: string;
  roles: Map<string, boolean>;
}

@injectable()
export class UserFormController implements IInitializableController, IDestructibleController {
  @observable
  readonly selectedConnections: Map<string, boolean>;

  @observable grantedConnections: AdminConnectionGrantInfo[];
  @observable isSaving: boolean;
  @observable isLoading: boolean;
  @observable credentials: IUserCredentials;

  @computed get connections(): AdminConnection[] {
    return Array.from(this.connectionsResource.data.values());
  }

  @computed get roles(): AdminRoleInfo[] {
    return Array.from(this.rolesResource.data.values());
  }

  get local(): boolean {
    return isLocalUser(this.user);
  }

  user!: AdminUserInfo;

  readonly error: GQLErrorCatcher;

  private isDistructed: boolean;
  private connectionAccessChanged: boolean;
  private connectionAccessLoaded: boolean;
  private collapse!: () => void;
  private editing!: boolean;

  constructor(
    private notificationService: NotificationService,
    private commonDialogService: CommonDialogService,
    private rolesResource: RolesResource,
    private usersResource: UsersResource,
    private connectionsResource: ConnectionsResource,
    private dbDriverResource: DBDriverResource
  ) {
    this.selectedConnections = new Map();
    this.grantedConnections = [];
    this.isSaving = false;
    this.isLoading = true;
    this.credentials = {
      login: '',
      password: '',
      passwordRepeat: '',
      roles: new Map(),
    };
    this.error = new GQLErrorCatcher();
    this.isDistructed = false;
    this.connectionAccessChanged = false;
    this.connectionAccessLoaded = false;
  }

  init(): void { }

  update(user: AdminUserInfo, editing: boolean, collapse: () => void): void {
    const prevUser = this.user;
    this.user = user;
    this.editing = editing;
    this.collapse = collapse;
    if (prevUser !== this.user) {
      this.loadRoles();
    }
  }

  destruct(): void {
    this.isDistructed = true;
  }

  save = async () => {
    if (this.isSaving) {
      return;
    }
    if (!this.validate()) {
      return;
    }

    this.isSaving = true;
    try {
      if (!this.editing) {
        await this.usersResource.create({
          userId: this.credentials.login,
          credentials: { password: this.credentials.password },
          roles: this.getGrantedRoles(),
          grantedConnections: this.getGrantedConnections(),
        });
        this.collapse();
        this.notificationService.logSuccess({ title: 'authentication_administration_user_created' });
      } else {
        if (this.credentials.password) {
          await this.usersResource.updateCredentials(this.user.userId, { password: this.credentials.password });
        }
        await this.updateRoles();
        await this.saveConnectionPermissions();
        await this.usersResource.refresh(this.user.userId);
        this.notificationService.logSuccess({ title: 'authentication_administration_user_updated' });
      }
    } catch (exception) {
      if (!this.error.catch(exception) || this.isDistructed) {
        if (!this.editing) {
          this.notificationService.logException(exception, 'Error creating new user');
        } else {
          this.notificationService.logException(exception, 'Error saving user');
        }
      }
    } finally {
      this.isSaving = false;
    }
  };

  showDetails = () => {
    if (this.error.exception) {
      this.commonDialogService.open(ErrorDetailsDialog, this.error.exception);
    }
  };

  handleConnectionsAccessChange = () => { this.connectionAccessChanged = true; };

  loadConnectionsAccess = async () => {
    if (this.isLoading || this.connectionAccessLoaded) {
      return;
    }

    this.isLoading = true;
    try {
      if (this.editing) {
        this.grantedConnections = await this.usersResource.loadConnections(this.user.userId);

        this.selectedConnections.clear();
        for (const connection of this.grantedConnections) {
          if (connection.subjectType !== AdminSubjectType.Role) {
            this.selectedConnections.set(connection.connectionId, true);
          }
        }
      }
      this.connectionAccessLoaded = true;
    } catch (exception) {
      this.notificationService.logException(exception, 'authentication_administration_user_connections_access_load_fail');
    }
    await this.loadConnections();
    this.isLoading = false;
  };

  private validate() {
    if (!this.editing) {
      if (!this.credentials.login.trim()) {
        this.notificationService.logError({ title: 'authentication_user_login_not_set' });
        return;
      }

      if (this.rolesResource.has(this.credentials.login)) {
        this.notificationService.logError({ title: 'authentication_user_login_cant_be_used' });
        return;
      }

      if (this.usersResource.has(this.credentials.login)) {
        this.notificationService.logError({ title: 'authentication_user_login_already_exists' });
        return;
      }
    }

    if (!this.isRoleSelected()) {
      this.notificationService.logError({ title: 'authentication_user_role_not_set' });
      return;
    }

    if (!this.credentials.password && !this.editing) {
      this.notificationService.logError({ title: 'authentication_user_password_not_set' });
      return;
    }

    if (!this.credentials.password && !this.editing) {
      this.notificationService.logError({ title: 'authentication_user_password_not_set' });
      return;
    }

    if (this.credentials.password !== this.credentials.passwordRepeat) {
      this.notificationService.logError({ title: 'authentication_user_passwords_not_match' });
      return;
    }

    return true;
  }

  private isRoleSelected() {
    return Array.from(this.credentials.roles.values())
      .some(Boolean);
  }

  private async updateRoles() {
    for (const [roleId, checked] of this.credentials.roles) {
      if (checked) {
        if (!this.user.grantedRoles.includes(roleId)) {
          await this.usersResource.grantRole(this.user.userId, roleId, true);
        }
      } else {
        await this.usersResource.revokeRole(this.user.userId, roleId, true);
      }
    }
  }

  private getGrantedRoles() {
    return Array.from(this.credentials.roles.keys()).filter(roleId => this.credentials.roles.get(roleId));
  }

  private getGrantedConnections() {
    return Array.from(this.selectedConnections.keys())
      .filter(connectionId => {
        const connectionPermission = this.grantedConnections.find(
          connectionPermission => connectionPermission.connectionId === connectionId
        );
        return this.selectedConnections.get(connectionId)
          && connectionPermission?.subjectType !== AdminSubjectType.Role;
      });
  }

  private async saveConnectionPermissions() {
    if (!this.connectionAccessChanged) {
      return;
    }
    await this.usersResource.setConnections(this.user.userId, this.getGrantedConnections());
    this.connectionAccessChanged = false;
    this.connectionAccessLoaded = false;
    await this.loadConnectionsAccess();
  }

  private async loadRoles() {
    try {
      await this.rolesResource.loadAll();
      await this.loadUser();
    } catch (exception) {
      this.notificationService.logException(exception, 'Can\'t load roles');
    } finally {
      this.isLoading = false;
    }
  }

  private async loadUser() {
    try {
      this.credentials.login = this.user.userId;
      this.credentials.roles = new Map(this.user.grantedRoles.map(roleId => ([roleId, true])));
    } catch (exception) {
      this.notificationService.logException(exception, 'Can\'t load user');
    }
  }

  private async loadConnections() {
    try {
      await this.dbDriverResource.loadAll();
      await this.connectionsResource.loadAll();
    } catch (exception) {
      this.notificationService.logException(exception, 'authentication_administration_user_connections_access_connections_load_fail');
    }
  }
}
