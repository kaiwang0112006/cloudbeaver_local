/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { injectable } from '@cloudbeaver/core-di';
import {
  GraphQLService,
  CachedMapResource,
  DriverInfo
} from '@cloudbeaver/core-sdk';
import { MetadataMap } from '@cloudbeaver/core-utils';

export type DBDriver = Pick<
DriverInfo,
| 'id'
| 'name'
| 'icon'
| 'description'
| 'defaultPort'
| 'defaultDatabase'
| 'defaultServer'
| 'defaultUser'
| 'sampleURL'
| 'embedded'
| 'anonymousAccess'
| 'promotedScore'
| 'defaultAuthModel'
>;

@injectable()
export class DBDriverResource extends CachedMapResource<string, DBDriver> {
  private loadedKeyMetadata: MetadataMap<string, boolean>;

  constructor(private graphQLService: GraphQLService) {
    super(new Map());
    this.loadedKeyMetadata = new MetadataMap(() => false);
  }

  has(id: string): boolean {
    if (this.loadedKeyMetadata.has(id)) {
      return this.loadedKeyMetadata.get(id);
    }

    return this.data.has(id);
  }

  async loadAll(): Promise<Map<string, DBDriver>> {
    await this.load('all');
    return this.data;
  }

  compare(driverA: DBDriver, driverB: DBDriver): number {
    if (driverA.promotedScore === driverB.promotedScore) {
      return (driverA.name || '').localeCompare((driverB.name || ''));
    }

    return (driverB.promotedScore || 0) - (driverA.promotedScore || 0);
  }

  protected async loader(key: string): Promise<Map<string, DBDriver>> {
    const { driverList } = await this.graphQLService.sdk.driverList();

    this.data.clear();

    for (const driver of driverList) {
      this.set(driver.id, driver);
    }

    // TODO: driverList must accept driverId, so we can update some drivers or all drivers,
    //       here we should check is it's was a full update
    this.loadedKeyMetadata.set('all', true);

    return this.data;
  }
}
