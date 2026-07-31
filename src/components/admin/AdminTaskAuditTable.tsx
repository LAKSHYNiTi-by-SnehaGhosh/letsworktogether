"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  ShieldCheck, 
  Tag, 
  Loader2, 
  AlertTriangle,
  UserCheck
} from "lucide-react";

interface AdminTaskAuditTableProps {
  initialTasks: any[];
  users: any[];
  projects: any[];
}

export default function AdminTaskAuditTable({
  initialTasks,
  users,
  projects,
}: AdminTaskAuditTableProps) {
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleStatus = async (taskId: string) => {
    setLoadingId(taskId);
    try {
      const res = await fetch("/api/admin/tasks/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, action: "toggle_status" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: t.status === "DONE" ? "TODO" : "DONE" }
              : t
          )
        );
      } else {
        alert(data.error || "Failed to update task status");
      }
    } catch (err) {
      console.error(err);
      alert("Error executing status update");
    } finally {
      setLoadingId(null);
    }
  };

  const handlePriorityChange = async (taskId: string, priority: string) => {
    setLoadingId(taskId);
    try {
      const res = await fetch("/api/admin/tasks/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, action: "update_priority", priority }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, priority } : t))
        );
      } else {
        alert(data.error || "Failed to update priority");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating priority");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task on behalf of the user?")) return;
    setLoadingId(taskId);
    try {
      const res = await fetch("/api/admin/tasks/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, action: "delete_task" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } else {
        alert(data.error || "Failed to delete task");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting task");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (selectedUser !== "ALL" && t.assignee?.id !== selectedUser) return false;
    if (selectedProject !== "ALL" && t.project?.id !== selectedProject) return false;
    if (selectedStatus !== "ALL" && t.status !== selectedStatus) return false;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const titleMatch = t.title?.toLowerCase().includes(q);
      const descMatch = t.description?.toLowerCase().includes(q);
      const emailMatch = t.assignee?.email?.toLowerCase().includes(q);
      const projMatch = t.project?.name?.toLowerCase().includes(q);
      return titleMatch || descMatch || emailMatch || projMatch;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-[#0a0a0a] p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user email, task title, topic, or project..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder:text-white/40"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* User Filter */}
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
          >
            <option value="ALL" className="bg-[#0a0a0a]">All Users ({users.length})</option>
            {users.map((u) => (
              <option key={u.id} value={u.id} className="bg-[#0a0a0a]">
                {u.email} ({u.subscriptionPlan})
              </option>
            ))}
          </select>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
          >
            <option value="ALL" className="bg-[#0a0a0a]">All Workspaces</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0a0a0a]">
                {p.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
          >
            <option value="ALL" className="bg-[#0a0a0a]">All Statuses</option>
            <option value="TODO" className="bg-[#0a0a0a]">To Do</option>
            <option value="IN_PROGRESS" className="bg-[#0a0a0a]">In Progress</option>
            <option value="DONE" className="bg-[#0a0a0a]">Done</option>
          </select>
        </div>
      </div>

      {/* Task Audit Table */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-white/60 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">User / Email</th>
                <th className="px-6 py-4 font-semibold">Project Workspace</th>
                <th className="px-6 py-4 font-semibold">Task Title & Topic</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created Date</th>
                <th className="px-6 py-4 font-semibold text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredTasks.map((t) => {
                const isDone = t.status === "DONE";
                const isUpdating = loadingId === t.id;

                return (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{t.assignee?.email || "Unassigned"}</span>
                      </div>
                    </td>

                    {/* Project Workspace */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 text-white/70 font-medium inline-flex items-center gap-1">
                        <Tag className="w-3 h-3 text-purple-400" />
                        {t.project?.name || "Personal Workspace"}
                      </span>
                    </td>

                    {/* Task Title & Topic */}
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-bold text-white text-sm line-clamp-1">{t.title}</div>
                      {t.description ? (
                        <div className="text-white/50 text-[11px] line-clamp-2 mt-0.5">{t.description}</div>
                      ) : (
                        <div className="text-white/30 text-[11px] italic">No description topic</div>
                      )}
                    </td>

                    {/* Priority Selector */}
                    <td className="px-6 py-4">
                      <select
                        value={t.priority || "MEDIUM"}
                        onChange={(e) => handlePriorityChange(t.id, e.target.value)}
                        disabled={isUpdating}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border bg-transparent cursor-pointer ${
                          t.priority === "URGENT"
                            ? "text-red-400 border-red-500/30 bg-red-500/10"
                            : t.priority === "HIGH"
                            ? "text-rose-400 border-rose-500/30 bg-rose-500/10"
                            : t.priority === "MEDIUM"
                            ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                            : "text-slate-400 border-slate-500/30 bg-slate-500/10"
                        }`}
                      >
                        <option value="URGENT" className="bg-[#0a0a0a]">URGENT</option>
                        <option value="HIGH" className="bg-[#0a0a0a]">HIGH</option>
                        <option value="MEDIUM" className="bg-[#0a0a0a]">MEDIUM</option>
                        <option value="LOW" className="bg-[#0a0a0a]">LOW</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(t.id)}
                        disabled={isUpdating}
                        className={`px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 transition-all ${
                          isDone
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-amber-400" />}
                        {t.status}
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-white/50 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(t.id)}
                          disabled={isUpdating}
                          className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-lg hover:bg-indigo-500/20 transition-colors"
                          title="Verify or Toggle Completion Status"
                        >
                          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isDone ? "Mark Pending" : "Verify & Complete"}
                        </button>
                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          disabled={isUpdating}
                          className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete User Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                    No tasks match the selected developer audit filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
