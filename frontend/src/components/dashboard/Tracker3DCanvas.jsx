import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const CATEGORY_COLORS = {
  shipping: '#38bdf8',
  habits: '#10b981',
  focus: '#a855f7',
  learning: '#f59e0b',
};

function BingoCell3D({ node, isChecked, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      if (isChecked || node.isSpecial) {
        meshRef.current.rotation.y = state.clock.elapsedTime * (node.isSpecial ? 1.5 : 0.6);
      }
    }
  });

  const size = 0.55;
  const active = hovered || isChecked || node.isSpecial;

  return (
    <group position={node.position3d}>
      {/* Glow ring for checked cells */}
      {(isChecked || node.isSpecial) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 0.9, size * 1.1, 32]} />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onToggle && onToggle(node.id)}
      >
        {node.isSpecial ? (
          <octahedronGeometry args={[size * 0.85, 0]} />
        ) : (
          <boxGeometry args={[size, size, size]} />
        )}
        <meshStandardMaterial
          color={isChecked || node.isSpecial ? node.color : '#1e293b'}
          emissive={node.color}
          emissiveIntensity={active ? 0.6 : 0.05}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {hovered && (
        <Text
          position={[0, size + 0.45, 0]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          anchorY="bottom"
          maxWidth={1.5}
        >
          {node.label}
        </Text>
      )}
    </group>
  );
}

export default function Tracker3DCanvas({
  achievementNodes = [],
  checkedIds = new Set(),
  onToggleNode = () => {},
}) {
  const completedCount = achievementNodes.filter(
    (n) => checkedIds.has(n.id) || n.isSpecial
  ).length;

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950/20 border border-violet-500/20 shadow-2xl">
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-violet-500/30 text-xs font-mono text-violet-300">
        <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
        <span>3D ACHIEVEMENT CUBE</span>
      </div>

      {/* Progress Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/30 text-xs font-mono text-amber-300">
        <span>✨</span>
        <span>{completedCount}/{achievementNodes.length} cells lit</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-slate-900/70 backdrop-blur-md border border-slate-700 text-[11px] text-slate-400 font-mono">
        🖱️ Click cells • Drag to orbit
      </div>

      <Canvas camera={{ position: [0, 3, 9], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 8, 0]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, 0, 5]} intensity={0.5} color="#818cf8" />
        <pointLight position={[5, 0, -5]} intensity={0.5} color="#10b981" />

        <Sparkles
          count={80}
          scale={12}
          size={2}
          speed={0.3}
          opacity={0.3}
          color="#a855f7"
        />

        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <group>
            {achievementNodes.map((node, idx) => (
              <BingoCell3D
                key={node.id || idx}
                node={node}
                isChecked={checkedIds.has(node.id)}
                onToggle={onToggleNode}
              />
            ))}
          </group>
        </Float>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.4}
          maxDistance={14}
          minDistance={5}
        />
      </Canvas>
    </div>
  );
}
