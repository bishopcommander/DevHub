import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Line, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 3D Core Node Mesh with distortion effect
function CoreNode({ isAnalyzing, label }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isAnalyzing ? 1.8 : 0.4);
      meshRef.current.rotation.x += delta * (isAnalyzing ? 1.2 : 0.2);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.1, 2]} />
        <MeshDistortMaterial
          color={isAnalyzing ? '#f59e0b' : '#d97706'}
          emissive={isAnalyzing ? '#fbbf24' : '#b45309'}
          emissiveIntensity={isAnalyzing ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.8}
          distort={isAnalyzing ? 0.6 : 0.3}
          speed={isAnalyzing ? 4 : 2}
          wireframe={false}
        />
      </mesh>
      <Text
        position={[0, 1.6, 0]}
        fontSize={0.28}
        color="#fef3c7"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf"
      >
        {label || "AI CODE AST CORE"}
      </Text>
    </Float>
  );
}

// Particle Field Background
function ParticleField({ isAnalyzing }) {
  const count = 350;
  const meshRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorChoices = ['#f59e0b', '#10b981', '#f43f5e', '#fbbf24'];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;

      const c = new THREE.Color(colorChoices[Math.floor(Math.random() * colorChoices.length)]);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isAnalyzing ? 0.35 : 0.05);
      meshRef.current.rotation.x += delta * (isAnalyzing ? 0.25 : 0.03);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isAnalyzing ? 0.12 : 0.08}
        vertexColors
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Graph Node in 3D Space
function GraphNode3D({ node, onSelectNode, isSelected }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  const pos = node.position3d || [0, 0, 0];
  const nodeColor = node.color || '#f59e0b';

  return (
    <group position={pos}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelectNode && onSelectNode(node)}
      >
        <octahedronGeometry args={[hovered || isSelected ? 0.45 : 0.3, 0]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={hovered || isSelected ? 0.9 : 0.4}
          wireframe={false}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Outer Halo */}
      <Sphere args={[hovered ? 0.6 : 0.4, 16, 16]}>
        <meshBasicMaterial
          color={nodeColor}
          transparent
          opacity={hovered ? 0.35 : 0.12}
          wireframe
        />
      </Sphere>

      {/* Node Label */}
      <Text
        position={[0, 0.55, 0]}
        fontSize={0.22}
        color={hovered || isSelected ? '#ffffff' : '#e7e5e4'}
        anchorX="center"
        anchorY="bottom"
      >
        {node.label || 'Node'}
      </Text>

      {/* Connecting Line to Origin Core */}
      <Line
        points={[[0, 0, 0], [-pos[0], -pos[1], -pos[2]]]}
        color={nodeColor}
        lineWidth={1.5}
        transparent
        opacity={hovered ? 0.7 : 0.3}
      />
    </group>
  );
}

export default function CodeExplainer3DCanvas({
  isAnalyzing = false,
  graphNodes = [],
  selectedNode = null,
  onSelectNode = () => {}
}) {
  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border border-amber-500/20 shadow-2xl shadow-stone-950/80">
      {/* Status Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-amber-500/30 text-xs font-mono text-amber-300">
        <span className={`w-2.5 h-2.5 rounded-full ${isAnalyzing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
        <span>{isAnalyzing ? 'AST MATRIX SCANNING...' : '3D HOLOGRAPHIC AST READY'}</span>
      </div>

      {/* Control Hint */}
      <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-stone-900/70 backdrop-blur-md border border-stone-800 text-[11px] text-stone-400 font-mono">
        🖱️ Drag to rotate • Scroll to zoom • Click nodes
      </div>

      {/* Selected Node Details Floating Tooltip */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 z-10 max-w-xs p-3.5 rounded-xl bg-stone-900/90 backdrop-blur-xl border border-amber-500/40 shadow-xl text-left transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedNode.color || '#f59e0b' }} />
            <p className="text-xs font-bold text-stone-100 font-mono">{selectedNode.label}</p>
            <span className="ml-auto text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-950 text-amber-400 border border-amber-800/50">
              {selectedNode.nodeType}
            </span>
          </div>
          <p className="text-xs text-stone-300 font-sans leading-relaxed">{selectedNode.details}</p>
        </div>
      )}

      {/* 3D R3F Canvas */}
      <Canvas camera={{ position: [0, 1, 7], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#f59e0b" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#10b981" />
        <directionalLight position={[0, 5, 5]} intensity={1} />

        <ParticleField isAnalyzing={isAnalyzing} />
        <CoreNode isAnalyzing={isAnalyzing} label={isAnalyzing ? "ANALYZING AST..." : "CODE AST MATRIX"} />

        {graphNodes && graphNodes.length > 0 && graphNodes.map((node, idx) => (
          <GraphNode3D
            key={node.id || idx}
            node={node}
            onSelectNode={onSelectNode}
            isSelected={selectedNode?.id === node.id}
          />
        ))}

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          maxDistance={14}
          minDistance={2.5}
          autoRotate={!isAnalyzing}
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
