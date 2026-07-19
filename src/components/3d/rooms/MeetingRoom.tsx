import React, { useState, useEffect } from "react";
import { Text, Html } from "@react-three/drei";
import { AiMentor } from "@/components/dashboard/ai-mentor";
import { AiWhiteboard } from "@/components/dashboard/ai-whiteboard";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useOfficeStore } from "@/lib/store/office-state";
import { toast } from "sonner";

export function MeetingRoom() {
  const [showPmModal, setShowPmModal] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const { sendMessage, lastMessage } = useWebSocket();
  const setRoom = useOfficeStore(state => state.setRoom);

  useEffect(() => {
    if (lastMessage && (lastMessage as any).type === "MEETING_START") {
      toast("A live meeting has started in the Meeting Room!");
    }
  }, [lastMessage]);

  const startMeeting = () => {
    sendMessage({ type: "MEETING_START", payload: { timestamp: Date.now() } });
    toast.success("Meeting broadcast sent to all users!");
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Conference Table */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 0.1, 32]} />
        <meshStandardMaterial color="#664422" />
      </mesh>

      {/* Meeting Bell */}
      <mesh 
        position={[0, 0.6, 0]} 
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          startMeeting();
        }}
        onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffcc00" metalness={0.8} roughness={0.2} />
      </mesh>
      <Text position={[0, 1.2, 0]} fontSize={0.15} color="#ffffff">
        Start Meeting (Click)
      </Text>

      {/* AI PM Character Placeholder */}
      <mesh 
        position={[0, 1, -2.5]} 
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          setShowPmModal(!showPmModal);
          setShowBoardModal(false);
        }}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'auto';
        }}
      >
        <cylinderGeometry args={[0.3, 0.3, 1.5, 16]} />
        <meshStandardMaterial color={showPmModal ? "#77ff77" : "#55ff55"} />
      </mesh>
      
      {showPmModal && (
        <Html position={[0, 2.5, -2.5]} center className="w-80 h-96 bg-background border rounded-xl shadow-2xl p-4 pointer-events-auto">
          <div className="relative h-full">
            <button 
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex justify-center items-center text-xs z-50"
              onClick={() => setShowPmModal(false)}
            >
              ×
            </button>
            <AiMentor persona="PM" />
          </div>
        </Html>
      )}

      {/* AI Whiteboard Placeholder */}
      <mesh 
        position={[3, 1.5, 0]} 
        rotation={[0, -Math.PI / 2, 0]}
        castShadow 
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          setShowBoardModal(!showBoardModal);
          setShowPmModal(false);
        }}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[4, 2.5, 0.1]} />
        <meshStandardMaterial color={showBoardModal ? "#ffffff" : "#f0f0f0"} />
      </mesh>
      <Text position={[2.9, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.2} color="#000000">
        Sprint Planning Board (Click Me)
      </Text>

      {showBoardModal && (
        <Html position={[3, 2.5, 0]} center className="w-[800px] h-[500px] bg-background border rounded-xl shadow-2xl pointer-events-auto">
          <div className="relative h-full">
            <button 
              className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex justify-center items-center text-sm z-50 shadow-md hover:bg-red-600 transition-colors"
              onClick={() => setShowBoardModal(false)}
            >
              ×
            </button>
            <AiWhiteboard />
          </div>
        </Html>
      )}

      <Text position={[0, 2, -2.5]} fontSize={0.2} color="white">
        AI PM
      </Text>

      <Text position={[0, 3, -3]} fontSize={0.4} color="#aaaaaa">
        Meeting Room (Standups)
      </Text>
    </group>
  );
}
