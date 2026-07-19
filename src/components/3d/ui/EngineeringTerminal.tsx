import React, { useState } from "react";

export function EngineeringTerminal() {
  const [activeTab, setActiveTab] = useState("pr");

  return (
    <div className="w-[700px] h-[500px] bg-[#1e1e1e] text-[#d4d4d4] rounded-xl shadow-2xl p-6 pointer-events-auto font-mono flex flex-col">
      <div className="flex justify-between items-center border-b border-[#333] pb-2 mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-blue-400">~/workspace/</span>
          engineering-terminal
        </h2>
        <div className="flex gap-2 text-sm">
          <button onClick={() => setActiveTab("pr")} className={`px-3 py-1 rounded ${activeTab === 'pr' ? 'bg-blue-600 text-white' : 'bg-[#333] hover:bg-[#444]'}`}>Pull Requests</button>
          <button onClick={() => setActiveTab("branches")} className={`px-3 py-1 rounded ${activeTab === 'branches' ? 'bg-blue-600 text-white' : 'bg-[#333] hover:bg-[#444]'}`}>Branches</button>
          <button onClick={() => setActiveTab("ide")} className={`px-3 py-1 rounded ${activeTab === 'ide' ? 'bg-blue-600 text-white' : 'bg-[#333] hover:bg-[#444]'}`}>IDE / Editor</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "pr" && (
          <div className="space-y-3">
            <div className="p-3 border border-[#333] bg-[#252526] rounded flex justify-between items-center hover:border-[#555] transition-colors cursor-pointer">
              <div>
                <div className="text-green-400 font-bold mb-1">#42 Implement Office State Engine</div>
                <div className="text-xs text-gray-400">opened 2 hours ago by @lakshyniti</div>
              </div>
              <div className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded">Open</div>
            </div>
            <div className="p-3 border border-[#333] bg-[#252526] rounded flex justify-between items-center hover:border-[#555] transition-colors cursor-pointer">
              <div>
                <div className="text-purple-400 font-bold mb-1">#41 Fix Next.js Build Errors</div>
                <div className="text-xs text-gray-400">merged yesterday by @lakshyniti</div>
              </div>
              <div className="bg-purple-900/50 text-purple-400 text-xs px-2 py-1 rounded">Merged</div>
            </div>
          </div>
        )}

        {activeTab === "branches" && (
          <div className="space-y-2">
            <div className="p-2 border border-[#333] bg-[#252526] rounded flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-white">master</span>
              <span className="text-gray-500 text-xs ml-auto">Updated 5 mins ago</span>
            </div>
            <div className="p-2 border border-[#333] bg-[#252526] rounded flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-white">feature/digital-twin</span>
              <span className="text-gray-500 text-xs ml-auto">Active</span>
            </div>
          </div>
        )}

        {activeTab === "ide" && (
          <div className="h-full bg-[#1e1e1e] border border-[#333] rounded p-4 font-mono text-sm overflow-hidden">
            <div className="text-blue-400">import</div> <div className="text-yellow-300">{"{ useState }"}</div> <div className="text-blue-400">from</div> <div className="text-orange-300">&quot;react&quot;</div>;
            <br/><br/>
            <div className="text-blue-400">export function</div> <div className="text-yellow-200">Terminal</div>() {"{"}<br/>
            &nbsp;&nbsp;<div className="text-gray-500">{/* Ready for AI Pair Programming */}</div><br/>
            &nbsp;&nbsp;<div className="text-blue-400">return</div> ( <div className="text-blue-300">{"<div />"}</div> );<br/>
            {"}"}
          </div>
        )}
      </div>
    </div>
  );
}
