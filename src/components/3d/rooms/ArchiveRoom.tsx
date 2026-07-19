import React, { useState } from "react";
import { Text, Html } from "@react-three/drei";

export function ArchiveRoom() {
  const [showDocs, setShowDocs] = useState(false);

  return (
    <group position={[0, 0, 0]}>
      {/* Bookshelves */}
      <mesh position={[-2, 1, -2]} castShadow receiveShadow>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[2, 1, -2]} castShadow receiveShadow>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>

      {/* Interactive Terminal / Catalog */}
      <mesh 
        position={[0, 0.5, -1]} 
        castShadow 
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          setShowDocs(!showDocs);
        }}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[1.5, 1, 0.8]} />
        <meshStandardMaterial color={showDocs ? "#555555" : "#333333"} />
      </mesh>
      <Text position={[0, 1.2, -0.9]} fontSize={0.15} color="white">
        Project Archive Catalog
      </Text>

      {showDocs && (
        <Html position={[0, 1.5, -1]} center className="w-96 h-80 bg-background border rounded-xl shadow-2xl p-4 pointer-events-auto">
          <div className="relative h-full flex flex-col">
            <button 
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex justify-center items-center text-xs z-50"
              onClick={() => setShowDocs(false)}
            >
              ×
            </button>
            <h3 className="font-bold mb-4 border-b pb-2">Documentation Library</h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              <div className="p-2 bg-muted rounded-md hover:bg-muted/80 cursor-pointer">
                Architecture Vision
              </div>
              <div className="p-2 bg-muted rounded-md hover:bg-muted/80 cursor-pointer">
                API Contracts
              </div>
              <div className="p-2 bg-muted rounded-md hover:bg-muted/80 cursor-pointer">
                Database Schema
              </div>
            </div>
          </div>
        </Html>
      )}

      <Text position={[0, 3, -3]} fontSize={0.4} color="#aaaaaa">
        Archive Room (Documentation)
      </Text>
    </group>
  );
}
