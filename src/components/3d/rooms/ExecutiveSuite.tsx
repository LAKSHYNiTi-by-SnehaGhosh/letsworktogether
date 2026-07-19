import React, { useState } from "react";
import { Text, Html } from "@react-three/drei";
import { ExecutiveOverview } from "../ui/ExecutiveOverview";

export function ExecutiveSuite() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <group position={[0, 0, 0]}>
      {/* Executive Desk */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.1, 1.5]} />
        <meshStandardMaterial color="#2c1e16" />
      </mesh>

      <mesh position={[-1.3, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.5, 1.3]} />
        <meshStandardMaterial color="#1a120c" />
      </mesh>
      
      <mesh position={[1.3, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.5, 1.3]} />
        <meshStandardMaterial color="#1a120c" />
      </mesh>
      
      {/* CEO Terminal / Dashboard */}
      <mesh 
        position={[0, 0.75, -0.2]} 
        castShadow
        onClick={(e) => { e.stopPropagation(); setShowDashboard(!showDashboard); }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[1.2, 0.6, 0.05]} />
        <meshStandardMaterial color={showDashboard ? "#445566" : "#223344"} />
      </mesh>
      <Text position={[0, 0.75, -0.16]} fontSize={0.1} color="white">
        CEO Dashboard
      </Text>

      {showDashboard && (
        <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
          <div className="relative">
            <button className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full z-50 flex items-center justify-center pointer-events-auto shadow-md" onClick={() => setShowDashboard(false)}>×</button>
            <ExecutiveOverview />
          </div>
        </Html>
      )}

      {/* Floating Sign */}
      <Text position={[0, 3, -3]} fontSize={0.4} color="#ffd700">
        Executive Suite
      </Text>
    </group>
  );
}
