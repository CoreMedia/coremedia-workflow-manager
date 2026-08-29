package com.coremedia.workflow.manager.resource;

import com.coremedia.cap.workflow.Process;
import com.coremedia.cap.workflow.WorkflowRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

@RequestMapping(value = "workflowmanager", produces = "application/json")
@RestController
public class WorkflowManagerPluginResource {

  public static final String FILTER = "filter";
  public static final String CATEGORIES = "/categories";
  public static final String PROCESSES_BY_NAME_NAME = "/processesByName/{name}";
  WorkflowRepository workflowRepository;

  public WorkflowManagerPluginResource(WorkflowRepository workflowRepository) {
    this.workflowRepository = workflowRepository;
  }

  @GetMapping(CATEGORIES)
  public List<String> workflowCategories() {
    return workflowRepository.getProcessDefinitionsByName().keySet().stream().toList();
  }

  @PostMapping(PROCESSES_BY_NAME_NAME)
  public List<Process> getRunningProcessesByName(@PathVariable("name") String name, @RequestBody Map body) {
    String filter = (String) body.get(FILTER);
    return getWorkflowsFiltered((p) -> {
      String defName = p.getDefinition().getName();
      return defName.equals(name) && (filter.isEmpty() || p.getId().contains(filter));
    }, !filter.isEmpty() ? 200 : 100);
  }

  private List<Process> getWorkflowsFiltered(Predicate<Process> predicate, int limit) {
    return workflowRepository.getProcesses().stream().filter(predicate).limit(limit).toList();
  }

}
