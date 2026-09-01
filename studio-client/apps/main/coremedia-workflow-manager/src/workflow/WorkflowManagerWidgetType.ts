import ComponentBasedWidgetType from "@coremedia/studio-client.main.editor-components/sdk/dashboard/ComponentBasedWidgetType";
import Dashboard_properties from "@coremedia/studio-client.main.editor-components/sdk/dashboard/Dashboard_properties";
import {Config} from "@jangaroo/runtime";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import WorkflowListGrid from "./WorkflowListGrid";

interface WorkflowManagerWidgetTypeConfig extends Config<ComponentBasedWidgetType> {
}

class WorkflowManagerWidgetType extends ComponentBasedWidgetType {
  declare Config: WorkflowManagerWidgetTypeConfig;

  constructor(config: Config<WorkflowManagerWidgetType> = null) {
    super(ConfigUtils.apply(Config(WorkflowManagerWidgetType, {
      name: "Workflow Management",
      description: "Manage running workflows",
      iconCls: Dashboard_properties.Widget_SimpleSearch_icon,
      widgetComponent: Config(WorkflowListGrid, {
        title: "Workflows",
      }),
    }), config));
  }
}

export default WorkflowManagerWidgetType;
