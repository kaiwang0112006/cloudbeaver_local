/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { injectable } from '@cloudbeaver/core-di';

import { CachedResource } from './CachedResource';

@injectable()
export abstract class CachedDataResource<
  TData,
  TParam,
  TKey = TParam,
> extends CachedResource<TData, TParam, TKey> {
  async refresh(param: TParam): Promise<TData> {
    await this.loadData(param, true);
    return this.data;
  }

  async load(param: TParam): Promise<TData> {
    await this.loadData(param);
    return this.data;
  }
}
