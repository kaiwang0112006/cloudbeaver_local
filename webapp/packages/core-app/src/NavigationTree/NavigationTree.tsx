/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react';
import styled, { css } from 'reshadow';

import { useFocus } from '@cloudbeaver/core-blocks';
import { useService } from '@cloudbeaver/core-di';
import { usePermission, EPermission } from '@cloudbeaver/core-root';
import { useActiveView } from '@cloudbeaver/core-view';

import { ROOT_NODE_PATH } from '../shared/NodesManager/NavNodeInfoResource';
import { ElementsTree } from './ElementsTree';
import { NavigationTreeService } from './NavigationTreeService';
import { useNavigationTree } from './useNavigationTree';

const navigationTreeStyles = css`
  inside-box {
    flex: 1;
    position: relative;
    min-width: 100%;
    overflow: auto;
    outline: none;
  }

  ElementsTree {
    padding-top: 16px;
    min-width: 100%;
    min-height: 100%;
    width: max-content;
  }

  center {
    display: flex;
    height: 100%;
    width: 100%;

    & message {
      margin: auto;
      text-align: center;
    }
  }

  message {
    box-sizing: border-box;
    max-width: 240px;
    padding: 24px;
  }
`;

export const NavigationTree = observer(function NavigationTree() {
  const navTreeService = useService(NavigationTreeService);
  const [onFocus, onBlur] = useActiveView(navTreeService.getView);
  const [ref] = useFocus<HTMLDivElement>({ onFocus, onBlur });
  const isEnabled = usePermission(EPermission.public);
  const { isSelected, handleOpen, handleSelect } = useNavigationTree();

  if (!isEnabled) {
    return null;
  }

  return styled(navigationTreeStyles)(
    <inside-box ref={ref} as='div' tabIndex={0}>
      <ElementsTree
        root={ROOT_NODE_PATH}
        emptyPlaceholder={() => styled(navigationTreeStyles)(
          <center as="div">
            <message as="div">
              No connections.<br />
              Use the top menu to setup connection to your database.
            </message>
          </center>
        )}
        isSelected={isSelected}
        onOpen={handleOpen}
        onSelect={handleSelect}
      />
    </inside-box>
  );
});
