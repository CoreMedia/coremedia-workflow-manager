# CoreMedia workflow management

## Versions
### V1
Compatible with CMCC release 2510

## Overview
The plugin bundle for studio client and studio-server provides a workflow management panel, enabling the configured
groups of editors to delete a running or escalated workflow.

## What this extension adds
- A dedicated **Workflows** tab in Studio WorkArea.
- One workflow grid per workflow type/category returned by the server.
- Toolbar actions per grid:
  - filter workflows by ID,
  - reload workflow data,
  - delete (abort) selected workflows.

## Studio client integration
- Main plugin class: `WorkflowManagerStudioPlugin`.
- The plugin registers a WorkArea tab type and opens `WorkflowListGrid` as tab content.
- A service shortcut runner with key `diorWorkflowGrid` is registered and opens/activates the workflow tab.

## Studio server integration
- REST resource base path: `workflowmanager`.
- Endpoints:
  - `GET /workflowmanager/categories` returns available workflow names/categories.
  - `POST /workflowmanager/processesByName/{name}` with body `{ "filter": "..." }` returns matching processes.
- Spring Boot auto-configuration wires the plugin resource into `studio-server`.

## Notes
- The UI maps each process to a compact row model (ID, name, state, assignee, start date, process handle).
- Delete action aborts the selected processes via workflow API calls from Studio client.


