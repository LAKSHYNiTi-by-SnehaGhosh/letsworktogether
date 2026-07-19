import React, { useState } from "react";
import { Text, Html } from "@react-three/drei";
import { AiMentor } from "@/components/dashboard/ai-mentor";

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
        <Html position={[0, 2.5, -2.5]} center className="w-80 h-96 bg-background border rounded-xl shadow-2xl p-4 pointer-events-auto">
          <div className="w-[350px] h-[450px] bg-background/95 backdrop-blur-md rounded-xl border border-border/50 shadow-2xl overflow-hidden" onPointerDown={(e) => e.stopPropagation()}>
            <AiMentor persona="HR" />
          </div>
          <div className="relative h-full">
            <button 
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex justify-center items-center text-xs z-50"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <div className="text-center font-bold mb-2">AI HR</div>
            <AiMentor />
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
