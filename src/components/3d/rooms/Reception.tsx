import React, { useState } from "react";
import { Text, Html } from "@react-three/drei";
import { HrBriefing } from "../ui/HrBriefing";

export function Reception() {
  const [showModal, setShowModal] = useState(false);

  return (
    <group position={[0, 0, 0]}>
      {/* Reception Desk */}
      <mesh position={[0, 0.5, -2]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 1]} />
        <meshStandardMaterial color="#88aadd" />
      </mesh>
      
      {/* AI HR Character Placeholder */}
      <mesh 
        position={[0, 1, -2.5]} 
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(!showModal);
        }}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'auto';
        }}
      >
        <cylinderGeometry args={[0.3, 0.3, 1.5, 16]} />
        <meshStandardMaterial color={showModal ? "#ff9999" : "#ff5555"} />
      </mesh>

      {showModal && (
        <Html position={[0, 2.5, -2.5]} center zIndexRange={[100, 0]}>
          <div className="relative">
            <button className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full z-50 flex items-center justify-center pointer-events-auto shadow-md" onClick={() => setShowModal(false)}>×</button>
            <HrBriefing />
          </div>
        </Html>
      )}

      <Text position={[0, 2, -2.5]} fontSize={0.2} color="white">
        AI HR
      </Text>

      {/* Welcome Sign */}
      <Text position={[0, 3, -5]} fontSize={0.5} color="#aaaaaa">
        LWT Reception
      </Text>
    </group>
  );
}
