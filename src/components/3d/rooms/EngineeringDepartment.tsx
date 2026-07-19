import React, { useState } from "react";
import { Text, Html } from "@react-three/drei";
import { AiMentor } from "@/components/dashboard/ai-mentor";
import { GithubVisualization } from "@/components/dashboard/github-visualization";

export function EngineeringDepartment() {
  const [showTechLeadModal, setShowTechLeadModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);

  return (
    <group position={[0, 0, 0]}>
      {/* Multi-desk setup */}
      <mesh position={[-2, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
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
          setShowTechLeadModal(!showTechLeadModal);
          setShowGithubModal(false);
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
        <Html position={[0, 2.5, -1.5]} center className="w-80 h-96 bg-background border rounded-xl shadow-2xl p-4 pointer-events-auto">
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

      {/* GitHub Commits Board Placeholder */}
      <mesh 
        position={[0, 1.5, -4]} 
        castShadow 
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          setShowGithubModal(!showGithubModal);
          setShowTechLeadModal(false);
        }}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[4, 2, 0.1]} />
        <meshStandardMaterial color={showGithubModal ? "#222222" : "#111111"} />
      </mesh>
      <Text position={[0, 1.5, -3.9]} fontSize={0.2} color="#00ff00">
        GitHub Activity Stream (Click Me)
      </Text>

      {showGithubModal && (
        <Html position={[0, 1.5, -3.8]} center className="w-[400px] h-[300px] pointer-events-auto">
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
