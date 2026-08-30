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
import RemoteServiceMethod from "@coremedia/studio-client.client-core/data/impl/RemoteServiceMethod";

interface GenericWorkflowTypePanelConfig extends Config<GridPanel> {
}

export default class GenericWorkflowTypePanel extends GridPanel {

  declare Config: GenericWorkflowTypePanelConfig;
  private genericWorkflowValueExpression: ValueExpression;
  private selectedItemsExpression: ValueExpression;

  constructor(config: Config<GenericWorkflowTypePanel> = null) {
    super(((): any => {
      return ConfigUtils.apply(Config(GenericWorkflowTypePanel, {
          title: "genericPanel",
          flex: 1,
          height: 400,
          scrollable: true,
          multiSelect: true,
          ui: PanelSkin.CARD_200.getSkin(),
          tbar: Config(Toolbar, {
            items: [
              Config(IconButton, {
                iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(trashBin),
                text: "delete",
                tooltip: "Delete selected workflows",
                handler: () => {
                  this.deleteWorkflows();
                }
              }),
              Config(IconButton, {
                iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(reload),
                text: "reload",
                tooltip: "Reload workflowlist",
                handler: () => {
                  this.fetchWorkflows(true);
                }
              }),
              Config(TextField, {
                itemId: "filterItemID",
                emptyText: "Filter by id",
                ariaLabel: "Filter by id",
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
              text: "ID",
              width: 100,
              flex: 0,
            },
            {
              dataIndex: "name",
              text: "Workflow Name",
              flex: 1,
              sortable: true,
            },
            {
              dataIndex: "process",
              hidden: true
            },
            {
              dataIndex: "state",
              text: "State",
              width: 100,
              sortable: true,
              renderer: this.renderState.bind(this),
            },
            {
              dataIndex: "owner",
              text: "Assignee",
              width: 150,
              sortable: true,
            },
            {
              dataIndex: "startDate",
              text: "Start Date",
              width: 200,
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
        process.process.abort();
      });
    })
  }

  private fetchWorkflows(reset: boolean) {
    const cmp: TextField = this.down("[itemId=filterItemID]") as TextField;
    const uri = "plugins/studio-server.coremedia-workflow-management-plugin/workflowmanager/processesByName/" + this.getTitle();
    new RemoteServiceMethod(uri, "POST", true).request({
      filter: !reset ? cmp.getValue() : ""
    }).then((result: any) => {
      const items: Array<Process> = result.getResponseJSON().items;
      Promise.all(items.map((item: Process) => {
        return item.load()
      })).then((processes: Array<Process>) => {
        this.getWorkflowExpression().setValue(processes.map((process => mapProcessToObject(process))));
      })
    });
  }
}

function mapProcessToObject(process: Process): any {
  return {
    "id": process.getId().replace("coremedia:///cap/process/", ""),
    "name": process.getDefinition().getName(),
    "state": process.getProcessState().name,
    "startDate": process.getCreationDate().toString(),
    "owner": process.getOwner().getName(),
    "process": process
  }
}
