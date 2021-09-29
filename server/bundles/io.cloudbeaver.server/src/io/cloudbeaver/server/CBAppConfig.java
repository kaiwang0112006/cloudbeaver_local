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
package io.cloudbeaver.server;

import io.cloudbeaver.auth.provider.local.LocalAuthProvider;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Application configuration
 */
public class CBAppConfig {
    private boolean anonymousAccessEnabled = true;
    private boolean authenticationEnabled = true;
    private String anonymousUserRole = CBConstants.DEFAUL_APP_ANONYMOUS_ROLE_NAME;
    private String defaultUserRole = CBConstants.DEFAUL_APP_ANONYMOUS_ROLE_NAME;
    private boolean supportsCustomConnections = true;
    private boolean supportsConnectionBrowser = false;
    private boolean supportsUserWorkspaces = false;
    private String[] enabledDrivers = new String[0];
    private String[] disabledDrivers = new String[0];
    private String defaultAuthProvider = LocalAuthProvider.PROVIDER_ID;
    private Map<String, Object> plugins = new LinkedHashMap<>();

    public boolean isAuthenticationEnabled() {
        return authenticationEnabled;
    }

    public void setAuthenticationEnabled(boolean authenticationEnabled) {
        this.authenticationEnabled = authenticationEnabled;
    }

    public boolean isAnonymousAccessEnabled() {
        return anonymousAccessEnabled;
    }

    public void setAnonymousAccessEnabled(boolean anonymousAccessEnabled) {
        this.anonymousAccessEnabled = anonymousAccessEnabled;
    }

    public String getAnonymousUserRole() {
        return anonymousUserRole;
    }

    public String getDefaultUserRole() {
        return defaultUserRole;
    }

    public boolean isSupportsCustomConnections() {
        return supportsCustomConnections;
    }

    public void setSupportsCustomConnections(boolean supportsCustomConnections) {
        this.supportsCustomConnections = supportsCustomConnections;
    }

    public boolean isSupportsConnectionBrowser() {
        return supportsConnectionBrowser;
    }

    public boolean isSupportsUserWorkspaces() {
        return supportsUserWorkspaces;
    }

    public String[] getEnabledDrivers() {
        return enabledDrivers;
    }

    public String[] getDisabledDrivers() {
        return disabledDrivers;
    }

    public String getDefaultAuthProvider() {
        return defaultAuthProvider;
    }

    public Map<String, Object> getPlugins() {
        return plugins;
    }

    public Map<String, Object> getPluginConfig(String pluginId) {
        return getPluginConfig(pluginId, false);
    }

    public Map<String, Object> getPluginConfig(String pluginId, boolean create) {
        Object config = plugins.get(pluginId);
        if (config instanceof Map) {
            return (Map<String, Object>) config;
        } else {
            if (create) {
                Map<String, Object> newConfig = new LinkedHashMap<>();
                plugins.put(pluginId, newConfig);
                return newConfig;
            } else {
                return Collections.emptyMap();
            }
        }
    }

    public <T> T getPluginOption(String pluginId, String option) {
        return (T)getPluginConfig(pluginId).get(option);
    }

}
