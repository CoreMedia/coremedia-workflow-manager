/** @type { import('@jangaroo/core').IJangarooConfig } */
module.exports = {
  type: "code",
  sencha: {
    namespace: "com.coremedia.plugins.workflow.manager",
    studioPlugins: [
      {
        mainClass: "com.coremedia.plugins.workflow.manager.WorkflowManagerStudioPlugin",
        name: "Studio workflow manager Plugin",
        requiredGroup: "administratoren@cognito"
      },
      {
        mainClass: "com.coremedia.plugins.workflow.manager.WorkflowManagerStudioPlugin",
        name: "Studio workflow manager Plugin",
        requiredGroup: "administratoren"
      },
    ],
  },
  appManifests:{
    en:{
      categories:[
        "Content"
      ],
      cmServiceShortcuts:[
        {
          cmKey: "diorWorkflowGrid",
          cmOrder: 40,
          cmCategory: "Content",
          name: "Workflow Management",
          url: "",
          cmAdministrative: false,
          cmService: {
            name: "launchSubAppService",
            method: "launchSubApp",
          },
        },
      ]
    }
  }
};
