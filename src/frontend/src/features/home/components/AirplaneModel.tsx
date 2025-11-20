import { Canvas } from '@react-three/fiber'
import { PresentationControls, Preload } from '@react-three/drei'
import { Suspense, useCallback } from 'react'
import * as THREE from 'three'
// @ts-expect-error JSX file without type declarations
import { Model } from '../../../../Airplane'

interface CanvasState {
  gl: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.Camera
}

function LoadingFallback() {
  return null
}

export const AirplaneModel = () => {
  const handleCreated = useCallback((state: CanvasState) => {
    try {
      state.gl.setClearColor('#ffffff', 0)
      state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    } catch (error) {
      console.error('Error initializing canvas:', error)
    }
  }, [])

  return (
    <Canvas
      style={{
        width: '200px',
        height: '200px',
      }}
      camera={{ position: [0, 0, 2.5], fov: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={handleCreated}
      onError={(error) => console.error('Canvas error:', error)}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow={false} />
      <Suspense fallback={<LoadingFallback />}>
        <PresentationControls
          speed={1.5}
          global
          zoom={1}
          rotation={[0.13, 0.1, 0]}
        >
          <Model />
        </PresentationControls>
      </Suspense>
      <Preload all />
    </Canvas>
  )
}
