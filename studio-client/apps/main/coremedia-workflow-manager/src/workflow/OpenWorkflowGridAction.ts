import WorkArea from "@coremedia/studio-client.main.editor-components/sdk/desktop/WorkArea";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import Ext from "@jangaroo/ext-ts";
import Action from "@jangaroo/ext-ts/Action";
import Panel from "@jangaroo/ext-ts/panel/Panel";
import {as} from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import WorkflowListGrid from "./WorkflowListGrid";

interface OpenWorkflowGridActionConfig extends Config<Action> {
}

export default class OpenWorkflowGridAction extends Action {

  constructor(config: Config<OpenWorkflowGridAction>) {
    super(((): any => {
      return ConfigUtils.apply(config as any, {handler: (): void => OpenWorkflowGridAction.handleOpen()});
    })());
  }

  private static handleOpen(): void {
    const workArea = as(editorContext._.getWorkArea(), WorkArea);
    const workflowGridTab = as(Ext.getCmp("workflowListGridTab"), WorkflowListGrid);

    if (!workflowGridTab) {
      const workAreaTabType = workArea.getTabTypeById(WorkflowListGrid.xtype);
      workAreaTabType.createTab(null, (tab: Panel): void => {
        const editor = as(tab, WorkflowListGrid);
        workArea.addTab(workAreaTabType, editor);
        workArea.setActiveTab(editor);
      });
    } else {
      workArea.setActiveTab(workflowGridTab);
    }
  }
}


