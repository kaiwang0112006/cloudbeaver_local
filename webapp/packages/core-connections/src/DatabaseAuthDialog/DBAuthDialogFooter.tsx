/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react';
import styled, { css } from 'reshadow';

import { Button } from '@cloudbeaver/core-blocks';
import { useTranslate } from '@cloudbeaver/core-localization';

const styles = css`
  controls {
    display: flex;
    height: 100%;
    flex: 1;
    align-items: center;
    margin: auto;
    justify-content: flex-end;
  }
`;

export interface Props {
  isAuthenticating: boolean;
  onLogin: () => void;
}

export const DBAuthDialogFooter = observer(function DBAuthDialogFooter({
  isAuthenticating,
  onLogin,
}: Props) {
  const translate = useTranslate();

  return styled(styles)(
    <controls as="div">
      <Button
        type="button"
        mod={['unelevated']}
        disabled={isAuthenticating}
        onClick={onLogin}
      >
        {translate('authentication_login')}
      </Button>
    </controls>
  );
});
