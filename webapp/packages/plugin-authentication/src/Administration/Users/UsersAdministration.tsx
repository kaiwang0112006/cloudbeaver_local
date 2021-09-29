/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react';
import styled, { css, use } from 'reshadow';

import { AdministrationTools, AdministrationItemContentProps, ADMINISTRATION_TOOLS_STYLES } from '@cloudbeaver/core-administration';
import { Loader, IconButton } from '@cloudbeaver/core-blocks';
import { useController, useService } from '@cloudbeaver/core-di';
import { useStyles, composes } from '@cloudbeaver/core-theming';

import { CreateUser } from './CreateUser';
import { CreateUserService } from './CreateUserService';
import { UsersAdministrationController } from './UsersAdministrationController';
import { UsersTable } from './UsersTable/UsersTable';

const styles = composes(
  css`
    layout-grid-cell {
      composes: theme-background-surface theme-text-on-surface from global;
    }

    layout-grid-cell {
      composes: theme-border-color-background from global;
    }
  `,
  css`
    layout-grid {
      width: 100%;
    }

    layout-grid, layout-grid-inner {
      min-height: 100%;
    }

    layout-grid-cell {
      position: relative;
      border: solid 1px;
    }

    AdministrationTools {
      border: none;
    }

    Loader {
      height: 100%;
    }
  `
);

export const UsersAdministration = observer(function UsersAdministration({
  sub,
}: AdministrationItemContentProps) {
  const service = useService(CreateUserService);
  const controller = useController(UsersAdministrationController);

  return styled(useStyles(styles, ADMINISTRATION_TOOLS_STYLES))(
    <layout-grid as="div">
      <layout-grid-inner as="div">
        <layout-grid-cell as='div' {...use({ span: 12 })}>
          {controller.isProvidersLoading
            ? <Loader />
            : (
              <>
                <AdministrationTools>
                  {controller.isLocalProviderAvailable && (
                    <>
                      <IconButton name="add" viewBox="0 0 28 28" disabled={sub && !!service.user} onClick={service.create} />
                      <IconButton name="trash" viewBox="0 0 28 28" disabled={!controller.itemsSelected} onClick={controller.delete} />
                    </>
                  )}
                  <IconButton name="refresh-outline" viewBox="0 0 28 28" onClick={controller.update} />
                </AdministrationTools>
                {sub && service.user && (
                  <CreateUser user={service.user} onCancel={service.cancelCreate} />
                )}
                <UsersTable
                  users={controller.users}
                  selectedItems={controller.selectedItems}
                  expandedItems={controller.expandedItems}
                  selectable={controller.isLocalProviderAvailable}
                />
                <Loader loading={controller.isLoading} overlay />
              </>
            )}
        </layout-grid-cell>
      </layout-grid-inner>
    </layout-grid>
  );
});
