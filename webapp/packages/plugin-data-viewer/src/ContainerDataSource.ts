/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { GraphQLService, SqlDataFilterConstraint } from '@cloudbeaver/core-sdk';

import { DatabaseDataSource } from './DatabaseDataModel/DatabaseDataSource';
import { IDatabaseDataResult } from './DatabaseDataModel/IDatabaseDataResult';
import { DataUpdate } from './DatabaseDataModel/IDatabaseDataSource';
import { IExecutionContext } from './IExecutionContext';

export interface IDataContainerOptions {
  containerNodePath: string;
  connectionId: string;
  whereFilter: string;
  constraints: SqlDataFilterConstraint[];
}

export interface IDataContainerResult extends IDatabaseDataResult {

}

export class ContainerDataSource extends DatabaseDataSource<IDataContainerOptions, IDataContainerResult> {
  canCancel: boolean;
  private executionContext: IExecutionContext | null;

  constructor(private graphQLService: GraphQLService) {
    super();
    this.executionContext = null;
    this.canCancel = false;
  }

  cancel(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async request(
    prevResults: IDataContainerResult[]
  ): Promise<IDataContainerResult[]> {
    if (!this.options?.containerNodePath) {
      throw new Error('containerNodePath must be provided for table');
    }
    const executionContext = await this.ensureContextCreated();
    const limit = this.count;

    const { readDataFromContainer } = await this.graphQLService.sdk.readDataFromContainer({
      connectionId: executionContext.connectionId,
      contextId: executionContext.contextId,
      containerNodePath: this.options.containerNodePath,
      filter: {
        offset: this.offset,
        limit,
        constraints: this.options.constraints,
        where: this.options.whereFilter || undefined,
      },
      dataFormat: this.dataFormat,
    });

    this.requestInfo = {
      requestDuration: readDataFromContainer?.duration || 0,
      requestMessage: readDataFromContainer?.statusMessage || '',
    };
    if (!readDataFromContainer?.results) {
      return prevResults;
    }

    return readDataFromContainer.results.map<IDataContainerResult>(result => ({
      id: result.resultSet?.id || '0',
      dataFormat: result.dataFormat!,
      loadedFully: (result.resultSet?.rows?.length || 0) < limit,
      // allays returns false
      // || !result.resultSet?.hasMoreData,
      data: result.resultSet,
    }));
  }

  async save(
    prevResults: IDataContainerResult[],
    data: DataUpdate
  ): Promise<IDataContainerResult[]> {
    const executionContext = await this.ensureContextCreated();

    const response = await this.graphQLService.sdk.updateResultsDataBatch({
      connectionId: executionContext.connectionId,
      contextId: executionContext.contextId,
      resultsId: data.data.id,
      // updatedRows: this.getRowsDiff(data),
    });

    this.requestInfo = {
      requestDuration: response.result?.duration || 0,
      requestMessage: 'Saved successfully',
    };

    throw new Error('Not implemented');
  }

  async dispose(): Promise<void> {
    if (this.executionContext) {
      await this.graphQLService.sdk.sqlContextDestroy({
        connectionId: this.executionContext.connectionId,
        contextId: this.executionContext.contextId,
      });
    }
  }

  private async ensureContextCreated(): Promise<IExecutionContext> {
    if (!this.executionContext) {
      if (!this.options) {
        throw new Error('Options must be provided');
      }
      this.executionContext = await this.createExecutionContext(this.options.connectionId);
    }
    return this.executionContext;
  }

  private async createExecutionContext(
    connectionId: string,
    defaultCatalog?: string,
    defaultSchema?: string
  ): Promise<IExecutionContext> {
    const response = await this.graphQLService.sdk.sqlContextCreate({
      connectionId,
      defaultCatalog,
      defaultSchema,
    });
    return {
      contextId: response.context.id,
      connectionId,
      objectCatalogId: response.context.defaultCatalog,
      objectSchemaId: response.context.defaultSchema,
    };
  }
}
