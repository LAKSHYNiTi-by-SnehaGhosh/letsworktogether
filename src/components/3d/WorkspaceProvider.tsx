"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useOfficeStore } from "@/lib/store/office-state";
import { OfficeEnvironment } from "./OfficeEnvironment";

import { OfficeStateEngineRunner } from "./OfficeStateEngineRunner";

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const is3DMode = useOfficeStore((state) => state.is3DMode);

  return (
    <div className="relative w-full h-full">
      <OfficeStateEngineRunner />
      {/* 2D Dashboard (hidden when 3D is active to keep state) */}
      <div className={`w-full h-full ${is3DMode ? "hidden" : "block"}`}>
        {children}
      </div>

      {/* 3D Workspace */}
      {is3DMode && (
        <div className="absolute inset-0 z-10 bg-black">
          <Canvas shadows camera={{ position: [5, 3, 5], fov: 50 }}>
            <Suspense fallback={null}>
              <OrbitControls makeDefault />
              <OfficeEnvironment />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
}
