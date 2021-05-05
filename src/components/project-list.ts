import { Component } from "./base-component.js";
import { ProjectItem } from "./project-item.js";
import { autobind } from "../decorators/autobind.js";
import { DragTarget } from '../models/drag-drop-interfaces.js';
import { Project, ProjectStatus} from '../models/project-model.js';
import { projectState } from "../state/project-state.js";

  // ProjectList Class
  export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
      super("project-list", "app", false, `${type}-projects`);
      this.assignedProjects = [];

      this.configure();
      this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        // The default for js drag and drop is not allow draging and dropping. We need to
        // prevent the default event
        event.preventDefault();
        const listId = this.element.querySelector("ul")!;
        listId.classList.add("droppable");
      }
    }

    @autobind
    dropHandler(event: DragEvent) {
      console.log(event.dataTransfer!.getData("text/plain"));
      const prjId = event.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        prjId,
        this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }

    @autobind
    dragLeaveHandler(_event: DragEvent) {
      const listId = this.element.querySelector("ul")!;
      listId.classList.remove("droppable");
    }

    configure() {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);

      projectState.addListener((projects: Project[]) => {
        const relevantProjects = projects.filter((prj) => {
          if (this.type === "active") {
            return prj.status === ProjectStatus.Active;
          }
          return prj.status === ProjectStatus.Finished;
        });
        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }

    renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " PROJECTS";
    }

    private renderProjects() {
      const listEl = document.getElementById(
        `${this.type}-projects-list`
      )! as HTMLUListElement;
      listEl.innerHTML = "";
      for (const prjItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
      }
    }
  }
