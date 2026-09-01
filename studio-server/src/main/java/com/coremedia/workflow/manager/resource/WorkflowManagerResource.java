package com.coremedia.workflow.manager.resource;

import com.coremedia.cap.workflow.Process;
import com.coremedia.cap.workflow.WorkflowRepository;
import com.coremedia.cms.common.plugins.plugin_base.PluginRestController;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.Locale;


@RestController
public class WorkflowManagerResource implements PluginRestController {

  public static final String FILTER = "filter";
  public static final String CATEGORIES = "/workflowmanager/categories";
  public static final String PROCESSES_BY_NAME_NAME = "/workflowmanager/processesByName/{name}";
  private static final List<String> EXCLUDED_WORKFLOW_NAME_PARTS = List.of("sync", "trans", "pub");
  private static final List<String> WFS_CATEGORIES = List.of("Translation", "Publication", "Synchronization");
  WorkflowRepository workflowRepository;

  public WorkflowManagerResource(WorkflowRepository workflowRepository) {
    this.workflowRepository = workflowRepository;
  }

  @GetMapping(CATEGORIES)
  public List<String> workflowCategories() {
    List<String> categoryList = new ArrayList<>(WFS_CATEGORIES);
    categoryList.addAll(workflowRepository.getProcessDefinitionsByName().keySet().stream()
      .filter(this::isApplicableWorkflowName)
      .toList());
    return categoryList;
  }

  @PostMapping(PROCESSES_BY_NAME_NAME)
  public List<Process> getRunningProcessesByName(@PathVariable("name") String name, @RequestBody Map body) {
    String filter = (String) body.get(FILTER);
    return getWorkflowsFiltered((p) -> {
      String defName = p.getDefinition().getName();
      return defName.toLowerCase(Locale.ROOT).contains(name) && (filter.isEmpty() || p.getId().contains(filter));
    }, !filter.isEmpty() ? 200 : 100);
  }

  private List<Process> getWorkflowsFiltered(Predicate<Process> predicate, int limit) {
    return workflowRepository.getProcesses().stream().filter(predicate).limit(limit).toList();
  }

  private boolean isApplicableWorkflowName(String workflowName) {
    String lowerCaseName = workflowName.toLowerCase(Locale.ROOT);
    return EXCLUDED_WORKFLOW_NAME_PARTS.stream().noneMatch(lowerCaseName::contains);
  }

}
