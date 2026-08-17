/** @type { import('@jangaroo/core').IJangarooConfig } */
module.exports = {
  type: "code",
  sencha: {
    namespace: "com.coremedia.plugins.workflow.manager",
    studioPlugins: [
      {
        mainClass: "com.coremedia.plugins.workflow.manager.WorkflowManagerStudioPlugin",
        name: "Studio workflow manager Plugin",
      },
    ],
  },
};
