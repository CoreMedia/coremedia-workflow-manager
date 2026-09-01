![CoreMedia Content Cloud Version](https://img.shields.io/static/v1?message=2506&label=CoreMedia%20Content%20Cloud&style=for-the-badge&labelColor=666666&color=672779
"This badge shows the CoreMedia version(s) this project is compatible with.
Please read the versioning section of the project to see what other CoreMedia versions are supported and how to find them.")
![Status](https://img.shields.io/static/v1?message=active&label=Status&style=for-the-badge&labelColor=666666&color=2FAC66
"The status badge describes if the project is maintained. Possible values are active and inactive.
If a project is inactive it means that the development has been discontinued and won't support future CoreMedia versions.")
![Dropbox SDK Java](https://img.shields.io/static/v1?message=v1.0.0&label=Workflow%20manager&20SDK%20Java&style=for-the-badge&labelColor=6FC3B8&color=006CAE "CoreMedia Labs projects may depend on third party systems or APIs. This badge type shows the version number that is required for the selected project version.")
# CoreMedia workflow management
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

## Notes
- The UI maps each process to a compact row model (ID, name, state, assignee, start date, process handle).
- Delete action aborts the selected processes via workflow API calls from Studio client.


