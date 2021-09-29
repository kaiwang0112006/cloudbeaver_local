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
package io.cloudbeaver.service.admin;

import io.cloudbeaver.DBWAuthProviderExternal;
import io.cloudbeaver.DBWConnectionGrant;
import io.cloudbeaver.auth.provider.local.LocalAuthProvider;
import io.cloudbeaver.model.session.WebSession;
import io.cloudbeaver.model.user.WebRole;
import io.cloudbeaver.model.user.WebUser;
import io.cloudbeaver.model.user.WebUserOriginInfo;
import io.cloudbeaver.registry.WebAuthProviderDescriptor;
import io.cloudbeaver.registry.WebServiceRegistry;
import io.cloudbeaver.server.CBPlatform;
import org.jkiss.dbeaver.Log;
import org.jkiss.dbeaver.model.exec.DBCException;
import org.jkiss.dbeaver.model.meta.Property;
import org.jkiss.utils.CommonUtils;

import java.util.Map;

/**
 * Admin user info
 */
public class AdminUserInfo {

    private static final Log log = Log.getLog(AdminUserInfo.class);

    private final WebSession session;
    private final WebUser user;

    public AdminUserInfo(WebSession session, WebUser user) {
        this.session = session;
        this.user = user;
    }

    @Property
    public String getUserId() {
        return user.getUserId();
    }

    @Property
    public Map<String, String> getMetaParameters() {
        return user.getMetaParameters();
    }

    @Property
    public Map<String, Object> getConfigurationParameters() {
        return user.getConfigurationParameters();
    }

    @Property
    public String[] getGrantedRoles() throws DBCException {
        if (user.getRoles() == null) {
            WebRole[] userRoles = CBPlatform.getInstance().getApplication().getSecurityController().getUserRoles(getUserId());
            user.setRoles(userRoles);
        }
        return user.getGrantedRoles();
    }

    @Property
    public DBWConnectionGrant[] getGrantedConnections() throws DBCException {
        return CBPlatform.getInstance().getApplication().getSecurityController().getSubjectConnectionAccess(new String[] { getUserId()} );
    }

    @Property
    public WebUserOriginInfo getOrigin() {
        String providerId = user.getMetaParameter(DBWAuthProviderExternal.META_AUTH_PROVIDER);
        if (CommonUtils.isEmpty(providerId)) {
            providerId = LocalAuthProvider.PROVIDER_ID;
        }
        WebAuthProviderDescriptor authProvider = WebServiceRegistry.getInstance().getAuthProvider(providerId);
        if (authProvider == null) {
            log.error("Auth provider '" + providerId + "' not found");
        }
        return new WebUserOriginInfo(session, user, authProvider);
    }

}
