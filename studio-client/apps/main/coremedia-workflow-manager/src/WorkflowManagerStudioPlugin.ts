import StudioPlugin from "@coremedia/studio-client.main.editor-components/configuration/StudioPlugin";
import {Config} from "@jangaroo/runtime";
import ComponentBasedWorkAreaTabType
  from "@coremedia/studio-client.main.editor-components/sdk/desktop/ComponentBasedWorkAreaTabType";
import WorkAreaTabTypesPlugin from "@coremedia/studio-client.main.editor-components/sdk/desktop/WorkAreaTabTypesPlugin";
import WorkArea from "@coremedia/studio-client.main.editor-components/sdk/desktop/WorkArea";
import WorkflowListGrid from "./workflow/WorkflowListGrid";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import IEditorContext from "@coremedia/studio-client.main.editor-components/sdk/IEditorContext";
import {studioAppsContext} from "@coremedia/studio-client.app-context-models";
import OpenWorkflowGridAction from "./workflow/OpenWorkflowGridAction";
import ConfigureDashboardPlugin from "@coremedia/studio-client.main.editor-components/sdk/dashboard/ConfigureDashboardPlugin";
import WorkflowManagerWidgetType from "./workflow/WorkflowManagerWidgetType";
import WorkflowManagerStudioPlugin_properties from "./WorkflowManagerStudioPlugin_properties";
import CopyResourceBundleProperties
  from "@coremedia/studio-client.main.editor-components/configuration/CopyResourceBundleProperties";
import resourceManager from "@jangaroo/runtime/l10n/resourceManager";
import Editor_properties from "@coremedia/studio-client.main.editor-components/Editor_properties";

export default class WorkflowManagerStudioPlugin extends StudioPlugin {
  static readonly xtype: string = "com.coremedia.plugins.workflow.manager.workflowManagerStudioPluginConfig";

  constructor(config: Config<WorkflowManagerStudioPlugin> = null) {
    super((() => {
      return ConfigUtils.apply(Config(WorkflowManagerStudioPlugin), {
        rules:[
          Config(WorkArea, {
            plugins: [
              Config(WorkAreaTabTypesPlugin, {
                tabTypes: [
                  new ComponentBasedWorkAreaTabType({
                    tabComponent: Config(WorkflowListGrid, {
                      id:"workflowListGridTabID",
                      itemId: "workflowListGridTab",
                      title: WorkflowManagerStudioPlugin_properties.workflowmanager_tab_title,
                      height:"600",
                      closable: true,
                    }),
                  }),
                ],
              }),
            ],
          }),
        ],
        configuration: [

        new CopyResourceBundleProperties({
          destination: resourceManager.getResourceBundle(null, Editor_properties),
          source: resourceManager.getResourceBundle(null, WorkflowManagerStudioPlugin_properties),
        }),
          new ConfigureDashboardPlugin({
            widgets: [],
            types: [
              new WorkflowManagerWidgetType({}),
            ],
          }),
        ],
      });
    })());
  }

  override init(editorContext: IEditorContext): void  {
    studioAppsContext._.getShortcutRunnerRegistry().registerShortcutRunner("diorWorkflowGrid", (): void => {
      const openWorkflowGridAction = new OpenWorkflowGridAction({});
      console.log("[diorWorkflowGrid] opening Tab");
      openWorkflowGridAction.execute();
    });
    super.init(editorContext);
  }
}
