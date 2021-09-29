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
package io.cloudbeaver.service.auth.impl;

import io.cloudbeaver.*;
import io.cloudbeaver.model.session.WebAuthInfo;
import io.cloudbeaver.model.session.WebSession;
import io.cloudbeaver.model.user.WebAuthProviderInfo;
import io.cloudbeaver.model.user.WebUser;
import io.cloudbeaver.registry.WebAuthProviderDescriptor;
import io.cloudbeaver.registry.WebServiceRegistry;
import io.cloudbeaver.server.CBApplication;
import io.cloudbeaver.server.CBPlatform;
import io.cloudbeaver.service.auth.DBWServiceAuth;
import org.jkiss.dbeaver.DBException;
import org.jkiss.dbeaver.model.access.DBASession;
import org.jkiss.dbeaver.model.exec.DBCException;
import org.jkiss.utils.CommonUtils;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.Map;

/**
 * Web service implementation
 */
public class WebServiceAuthImpl implements DBWServiceAuth {

    @Override
    public WebAuthInfo authLogin(WebSession webSession, String providerId, Map<String, Object> authParameters) throws DBWebException {
        DBWSecurityController serverController = CBPlatform.getInstance().getApplication().getSecurityController();

        if (CommonUtils.isEmpty(providerId)) {
            throw new DBWebException("Missing auth provider parameter");
        }
        WebAuthProviderDescriptor authProvider = WebServiceRegistry.getInstance().getAuthProvider(providerId);
        if (authProvider == null) {
            throw new DBWebException("Invalid auth provider '" + providerId + "'");
        }
        try {
            Map<String, Object> providerConfig = Collections.emptyMap();

            DBWAuthProvider<?> authProviderInstance = authProvider.getInstance();
            DBWAuthProviderExternal<?> authProviderExternal = authProviderInstance instanceof DBWAuthProviderExternal<?> ?
                (DBWAuthProviderExternal<?>) authProviderInstance : null;
            if (authProviderExternal != null) {
                authParameters = authProviderExternal.readExternalCredentials(webSession.getProgressMonitor(), providerConfig, authParameters);
            }

            WebUser user = null;
            String userId = serverController.getUserByCredentials(authProvider, authParameters);
            if (userId == null) {
                // User doesn't exist. We can create new user automatically if auth provider supports this
                if (authProviderExternal != null) {
                    user = authProviderExternal.registerNewUser(webSession.getProgressMonitor(), serverController, providerConfig, authParameters);
                    userId = user.getUserId();
                }

                if (userId == null) {
                    throw new DBCException("Invalid user credentials");
                }
            }

            // Check for auth enabled. Auth is always enabled for admins
            if (!CBApplication.getInstance().getAppConfiguration().isAuthenticationEnabled()) {
                if (!serverController.getUserPermissions(userId).contains(DBWConstants.PERMISSION_ADMIN)) {
                    throw new DBWebException("Authentication was disabled for this server");
                }
            }

            Map<String, Object> userCredentials = serverController.getUserCredentials(userId, authProvider);

            DBASession authSession = authProviderInstance.openSession(
                webSession,
                providerConfig,
                userCredentials,
                authParameters);

            if (user == null) {
                user = new WebUser(userId);
            }
            if (authProviderExternal != null) {
                user.setDisplayName(authProviderExternal.getUserDisplayName(webSession.getProgressMonitor(), providerConfig, authParameters));
            }

            WebAuthInfo authInfo = new WebAuthInfo(webSession, user);
            authInfo.setLoginTime(OffsetDateTime.now());
            authInfo.setAuthProvider(authProvider);
            authInfo.setAuthSession(authSession);
            authInfo.setMessage("Authenticated with " + authProvider.getLabel() + " provider");
            webSession.setAuthInfo(authInfo);

            return authInfo;
        } catch (DBException e) {
            throw new DBWebException("User authentication failed", e);
        }
    }

    @Override
    public void authLogout(WebSession webSession) throws DBWebException {
        if (webSession.getUser() == null) {
            throw new DBWebException("Not logged in");
        }
        webSession.setAuthInfo(null);
    }

    @Override
    public WebAuthInfo sessionUser(WebSession webSession) throws DBWebException {
        if (webSession.getUser() == null) {
            return null;
        }
        return webSession.getAuthInfo();
    }

    @Override
    public WebAuthProviderInfo[] getAuthProviders(WebSession webSession) {
        return WebServiceRegistry.getInstance().getAuthProviders()
            .stream().map(WebAuthProviderInfo::new)
            .toArray(WebAuthProviderInfo[]::new);
    }

}
