import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

/**
 * Generate high-resolution procedural textures for luxury dark walnut wood
 * and subtle tactile surface roughness without needing external image downloads.
 */
function createWoodTextures() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  // Base dark charcoal / deep espresso tone
  ctx.fillStyle = '#141210'
  ctx.fillRect(0, 0, 512, 1024)

  // Draw fine vertical wood grain striations
  for (let x = 0; x < 512; x++) {
    const wave = Math.sin(x * 0.08) * 4 + Math.sin(x * 0.02) * 12
    const shade = Math.sin(x * 0.4 + wave * 0.1) * 0.5 + 0.5
    const alpha = 0.04 + shade * 0.09

    ctx.strokeStyle = Math.random() > 0.4 ? `rgba(34, 30, 26, ${alpha})` : `rgba(10, 9, 8, ${alpha * 1.3})`
    ctx.lineWidth = 1 + Math.random() * 2
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + (Math.random() - 0.5) * 3, 1024)
    ctx.stroke()
  }

  // Subtle wood pores / micro grain
  for (let i = 0; i < 1800; i++) {
    const px = Math.random() * 512
    const py = Math.random() * 1024
    const pl = 8 + Math.random() * 25
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(px, py + pl)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)
  texture.colorSpace = THREE.SRGBColorSpace

  // Tactile roughness canvas
  const rCanvas = document.createElement('canvas')
  rCanvas.width = 256
  rCanvas.height = 512
  const rCtx = rCanvas.getContext('2d')
  rCtx.fillStyle = '#b0b0b0'
  rCtx.fillRect(0, 0, 256, 512)

  for (let x = 0; x < 256; x += 2) {
    const val = 160 + Math.floor(Math.random() * 40)
    rCtx.fillStyle = `rgb(${val}, ${val}, ${val})`
    rCtx.fillRect(x, 0, 2, 512)
  }

  const rTexture = new THREE.CanvasTexture(rCanvas)
  rTexture.wrapS = THREE.RepeatWrapping
  rTexture.wrapT = THREE.RepeatWrapping
  rTexture.repeat.set(1, 1)

  return { texture, rTexture }
}

/**
 * 3D Architectural Double Door Scene
 * Matches the luxury reference image while strictly preserving
 * existing scroll-scrub interaction and timing.
 */
export default function DoorScene({ progressRef, progress = 0 }) {
  const { viewport } = useThree()

  // References for animation
  const leftHingeRef = useRef(null)
  const rightHingeRef = useRef(null)
  const seamLightRef = useRef(null)
  const thresholdGlowRef = useRef(null)
  const dustParticlesRef = useRef(null)

  // Door leaf dimensions (luxury floor-to-ceiling proportions)
  const doorW = 1.05
  const doorH = 3.65
  const doorT = 0.075

  // Sidelight dimensions (narrow vertical glass panels)
  const sideW = 0.38

  // Textures and materials
  const { woodMat, brassMat, glassMat, frameMat } = useMemo(() => {
    const { texture, rTexture } = createWoodTextures()

    // Premium dark walnut / charcoal wood
    const wood = new THREE.MeshStandardMaterial({
      color: '#151311',
      map: texture,
      roughnessMap: rTexture,
      roughness: 0.82,
      metalness: 0.08,
      bumpMap: rTexture,
      bumpScale: 0.003,
    })

    // Deep matte architectural blackened metal for frames & trims
    const frame = new THREE.MeshStandardMaterial({
      color: '#0d0d0d',
      roughness: 0.55,
      metalness: 0.45,
    })

    // Luxury champagne/gold brushed brass handles
    const brass = new THREE.MeshStandardMaterial({
      color: '#d4af37',
      roughness: 0.22,
      metalness: 0.94,
    })

    // Architectural sidelight glass
    const glass = new THREE.MeshPhysicalMaterial({
      color: '#1a1a1a',
      roughness: 0.08,
      transmission: 0.72,
      transparent: true,
      opacity: 0.85,
      ior: 1.52,
      metalness: 0.1,
    })

    return {
      woodMat: wood,
      brassMat: brass,
      glassMat: glass,
      frameMat: frame,
    }
  }, [])

  // Floating ambient atmospheric dust particles
  const particleGeo = useMemo(() => {
    const count = 50
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3.5
      positions[i * 3 + 1] = Math.random() * 3.8 - 1.6
      positions[i * 3 + 2] = -Math.random() * 4 - 0.2
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  // Frame update synchronized with scroll progress
  useFrame((state, delta) => {
    const rawP = progressRef?.current !== undefined ? progressRef.current : progress
    const p = THREE.MathUtils.clamp(rawP, 0, 1)

    // Compute target door open angle matching exact original phases:
    // Phase 1 (0% → 25%): Doors begin opening from center (0 to ~28 deg)
    // Phase 2 (25% → 55%): Doors swing open wide to sides (reaches ~98 deg, fully clear)
    // Phase 3 (55% → 85%): Camera moves forward through doorway threshold
    // Phase 4 (85% → 100%): Full transition complete
    let targetAngle = 0
    if (p < 0.25) {
      const t = p / 0.25
      targetAngle = Math.pow(t, 1.3) * (Math.PI * 0.16)
    } else if (p < 0.55) {
      const t = (p - 0.25) / (0.55 - 0.25)
      targetAngle = (Math.PI * 0.16) + Math.sin(t * Math.PI * 0.5) * (Math.PI * 0.38)
    } else {
      targetAngle = Math.PI * 0.54
    }

    // Apply hinge rotation around Y
    // Left leaf swings into room (positive Y), right leaf swings into room (negative Y)
    if (leftHingeRef.current) {
      leftHingeRef.current.rotation.y = THREE.MathUtils.damp(
        leftHingeRef.current.rotation.y,
        targetAngle,
        22,
        delta
      )
    }
    if (rightHingeRef.current) {
      rightHingeRef.current.rotation.y = THREE.MathUtils.damp(
        rightHingeRef.current.rotation.y,
        -targetAngle,
        22,
        delta
      )
    }

    // Seam glow & threshold light
    if (seamLightRef.current) {
      let seamInt = 1.0
      if (p < 0.25) {
        seamInt = 1.0 + (p / 0.25) * 3.5
      } else if (p < 0.65) {
        seamInt = 4.5 - ((p - 0.25) / 0.4) * 3.0
      } else {
        seamInt = 1.0
      }
      seamLightRef.current.intensity = THREE.MathUtils.damp(
        seamLightRef.current.intensity,
        seamInt,
        14,
        delta
      )
    }

    if (thresholdGlowRef.current) {
      const threshTarget = p > 0.05 ? Math.min((p - 0.05) * 2.0, 1.0) : 0.0
      thresholdGlowRef.current.material.opacity = THREE.MathUtils.damp(
        thresholdGlowRef.current.material.opacity,
        threshTarget * 0.65,
        14,
        delta
      )
    }

    // Responsive camera dolly:
    const isMobile = viewport.aspect < 0.8
    const baseZ = isMobile ? 6.2 : viewport.aspect < 1.3 ? 5.4 : 4.8
    const baseY = 0.0

    let targetCamZ = baseZ
    let targetCamY = baseY

    if (p < 0.55) {
      // Subtle anticipation
      targetCamZ = baseZ - p * 0.4
    } else if (p < 0.85) {
      // Dolly forward smoothly through the doorway threshold
      const pushT = (p - 0.55) / 0.30
      const easePush = pushT < 0.5 ? 4 * pushT * pushT * pushT : 1 - Math.pow(-2 * pushT + 2, 3) / 2
      targetCamZ = (baseZ - 0.22) - easePush * (baseZ - 0.22 - 0.2)
      targetCamY = baseY - easePush * 0.1
    } else {
      targetCamZ = 0.2
      targetCamY = baseY - 0.1
    }

    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetCamZ, 20, delta)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetCamY, 20, delta)

    if (dustParticlesRef.current) {
      dustParticlesRef.current.rotation.y += delta * 0.02
    }
  })

  // Door leaf construction component
  const DoorLeaf = ({ isLeft }) => {
    const s = isLeft ? 1 : -1

    return (
      <group position={[s * (doorW / 2), 0, 0]}>
        {/* Main solid door leaf slab */}
        <mesh castShadow receiveShadow material={woodMat}>
          <boxGeometry args={[doorW - 0.004, doorH, doorT]} />
        </mesh>

        {/* Architectural inset panels - subtle relief styling */}
        <mesh position={[0, 0, doorT / 2 + 0.002]} material={woodMat}>
          <boxGeometry args={[doorW - 0.14, doorH - 0.22, 0.008]} />
        </mesh>
        <mesh position={[0, 0, -doorT / 2 - 0.002]} material={woodMat}>
          <boxGeometry args={[doorW - 0.14, doorH - 0.22, 0.008]} />
        </mesh>

        {/* Inner panel border trim (micro shadow reveal) */}
        <mesh position={[0, 0, doorT / 2 + 0.006]} material={frameMat}>
          <boxGeometry args={[doorW - 0.12, 0.008, 0.004]} />
        </mesh>
        <mesh position={[0, 0, -doorT / 2 - 0.006]} material={frameMat}>
          <boxGeometry args={[doorW - 0.12, 0.008, 0.004]} />
        </mesh>

        {/* Vertical shadow groove line (luxury planking accent) */}
        <mesh position={[s * 0.15, 0, doorT / 2 + 0.005]} material={frameMat}>
          <boxGeometry args={[0.004, doorH - 0.3, 0.003]} />
        </mesh>

        {/* Long Slim Vertical Brass Handle */}
        {/* Placed near inner meeting edge of each door leaf */}
        <group position={[s * (doorW / 2 - 0.13), -0.05, doorT / 2 + 0.045]}>
          {/* Main vertical brass cylindrical pull bar */}
          <mesh castShadow material={brassMat}>
            <cylinderGeometry args={[0.015, 0.015, 1.75, 24]} />
          </mesh>

          {/* Top standoff bracket */}
          <mesh position={[0, 0.65, -0.025]} rotation={[Math.PI / 2, 0, 0]} material={brassMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.05, 16]} />
          </mesh>

          {/* Bottom standoff bracket */}
          <mesh position={[0, -0.65, -0.025]} rotation={[Math.PI / 2, 0, 0]} material={brassMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.05, 16]} />
          </mesh>
        </group>

        {/* Matching brass handle on interior side */}
        <group position={[s * (doorW / 2 - 0.13), -0.05, -doorT / 2 - 0.045]}>
          <mesh material={brassMat}>
            <cylinderGeometry args={[0.015, 0.015, 1.75, 24]} />
          </mesh>
          <mesh position={[0, 0.65, 0.025]} rotation={[Math.PI / 2, 0, 0]} material={brassMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.05, 16]} />
          </mesh>
          <mesh position={[0, -0.65, 0.025]} rotation={[Math.PI / 2, 0, 0]} material={brassMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.05, 16]} />
          </mesh>
        </group>
      </group>
    )
  }

  return (
    <group position={[0, 0, 0]}>
      {/* ── ATMOSPHERIC LIGHTS ── */}
      <ambientLight color="#181512" intensity={0.55} />

      {/* Main architectural key light from top-front-right */}
      <directionalLight
        position={[3.5, 5.0, 4.0]}
        intensity={1.5}
        color="#f6ebe2"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={15}
        shadow-bias={-0.0002}
      />

      {/* Soft fill light from front-left */}
      <directionalLight position={[-3.0, 2.5, 3.5]} intensity={0.4} color="#a6b4c4" />

      {/* Warm Orange Seam Light (leaks through center crack) */}
      <pointLight
        ref={seamLightRef}
        position={[0, 0.1, -0.12]}
        color="#ff7a18"
        intensity={1.2}
        distance={6.5}
        decay={2}
      />

      {/* ── THE TWO REALISTIC DOOR HINGE GROUPS ── */}
      {/* Left door leaf: hinge positioned at left outer edge x = -doorW */}
      <group ref={leftHingeRef} position={[-doorW, 0, 0]}>
        <DoorLeaf isLeft={true} />
      </group>

      {/* Right door leaf: hinge positioned at right outer edge x = +doorW */}
      <group ref={rightHingeRef} position={[doorW, 0, 0]}>
        <DoorLeaf isLeft={false} />
      </group>

      {/* ── ARCHITECTURAL FRAME & SURROUND ── */}
      {/* Top Header Lintel */}
      <mesh position={[0, doorH / 2 + 0.045, 0]} material={frameMat}>
        <boxGeometry args={[doorW * 2 + 0.16, 0.09, doorT + 0.06]} />
      </mesh>

      {/* Left Center Jamb (outer edge of left door) */}
      <mesh position={[-doorW - 0.04, 0, 0]} material={frameMat}>
        <boxGeometry args={[0.08, doorH + 0.18, doorT + 0.05]} />
      </mesh>

      {/* Right Center Jamb (outer edge of right door) */}
      <mesh position={[doorW + 0.04, 0, 0]} material={frameMat}>
        <boxGeometry args={[0.08, doorH + 0.18, doorT + 0.05]} />
      </mesh>

      {/* Ground Threshold (Dark basalt stone slab) */}
      <mesh position={[0, -doorH / 2 - 0.04, 0]} material={frameMat} receiveShadow>
        <boxGeometry args={[doorW * 2 + sideW * 2 + 0.4, 0.08, doorT + 0.28]} />
      </mesh>

      {/* Threshold warm light spill mesh */}
      <mesh
        ref={thresholdGlowRef}
        position={[0, -doorH / 2 - 0.005, 0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[doorW * 1.8, 0.9]} />
        <meshBasicMaterial
          color="#ff801e"
          transparent
          opacity={0.0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── GLASS SIDELIGHTS (FLANKING SIDES) ── */}
      {/* Left Sidelight */}
      <group position={[-doorW - 0.08 - sideW / 2, 0, 0]}>
        <mesh material={glassMat}>
          <boxGeometry args={[sideW, doorH, 0.025]} />
        </mesh>
        <mesh position={[0, doorH / 2 - 0.015, 0]} material={frameMat}>
          <boxGeometry args={[sideW + 0.02, 0.03, 0.04]} />
        </mesh>
        <mesh position={[0, -doorH / 2 + 0.015, 0]} material={frameMat}>
          <boxGeometry args={[sideW + 0.02, 0.03, 0.04]} />
        </mesh>
        <mesh position={[-sideW / 2 - 0.02, 0, 0]} material={frameMat}>
          <boxGeometry args={[0.04, doorH + 0.18, doorT + 0.04]} />
        </mesh>
      </group>

      {/* Right Sidelight */}
      <group position={[doorW + 0.08 + sideW / 2, 0, 0]}>
        <mesh material={glassMat}>
          <boxGeometry args={[sideW, doorH, 0.025]} />
        </mesh>
        <mesh position={[0, doorH / 2 - 0.015, 0]} material={frameMat}>
          <boxGeometry args={[sideW + 0.02, 0.03, 0.04]} />
        </mesh>
        <mesh position={[0, -doorH / 2 + 0.015, 0]} material={frameMat}>
          <boxGeometry args={[sideW + 0.02, 0.03, 0.04]} />
        </mesh>
        <mesh position={[sideW / 2 + 0.02, 0, 0]} material={frameMat}>
          <boxGeometry args={[0.04, doorH + 0.18, doorT + 0.04]} />
        </mesh>
      </group>

      {/* ── EXTERIOR WALL SURROUND (DARK CHARCOAL FACADE) ── */}
      <mesh
        position={[-doorW - sideW - 1.25, 0, -0.01]}
        material={frameMat}
        receiveShadow
      >
        <boxGeometry args={[2.0, doorH + 0.6, 0.06]} />
      </mesh>

      <mesh
        position={[doorW + sideW + 1.25, 0, -0.01]}
        material={frameMat}
        receiveShadow
      >
        <boxGeometry args={[2.0, doorH + 0.6, 0.06]} />
      </mesh>

      <mesh
        position={[0, doorH / 2 + 0.45, -0.01]}
        material={frameMat}
        receiveShadow
      >
        <boxGeometry args={[doorW * 2 + sideW * 2 + 2.5, 0.72, 0.06]} />
      </mesh>

      {/* Atmospheric dust particles floating in the doorway light beam */}
      <points ref={dustParticlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.035}
          color="#ffb366"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
