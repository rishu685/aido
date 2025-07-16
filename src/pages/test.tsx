import type { NextPage } from "next";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Avatar from "src/components/3d/avatar1";

const Test: NextPage = ({}) => {
  return (
    <div>
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 8], fov: 43 }}
        fallback={<div className="flex items-center justify-center h-full">Loading...</div>}
      >
        <color attach="background" args={["#ececec"]} />
        <OrbitControls />
        <React.Suspense fallback={null}>
          <Avatar position={[0, -3, 5]} scale={2} />
        </React.Suspense>
        <Environment preset="apartment" />
        <Scene />
      </Canvas>
    </div>
  );
};

export default Test;

const Scene = () => {
  const viewport = useThree((state) => state.viewport);
  // Create a simple gradient background instead of loading texture
  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshBasicMaterial color="#ececec" />
    </mesh>
  );
};
