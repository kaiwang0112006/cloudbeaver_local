/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react';
import { useRef, useLayoutEffect } from 'react';
import styled, { css } from 'reshadow';

import { useAppLoadingSreen } from '@cloudbeaver/core-blocks';
import { useService } from '@cloudbeaver/core-di';
import { DialogsPortal } from '@cloudbeaver/core-dialogs';
import { Notifications } from '@cloudbeaver/core-notifications';
import { ScreenService } from '@cloudbeaver/core-routing';
import { useStyles } from '@cloudbeaver/core-theming';

import { useAppVersion } from './useAppVersion';

const bodyStyles = css`
  theme {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

export const Body = observer(function Body() {
  useAppLoadingSreen();
  const ref = useRef<HTMLDivElement>(null);
  const screenService = useService(ScreenService);
  const Screen = screenService.screen?.component;
  const { backendVersion } = useAppVersion();

  // sync classes from theme with body for popup components and etc
  useLayoutEffect(() => {
    if (ref.current) {
      document.body.className = ref.current.className;
    }
    document.documentElement.dataset.backendVersion = backendVersion;
  });

  return styled(useStyles(bodyStyles))(
    <theme ref={ref} as="div">
      {Screen && <Screen />}
      <DialogsPortal />
      <Notifications />
    </theme>
  );
});
