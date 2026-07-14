"use client";

import { useState, useEffect, Suspense, use } from "react";
import { CheckCircle2, Circle, Loader2, Plus, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateTaskStatus, createTask, submitTask } from "@/app/actions/tasks";
import { getProjectTasks } from "@/app/actions/queries";
import { useUser } from "@clerk/nextjs";

// DnD Kit imports
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "IN_REVIEW", title: "Review" },
  { id: "DONE", title: "Done" },
];

function KanbanBoard({ projectId }: { projectId: string }) {
  const { user } = useUser();

  const [tasks, setTasks] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<string | null>(null); // column id
  const [newTaskTitle, setNewTaskTitle] = useState("");
  
  // Submission dialog
  const [submissionTaskId, setSubmissionTaskId] = useState<string | null>(null);
  const [submissionContent, setSubmissionContent] = useState("");

  useEffect(() => {
    if (!user || !projectId) return;

    getProjectTasks(projectId)
      .then((fetchedTasks) => setTasks(fetchedTasks))
      .catch((error) => console.error("Error fetching tasks:", error))
      .finally(() => setLoading(false));
  }, [user, projectId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    // Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dropping a Task over a Column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex].status = String(overId);
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isActiveTask = active.data.current?.type === "Task";
    if (!isActiveTask) return;

    // Determine the new status
    let newStatus = "";
    if (over.data.current?.type === "Column") {
      newStatus = overId;
    } else if (over.data.current?.type === "Task") {
      const overTask = tasks.find((t) => t.id === overId);
      newStatus = overTask?.status || "TODO";
    }

    if (newStatus === "IN_REVIEW") {
      // Instead of just moving it, maybe prompt for submission if it requires content
      // But for drag and drop, we might just update status and let them add comments later.
      // For a real submission, they should use a submit button.
      // We will just do a standard status update here.
    }

    if (newStatus) {
      const result = await updateTaskStatus({ taskId: activeId, newStatus: newStatus as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" });
      if (!result?.data?.success) {
        // Revert on error
        getProjectTasks(projectId).then(setTasks);
      }
    }
  };

  const handleAddTask = async (columnId: string) => {
    if (!newTaskTitle.trim() || !projectId || !user) return;
    
    setIsAdding(null);
    const title = newTaskTitle;
    setNewTaskTitle("");

    await createTask({
      projectId,
      title: title,
      status: columnId as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE",
    });
    
    // Refresh tasks after adding
    getProjectTasks(projectId).then(setTasks);
  };
  
  const handleTaskSubmit = async () => {
    if (!submissionTaskId || !submissionContent.trim()) return;
    
    const result = await submitTask({ taskId: submissionTaskId, content: submissionContent });
    if (result?.data?.success) {
      setSubmissionTaskId(null);
      setSubmissionContent("");
      getProjectTasks(projectId).then(setTasks);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-lwt-blue" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <Column 
              key={col.id} 
              column={col} 
              tasks={tasks.filter((t) => t.status === col.id)} 
              isAdding={isAdding === col.id}
              setIsAdding={setIsAdding}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
              handleAddTask={() => handleAddTask(col.id)}
              onReviewClick={(id: string) => setSubmissionTaskId(id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard task={tasks.find((t) => t.id === activeId)} />
          ) : null}
        </DragOverlay>
      </DndContext>
      
      <Dialog open={!!submissionTaskId} onOpenChange={(o) => !o && setSubmissionTaskId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Task for Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <textarea 
              rows={4}
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              className="w-full p-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="What did you complete? Add links or notes here."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSubmissionTaskId(null)}>Cancel</Button>
              <Button onClick={handleTaskSubmit} className="bg-[image:var(--brand-gradient)] text-white border-0">Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function KanbanBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-lwt-blue" />
      </div>
    }>
      <KanbanBoard projectId={resolvedParams.id} />
    </Suspense>
  )
}

function Column({ column, tasks, isAdding, setIsAdding, newTaskTitle, setNewTaskTitle, handleAddTask, onReviewClick }: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { setNodeRef } = useSortable({
    id: column.id,
    data: { type: "Column", column },
  });

  return (
    <div ref={setNodeRef} className="flex flex-col bg-muted/30 rounded-xl border border-border/40 p-4 h-full min-h-[500px]">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          {column.title} <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">{tasks.length}</span>
        </h3>
        <Button onClick={() => setIsAdding(column.id)} variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-3 flex-1">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <SortableContext items={tasks.map((t: any) => t.id)}>
          {tasks.map((task: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
            <SortableTaskCard key={task.id} task={task} onReviewClick={() => onReviewClick(task.id)} />
          ))}
        </SortableContext>

        {isAdding && (
          <div className="p-3 rounded-lg border border-primary/50 bg-card shadow-sm">
            <input 
              autoFocus
              className="w-full text-sm bg-transparent outline-none mb-2"
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
                if (e.key === "Escape") setIsAdding(null);
              }}
            />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setIsAdding(null)}>Cancel</Button>
              <Button size="sm" className="h-7 text-xs bg-lwt-blue hover:bg-lwt-blue-light text-white" onClick={handleAddTask}>Add</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableTaskCard({ task, onReviewClick }: { task: any, onReviewClick?: () => void }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="p-4 rounded-lg border-2 border-primary/50 border-dashed bg-card/50 opacity-30 min-h-[80px]" />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onReviewClick={onReviewClick} />
    </div>
  );
}

function TaskCard({ task, onReviewClick }: { task?: any, onReviewClick?: () => void }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!task) return null;
  const isDone = task.status === "DONE";
  
  return (
    <div className={`p-4 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing transition-all ${
      isDone ? "bg-card/50 border-border/30 opacity-70" : "bg-card border-border hover:border-primary/50"
    }`}>
      <div className="flex items-start gap-3">
        {isDone ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        )}
        <div className="space-y-3 w-full">
          <p className={`text-sm font-medium leading-snug ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {task.title}
          </p>
          
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
            {task.assigneeId && (
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-secondary/80 text-[10px] font-bold text-secondary-foreground" title={task.assigneeId}>
                <User className="h-3 w-3" />
              </div>
            )}
            
            {!isDone && task.status !== "IN_REVIEW" && onReviewClick && (
              <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] ml-auto gap-1 text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); onReviewClick(); }}>
                <FileText className="h-3 w-3" /> Submit
              </Button>
            )}
            {task.status === "IN_REVIEW" && (
              <span className="text-[10px] font-medium text-orange-500 ml-auto bg-orange-500/10 px-2 py-0.5 rounded-full">Pending Review</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
