/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observable } from 'mobx';

import { IProperty } from '@cloudbeaver/core-blocks';
import { DBDriver, DriverPropertiesService } from '@cloudbeaver/core-connections';
import { injectable, IInitializableController } from '@cloudbeaver/core-di';
import { NotificationService } from '@cloudbeaver/core-events';
import { ObjectPropertyInfo } from '@cloudbeaver/core-sdk';
import { uuid } from '@cloudbeaver/core-utils';

export interface DriverPropertyState {
  [key: string]: string;
}

interface StaticId {
  staticId: string;
}

export type DriverPropertyInfoWithStaticId = ObjectPropertyInfo & StaticId;

@injectable()
export class DriverPropertiesController implements IInitializableController {
  @observable isLoading = false;
  @observable driver!: DBDriver;
  @observable hasDetails = false;
  @observable responseMessage: string | null = null;
  @observable driverProperties = observable<IProperty>([]);

  private loaded = false;
  private state!: Record<string, string>;

  constructor(
    private driverPropertiesService: DriverPropertiesService,
    private notificationService: NotificationService
  ) { }

  init(driver: DBDriver, state: Record<string, string>) {
    this.driver = driver;
    this.state = state;
  }

  addProperty = (key?: string, value?: string) => {
    this.driverProperties.unshift({
      id: uuid(),
      key: key ?? '',
      keyPlaceholder: 'property',
      defaultValue: value ?? '',
      new: !key,
    });
  };

  async loadDriverProperties() {
    if (this.isLoading || this.loaded) {
      return;
    }
    this.isLoading = true;
    try {
      const driverProperties = await this.driverPropertiesService.loadDriverProperties(this.driver.id);
      this.driverProperties = observable(driverProperties.map<IProperty>(property => ({
        id: property.id!,
        key: property.id!,
        displayName: property.displayName!,
        defaultValue: property.defaultValue,
        valuePlaceholder: property.defaultValue,
        description: property.description,
        validValues: property.validValues,
      })));

      for (const key of Object.keys(this.state)) {
        if (this.driverProperties.some(property => property.key === key)) {
          continue;
        }

        this.addProperty(key, this.state[key]);
      }
      this.loaded = true;
    } catch (exception) {
      this.notificationService.logException(exception, 'Can\'t load driver properties');
    } finally {
      this.isLoading = false;
    }
  }
}
