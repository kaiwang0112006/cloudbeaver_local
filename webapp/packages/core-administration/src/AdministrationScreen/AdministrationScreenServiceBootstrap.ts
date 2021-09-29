/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { injectable, Bootstrap } from '@cloudbeaver/core-di';
import { ServerConfigResource } from '@cloudbeaver/core-root';
import { ScreenService } from '@cloudbeaver/core-routing';

import { AdministrationScreen } from './AdministrationScreen';
import { AdministrationScreenService } from './AdministrationScreenService';
import { ConfigurationWizardScreen } from './ConfigurationWizard/ConfigurationWizardScreen';

@injectable()
export class AdministrationScreenServiceBootstrap extends Bootstrap {
  constructor(
    private screenService: ScreenService,
    private administrationScreenService: AdministrationScreenService,
    private serverConfigResource: ServerConfigResource
  ) {
    super();
  }

  register(): void {
    this.screenService.create({
      name: AdministrationScreenService.screenName,
      routes: [
        {
          name: AdministrationScreenService.screenName,
          path: '/admin',
          canActivate: () => this.administrationScreenService.handleCanActivate.bind(this.administrationScreenService),
        },
        {
          name: AdministrationScreenService.itemRouteName,
          path: '/:item',
          canActivate: () => this.administrationScreenService.handleCanActivate.bind(this.administrationScreenService),
        },
        {
          name: AdministrationScreenService.itemSubRouteName,
          path: '/:sub',
          canActivate: () => this.administrationScreenService.handleCanActivate.bind(this.administrationScreenService),
        },
        {
          name: AdministrationScreenService.itemSubParamRouteName,
          path: '/:param',
          canActivate: () => this.administrationScreenService.handleCanActivate.bind(this.administrationScreenService),
        },
      ],
      component: AdministrationScreen,
      onActivate: this.administrationScreenService.handleActivate.bind(this.administrationScreenService),
      onDeactivate: this.administrationScreenService.handleDeactivate.bind(this.administrationScreenService),
    });

    this.screenService.create({
      name: AdministrationScreenService.setupName,
      routes: [
        {
          name: AdministrationScreenService.setupName,
          path: '/setup',
          canActivate: () => this.administrationScreenService.handleCanActivate.bind(this.administrationScreenService),
        },
        {
          name: AdministrationScreenService.setupItemRouteName,
          path: '/:item',
          canActivate: () => this.administrationScreenService.handleCanActivate.bind(this.administrationScreenService),
        },
        {
          name: AdministrationScreenService.setupItemSubRouteName,
          path: '/:sub',
          canActivate: () => this.administrationScreenService.handleCanActivate.bind(this.administrationScreenService),
        },
        {
          name: AdministrationScreenService.setupItemSubParamRouteName,
          path: '/:param',
          canActivate: () => this.administrationScreenService.handleCanActivate.bind(this.administrationScreenService),
        },
      ],
      component: ConfigurationWizardScreen,
      onActivate: this.administrationScreenService.handleActivate.bind(this.administrationScreenService),
      onDeactivate: this.administrationScreenService.handleDeactivate.bind(this.administrationScreenService),
    });
  }

  async load(): Promise<void> {
    await this.serverConfigResource.load();

    if (this.administrationScreenService.isConfigurationMode
      && !this.screenService.isActive(this.screenService.routerService.route, AdministrationScreenService.setupName)) {
      this.administrationScreenService.navigateToRoot();
    }
  }
}
