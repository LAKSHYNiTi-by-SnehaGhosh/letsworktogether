import React, { useEffect, useState } from "react";
import { useOfficeStore } from "@/lib/store/office-state";
import { Briefcase, AlertTriangle, Target, DollarSign, Lightbulb } from "lucide-react";

interface ExecutiveData {
  projectHealth: string;
  budget: { spent: number; allocated: number };
  roadmap: Array<{ status: string }>;
  aiInsights: string;
  clientFeedback: string;
  risks: string[];
}

export function ExecutiveOverview() {
  const activeProjectId = useOfficeStore(state => state.activeProjectId);
  const [data, setData] = useState<ExecutiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!activeProjectId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/ceo?projectId=${activeProjectId}`);
        if (!res.ok) {
          if (res.status === 403) throw new Error("Forbidden: Executive Access Only");
          throw new Error("Failed to fetch data");
        }
        setData(await res.json());
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [activeProjectId]);

  if (error) {
    return (
      <div className="w-[500px] bg-red-950/90 text-white rounded-xl border border-red-700 shadow-2xl p-6 pointer-events-auto">
        <div className="flex items-center gap-3 text-red-400 mb-4">
          <AlertTriangle size={24} />
          <h2 className="text-xl font-bold">Access Denied</h2>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-[900px] max-h-[700px] overflow-y-auto bg-slate-900/95 text-slate-100 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl p-8 pointer-events-auto">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-4">
        <Briefcase className="text-blue-400 w-8 h-8" />
        <h2 className="text-3xl font-bold">CEO Executive Dashboard</h2>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-slate-800 rounded-xl w-full"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-48 bg-slate-800 rounded-xl w-full"></div>
            <div className="h-48 bg-slate-800 rounded-xl w-full"></div>
          </div>
        </div>
      ) : !data ? (
        <div className="text-center py-12 text-slate-400">Select a project to view the executive overview.</div>
      ) : (
        <div className="space-y-6">
          {/* Top KPI row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 text-slate-400 mb-2"><Activity size={18}/> Project Health</div>
              <div className={`text-2xl font-bold ${
                data.projectHealth === 'Healthy' ? 'text-emerald-400' :
                data.projectHealth === 'Critical' ? 'text-red-400' : 'text-amber-400'
              }`}>{data.projectHealth}</div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 text-slate-400 mb-2"><DollarSign size={18}/> Budget Spent</div>
              <div className="text-2xl font-bold text-white">${data.budget.spent.toLocaleString()} <span className="text-sm text-slate-500 font-normal">/ ${data.budget.allocated.toLocaleString()}</span></div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className={`h-full ${data.budget.spent > data.budget.allocated * 0.9 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (data.budget.spent / data.budget.allocated) * 100)}%` }}></div>
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 text-slate-400 mb-2"><Target size={18}/> Active Milestones</div>
              <div className="text-2xl font-bold text-white">{data.roadmap.filter((m) => m.status === 'ACTIVE').length} <span className="text-sm text-slate-500 font-normal">/ {data.roadmap.length} Total</span></div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Lightbulb size={18} className="text-amber-400"/> AI Executive Insights</h3>
              <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                {data.aiInsights}
              </p>
              
              <h3 className="font-bold mb-3 mt-6 flex items-center gap-2"><Briefcase size={18} className="text-blue-400"/> Client Feedback</h3>
              <p className="text-slate-300 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1">
                &quot;{data.clientFeedback}&quot;
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-red-400"><AlertTriangle size={18}/> Active Risks</h3>
              <ul className="space-y-3">
                {data.risks.map((risk: string, i: number) => (
                  <li key={i} className="flex gap-3 bg-red-950/20 border border-red-900/30 p-3 rounded-lg text-red-200 text-sm">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span>{risk}</span>
                  </li>
                ))}
                {data.risks.length === 0 && (
                  <li className="text-emerald-400 text-sm">No active risks reported.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick fallback if Activity icon wasn't imported from lucide-react in earlier components (importing it locally here)
import { Activity } from "lucide-react";
