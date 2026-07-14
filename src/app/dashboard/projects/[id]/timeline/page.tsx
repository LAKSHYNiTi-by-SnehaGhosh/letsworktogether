import { getProjectMilestones } from "@/app/actions/queries";
import { CalendarDays, Flag, Plus } from "lucide-react";

export default async function ProjectTimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const milestones = await getProjectMilestones(id);

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Milestone Timeline</h2>
          <p className="text-muted-foreground mt-1">Track the high-level goals of this project.</p>
        </div>
        <button className="bg-[image:var(--brand-gradient)] flex items-center gap-2 text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Add Milestone
        </button>
      </div>

      <div className="relative border-l-2 border-primary/20 ml-4 pl-8 space-y-8 py-4">
        {milestones.length === 0 ? (
          <div className="text-muted-foreground border border-dashed border-border rounded-xl p-8 text-center max-w-md">
            No milestones have been defined yet. Create your first milestone to organize tasks into sprints or phases.
          </div>
        ) : (
          milestones.map((milestone) => (
            <div key={milestone.id} className="relative bg-card border border-border hover:border-primary/50 transition-colors rounded-xl p-6 shadow-sm max-w-2xl">
              <div className="absolute -left-[42px] top-6 h-5 w-5 rounded-full border-4 border-background bg-primary shadow-sm" />
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Flag className="h-4 w-4 text-primary" /> {milestone.title}
                </h3>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md font-medium uppercase tracking-wider">
                  {milestone.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{milestone.description}</p>
              {milestone.dueDate && (
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 p-2 rounded-lg w-fit">
                  <CalendarDays className="h-4 w-4" /> Due: {new Date(milestone.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
