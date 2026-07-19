import React, { Suspense, useEffect, useState, useRef } from "react";
import { Environment, Sky, Sparkles, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOfficeStore } from "@/lib/store/office-state";
import { Reception } from "./rooms/Reception";
import { PersonalWorkspace } from "./rooms/PersonalWorkspace";
import { MeetingRoom } from "./rooms/MeetingRoom";
import { EngineeringDepartment } from "./rooms/EngineeringDepartment";
import { ArchiveRoom } from "./rooms/ArchiveRoom";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useUser } from "@clerk/nextjs";

export function OfficeEnvironment() {
  const currentRoom = useOfficeStore((state) => state.currentRoom);
  const projectHealth = useOfficeStore((state) => state.projectHealth);
  const { user } = useUser();
  const { activeUsers, updatePosition } = useWebSocket();
  
  const [timeOfDay, setTimeOfDay] = useState({ hour: 12, sunPosition: [10, 10, 10] as [number, number, number] });
  const lightRef = useRef<THREE.DirectionalLight>(null);

  // Broadcast position when room changes
  useEffect(() => {
    if (user) {
      // Small random offset so avatars don't overlap perfectly
      const randomOffset = [
        Math.random() * 2 - 1, 
        0.5, 
        Math.random() * 2 - 1
      ] as [number, number, number];
      
      updatePosition(randomOffset, currentRoom);
    }
  }, [currentRoom, user]);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  // Determine time of day
  useEffect(() => {
    const hour = new Date().getHours();
    // Sun position logic based on hour (very simple arc)
    const normalizedHour = (hour - 6) / 12; // 6am = 0, 6pm = 1
    const angle = normalizedHour * Math.PI;
    const x = Math.cos(angle) * 10;
    const y = Math.max(Math.sin(angle) * 10, -2); // don't go too far below horizon
    
    setTimeOfDay({ hour, sunPosition: [x, y, 10] });
  }, []);

  // Animate critical lighting
  useFrame((state) => {
    if (projectHealth === "Critical" && ambientRef.current) {
      // Pulsing red effect
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.3;
      ambientRef.current.intensity = pulse;
    } else if (ambientRef.current) {
      ambientRef.current.intensity = 0.5; // Default
    }
  });

  // Health-based colors
  let ambientColor = "#ffffff";
  let directionalColor = "#ffffff";
  
  if (projectHealth === "Healthy") {
    ambientColor = "#e6f7ff"; // slight cool white
  } else if (projectHealth === "At Risk") {
    ambientColor = "#ffebcc"; // amber hue
    directionalColor = "#ffcc80";
  } else if (projectHealth === "Critical") {
    ambientColor = "#ffcccc"; // red hue
    directionalColor = "#ff4d4d";
  } else if (projectHealth === "Completed") {
    ambientColor = "#ffffff";
    directionalColor = "#ffffff";
  }

  return (
    <>
      <Sky sunPosition={timeOfDay.sunPosition} />
      {/* Fallback environment lighting if sky isn't enough */}
      <Environment preset={timeOfDay.hour < 7 || timeOfDay.hour > 19 ? "night" : "city"} />
      
      <ambientLight ref={ambientRef} color={ambientColor} intensity={0.5} />
      <directionalLight 
        ref={lightRef}
        color={directionalColor}
        position={timeOfDay.sunPosition} 
        intensity={projectHealth === "Critical" ? 0.3 : 1} 
        castShadow 
      />
      
      {/* Celebration Confetti */}
      {projectHealth === "Completed" && (
        <Sparkles count={200} scale={15} size={2} speed={0.4} opacity={1} color="#ffcc00" position={[0, 3, 0]} />
      )}

      {/* Multiplayer Avatars */}
      {activeUsers.filter(u => u.id !== user?.id && u.room === currentRoom).map((u) => (
        <group key={u.id} position={u.position as [number, number, number] || [0, 1, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.2, 1.2, 16]} />
            <meshStandardMaterial color="#88aadd" />
          </mesh>
          <Html position={[0, 1.5, 0]} center>
            <div className="px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-[10px] rounded shadow border border-white/10 whitespace-nowrap">
              {u.name}
            </div>
          </Html>
        </group>
      ))}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={projectHealth === "Critical" ? "#1a0f0f" : "#303030"} />
      </mesh>

      <Suspense fallback={null}>
        {currentRoom === "reception" && <Reception />}
        {currentRoom === "workspace" && <PersonalWorkspace />}
        {currentRoom === "meeting" && <MeetingRoom />}
        {currentRoom === "engineering" && <EngineeringDepartment />}
        {currentRoom === "archive" && <ArchiveRoom />}
      </Suspense>
    </>
  );
}
