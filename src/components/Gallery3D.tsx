import { Canvas } from "@react-three/fiber"
import { Suspense, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Scene, { fishData } from "./Scene"
import Overlay from "./Overlay"
import LoadingScreen from "./LoadingScreen"

export default function Gallery3D() {
  const [selectedFish, setSelectedFish] = useState<number | null>(null)
  const fish = selectedFish !== null ? fishData[selectedFish] : null

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: false }}>
        <Suspense fallback={null}>
          <Scene onSelectFish={(i) => setSelectedFish(i)} />
        </Suspense>
      </Canvas>
      <Overlay />
      <LoadingScreen />

      <AnimatePresence>
        {fish && (
          <motion.div
            key={selectedFish}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-72"
          >
            <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
              <img
                src={fish.img}
                alt={fish.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="font-serif text-xl text-white">{fish.name}</h2>
                  <button
                    onClick={() => setSelectedFish(null)}
                    className="text-white/40 hover:text-white text-lg leading-none ml-2 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <p className="text-white/40 text-xs italic mb-3">{fish.latin}</p>
                <p className="text-white/70 text-sm leading-relaxed mb-4">{fish.desc}</p>

                <div className="mb-3">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Что посмотреть</p>
                  <div className="flex flex-wrap gap-1.5">
                    {fish.baits.map((b) => (
                      <span
                        key={b}
                        className="text-xs px-2 py-0.5 rounded-full border border-white/20 text-white/60"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <span className="text-white/40 text-xs uppercase tracking-widest">Сезон:</span>
                  <span className="text-white/80 text-xs">{fish.season}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!fish && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
        >
          <p className="text-white/25 text-xs text-right">Нажмите на фото<br/>чтобы узнать подробнее</p>
        </motion.div>
      )}
    </div>
  )
}