import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Torus } from '@react-three/drei';
import * as THREE from 'three';

function RotatingTorusKnot({ position, color, speed }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
  });
  return (
    <Float speed={speed * 0.7} rotationIntensity={0.3} floatIntensity={1.5}>
      <mesh ref={ref} position={position}>
        <torusKnotGeometry args={[0.6, 0.18, 120, 16]} />
        <MeshDistortMaterial
          color={color}
          distort={0.25}
          speed={1.5}
          roughness={0.05}
          metalness={0.95}
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  );
}

function GlowSphere({ position, color, size, speed }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.4;
  });
  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.9}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          distort={0.35}
          speed={2}
          roughness={0.1}
          metalness={0.6}
          transparent
          opacity={0.45}
        />
      </mesh>
    </Float>
  );
}

function WarmParticles() {
  const count = 350;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 35;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return arr;
  }, []);

  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.018;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f59e0b" size={0.04} transparent opacity={0.5} />
    </points>
  );
}

function DriftingGrid() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = (state.clock.elapsedTime * 0.35) % 2;
    }
  });
  return (
    <gridHelper
      ref={ref}
      args={[70, 70, '#1c1409', '#130e04']}
      position={[0, -4.5, 0]}
    />
  );
}

export default function Landing3DBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 9], fov: 58 }}>
        <ambientLight intensity={0.25} />
        <pointLight position={[8,  8, 8]}  intensity={1.2} color="#f59e0b" />
        <pointLight position={[-8, -4, -4]} intensity={0.6} color="#10b981" />
        <pointLight position={[0,  6, -6]}  intensity={0.4} color="#f43f5e" />

        <DriftingGrid />
        <WarmParticles />

        <Sparkles count={60} scale={16} size={1.8} speed={0.25} opacity={0.18} color="#f59e0b" />
        <Sparkles count={40} scale={10} size={1.2} speed={0.4}  opacity={0.12} color="#10b981" />

        <RotatingTorusKnot position={[-4.5, 1.5, -3]} color="#d97706" speed={0.7} />
        <RotatingTorusKnot position={[4.5, -1.5, -4]} color="#059669" speed={0.5} />

        <GlowSphere position={[3,  2.5, -2]} color="#f59e0b" size={0.8} speed={0.9} />
        <GlowSphere position={[-3, -2,  -1]} color="#10b981" size={0.6} speed={0.7} />
        <GlowSphere position={[0,  3.5, -5]} color="#f43f5e" size={0.5} speed={1.1} />
        <GlowSphere position={[-1, -3.5,-2]} color="#fbbf24" size={0.4} speed={0.6} />
      </Canvas>
    </div>
  );
}
