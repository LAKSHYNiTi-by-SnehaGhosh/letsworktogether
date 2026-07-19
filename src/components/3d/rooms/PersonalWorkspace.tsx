import React from "react";
import { Text } from "@react-three/drei";

export function PersonalWorkspace() {
  return (
    <group position={[0, 0, 0]}>
      {/* Personal Desk */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      <mesh position={[-0.9, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      <mesh position={[0.9, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Laptop / Monitor */}
      <mesh position={[0, 0.75, -0.2]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.05]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <Text position={[0, 0.75, -0.16]} fontSize={0.08} color="white">
        Dashboard
      </Text>

      {/* Floating Sign */}
      <Text position={[0, 2, -2]} fontSize={0.4} color="#aaaaaa">
        Personal Workspace
      </Text>
    </group>
  );
}
