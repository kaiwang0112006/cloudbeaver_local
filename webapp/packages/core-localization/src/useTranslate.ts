/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { useService } from '@cloudbeaver/core-di';

import { LocalizationService } from './LocalizationService';
import { TLocalizationToken } from './TLocalizationToken';

export function useTranslate(): ((token: TLocalizationToken) => string) {
  const localizationService = useService(LocalizationService);

  return localizationService.translate;
}
