import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

function GalaxyNode3D({ node, onSelectNode, isSelected }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  const pos = node.position3d || [0, 0, 0];
  const nodeColor = node.color || '#38bdf8';
  const size = node.radius || 0.6;

  return (
    <group position={pos}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelectNode && onSelectNode(node)}
      >
        <sphereGeometry args={[hovered || isSelected ? size * 1.3 : size, 32, 32]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.25}
        color={hovered || isSelected ? '#ffffff' : '#cbd5e1'}
        anchorX="center"
        anchorY="bottom"
      >
        {node.name}
      </Text>
      
      <Text
        position={[0, size + 0.2, 0]}
        fontSize={0.15}
        color={nodeColor}
        anchorX="center"
        anchorY="bottom"
      >
        {node.category.toUpperCase()}
      </Text>

      {/* Orbit ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.5, size * 1.6, 64]} />
        <meshBasicMaterial color={nodeColor} transparent opacity={hovered ? 0.5 : 0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function ConnectionLines({ nodes }) {
  if (!nodes || nodes.length < 2) return null;
  
  const lines = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      lines.push(
        <Line
          key={`${i}-${j}`}
          points={[nodes[i].position3d, nodes[j].position3d]}
          color="#334155"
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      );
    }
  }
  return <>{lines}</>;
}

export default function StackDecider3DCanvas({
  isLoading = false,
  galaxyNodes = [],
  selectedNode = null,
  onSelectNode = () => {}
}) {
  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border border-emerald-500/20 shadow-2xl shadow-stone-950/80">
      
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-emerald-500/30 text-xs font-mono text-emerald-300">
        <span className={`w-2.5 h-2.5 rounded-full ${isLoading ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
        <span>{isLoading ? 'CALCULATING ORBITS...' : 'TECH GALAXY RENDERED'}</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-stone-900/70 backdrop-blur-md border border-stone-800 text-[11px] text-stone-400 font-mono">
        🖱️ Drag to orbit • Scroll to zoom
      </div>

      {selectedNode && (
        <div className="absolute bottom-4 left-4 z-10 p-3.5 rounded-xl bg-stone-900/90 backdrop-blur-xl border border-emerald-500/40 shadow-xl text-left min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedNode.color || '#10b981' }} />
            <p className="text-xs font-bold text-stone-100">{selectedNode.name}</p>
          </div>
          <p className="text-[10px] text-stone-400 uppercase tracking-wider">{selectedNode.category} Layer</p>
        </div>
      )}

      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#10b981" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={isLoading ? 3 : 1} />

        <Float speed={isLoading ? 3 : 1} rotationIntensity={0.5} floatIntensity={1}>
          <group rotation={[0, isLoading ? Math.PI : 0, 0]}>
            <ConnectionLines nodes={galaxyNodes} />
            {galaxyNodes.map((node, idx) => (
              <GalaxyNode3D
                key={node.id || idx}
                node={node}
                onSelectNode={onSelectNode}
                isSelected={selectedNode?.id === node.id}
              />
            ))}
          </group>
        </Float>

        <OrbitControls enableZoom={true} enablePan={true} autoRotate={!isLoading} autoRotateSpeed={0.5} maxDistance={15} minDistance={3} />
      </Canvas>
    </div>
  );
}
