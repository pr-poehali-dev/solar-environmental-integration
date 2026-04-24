import { motion } from "framer-motion"

export default function Overlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute top-8 left-0 right-0 flex flex-col items-center gap-2">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="font-serif text-2xl md:text-3xl font-light text-white tracking-widest uppercase"
        >
          Рыбы Северо-Запада
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="text-white/50 text-sm tracking-wider font-light"
        >
          Справочник · Виды · Снасти
        </motion.p>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="text-white/30 text-xs tracking-widest uppercase"
        >
          Перетаскивайте или используйте стрелки для навигации
        </motion.p>
      </div>
    </div>
  )
}