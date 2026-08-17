import StudioPlugin from "@coremedia/studio-client.main.editor-components/configuration/StudioPlugin";
import {Config, ConfigUtils} from "@jangaroo/runtime";

export default class WorkflowManagerStudioPlugin extends StudioPlugin {

  static readonly xtype: string = "com.coremedia.plugins.workflow.manager.workflowManagerStudioPlugin";

  constructor(config: Config<WorkflowManagerStudioPlugin> = null) {
    super((()=>{
      return ConfigUtils.apply(config, {

      });
    })());
  }
}
