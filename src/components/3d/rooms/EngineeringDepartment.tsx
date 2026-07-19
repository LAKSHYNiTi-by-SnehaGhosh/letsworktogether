import React, { useState } from "react";
import { Text, Html } from "@react-three/drei";
import { AiMentor } from "@/components/dashboard/ai-mentor";
import { GithubVisualization } from "@/components/dashboard/github-visualization";
import { EngineeringTerminal } from "../ui/EngineeringTerminal";
import { AnalyticsDashboard } from "../ui/AnalyticsDashboard";

export function EngineeringDepartment() {
  const [showTechLeadModal, setShowTechLeadModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const closeAll = () => {
    setShowTechLeadModal(false);
    setShowGithubModal(false);
    setShowTerminal(false);
    setShowAnalytics(false);
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Multi-desk setup */}
      <mesh position={[-2, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      
      {/* Computer Terminal on Desk 1 */}
      <mesh 
        position={[-2, 1.25, -0.2]} 
        castShadow
        onClick={(e) => { e.stopPropagation(); closeAll(); setShowTerminal(!showTerminal); }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[0.8, 0.5, 0.05]} />
        <meshStandardMaterial color={showTerminal ? "#333333" : "#111111"} />
      </mesh>
      <Text position={[-2, 1.25, -0.16]} fontSize={0.08} color="#00ff00">
        Terminal
      </Text>

      {showTerminal && (
        <Html position={[-2, 2.5, 0]} center zIndexRange={[100, 0]}>
          <div className="relative">
            <button className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full z-50 flex items-center justify-center pointer-events-auto shadow-md" onClick={() => setShowTerminal(false)}>×</button>
            <EngineeringTerminal />
          </div>
        </Html>
      )}

      <mesh position={[2, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color="#444444" />
      </mesh>

      {/* AI Tech Lead Character Placeholder */}
      <mesh 
        position={[0, 1, -1.5]} 
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          closeAll();
          setShowTechLeadModal(!showTechLeadModal);
        }}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'auto';
        }}
      >
        <cylinderGeometry args={[0.3, 0.3, 1.5, 16]} />
        <meshStandardMaterial color={showTechLeadModal ? "#9999ff" : "#5555ff"} />
      </mesh>

      {showTechLeadModal && (
        <Html position={[0, 2.5, -1.5]} center zIndexRange={[100, 0]} className="w-80 h-96 bg-background border rounded-xl shadow-2xl p-4 pointer-events-auto">
          <div className="relative h-full">
            <button 
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex justify-center items-center text-xs z-50"
              onClick={() => setShowTechLeadModal(false)}
            >
              ×
            </button>
            <div className="text-center font-bold mb-2">AI Tech Lead</div>
            <AiMentor persona="TECH_LEAD" />
          </div>
        </Html>
      )}

      <Text position={[0, 2, -1.5]} fontSize={0.2} color="white">
        AI Tech Lead
      </Text>

      {/* Analytics Wall */}
      <mesh 
        position={[-3, 1.5, -4]} 
        castShadow 
        receiveShadow
        onClick={(e) => { e.stopPropagation(); closeAll(); setShowAnalytics(!showAnalytics); }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color={showAnalytics ? "#223344" : "#112233"} />
      </mesh>
      <Text position={[-3, 1.5, -3.9]} fontSize={0.2} color="#00ffff">
        Analytics Wall (Click)
      </Text>

      {showAnalytics && (
        <Html position={[-3, 1.5, -3.8]} center zIndexRange={[100, 0]}>
          <div className="relative">
            <button className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full z-50 flex items-center justify-center pointer-events-auto shadow-md" onClick={() => setShowAnalytics(false)}>×</button>
            <AnalyticsDashboard />
          </div>
        </Html>
      )}

      {/* GitHub Commits Board Placeholder */}
      <mesh 
        position={[2, 1.5, -4]} 
        castShadow 
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          closeAll();
          setShowGithubModal(!showGithubModal);
        }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color={showGithubModal ? "#222222" : "#111111"} />
      </mesh>
      <Text position={[2, 1.5, -3.9]} fontSize={0.2} color="#00ff00">
        GitHub Stream (Click)
      </Text>

      {showGithubModal && (
        <Html position={[2, 1.5, -3.8]} center zIndexRange={[100, 0]} className="w-[400px] h-[300px] pointer-events-auto">
          <div className="relative h-full w-full">
            <button 
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex justify-center items-center text-xs z-50"
              onClick={() => setShowGithubModal(false)}
            >
              ×
            </button>
            <GithubVisualization />
          </div>
        </Html>
      )}

      <Text position={[0, 3, -4]} fontSize={0.4} color="#aaaaaa">
        Engineering Department
      </Text>
    </group>
  );
}
