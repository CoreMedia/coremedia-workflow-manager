import {Config} from "@jangaroo/runtime";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import PanelSkin from "@coremedia/studio-client.ext.ui-components/skins/PanelSkin";
import GridPanel from "@jangaroo/ext-ts/grid/Panel";
import BindListPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindListPlugin";
import DataField from "@jangaroo/ext-ts/data/field/Field";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import {Process} from "@coremedia/studio-client.cap-rest-client";
import Toolbar from "@jangaroo/ext-ts/toolbar/Toolbar";
import IconButton from "@coremedia/studio-client.ext.ui-components/components/IconButton";
import {SvgIconUtil} from "@coremedia/studio-client.base-models";
import {reload, trashBin} from "@coremedia/studio-client.common-icons";
import MessageBoxUtil from "@coremedia/studio-client.ext.ui-components/messagebox/MessageBoxUtil";
import BindSelectionPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindSelectionPlugin";
import TextField from "@jangaroo/ext-ts/form/field/Text";
import LocalComboBox from "@coremedia/studio-client.ext.ui-components/components/LocalComboBox";
import RemoteServiceMethod from "@coremedia/studio-client.client-core-impl/data/impl/RemoteServiceMethod";
import LoadMask from "@jangaroo/ext-ts/LoadMask";
import WorkflowManagerStudioPlugin_properties from "../WorkflowManagerStudioPlugin_properties";
interface GenericWorkflowTypePanelConfig extends Config<GridPanel> {
  categories: Array<string>
}

export default class WorkflowTypePanel extends GridPanel {
  private readonly cat_mappings: string[] = ["trans", "pub", "sync"];
  private static BASE_URI:string = "plugins/studio-server.coremedia-workflow-management-plugin/workflowmanager/processesByName/"
  declare Config: GenericWorkflowTypePanelConfig;
  private genericWorkflowValueExpression: ValueExpression;
  private selectedItemsExpression: ValueExpression;
  private selectedCategory: ValueExpression;

  constructor(config: Config<WorkflowTypePanel> = null) {
    super(((): any => {
      return ConfigUtils.apply(Config(WorkflowTypePanel, {
          categories: [],
          title: WorkflowManagerStudioPlugin_properties.workflowmanager_generic_panel_title,
          minHeight: 400,
          flex: 1,
          scrollable: true,
          multiSelect: true,
          ui: PanelSkin.CARD.getSkin(),
          tbar: Config(Toolbar, {
            items: [
              Config(IconButton, {
                iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(trashBin),
                text: WorkflowManagerStudioPlugin_properties.workflowmanager_delete_text,
                tooltip: WorkflowManagerStudioPlugin_properties.workflowmanager_delete_tooltip,
                handler: () => {
                  this.deleteWorkflows();
                }
              }),
              Config(IconButton, {
                iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(reload),
                text: WorkflowManagerStudioPlugin_properties.workflowmanager_reload_text,
                tooltip: WorkflowManagerStudioPlugin_properties.workflowmanager_reload_tooltip,
                handler: () => {
                  this.fetchWorkflows(true);
                }
              }),
              Config(LocalComboBox, {
                width: 300,
                valueField: "label",
                displayField: "label",
                value: "Translation",
                listeners: {
                  change: (field, value) => {
                    value = value==null? "" : value;
                    let category: string = (value as string).toLowerCase();
                    let filtered = this.cat_mappings.filter((e) => category.indexOf(e) !== -1);
                    category = filtered.length > 0 ? filtered[0] : category;
                    this.getSelectedCategoryExpression().setValue(category);
                    this.fetchWorkflows(true);
                  }
                },
                plugins: [
                  Config(BindListPlugin, {
                    bindTo: ValueExpressionFactory.createFromValue(config.categories.map(c => {
                      return {label: c}
                    })),
                    ifUndefined: [],
                    sortField: "label",
                    sortDirection: "ASC",
                    fields: [
                      Config(DataField, {name: "label"})
                    ],
                  }),
                ]
              }),
              Config(TextField, {
                itemId: "filterItemID",
                emptyText: WorkflowManagerStudioPlugin_properties.workflowmanager_filter_empty_text,
                ariaLabel: WorkflowManagerStudioPlugin_properties.workflowmanager_filter_aria_label,
                listeners: {
                  change: (change) => {
                    this.getStore().filterBy(record => {
                      return record.get("id").toLowerCase().indexOf(change.value) !== -1;
                    });
                    if (this.getStore().count() === 0) {
                      this.fetchWorkflows(false);
                    }
                  }
                }
              }),
            ]
          }),
          columns: [
            {
              height: "50",
              dataIndex: "id",
              text: WorkflowManagerStudioPlugin_properties.workflowmanager_column_id,
              flex: 1,
            },
            {
              dataIndex: "name",
              text: WorkflowManagerStudioPlugin_properties.workflowmanager_column_workflow_name,
              flex: 2,
              sortable: true,
            },
            {
              dataIndex: "process",
              hidden: true
            },
            {
              dataIndex: "state",
              text: WorkflowManagerStudioPlugin_properties.workflowmanager_column_state,
              flex: 1,
              sortable: true,
              renderer: this.renderState.bind(this),
            },
            {
              dataIndex: "startDate",
              text: WorkflowManagerStudioPlugin_properties.workflowmanager_column_start_date,
              flex: 1,
              sortable: true,
              renderer: this.renderDate.bind(this),
            },

          ],
          plugins: [
            Config(BindListPlugin, {
              fields: [
                Config(DataField, {
                  name: "id"
                }),
                Config(DataField, {
                  name: "name"
                }),
                Config(DataField, {
                  name: "startDate"
                }),
                Config(DataField, {
                  name: "owner"
                }),
                Config(DataField, {
                  name: "state"
                }),
                Config(DataField, {
                  name: "process"
                }),
              ],
              bindTo: this.getWorkflowExpression()
            }),
            Config(BindSelectionPlugin, {
              selectedValues: this.getSelectedItemsExpression()
            })
          ]
        }),
        config
      );
    })());
  }

  protected override afterRender(): any {
    this.fetchWorkflows(false);
    return super.afterRender();
  }

  private getWorkflowExpression(): ValueExpression {
    if (!this.genericWorkflowValueExpression) {
      this.genericWorkflowValueExpression = ValueExpressionFactory.createFromValue([]);
    }
    return this.genericWorkflowValueExpression;
  }

  private renderState(value: string): string {
    const stateColors: { [key: string]: string } = {
      "RUNNING": "<span style='color: green;'>RUNNING</span>",
      "COMPLETED": "<span style='color: blue;'>COMPLETED</span>",
      "FAILED": "<span style='color: red;'>FAILED</span>",
      "ABORTED": "<span style='color: red;'>FAILED</span>",
      "PENDING": "<span style='color: orange;'>PENDING</span>",
      "READABLE": "<span style='color: green;'>READABLE</span>",
    };
    return stateColors[value] || value;
  }

  private renderDate(value: any): string {
    if (value instanceof Date) {
      const pad = (n: number): string => n < 10 ? "0" + n : "" + n;
      return value.getFullYear() + "-" + pad(value.getMonth() + 1) + "-" +
        pad(value.getDate()) + " " + pad(value.getHours()) + ":" +
        pad(value.getMinutes()) + ":" + pad(value.getSeconds());
    }
    return String(value);
  }

  private getSelectedItemsExpression(): ValueExpression {
    if (!this.selectedItemsExpression) {
      this.selectedItemsExpression = ValueExpressionFactory.createFromValue([]);
    }
    return this.selectedItemsExpression;
  }

  private deleteWorkflows() {
    MessageBoxUtil.showDecision("Delete workflow", "Do you like to delete the selected workflow", "yes", () => {
      this.getSelectedItemsExpression().getValue().forEach((process: any) => {
        (process.process as Process).abort().then(()=>{
          this.fetchWorkflows(true);
        });
      });
    })
  }

  private getSelectedCategoryExpression(): ValueExpression {
    if (!this.selectedCategory) {
      this.selectedCategory = ValueExpressionFactory.createFromValue("trans");
    }
    return this.selectedCategory;
  }

  private fetchWorkflows(reset: boolean) {
    const cmp: TextField = this.down("[itemId=filterItemID]") as TextField;
    const uri = WorkflowTypePanel.BASE_URI + this.getSelectedCategoryExpression().getValue();
    const loadMask = new LoadMask({
      target: this,
    });
    loadMask.show();
    new RemoteServiceMethod(uri, "POST", true).request({
      filter: !reset ? cmp.getValue() : ""
    }).then((result: any) => {
      const items: Array<Process> = result.getResponseJSON().items;
      return Promise.all(items.map((item: Process) => item.load()));
    }).then((processes: Array<Process>) => {
      let mapped = processes.map((process => this.mapProcessToObject(process)));
      this.getWorkflowExpression().setValue(mapped);
    }).finally(() => {
      loadMask.destroy();
    });
  }

  private mapProcessToObject(process: Process): any {
    return {
      "id": process.getId().replace("coremedia:///cap/process/", ""),
      "name": process.getDefinition().getName(),
      "state": process.getProcessState().name,
      "startDate": process.getCreationDate(),
      "process": process
    }
  }
}
