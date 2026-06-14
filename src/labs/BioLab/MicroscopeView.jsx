import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'

function CellMembrane({ type, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => { e.stopPropagation(); onClick('membrane') }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshPhysicalMaterial
        color={hovered ? '#7EDCCC' : '#4ECDC4'}
        transparent
        opacity={0.35}
        roughness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Nucleus({ onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={[0, 0, 0]}
      onClick={(e) => { e.stopPropagation(); onClick('nucleus') }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.9, 24, 24]} />
      <meshStandardMaterial
        color={hovered ? '#6B8AFF' : '#4A6CF7'}
        emissive={hovered ? '#4A6CF7' : '#2a3b9a'}
        emissiveIntensity={hovered ? 0.8 : 0.4}
      />
    </mesh>
  )
}

function Mitochondria({ position, rotation, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={position}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick('mitochondria') }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
      <meshStandardMaterial
        color={hovered ? '#FFB040' : '#FF8F00'}
        emissive={hovered ? '#FF8F00' : '#7a4500'}
        emissiveIntensity={hovered ? 0.5 : 0.2}
      />
    </mesh>
  )
}

function ER({ onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={[0.8, 0.3, 0]}
      rotation={[Math.PI / 4, 0, 0]}
      onClick={(e) => { e.stopPropagation(); onClick('er') }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <torusGeometry args={[0.9, 0.12, 8, 32]} />
      <meshStandardMaterial
        color={hovered ? '#BA68C8' : '#9C27B0'}
        wireframe
        emissive={hovered ? '#9C27B0' : '#4a1060'}
        emissiveIntensity={hovered ? 0.5 : 0.3}
      />
    </mesh>
  )
}

function Ribosomes({ onClick }) {
  const positions = [
    [1.2, 0.5, 0.3], [1.4, 0.1, -0.2], [0.9, 0.6, -0.3],
    [1.1, -0.1, 0.4], [0.7, 0.4, 0.5], [1.5, 0.3, 0.1],
    [0.6, 0.2, -0.5], [1.3, 0.7, -0.1],
  ]
  const [hovered, setHovered] = useState(false)

  return (
    <group
      onClick={(e) => { e.stopPropagation(); onClick('ribosomes') }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color={hovered ? '#F06292' : '#E91E63'}
            emissive={hovered ? '#E91E63' : '#7a0030'}
            emissiveIntensity={hovered ? 0.6 : 0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

function Chloroplast({ position, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={position}
      rotation={[Math.PI / 2, 0, Math.random()]}
      onClick={(e) => { e.stopPropagation(); onClick('chloroplast') }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.4, 16, 8]} />
      <meshStandardMaterial
        color={hovered ? '#66BB6A' : '#4CAF50'}
        emissive={hovered ? '#4CAF50' : '#1a5a20'}
        emissiveIntensity={hovered ? 0.5 : 0.2}
      />
    </mesh>
  )
}

function CellWall() {
  return (
    <mesh>
      <boxGeometry args={[5.5, 5.5, 5.5]} />
      <meshStandardMaterial
        color="#8D6E63"
        wireframe
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}

function Vacuole({ onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={[-0.5, -0.5, 0.5]}
      onClick={(e) => { e.stopPropagation(); onClick('vacuole') }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1.2, 24, 24]} />
      <meshPhysicalMaterial
        color={hovered ? '#A0D8F0' : '#81D4FA'}
        transparent
        opacity={0.45}
        roughness={0.2}
      />
    </mesh>
  )
}

function Golgi({ onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <group
      position={[-1, -0.3, 0.5]}
      onClick={(e) => { e.stopPropagation(); onClick('golgi') }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {[0, 0.15, 0.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0.2 * i, 0, 0]}>
          <torusGeometry args={[0.3, 0.04, 8, 24, Math.PI]} />
          <meshStandardMaterial
            color={hovered ? '#FFD54F' : '#FFC107'}
            emissive={hovered ? '#FFC107' : '#000000'}
            emissiveIntensity={hovered ? 0.3 : 0}
          />
        </mesh>
      ))}
    </group>
  )
}

function MitosisCell({ phase, position, onClick }) {
  const [hovered, setHovered] = useState(false)
  const colors = {
    interphase: '#B0BEC5',
    prophase: '#4A6CF7',
    metaphase: '#FF8F00',
    anaphase: '#E91E63',
    telophase: '#4CAF50',
  }

  return (
    <group position={position}>
      {/* Cell body */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(phase) }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? '#fff' : '#f5f5f5'}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Chromosomes/nucleus visual */}
      <mesh>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial
          color={colors[phase] || '#666'}
          emissive={hovered ? colors[phase] : '#000'}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {phase === 'anaphase' && (
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color={colors[phase]} />
        </mesh>
      )}

      {phase === 'telophase' && (
        <>
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color={colors[phase]} />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color={colors[phase]} />
          </mesh>
        </>
      )}
    </group>
  )
}

function CellScene({ specimen, onOrganelleClick, showLabels }) {
  if (!specimen) return null

  if (specimen.type === 'mitosis') {
    const phases = ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase']
    return (
      <group>
        {phases.map((phase, i) => (
          <group key={phase}>
            <MitosisCell
              phase={phase}
              position={[(i - 2) * 2, 0, 0]}
              onClick={onOrganelleClick}
            />
            {showLabels && (
              <Text
                position={[(i - 2) * 2, -1.2, 0]}
                fontSize={0.2}
                color="#666"
                anchorX="center"
              >
                {phase}
              </Text>
            )}
          </group>
        ))}
      </group>
    )
  }

  const isPlant = specimen.type === 'plant'

  return (
    <group>
      {isPlant && <CellWall />}
      <CellMembrane type={specimen.type} onClick={onOrganelleClick} />
      <Nucleus onClick={onOrganelleClick} />

      {/* Mitochondria */}
      <Mitochondria position={[1.2, 0.8, 0.5]} rotation={[0.5, 0, 0.3]} onClick={onOrganelleClick} />
      <Mitochondria position={[-0.9, 1, -0.3]} rotation={[0, 0.7, 0.2]} onClick={onOrganelleClick} />
      <Mitochondria position={[0.5, -1.2, 0.8]} rotation={[0.3, 0, 0.8]} onClick={onOrganelleClick} />
      <Mitochondria position={[-1.3, -0.5, -0.7]} rotation={[0.1, 0.5, 0]} onClick={onOrganelleClick} />

      <ER onClick={onOrganelleClick} />
      <Ribosomes onClick={onOrganelleClick} />
      <Golgi onClick={onOrganelleClick} />

      {isPlant && (
        <>
          <Chloroplast position={[1.5, 0, -0.8]} onClick={onOrganelleClick} />
          <Chloroplast position={[-1.2, 0.7, 0.6]} onClick={onOrganelleClick} />
          <Chloroplast position={[0.3, -1, -1.2]} onClick={onOrganelleClick} />
          <Vacuole onClick={onOrganelleClick} />
        </>
      )}

      {/* Labels */}
      {showLabels && (
        <>
          <Text position={[0, 0.9, 0]} fontSize={0.15} color="#4A6CF7">Nucleus</Text>
          <Text position={[1.2, 1.2, 0.5]} fontSize={0.12} color="#FF8F00">Mitochondria</Text>
          <Text position={[0.8, 0.7, 0]} fontSize={0.12} color="#9C27B0">ER</Text>
          <Text position={[-1, -0.7, 0.5]} fontSize={0.12} color="#FFC107">Golgi</Text>
          {isPlant && (
            <>
              <Text position={[1.5, 0.5, -0.8]} fontSize={0.12} color="#4CAF50">Chloroplast</Text>
              <Text position={[-0.5, -1.2, 0.5]} fontSize={0.12} color="#81D4FA">Vacuole</Text>
            </>
          )}
        </>
      )}
    </group>
  )
}

export default function MicroscopeView({ specimen, onOrganelleClick, showLabels }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '420px' }}>
      {/* Microscope vignette overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '16px',
        background: 'radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.15) 85%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 1,
        borderRadius: '16px',
      }} />

      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ borderRadius: '16px', background: '#f0f4f8' }}
      >
        <color attach="background" args={['#f0f4f8']} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.0} />
        <directionalLight position={[-3, -3, 2]} intensity={0.5} />
        <directionalLight position={[0, -5, 5]} intensity={0.3} />

        <Suspense fallback={null}>
          <CellScene
            specimen={specimen}
            onOrganelleClick={onOrganelleClick}
            showLabels={showLabels}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={12}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
