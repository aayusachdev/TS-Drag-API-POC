
  // Drag & Drop Interfaces
  // Using export makes it available outside of this file
  export interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
  }

  export interface DragTarget {
  dragOverHandler(event: DragEvent): void;  // Something is a valid drag target
  dropHandler(event: DragEvent): void; // React to the actual drop that happens
  dragLeaveHandler(event: DragEvent): void; // To give some visual cues if drop happens or if no drop happens then revert
  }