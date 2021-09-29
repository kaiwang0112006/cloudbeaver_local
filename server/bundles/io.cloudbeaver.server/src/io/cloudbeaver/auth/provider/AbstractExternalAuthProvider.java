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
package io.cloudbeaver.auth.provider;

import io.cloudbeaver.DBWAuthProviderExternal;
import io.cloudbeaver.model.user.WebUser;
import org.jkiss.dbeaver.model.access.DBASession;
import org.jkiss.utils.CommonUtils;

/**
 * Abstract external auth provider
 */
public abstract class AbstractExternalAuthProvider<SESSION extends DBASession> implements DBWAuthProviderExternal<SESSION> {

    protected void setUserOrigin(WebUser user, String type, String subType) {
        user.setMetaParameter(META_AUTH_PROVIDER, type);
        if (!CommonUtils.isEmpty(subType)) {
            user.setMetaParameter(META_AUTH_SPACE_ID, subType);
        }
    }

}
