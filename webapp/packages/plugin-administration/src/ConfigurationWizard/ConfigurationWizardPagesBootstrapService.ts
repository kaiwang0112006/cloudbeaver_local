/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { AdministrationItemService, AdministrationItemType, ConfigurationWizardService } from '@cloudbeaver/core-administration';
import { injectable, Bootstrap } from '@cloudbeaver/core-di';

import { FinishPage } from './Finish/FinishPage';
import { FinishPageDrawerItem } from './Finish/FinishPageDrawerItem';
import { ServerConfigurationDrawerItem } from './ServerConfiguration/ServerConfigurationDrawerItem';
import { ServerConfigurationPage } from './ServerConfiguration/ServerConfigurationPage';
import { ServerConfigurationService } from './ServerConfiguration/ServerConfigurationService';
import { WelcomeDrawerItem } from './Welcome/WelcomeDrawerItem';
import { WelcomePage } from './Welcome/WelcomePage';

@injectable()
export class ConfigurationWizardPagesBootstrapService extends Bootstrap {
  constructor(
    private administrationItemService: AdministrationItemService,
    private configurationWizardService: ConfigurationWizardService,
    private serverConfigurationService: ServerConfigurationService
  ) {
    super();
  }

  register(): void | Promise<void> {
    this.administrationItemService.create({
      name: 'welcome',
      type: AdministrationItemType.ConfigurationWizard,
      configurationWizardOptions: {
        description: 'administration_configuration_wizard_welcome_step_description',
      },
      order: 1,
      getContentComponent: () => WelcomePage,
      getDrawerComponent: () => WelcomeDrawerItem,
    });
    this.administrationItemService.create({
      name: 'configuration',
      type: AdministrationItemType.Default,
      configurationWizardOptions: {
        description: 'administration_configuration_wizard_configuration_step_description',
        order: 1.1,
        isDone: this.serverConfigurationService.isDone.bind(this.serverConfigurationService),
        onFinish: this.serverConfigurationService.validate.bind(this.serverConfigurationService),
        onConfigurationFinish: this.serverConfigurationService.handleConfigurationFinish.bind(
          this.serverConfigurationService
        ),
      },
      order: 4,
      onActivate: this.serverConfigurationService.loadConfig.bind(this.serverConfigurationService),
      getContentComponent: () => ServerConfigurationPage,
      getDrawerComponent: () => ServerConfigurationDrawerItem,
    });
    this.administrationItemService.create({
      name: 'finish',
      type: AdministrationItemType.ConfigurationWizard,
      configurationWizardOptions: {
        description: 'administration_configuration_wizard_finish_step_description',
        isDisabled: () => !this.configurationWizardService.canFinish,
      },
      canActivate: () => this.configurationWizardService.canFinish,
      getContentComponent: () => FinishPage,
      getDrawerComponent: () => FinishPageDrawerItem,
    });
  }

  load(): void | Promise<void> { }
}
