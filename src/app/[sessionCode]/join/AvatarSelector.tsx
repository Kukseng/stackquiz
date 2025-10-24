"use client"

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useGLTF } from '@react-three/drei'
import { Button } from '@/components/ui/button'

// Load Canvas dynamically to avoid SSR errors
const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
)
const OrbitControls = dynamic(
  () => import('@react-three/drei').then((mod) => mod.OrbitControls),
  { ssr: false }
)

function AvatarModel({ url }: { url: string }) {
  const gltf = useGLTF(url)
  const scene = gltf.scene
  if (!scene) return null
  return <primitive object={scene} scale={1.0} />
}

export default function AvatarSelector({ userId, onSelect }: { userId: string, onSelect?: (avatarId: number) => void }) {
  const [avatars, setAvatars] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/avatars')
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setAvatars(data || [])
      })
      .catch((e) => {
        console.error('Failed to load avatars', e)
        if (mounted) setError('Failed to load avatars')
      })
    return () => {
      mounted = false
    }
  }, [])

  async function confirmSelection() {
    if (!selected) return
    setLoading(true)
    try {
      // If no userId is provided (pre-join), just notify parent and skip server save
      if (!userId) {
        setLoading(false)
        try { if (onSelect) onSelect(selected.id) } catch (e) { console.warn('onSelect callback failed', e) }
        return
      }

      const res = await fetch(`/api/users/${userId}/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarId: selected.id }),
      })
      if (!res.ok) throw new Error(await res.text())
      setLoading(false)
      // notify parent if provided
      try { if (onSelect) onSelect(selected.id) } catch(e) { console.warn('onSelect callback failed', e) }
    } catch (e: any) {
      console.error('Failed to save avatar', e)
      setError(e?.message || 'Failed to save avatar')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {avatars.map((a) => (
          <div
            key={a.id}
            className={`p-2 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selected?.id === a.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => {
              setSelected(a)
              try { if (onSelect) onSelect(a.id) } catch(e) { console.warn('onSelect callback failed', e) }
            }}
          >
            <div className="h-36 w-full bg-gray-100 rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 0, 3] }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[2, 2, 2]} />
              
                <OrbitControls enableZoom={false} />
                <AvatarModel url={a.modelUrl} />
              </Canvas>
            </div>
            <p className="text-center mt-2 font-medium">{a.name}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button onClick={confirmSelection} disabled={!selected || loading}>
          {loading ? 'Saving...' : selected ? `Confirm ${selected.name}` : 'Select an avatar'}
        </Button>
      </div>
    </div>
  )
}
