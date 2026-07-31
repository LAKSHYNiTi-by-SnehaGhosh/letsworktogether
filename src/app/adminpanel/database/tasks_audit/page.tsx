import { prisma } from "@/lib/prisma";
import { 
  CheckSquare, 
  Users, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Tag, 
  ShieldCheck, 
  Search,
  Building2,
  ListFilter
} from "lucide-react";
import AdminTaskAuditTable from "@/components/admin/AdminTaskAuditTable";

export const dynamic = "force-dynamic";

export default async function TasksAuditPage() {
  const [tasks, users, projects] = await Promise.all([
    prisma.task.findMany({
      where: { deletedAt: null },
      include: {
        assignee: { select: { id: true, email: true, profile: true } },
        project: { select: { id: true, name: true, organization: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.user.findMany({
      select: { id: true, email: true, subscriptionPlan: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.project.findMany({
      select: { id: true, name: true },
      take: 50,
    }),
  ]);

  const totalTasks = await prisma.task.count({ where: { deletedAt: null } });
  const completedTasks = await prisma.task.count({ where: { status: "DONE", deletedAt: null } });
  const pendingTasks = totalTasks - completedTasks;
  const urgentTasks = await prisma.task.count({ where: { priority: "URGENT", deletedAt: null } });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
              Task & To-Do Audit Matrix
            </h1>
            <p className="text-white/60 text-sm">
              Step-by-step verification dashboard for LWT Backend Engineers, Database Developers, and Data Auditors to inspect, verify, and manage user tasks.
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /> Live Developer Audit Mode
          </div>
        </div>
      </div>

      {/* Step-by-Step Workflow Guide */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
          <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Step 1</div>
          <div className="font-semibold text-sm">User & Topic Inspection</div>
          <p className="text-xs text-white/50">Filter tasks by user email, plan tier, or topic description.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
          <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Step 2</div>
          <div className="font-semibold text-sm">Priority & Status Check</div>
          <p className="text-xs text-white/50">Audit priority levels (Urgent, High) & completion status.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
          <div className="text-xs text-purple-400 font-bold uppercase tracking-wider">Step 3</div>
          <div className="font-semibold text-sm">Developer Verification</div>
          <p className="text-xs text-white/50">Verify user or AI-generated tasks and toggle completion.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
          <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Step 4</div>
          <div className="font-semibold text-sm">Database Cleanup</div>
          <p className="text-xs text-white/50">Remove flagged or invalid user tasks from the database.</p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase">Total User Tasks</p>
            <p className="text-3xl font-bold text-white mt-1">{totalTasks}</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase">Active Pending</p>
            <p className="text-3xl font-bold text-amber-400 mt-1">{pendingTasks}</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase">Completed Tasks</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">{completedTasks}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase">Urgent Tasks</p>
            <p className="text-3xl font-bold text-red-400 mt-1">{urgentTasks}</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Interactive Audit Table */}
      <AdminTaskAuditTable initialTasks={tasks} users={users} projects={projects} />
    </div>
  );
}
