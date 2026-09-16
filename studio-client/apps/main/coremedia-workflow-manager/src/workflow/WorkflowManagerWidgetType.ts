import ComponentBasedWidgetType from "@coremedia/studio-client.main.editor-components/sdk/dashboard/ComponentBasedWidgetType";
import Dashboard_properties from "@coremedia/studio-client.main.editor-components/sdk/dashboard/Dashboard_properties";
import {Config} from "@jangaroo/runtime";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import WorkflowListGrid from "./WorkflowListGrid";
import WorkflowManagerStudioPlugin_properties from "../WorkflowManagerStudioPlugin_properties";

interface WorkflowManagerWidgetTypeConfig extends Config<ComponentBasedWidgetType> {
}

class WorkflowManagerWidgetType extends ComponentBasedWidgetType {
  declare Config: WorkflowManagerWidgetTypeConfig;

  constructor(config: Config<WorkflowManagerWidgetType> = null) {
    super(ConfigUtils.apply(Config(WorkflowManagerWidgetType, {
      name: WorkflowManagerStudioPlugin_properties.workflowmanager_widget_name,
      description: WorkflowManagerStudioPlugin_properties.workflowmanager_widget_description,
      iconCls: Dashboard_properties.Widget_SimpleSearch_icon,
      widgetComponent: Config(WorkflowListGrid, {
        title: WorkflowManagerStudioPlugin_properties.workflowmanager_widget_title,
      }),
    }), config));
  }
}

export default WorkflowManagerWidgetType;
