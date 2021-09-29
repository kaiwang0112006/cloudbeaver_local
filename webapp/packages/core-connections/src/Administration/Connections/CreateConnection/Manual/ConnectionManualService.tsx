/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { injectable } from '@cloudbeaver/core-di';

import { DBDriverResource } from '../../../../DBDriverResource';
import { ConnectionsResource } from '../../../ConnectionsResource';
import { CreateConnectionService } from '../../CreateConnectionService';

@injectable()
export class ConnectionManualService {
  get disabled(): boolean {
    return this.createConnectionService.disabled;
  }

  set disabled(value: boolean) {
    this.createConnectionService.disabled = value;
  }

  constructor(
    private dbDriverResource: DBDriverResource,
    private connectionsResource: ConnectionsResource,
    private createConnectionService: CreateConnectionService
  ) {
    this.select = this.select.bind(this);
    this.load = this.load.bind(this);
  }

  select(driverId: string): void {
    this.createConnectionService.setConnectionTemplate(
      {
        ...this.connectionsResource.getEmptyConnection(),
        driverId,
      },
      [driverId]
    );
  }

  async load(): Promise<void> {
    await this.dbDriverResource.loadAll();
  }
}
