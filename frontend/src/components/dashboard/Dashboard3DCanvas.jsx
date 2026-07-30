import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Box, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Bar3D({ node, isSelected, onSelectNode }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle floating animation for bars based on their height
      meshRef.current.position.y = node.position3d[1] + Math.sin(state.clock.elapsedTime + node.position3d[0]) * 0.1;
    }
  });

  const width = 0.6;
  const depth = 0.6;
  const height = Math.max(0.1, node.value); // Base height
  
  const active = hovered || isSelected;

  return (
    <group position={[node.position3d[0], 0, node.position3d[2]]}>
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]} // Shift up so base is at y=0
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelectNode && onSelectNode(node)}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={active ? 0.6 : 0.2}
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={active ? 1 : 0.8}
        />
      </mesh>

      {/* Label Text */}
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.3}
        color={active ? '#ffffff' : '#94a3b8'}
        anchorX="center"
        anchorY="top"
      >
        {node.label}
      </Text>
      
      {/* Value Text */}
      {active && (
        <Text
          position={[0, height + 1.2, 0]}
          fontSize={0.4}
          color={node.color}
          anchorX="center"
          anchorY="bottom"
        >
          {node.value}h
        </Text>
      )}

      {/* Base Grid Highlighter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={node.color} transparent opacity={active ? 0.3 : 0.05} />
      </mesh>
    </group>
  );
}

export default function Dashboard3DCanvas({
  barNodes = [],
  selectedNode = null,
  onSelectNode = () => {}
}) {
  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/20 border border-indigo-500/20 shadow-2xl">
      
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 text-xs font-mono text-indigo-300">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>3D ACTIVITY MATRIX</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-slate-900/70 backdrop-blur-md border border-slate-700 text-[11px] text-slate-400 font-mono">
        🖱️ Orbit • Scroll Zoom
      </div>

      <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#818cf8" />
        
        <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.2} color="#818cf8" />

        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <group position={[0, -1, 0]}>
            {/* Base Grid Plane */}
            <gridHelper args={[12, 12, '#334155', '#1e293b']} position={[0, -0.1, 0]} />
            
            {barNodes.map((node, idx) => (
              <Bar3D
                key={node.id || idx}
                node={node}
                isSelected={selectedNode?.id === node.id}
                onSelectNode={onSelectNode}
              />
            ))}
          </group>
        </Float>

        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          autoRotate={true} 
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2 - 0.1} // Prevent looking from below
          minDistance={4}
          maxDistance={12}
        />
      </Canvas>
    </div>
  );
}
