import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Group } from 'three'

import type { Project } from '@/types'

type ArtifactShape = 'icosahedron' | 'cubes' | 'torus' | 'dodecahedron' | 'roomgrid'

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
  'auto-code-review': { shape: 'icosahedron', color: '#6f8cff', speed: 0.4 },
  'private-cloud-service': { shape: 'cubes', color: '#fb7a9a', speed: 0.35 },
  'bali-school-kids': { shape: 'torus', color: '#bf6bf0', speed: 0.5 },
  'sidewi-bali': { shape: 'dodecahedron', color: '#6fcfc6', speed: 0.4 },
  'broom-project': { shape: 'roomgrid', color: '#f7b15a', speed: 0.35 },
}

const DEFAULT_SPEC: ArtifactSpec = { shape: 'icosahedron', color: '#e0501e', speed: 0.4 }

function Material({ color }: { color: string }) {
  return <meshStandardMaterial color={color} roughness={0.35} metalness={0.25} flatShading />
}

function Shape({ shape, color }: { shape: ArtifactShape; color: string }) {
  switch (shape) {
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
    case 'roomgrid':
      return (
        <group>
          {Array.from({ length: 6 }).map((_, i) => {
            const x = (i % 2) * 0.86 - 0.43
            const y = Math.floor(i / 2) * 0.62 - 0.62
            return (
              <mesh key={i} position={[x, y, 0]}>
                <boxGeometry args={[0.72, 0.46, 0.5]} />
                <Material color={color} />
              </mesh>
            )
          })}
        </group>
      )
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
}: {
  project: Project
  className?: string
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
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
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
