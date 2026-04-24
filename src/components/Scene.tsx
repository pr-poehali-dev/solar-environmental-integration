import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

function makeFallbackTexture(color = "#1a2a3a") {
  const canvas = document.createElement("canvas")
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

function useTextures(urls: string[]) {
  const [textures, setTextures] = useState<THREE.Texture[]>([])

  useEffect(() => {
    let cancelled = false
    Promise.all(
      urls.map((url) =>
        fetch(url)
          .then((r) => r.blob())
          .then(
            (blob) =>
              new Promise<THREE.Texture>((resolve) => {
                const blobUrl = URL.createObjectURL(blob)
                const img = new Image()
                img.onload = () => {
                  const tex = new THREE.Texture(img)
                  tex.needsUpdate = true
                  URL.revokeObjectURL(blobUrl)
                  resolve(tex)
                }
                img.onerror = () => resolve(makeFallbackTexture())
                img.src = blobUrl
              })
          )
          .catch(() => makeFallbackTexture())
      )
    ).then((result) => {
      if (!cancelled) setTextures(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return textures
}

const PROXY = "https://functions.poehali.dev/7a9b8813-38a2-4c95-be1f-834c89959795"
const p = (url: string) => `${PROXY}?url=${encodeURIComponent(url)}`

const fishData = [
  {
    img: p("https://cdn.poehali.dev/projects/e0c3d6a7-798f-46f2-a0a7-4f3cf94ac813/files/18774966-27c7-4c8e-b27e-76bcd50b6247.jpg"),
    name: "Щука",
    latin: "Esox lucius",
    desc: "Главный хищник пресных вод. Достигает 1.5 м и 35 кг. Обитает в реках, озёрах и водохранилищах СЗ России.",
    baits: ["Воблеры", "Колебалки", "Джиг", "Живец"],
    season: "Круглый год"
  },
  {
    img: p("https://cdn.poehali.dev/projects/e0c3d6a7-798f-46f2-a0a7-4f3cf94ac813/files/ce79aa57-4f34-435d-b148-bf98a84d0057.jpg"),
    name: "Окунь",
    latin: "Perca fluviatilis",
    desc: "Самая распространённая рыба региона. Стайный хищник, активен в любое время года. Ловится везде.",
    baits: ["Вертушки", "Мормышка", "Микроджиг", "Червь"],
    season: "Круглый год"
  },
  {
    img: p("https://cdn.poehali.dev/projects/e0c3d6a7-798f-46f2-a0a7-4f3cf94ac813/files/2081e3ed-7c3f-4d08-9be1-ae21edcd616c.jpg"),
    name: "Лосось атлантический",
    latin: "Salmo salar",
    desc: "Царская рыба. Входит в реки Карелии и Мурманской области. Объект спортивного лицензионного лова.",
    baits: ["Мухи", "Воблеры", "Колебалки", "Девон"],
    season: "Июнь — Октябрь"
  },
  {
    img: p("https://cdn.poehali.dev/projects/e0c3d6a7-798f-46f2-a0a7-4f3cf94ac813/files/41004fe9-0caa-4705-9d01-184200c02147.jpg"),
    name: "Судак",
    latin: "Sander lucioperca",
    desc: "Ценный хищник. Предпочитает крупные водоёмы с чистой водой. Ловится со дна на большой глубине.",
    baits: ["Джиг", "Воблеры (суспендеры)", "Мёртвая рыбка"],
    season: "Апрель — Ноябрь"
  },
  {
    img: p("https://cdn.poehali.dev/projects/e0c3d6a7-798f-46f2-a0a7-4f3cf94ac813/files/fb66f587-4475-4552-8981-00b3f5012f7d.jpg"),
    name: "Лещ",
    latin: "Abramis brama",
    desc: "Крупный мирный карповый. Держится у дна на глубоких участках. Ночная рыба в тёплое время года.",
    baits: ["Фидер", "Донка", "Опарыш", "Перловка", "Мотыль"],
    season: "Апрель — Ноябрь"
  },
  {
    img: p("https://cdn.poehali.dev/projects/e0c3d6a7-798f-46f2-a0a7-4f3cf94ac813/files/f2bc0cc8-1c6b-4426-a40a-51fc308ffc01.jpg"),
    name: "Форель ручьевая",
    latin: "Salmo trutta fario",
    desc: "Обитает в холодных прозрачных ручьях и реках Карелии, Ленобласти и Мурманска. Требует лицензии.",
    baits: ["Мухи (нахлыст)", "Вертушки", "Червь"],
    season: "Март — Сентябрь"
  },
  {
    img: p("https://cdn.poehali.dev/projects/e0c3d6a7-798f-46f2-a0a7-4f3cf94ac813/files/7ed37b25-88e2-4c7e-822d-4df9bae2f703.jpg"),
    name: "Сом",
    latin: "Silurus glanis",
    desc: "Крупнейшая пресноводная рыба. Встречается в крупных реках. Активен ночью, прячется в ямах.",
    baits: ["Квок + живец", "Донка", "Лягушка", "Кальмар"],
    season: "Май — Октябрь"
  },
  {
    img: p("https://cdn.poehali.dev/projects/e0c3d6a7-798f-46f2-a0a7-4f3cf94ac813/files/3a1e546c-14a0-4c95-a629-3b56e00b83e7.jpg"),
    name: "Плотва",
    latin: "Rutilus rutilus",
    desc: "Самая многочисленная рыба СЗ России. Встречается во всех водоёмах. Отличный объект для начинающих.",
    baits: ["Поплавочная удочка", "Мотыль", "Хлеб", "Манка"],
    season: "Круглый год"
  },
]

const images = fishData.map(f => f.img)

const imagePositions = [
  { pos: [-3.2, 1.8, -2.5] as [number, number, number], rot: [0, 0.4, 0] as [number, number, number], scale: 0.7 },
  { pos: [2.8, -1.2, -3] as [number, number, number], rot: [0, -0.5, 0] as [number, number, number], scale: 0.8 },
  { pos: [-1.5, 2.5, -1.8] as [number, number, number], rot: [0, 0.3, 0] as [number, number, number], scale: 0.65 },
  { pos: [3.5, 0.8, -2.2] as [number, number, number], rot: [0, -0.4, 0] as [number, number, number], scale: 0.75 },
  { pos: [-2.8, -2.1, -2.8] as [number, number, number], rot: [0, 0.5, 0] as [number, number, number], scale: 0.7 },
  { pos: [1.2, 2.2, -2.5] as [number, number, number], rot: [0, -0.3, 0] as [number, number, number], scale: 0.8 },
  { pos: [-3.5, 0.5, -2] as [number, number, number], rot: [0, 0.6, 0] as [number, number, number], scale: 0.65 },
  { pos: [2.2, -2.5, -2.6] as [number, number, number], rot: [0, -0.4, 0] as [number, number, number], scale: 0.75 },
  { pos: [-1.8, -0.8, -3.2] as [number, number, number], rot: [0, 0.3, 0] as [number, number, number], scale: 0.7 },
  { pos: [3.2, 1.5, -1.9] as [number, number, number], rot: [0, -0.5, 0] as [number, number, number], scale: 0.8 },
  { pos: [-2.5, 2.8, -2.4] as [number, number, number], rot: [0, 0.4, 0] as [number, number, number], scale: 0.65 },
  { pos: [0.8, -1.8, -2.7] as [number, number, number], rot: [0, -0.3, 0] as [number, number, number], scale: 0.75 },
  { pos: [-3.8, -1.5, -2.3] as [number, number, number], rot: [0, 0.5, 0] as [number, number, number], scale: 0.7 },
  { pos: [2.5, 2.8, -2.9] as [number, number, number], rot: [0, -0.4, 0] as [number, number, number], scale: 0.8 },
  { pos: [-0.8, -2.8, -2.1] as [number, number, number], rot: [0, 0.3, 0] as [number, number, number], scale: 0.65 },
  { pos: [3.8, -0.5, -2.5] as [number, number, number], rot: [0, -0.5, 0] as [number, number, number], scale: 0.75 },
]

interface FloatingImageProps {
  texture: THREE.Texture
  index: number
  rotation: number
  onSelect: (index: number) => void
}

function FloatingImage({ texture, index, rotation, onSelect }: FloatingImageProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const config = imagePositions[index % imagePositions.length]
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return

    const targetRotY = config.rot[1] + rotation
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.12)

    const time = state.clock.getElapsedTime()
    meshRef.current.position.y = config.pos[1] + Math.sin(time * 0.5 + index) * 0.1

    const targetScale = hovered ? config.scale * 1.08 : config.scale
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1))
  })

  return (
    <mesh
      ref={meshRef}
      position={config.pos}
      rotation={config.rot}
      scale={config.scale}
      onClick={() => onSelect(index)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[0.833, 1.2]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={hovered ? 1 : 0.95}
        side={THREE.DoubleSide}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  )
}

export { fishData }

interface SceneProps {
  onSelectFish: (index: number) => void
}

export default function Scene({ onSelectFish }: SceneProps) {
  const [rotation, setRotation] = useState(0)
  const [targetRotation, setTargetRotation] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [lastInteraction, setLastInteraction] = useState(Date.now())
  const { camera, size } = useThree()
  const mousePosition = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const dragRotation = useRef(0)

  const textures = useTextures(images)

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - dragStart.current.x
        const rotationAmount = (deltaX / size.width) * Math.PI * 2
        setTargetRotation(dragRotation.current + rotationAmount)
      } else {
        mousePosition.current = {
          x: (e.clientX / size.width) * 2 - 1,
          y: -(e.clientY / size.height) * 2 + 1,
        }
      }
      setLastInteraction(Date.now())
      setIsAutoPlaying(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [size])

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      dragStart.current = { x: e.clientX, y: e.clientY }
      dragRotation.current = targetRotation
      setLastInteraction(Date.now())
      setIsAutoPlaying(false)
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [targetRotation])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      dragRotation.current = targetRotation
      setLastInteraction(Date.now())
      setIsAutoPlaying(false)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current) {
        const deltaX = e.touches[0].clientX - dragStart.current.x
        const rotationAmount = (deltaX / size.width) * Math.PI * 2
        setTargetRotation(dragRotation.current + rotationAmount)
      }
      setLastInteraction(Date.now())
      setIsAutoPlaying(false)
    }

    const handleTouchEnd = () => {
      isDragging.current = false
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)
    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [targetRotation, size])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setTargetRotation((prev) => prev + Math.PI / 3)
        setLastInteraction(Date.now())
        setIsAutoPlaying(false)
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setTargetRotation((prev) => prev - Math.PI / 3)
        setLastInteraction(Date.now())
        setIsAutoPlaying(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    let isThrottled = false

    const handleWheel = (e: WheelEvent) => {
      if (isThrottled) return

      isThrottled = true
      setTimeout(() => {
        isThrottled = false
      }, 400)

      if (e.deltaY > 0) {
        setTargetRotation((prev) => prev + Math.PI / 3)
      } else {
        setTargetRotation((prev) => prev - Math.PI / 3)
      }

      setLastInteraction(Date.now())
      setIsAutoPlaying(false)
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => {
      window.removeEventListener("wheel", handleWheel)
    }
  }, [])

  // Auto-play after 3s of inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastInteraction = Date.now() - lastInteraction
      if (timeSinceLastInteraction > 3000) {
        setIsAutoPlaying(true)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [lastInteraction])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setTargetRotation((prev) => prev + Math.PI / 3)
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  useFrame(() => {
    if (!isDragging.current) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mousePosition.current.x * 0.5, 0.1)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, mousePosition.current.y * 0.5, 0.1)
    }
    camera.lookAt(0, 0, 0)

    setRotation((prev) => THREE.MathUtils.lerp(prev, targetRotation, 0.12))
  })

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#ff6b35" />
      <spotLight position={[0, 5, 5]} intensity={0.3} angle={0.6} penumbra={1} />

      {textures.map((texture, index) => (
        <FloatingImage key={index} texture={texture} index={index} rotation={rotation} onSelect={onSelectFish} />
      ))}

      {/* Reflection plane */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.2} roughness={0.1} metalness={0.9} />
      </mesh>
    </>
  )
}