import { getProjectAnalytics } from "@/app/actions/queries";
import { BarChart, CheckCircle2, ListTodo, Presentation, FileText } from "lucide-react";

export default async function ProjectAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const analytics = await getProjectAnalytics(id);
  const progress = analytics.totalTasks === 0 ? 0 : Math.round((analytics.completedTasks / analytics.totalTasks) * 100);

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><ListTodo className="h-5 w-5" /></div>
            <h3 className="font-semibold text-muted-foreground">Total Tasks</h3>
          </div>
          <p className="text-3xl font-bold">{analytics.totalTasks}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><CheckCircle2 className="h-5 w-5" /></div>
            <h3 className="font-semibold text-muted-foreground">Completed Tasks</h3>
          </div>
          <p className="text-3xl font-bold">{analytics.completedTasks}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Presentation className="h-5 w-5" /></div>
            <h3 className="font-semibold text-muted-foreground">Milestones</h3>
          </div>
          <p className="text-3xl font-bold">{analytics.milestones.length}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><BarChart className="h-5 w-5" /></div>
            <h3 className="font-semibold text-muted-foreground">Task Progress</h3>
          </div>
          <p className="text-3xl font-bold">{progress}%</p>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-3">
            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Recent Submissions</h3>
          {analytics.submissions > 0 ? (
            <div className="text-sm text-muted-foreground">
              {analytics.submissions} submissions have been made for review.
            </div>
          ) : (
            <div className="text-sm text-muted-foreground border border-dashed border-border rounded-lg p-8 text-center">
              No tasks have been submitted for review yet.
            </div>
          )}
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold mb-4">Milestone Progress</h3>
          <div className="space-y-4">
            {analytics.milestones.length > 0 ? (
              analytics.milestones.map((m: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                const total = m.tasks.length;
                const completed = m.tasks.filter((t: any) => t.status === "DONE").length; // eslint-disable-line @typescript-eslint/no-explicit-any
                const p = total === 0 ? 0 : Math.round((completed / total) * 100);
                return (
                  <div key={m.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{m.title}</span>
                      <span className="text-muted-foreground">{p}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${p}%` }} />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-sm text-muted-foreground border border-dashed border-border rounded-lg p-8 text-center">
                No milestones to track.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
