/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react';

import { Snackbar } from '@cloudbeaver/core-blocks';
import { useController } from '@cloudbeaver/core-di';
import { INotification } from '@cloudbeaver/core-events';

import { NotificationItemController } from './NotificationItemController';

interface Props {
  notification: INotification<any>;
}

export const NotificationsItem: React.FC<Props> = observer(function Notification({ notification }) {
  const controller = useController(NotificationItemController, notification);

  if (notification.customComponent) {
    const Custom = notification.customComponent();
    return <Custom notification={notification} {...notification.extraProps} />;
  }

  return (
    <Snackbar
      title={notification.title}
      message={notification.message}
      type={notification.type}
      time={notification.timestamp}
      state={notification.state}
      disableShowDetails={controller.isDetailsDialogOpen}
      closeDelay={controller.closeAfter}
      onClose={notification.close}
      onShowDetails={controller.handleShowDetails}
    />
  );
});
