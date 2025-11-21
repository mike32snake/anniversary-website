import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows, Float, Sparkles, RoundedBox, Cylinder } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const EternityRing = ({ opacity = 1 }) => {
  const diamondCount = 30;
  const radius = 0.6;
  const bandWidth = 0.14;
  const bandThickness = 0.08;
  const diamondSize = 0.15;

  // Generate band shape
  const bandShape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = bandWidth / 2;
    const t = bandThickness;

    // U-shaped profile for setting
    shape.moveTo(-w, -t);
    shape.lineTo(w, -t);
    shape.lineTo(w, t * 0.5);
    shape.lineTo(w * 0.8, t); // Bevel in
    shape.lineTo(-w * 0.8, t);
    shape.lineTo(-w, t * 0.5);
    shape.lineTo(-w, -t);

    return shape;
  }, []);

  const bandGeometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0, 0,            // ax, aY
      radius, radius,  // xRadius, yRadius
      0, 2 * Math.PI,  // aStartAngle, aEndAngle
      false,           // aClockwise
      0                // aRotation
    );

    const points = curve.getPoints(100);
    const path = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(p.x, 0, p.y)),
      true // closed
    );

    return new THREE.ExtrudeGeometry(bandShape, {
      extrudePath: path,
      steps: 100,
      bevelEnabled: false
    });
  }, [bandShape, radius]);

  const items = useMemo(() => {
    return new Array(diamondCount).fill(0).map((_, i) => {
      const angle = (i / diamondCount) * Math.PI * 2;

      // Position on outer circumference
      // Significantly lowering the diamonds so they sit IN the ring setting
      const outerRadius = radius + bandThickness - 0.03;
      const x = outerRadius * Math.cos(angle);
      const z = outerRadius * Math.sin(angle);

      // Prong angle (between diamonds)
      const prongAngle = angle + (Math.PI / diamondCount);
      // Prongs adjusted to match lowered diamond position
      const prongRadius = radius + bandThickness - 0.02;

      return {
        diamond: {
          position: [x, 0, z],
          rotation: [0, -angle, Math.PI / 2]
        },
        prong: {
          position: [
            prongRadius * Math.cos(prongAngle),
            0,
            prongRadius * Math.sin(prongAngle)
          ],
          rotation: [0, -prongAngle, Math.PI / 2]
        }
      };
    });
  }, []);

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Custom Band */}
      <mesh geometry={bandGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#F5F5F5"
          metalness={1}
          roughness={0.1}
          envMapIntensity={2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Diamonds & Prongs */}
      {items.map((item, i) => (
        <group key={i}>
          {/* Diamond - Brilliant Cut Approximation */}
          <group position={item.diamond.position} rotation={item.diamond.rotation}>
            {/* Crown (Top) */}
            <mesh position={[0, diamondSize * 0.15, 0]} castShadow>
              <cylinderGeometry args={[diamondSize * 0.35, diamondSize * 0.5, diamondSize * 0.3, 8]} />
              <meshPhysicalMaterial
                color="white"
                metalness={0}
                roughness={0}
                transmission={0.98}
                thickness={1.5}
                ior={2.4}
                clearcoat={1}
                toneMapped={false}
                emissive="white"
                emissiveIntensity={0.8}
                transparent
                opacity={opacity}
              />
            </mesh>
            {/* Pavilion (Bottom) */}
            <mesh position={[0, -diamondSize * 0.25, 0]}>
              <coneGeometry args={[diamondSize * 0.5, diamondSize * 0.5, 8]} />
              <meshPhysicalMaterial
                color="white"
                metalness={0}
                roughness={0}
                transmission={0.98}
                thickness={1.5}
                ior={2.4}
                clearcoat={1}
                toneMapped={false}
                transparent
                opacity={opacity}
              />
            </mesh>
          </group>

          {/* Prongs (Shared Claws) */}
          <group position={item.prong.position} rotation={item.prong.rotation}>
            {/* Top Prong - Claw shape */}
            <mesh position={[0, bandWidth * 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.02, 0.04, 8]} />
              <meshStandardMaterial color="#F5F5F5" metalness={1} roughness={0.1} transparent opacity={opacity} />
            </mesh>
            {/* Bottom Prong - Claw shape */}
            <mesh position={[0, -bandWidth * 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.02, 0.04, 8]} />
              <meshStandardMaterial color="#F5F5F5" metalness={1} roughness={0.1} transparent opacity={opacity} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

const BoxLid = ({ isOpen }) => {
  const group = useRef();

  useFrame((state, delta) => {
    const targetRotation = isOpen ? -2.0 : 0;
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotation, delta * 3);
    }
  });

  return (
    <group ref={group} position={[0, 1, -1.05]}>
      <group position={[0, 0.1, 1.05]}>
        {/* Lid Exterior */}
        <RoundedBox args={[2.4, 0.3, 2.4]} radius={0.1} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
        </RoundedBox>

        {/* Lid Interior (Velvet) */}
        <RoundedBox args={[2.2, 0.1, 2.2]} radius={0.05} smoothness={4} position={[0, -0.15, 0]} receiveShadow>
          <meshStandardMaterial color="#3f0000" roughness={0.9} metalness={0.1} />
        </RoundedBox>
      </group>
    </group>
  );
};

const RingBox = ({ isOpen, showRing }) => {
  return (
    <group>
      {/* Bottom Box */}
      <group position={[0, 0, 0]}>
        {/* Exterior */}
        <RoundedBox args={[2.4, 1, 2.4]} radius={0.1} smoothness={4} position={[0, 0.5, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
        </RoundedBox>

        {/* Interior Velvet Base */}
        <RoundedBox args={[2.2, 0.8, 2.2]} radius={0.05} smoothness={4} position={[0, 0.6, 0]} receiveShadow>
          <meshStandardMaterial color="#3f0000" roughness={0.9} metalness={0.1} />
        </RoundedBox>

        {/* Ring Cushion (Two Cylinders) */}
        <group position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <Cylinder args={[0.35, 0.35, 1.8, 32]} position={[0, 0.3, 0]} receiveShadow>
            <meshStandardMaterial color="#4a0404" roughness={1} />
          </Cylinder>
          <Cylinder args={[0.35, 0.35, 1.8, 32]} position={[0, -0.3, 0]} receiveShadow>
            <meshStandardMaterial color="#4a0404" roughness={1} />
          </Cylinder>
        </group>
      </group>

      <BoxLid isOpen={isOpen} />

      {/* Ring */}
      <Float speed={isOpen ? 2 : 0} rotationIntensity={isOpen ? 0.2 : 0} floatIntensity={isOpen ? 0.2 : 0}>
        <group position={[0, 1.1, 0]} scale={showRing ? 1 : 0}>
          <EternityRing opacity={showRing ? 1 : 0} />
          {showRing && isOpen && (
            <Sparkles count={40} scale={3} size={4} speed={0.4} opacity={0.8} color="#fff" />
          )}
        </group>
      </Float>
    </group>
  );
};

const RingBox3D = ({ isOpen, showRing }) => {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]} gl={{ toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
        <PerspectiveCamera makeDefault position={[0, 5, 8]} fov={40} />

        <ambientLight intensity={0.4} />
        <spotLight position={[5, 8, 5]} angle={0.2} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-5, 2, -5]} intensity={0.5} color="#ffdddd" />

        <Environment preset="city" />

        <group position={[0, 4.0, 0]}>
          <RingBox isOpen={isOpen} showRing={showRing} />
        </group>

        <ContactShadows position={[0, -0.01, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default RingBox3D;
