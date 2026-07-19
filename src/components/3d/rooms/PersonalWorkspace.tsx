import React, { useState } from "react";
import { Text, Html } from "@react-three/drei";
import { TaskBoard } from "../ui/TaskBoard";
import { CalendarWidget } from "../ui/CalendarWidget";
import { NotificationFeed } from "../ui/NotificationFeed";

export function PersonalWorkspace() {
  const [showTasks, setShowTasks] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const closeAll = () => {
    setShowTasks(false);
    setShowCalendar(false);
    setShowNotifs(false);
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Personal Desk (Tasks) */}
      <mesh 
        position={[0, 0.5, 0]} 
        castShadow 
        receiveShadow
        onClick={(e) => { e.stopPropagation(); closeAll(); setShowTasks(!showTasks); }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color={showTasks ? "#777777" : "#555555"} />
      </mesh>

      <mesh position={[-0.9, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      <mesh position={[0.9, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Laptop / Monitor (Tasks) */}
      <mesh 
        position={[0, 0.75, -0.2]} 
        castShadow
        onClick={(e) => { e.stopPropagation(); closeAll(); setShowTasks(!showTasks); }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[0.8, 0.5, 0.05]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <Text position={[0, 0.75, -0.16]} fontSize={0.08} color="white">
        Task Board
      </Text>

      {showTasks && (
        <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
          <div className="relative">
            <button className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full z-50 flex items-center justify-center pointer-events-auto shadow-md" onClick={() => setShowTasks(false)}>×</button>
            <TaskBoard />
          </div>
        </Html>
      )}

      {/* Calendar Screen */}
      <mesh 
        position={[-2, 1.5, -2]} 
        rotation={[0, Math.PI / 4, 0]}
        castShadow
        onClick={(e) => { e.stopPropagation(); closeAll(); setShowCalendar(!showCalendar); }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[1.5, 1, 0.05]} />
        <meshStandardMaterial color={showCalendar ? "#334466" : "#223355"} />
      </mesh>
      <Text position={[-1.9, 1.5, -1.9]} rotation={[0, Math.PI / 4, 0]} fontSize={0.15} color="white">
        Calendar
      </Text>
      
      {showCalendar && (
        <Html position={[-2, 1.5, -1.9]} center zIndexRange={[100, 0]}>
          <div className="relative">
            <button className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full z-50 flex items-center justify-center pointer-events-auto shadow-md" onClick={() => setShowCalendar(false)}>×</button>
            <CalendarWidget />
          </div>
        </Html>
      )}

      {/* Notification Board */}
      <mesh 
        position={[2, 1.5, -2]} 
        rotation={[0, -Math.PI / 4, 0]}
        castShadow
        onClick={(e) => { e.stopPropagation(); closeAll(); setShowNotifs(!showNotifs); }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[1.2, 1.8, 0.05]} />
        <meshStandardMaterial color={showNotifs ? "#663333" : "#552222"} />
      </mesh>
      <Text position={[1.95, 1.5, -1.9]} rotation={[0, -Math.PI / 4, 0]} fontSize={0.12} color="white">
        Company Activity
      </Text>

      {showNotifs && (
        <Html position={[2, 1.5, -1.9]} center zIndexRange={[100, 0]}>
          <div className="relative">
            <button className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full z-50 flex items-center justify-center pointer-events-auto shadow-md" onClick={() => setShowNotifs(false)}>×</button>
            <NotificationFeed />
          </div>
        </Html>
      )}

      {/* Floating Sign */}
      <Text position={[0, 3, -3]} fontSize={0.4} color="#aaaaaa">
        Personal Workspace
      </Text>
    </group>
  );
}
