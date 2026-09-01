import Panel from "@jangaroo/ext-ts/panel/Panel";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import beanFactory from "@coremedia/studio-client.client-core/data/beanFactory";
import RemoteBean from "@coremedia/studio-client.client-core/data/RemoteBean";
import WorkflowTypePanel from "./WorkflowTypePanel";
import PanelSkin from "@coremedia/studio-client.ext.ui-components/skins/PanelSkin";

interface WorkflowListGridConfig extends Config<Panel> {
}

class WorkflowListGrid extends Panel {
  declare Config: WorkflowListGridConfig;
  static readonly WORKFLOW_NAMES = "plugins/studio-server.coremedia-workflow-management-plugin/workflowmanager/categories";
  static override readonly xtype: string = "com.coremedia.studio.dior.ecommerce.workflowListGrid.config";

  constructor(config: Config<WorkflowListGrid> = null) {

    super(ConfigUtils.apply(Config(WorkflowListGrid, {
      ui: PanelSkin.DEFAULT.getSkin(),
      scrollable: true,
      border: false,
    }), config));

    this.fetchApplicableDefinitions();
  }

  private fetchApplicableDefinitions() {
    beanFactory._.getRemoteBean(WorkflowListGrid.WORKFLOW_NAMES).load().then((result: RemoteBean) => {
      const workflowCategories: Array<string> = result.toObject().items || [];
      this.removeAll();
      this.add(new WorkflowTypePanel({
        title: "Workflow selection",
        categories: workflowCategories
      }));
    });
  }

}

export default WorkflowListGrid;

