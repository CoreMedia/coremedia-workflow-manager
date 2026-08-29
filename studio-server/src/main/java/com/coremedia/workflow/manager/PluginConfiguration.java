package com.coremedia.workflow.manager;

import com.coremedia.cms.common.plugins.beans_for_plugins2.CommonBeansForPluginsConfiguration;
import com.coremedia.workflow.manager.config.WorkflowManagerPluginConfig;import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration(proxyBeanMethods = false)
@Import({CommonBeansForPluginsConfiguration.class,
  WorkflowManagerPluginConfig.class
})

@ConditionalOnProperty(name = "plugins." + PluginConfiguration.PLUGIN_ID + ".enabled", havingValue = "true", matchIfMissing = true)
public class PluginConfiguration {
  public static final String PLUGIN_ID = "studio-server.coremedia-workflow-management-plugin";
}
