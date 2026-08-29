package com.coremedia.workflow.manager.config;

import com.coremedia.cms.common.plugins.beans_for_plugins2.CommonBeansForPluginsConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration(proxyBeanMethods = false)
@Import(CommonBeansForPluginsConfiguration.class)
public class WorkflowManagerPluginConfig {

}
