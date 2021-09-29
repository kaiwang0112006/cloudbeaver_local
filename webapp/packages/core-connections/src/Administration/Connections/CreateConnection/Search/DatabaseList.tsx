/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react';
import { useCallback, useState } from 'react';
import styled, { css } from 'reshadow';

import {
  ItemListSearch, ItemList, SubmittingForm, TextPlaceholder
} from '@cloudbeaver/core-blocks';
import { useTranslate } from '@cloudbeaver/core-localization';
import { AdminConnectionSearchInfo } from '@cloudbeaver/core-sdk';
import { composes, useStyles } from '@cloudbeaver/core-theming';

import { Database } from './Database';

const styles = composes(
  css`
    SubmittingForm {
      composes: theme-background-surface theme-text-on-surface from global;
    }
  `,
  css`
    SubmittingForm {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `
);

interface Props {
  databases: AdminConnectionSearchInfo[];
  hosts: string;
  disabled?: boolean;
  className?: string;
  onSelect: (database: AdminConnectionSearchInfo) => void;
  onChange: (hosts: string) => void;
  onSearch?: () => Promise<void>;
}

export const DatabaseList = observer(function DatabaseList({
  databases, hosts, disabled, className, onSelect, onChange, onSearch,
}: Props) {
  const translate = useTranslate();
  const [isSearched, setIsSearched] = useState(false);

  const searchHandler = useCallback(() => {
    if (onSearch) {
      onSearch().then(() => {
        setIsSearched(true);
      });
    }
  }, [onSearch]);

  const placeholderMessage = isSearched ? 'connections_not_found' : 'connections_administration_search_database_tip';

  return styled(useStyles(styles))(
    <SubmittingForm className={className} onSubmit={onSearch}>
      <ItemList>
        <ItemListSearch value={hosts} placeholder={translate('connections_administration_search_database_tip')} disabled={disabled} onChange={onChange} onSearch={searchHandler} />
        {databases.map(database => (
          <Database key={database.host + database.port} database={database} onSelect={onSelect} />
        ))}
      </ItemList>
      {!databases.length && <TextPlaceholder>{translate(placeholderMessage)}</TextPlaceholder>}
    </SubmittingForm>
  );
});
