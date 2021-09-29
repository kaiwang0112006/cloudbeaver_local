/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { css } from 'reshadow';

import { composes } from '@cloudbeaver/core-theming';

export const TREE_NODE_STYLES = composes(
  css`
    TreeNodeControl {
      composes: theme-ripple theme-ripple-selectable from global;
    }
  `,
  css`
    node {
      box-sizing: border-box;
      width: fit-content;
      min-width: 100%;

      &[use|expanded] {
        & > TreeNodeNested {
          display: block;
        }

        & > TreeNodeControl > TreeNodeExpand {
          transform: rotate(90deg);
        }
      }

      & TreeNodeControl {
        box-sizing: border-box;
        height: 20px;
        display: flex;
        align-items: center;
        padding: 0px 5px;
        user-select: none;
        white-space: nowrap;
        position: initial;
        outline: none;

        &::before {
          left: 0;
          top: auto;
          height: inherit;
          width: 100%;
        }

        & > * {
          margin-right: 4px;
          margin-left: 4px;
        }
      }
    }

    TreeNodeExpand {
      display: flex;
      box-sizing: border-box;
      flex-shrink: 0;
      opacity: 0.5;
      width: 16px;
      height: 16px;

      & [|size='small'] {
        display: block;
      }

      & [|size='big'] {
        display: none;
      }
    }

    TreeNodeIcon {
      box-sizing: border-box;
      flex-shrink: 0;
      width: 16px;
      height: 16px;
    }

    TreeNodeName {
      box-sizing: border-box;
      padding-right: 16px;
    }

    TreeNodeNested {
      box-sizing: border-box;
      padding: 2px 0;
      padding-left: 24px;
      display: none;
    }

    node TreeNodeControl[big] {
      height: 46px;
      padding: 0;

      & TreeNodeSelect {
        margin: 3px;
      }
      & TreeNodeName {
        margin: 0;
        padding-right: 16px;
        padding-left: 16px;
      }
      & TreeNodeIcon,
      & TreeNodeExpand {
        width: 24px;
        height: 24px;
      }

      & TreeNodeExpand [|size='small'] {
        display: none;
      }

      & TreeNodeExpand [|size='big'] {
        display: block;
      }

      & > * {
        margin-right: 11px;
        margin-left: 11px;
      }
    }

    node TreeNodeControl[big] + TreeNodeNested {
      padding-left: 46px;
    }
  `
);
