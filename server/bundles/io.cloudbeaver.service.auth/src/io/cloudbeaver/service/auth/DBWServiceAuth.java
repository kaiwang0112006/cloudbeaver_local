/*
 * DBeaver - Universal Database Manager
 * Copyright (C) 2010-2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.cloudbeaver.service.auth;

import io.cloudbeaver.DBWService;
import io.cloudbeaver.DBWebException;
import io.cloudbeaver.WebAction;
import io.cloudbeaver.model.session.WebAuthInfo;
import io.cloudbeaver.model.session.WebSession;
import io.cloudbeaver.model.user.WebAuthProviderInfo;

import java.util.Map;

/**
 * Web service API
 */
public interface DBWServiceAuth extends DBWService {

    @WebAction(requirePermissions = {} )
    WebAuthInfo authLogin(WebSession webSession, String providerId, Map<String, Object> credentials) throws DBWebException;

    @WebAction(requirePermissions = {} )
    void authLogout(WebSession webSession) throws DBWebException;

    @WebAction(requirePermissions = {})
    WebAuthInfo sessionUser(WebSession webSession) throws DBWebException;

    @WebAction(requirePermissions = {})
    WebAuthProviderInfo[] getAuthProviders(WebSession webSession);
}
