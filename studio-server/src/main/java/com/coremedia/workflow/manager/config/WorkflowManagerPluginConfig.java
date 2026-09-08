package com.coremedia.workflow.manager.config;

import com.coremedia.cap.common.CapConnection;
import com.coremedia.cms.common.plugins.beans_for_plugins2.CommonBeansForPluginsConfiguration;
import com.coremedia.workflow.manager.resource.WorkflowManagerResource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration(proxyBeanMethods = false)
@Import({
  CommonBeansForPluginsConfiguration.class
})
public class WorkflowManagerPluginConfig {

  @Bean
  WorkflowManagerResource getWorkflowManagerPluginResource(CapConnection connection) {
    return new WorkflowManagerResource(connection.getWorkflowRepository());
  }
}
