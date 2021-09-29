/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { AdministrationItemService } from '@cloudbeaver/core-administration';
import { UsersResource } from '@cloudbeaver/core-authentication';
import { injectable, Bootstrap } from '@cloudbeaver/core-di';
import { NotificationService } from '@cloudbeaver/core-events';

import { CreateUserService } from './CreateUserService';
import { UsersAdministration } from './UsersAdministration';
import { UsersAdministrationNavigationService } from './UsersAdministrationNavigationService';
import { UsersDrawerItem } from './UsersDrawerItem';

@injectable()
export class UsersAdministrationService extends Bootstrap {
  constructor(
    private administrationItemService: AdministrationItemService,
    private notificationService: NotificationService,
    private usersResource: UsersResource,
    private createUserService: CreateUserService
  ) {
    super();
  }

  register() {
    this.administrationItemService.create({
      name: UsersAdministrationNavigationService.ItemName,
      order: 3,
      sub: [
        {
          name: UsersAdministrationNavigationService.CreateItemName,
          onDeActivate: this.cancelCreate.bind(this),
        },
      ],
      getContentComponent: () => UsersAdministration,
      getDrawerComponent: () => UsersDrawerItem,
      onActivate: this.loadUsers.bind(this),
    });
  }

  load(): void | Promise<void> { }

  private async cancelCreate() {
    this.createUserService.close();
  }

  private async loadUsers() {
    try {
      await this.usersResource.loadAll();
    } catch (exception) {
      this.notificationService.logException(exception, 'Error occurred while loading users');
    }
  }
}
