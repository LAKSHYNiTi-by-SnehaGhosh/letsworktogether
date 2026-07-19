import React, { useState } from "react";
import { Text, Html } from "@react-three/drei";
import { DocumentationLibrary } from "../ui/DocumentationLibrary";

export function ArchiveRoom() {
  const [showDocs, setShowDocs] = useState(false);

  return (
    <group position={[0, 0, 0]}>
      {/* Bookshelves */}
      <mesh 
        position={[-3, 1.5, 0]} 
        castShadow 
        receiveShadow
        onClick={(e) => { e.stopPropagation(); setShowDocs(!showDocs); }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[1, 3, 4]} />
        <meshStandardMaterial color={showDocs ? "#553311" : "#3e2723"} />
      </mesh>
      
      {showDocs && (
        <Html position={[-3, 2, 0]} center zIndexRange={[100, 0]}>
          <div className="relative">
            <button className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full z-50 flex items-center justify-center pointer-events-auto shadow-md" onClick={() => setShowDocs(false)}>×</button>
            <DocumentationLibrary />
          </div>
        </Html>
      )}

      <Text position={[0, 3, -3]} fontSize={0.4} color="#aaaaaa">
        Archive Room (Documentation)
      </Text>
    </group>
  );
}
