import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { ReactNode } from 'react'
import type { Group } from 'three'

import type { Project } from '@/types'

type ArtifactShape = 'icosahedron' | 'cubes' | 'torus' | 'dodecahedron' | 'roomgrid' | 'github-logo' | 'ubuntu-logo'

interface ArtifactSpec {
  shape: ArtifactShape
  color: string
  speed: number
}

/**
 * A low-poly 3D object per project, themed to its overview:
 * - auto-code-review  → faceted icosahedron (the AI engine)
 * - private-cloud     → cluster of cubes (Docker containers)
 * - bali-school-kids  → torus (connecting sponsors & children)
 * - sidewi-bali       → dodecahedron (a "hidden gem" village)
 * - broom-project     → stacked boxes (rooms in a building)
 */
const ARTIFACTS: Record<string, ArtifactSpec> = {
  'auto-code-review': { shape: 'github-logo', color: '#6f8cff', speed: 0.4 },
  'private-cloud-service': { shape: 'ubuntu-logo', color: '#fb7a9a', speed: 0.1 },
  'bali-school-kids': { shape: 'torus', color: '#bf6bf0', speed: 0.5 },
  'sidewi-bali': { shape: 'cubes', color: '#6fcfc6', speed: 0.4 },
  'broom-project': { shape: 'roomgrid', color: '#f7b15a', speed: 0.35 },
}

const DEFAULT_SPEC: ArtifactSpec = { shape: 'icosahedron', color: '#e0501e', speed: 0.4 }

function Material({ color }: { color: string }) {
  return <meshStandardMaterial color={color} roughness={0.35} metalness={0.25} flatShading />
}

function Shape({ shape, color }: { shape: ArtifactShape; color: string }) {
  switch (shape) {
    case 'github-logo': {
      return (
        <group>
          {/* The Outer Ring */}
          <mesh>
            <torusGeometry args={[1.1, 0.08, 16, 64]} />
            <Material color={color} />
          </mesh>

          <group position={[0, -0.1, 0]}>
            {/* The Head */}
            <mesh position={[0, 0.3, 0]}>
              {/* Flattened sphere for the face */}
              <sphereGeometry args={[0.45, 32, 32]} />
              <Material color={color} />
            </mesh>

            {/* Left Ear */}
            <mesh position={[-0.25, 0.7, 0]} rotation={[0, 0, 0.4]}>
              <coneGeometry args={[0.15, 0.3, 16]} />
              <Material color={color} />
            </mesh>

            {/* Right Ear */}
            <mesh position={[0.25, 0.7, 0]} rotation={[0, 0, -0.4]}>
              <coneGeometry args={[0.15, 0.3, 16]} />
              <Material color={color} />
            </mesh>

            {/* The Body */}
            <mesh position={[0, -0.4, 0]}>
              {/* Tapered cylinder */}
              <cylinderGeometry args={[0.25, 0.35, 0.7, 32]} />
              <Material color={color} />
            </mesh>

            {/* The Tail */}
            {/* Using a partial torus to create the swooping cat tail */}
            <mesh position={[-0.45, -0.4, 0]} rotation={[0, 0, 0.8]}>
              <torusGeometry args={[0.25, 0.08, 16, 32, Math.PI * 0.8]} />
              <Material color={color} />
            </mesh>
          </group>
        </group>
      );
    }
      
    case 'ubuntu-logo': {
      // Proportions for the "Circle of Friends"
      const segments = 3;
      const radius = 0.8; 
      const tube = 0.18; 
      const headRadius = 0.23; 
      const headDistance = 1.02; // Pushes the heads slightly outside the main ring
      
      // Calculate arc lengths (120 degrees minus the gap for the head)
      const gapAngle = 0.55; // Roughly 31 degrees of empty space
      const arcLength = (Math.PI * 2) / 3 - gapAngle;

      return (
        <group>
          {Array.from({ length: segments }).map((_, i) => {
            // Base angle for this third of the logo (0, 120, 240 degrees)
            const baseAngle = i * ((Math.PI * 2) / 3);
            
            // Position the head precisely in the center of the gap
            const headX = Math.cos(baseAngle) * headDistance;
            const headY = Math.sin(baseAngle) * headDistance;
            
            // Start the arc right after the gap ends
            const arcRotation = baseAngle + gapAngle / 2;

            return (
              <group key={i}>
                {/* The "Head" */}
                <mesh position={[headX, headY, 0]}>
                  <sphereGeometry args={[headRadius, 24, 24]} />
                  <Material color={color} />
                </mesh>
                
                {/* The "Arm" */}
                <mesh rotation={[0, 0, arcRotation]}>
                  <torusGeometry args={[radius, tube, 16, 48, arcLength]} />
                  <Material color={color} />
                </mesh>
              </group>
            );
          })}
        </group>
      );
    }

    case 'cubes':
      return (
        <group>
          {(
            [
              [-0.5, 0.5, 0],
              [0.5, 0.42, -0.3],
              [0.05, -0.5, 0.42],
              [0.5, -0.45, -0.1],
            ] as [number, number, number][]
          ).map((position, i) => (
            <mesh key={i} position={position} rotation={[i * 0.4, i * 0.6, 0]}>
              <boxGeometry args={[0.72, 0.72, 0.72]} />
              <Material color={color} />
            </mesh>
          ))}
        </group>
      )
    case 'torus':
      return (
        <mesh>
          <torusGeometry args={[0.95, 0.34, 18, 44]} />
          <Material color={color} />
        </mesh>
      )
    case 'dodecahedron':
      return (
        <mesh>
          <dodecahedronGeometry args={[1.22, 0]} />
          <Material color={color} />
        </mesh>
      )
    case 'roomgrid': {
      // Custom material for "available" or "glass" rooms
      const GlassMaterial = () => (
        <meshStandardMaterial 
          color="#ffffff" 
          transparent={true} 
          opacity={0.25} 
          roughness={0.1} 
          metalness={0.9} 
        />
      );

      // We use slight gaps between the blocks (size is 0.7, spacing is 0.75) 
      // to make them look like distinct, modular facility rooms.
      return (
        <group position={[0, -0.4, 0]}>
          {/* Ground Floor (2x2 grid) */}
          <mesh position={[-0.375, 0, -0.375]}>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <Material color={color} />
          </mesh>
          <mesh position={[0.375, 0, -0.375]}>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <GlassMaterial />
          </mesh>
          <mesh position={[-0.375, 0, 0.375]}>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <GlassMaterial />
          </mesh>
          <mesh position={[0.375, 0, 0.375]}>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <Material color={color} />
          </mesh>

          {/* Second Floor (L-Shape, leaving one block empty for a "terrace") */}
          <mesh position={[-0.375, 0.55, -0.375]}>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <GlassMaterial />
          </mesh>
          <mesh position={[0.375, 0.55, -0.375]}>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <Material color={color} />
          </mesh>
          <mesh position={[-0.375, 0.55, 0.375]}>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <Material color={color} />
          </mesh>

          {/* Third Floor (Top Office / Penthouse) */}
          <mesh position={[-0.375, 1.1, -0.375]}>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <Material color={color} />
          </mesh>
        </group>
      );
    }
    case 'icosahedron':
    default:
      return (
        <mesh>
          <icosahedronGeometry args={[1.3, 0]} />
          <Material color={color} />
        </mesh>
      )
  }
}

function Spinner({ speed, children }: { speed: number; children: ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * speed
    ref.current.rotation.x += delta * speed * 0.35
  })
  return <group ref={ref}>{children}</group>
}

export default function ProjectArtifact({
  project,
  className = '',
  quality = 'high',
}: {
  project: Project
  className?: string
  /** 'low' caps DPR at 1 and disables AA — for the many small gallery tiles. */
  quality?: 'high' | 'low'
}) {
  const spec = ARTIFACTS[project.id] ?? DEFAULT_SPEC
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)

  // Pause the render loop when the cover is off-screen.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className={className}>
      <Canvas
        dpr={quality === 'low' ? 1 : [1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        gl={{ alpha: true, antialias: quality !== 'low', powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 4.4], fov: 42 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.7} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} />
        <Spinner speed={spec.speed}>
          <Shape shape={spec.shape} color={spec.color} />
        </Spinner>
      </Canvas>
    </div>
  )
}
