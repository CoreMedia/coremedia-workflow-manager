interface WorkflowManagerStudioPlugin_properties {
  workflowmanager_tab_title: string;
  workflowmanager_widget_name: string;
  workflowmanager_widget_description: string;
  workflowmanager_widget_title: string;
  workflowmanager_generic_panel_title: string;
  workflowmanager_delete_text: string;
  workflowmanager_delete_tooltip: string;
  workflowmanager_reload_text: string;
  workflowmanager_reload_tooltip: string;
  workflowmanager_filter_empty_text: string;
  workflowmanager_filter_aria_label: string;
  workflowmanager_column_id: string;
  workflowmanager_column_workflow_name: string;
  workflowmanager_column_state: string;
  workflowmanager_column_start_date: string;
  workflowmanager_workflow_selection_title: string;
}

const WorkflowManagerStudioPlugin_properties: WorkflowManagerStudioPlugin_properties = {
  workflowmanager_tab_title: "Workflow",
  workflowmanager_widget_name: "Workflow Management",
  workflowmanager_widget_description: "Manage running workflows",
  workflowmanager_widget_title: "Workflows",
  workflowmanager_generic_panel_title: "genericPanel",
  workflowmanager_delete_text: "delete",
  workflowmanager_delete_tooltip: "Delete selected workflows",
  workflowmanager_reload_text: "reload",
  workflowmanager_reload_tooltip: "Reload workflowlist",
  workflowmanager_filter_empty_text: "Filter by id",
  workflowmanager_filter_aria_label: "Filter by id",
  workflowmanager_column_id: "ID",
  workflowmanager_column_workflow_name: "Workflow Name",
  workflowmanager_column_state: "State",
  workflowmanager_column_start_date: "Start Date",
  workflowmanager_workflow_selection_title: "",
};

export default WorkflowManagerStudioPlugin_properties;
