import React, { useEffect, useState } from 'react'
import { Rocket, Sparkles, Zap, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [startBar, setStartBar] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setStartBar(true)
    }, 1200) // start progress bar after fade-in animations
    return () => clearTimeout(fadeTimer)
  }, [])

  useEffect(() => {
    if (startBar) {
      const finishTimer = setTimeout(() => {
        onComplete()
      }, 2000) // progress bar duration
      return () => clearTimeout(finishTimer)
    }
  }, [startBar, onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-black/90 backdrop-blur-xl flex items-center justify-center z-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Glowing orbs */}
        <motion.div 
          className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full filter blur-xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full filter blur-xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="text-center relative z-10">
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="w-28 h-28 mx-auto relative">
            {/* Outer glow */}
            <motion.div
              className="absolute inset-0 bg-purple-500/20 rounded-full blur-md"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Glass morphic circle */}
            <motion.div
              className="absolute inset-0 border-4 border-purple-400/70 border-t-purple-200 rounded-full backdrop-blur-md"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px 0 rgba(107, 70, 193, 0.37)',
              }}
            />
            
            {/* Inner glossy circle */}
            <motion.div
              className="absolute inset-4 bg-gradient-to-br from-purple-600/30 to-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: 'backOut' }}
              style={{
                boxShadow: `
                  inset 0 2px 10px rgba(255, 255, 255, 0.3),
                  inset 0 -2px 10px rgba(0, 0, 0, 0.2),
                  0 0 20px rgba(139, 92, 246, 0.5)
                `,
              }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Rocket className="h-10 w-10 text-purple-200" fill="rgba(216, 180, 254, 0.3)" />
              </motion.div>
              
              {/* Sparkle effects */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star className="h-4 w-4 text-yellow-300 fill-yellow-300/50" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-2"
                animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <Sparkles className="h-4 w-4 text-cyan-300" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.h2
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #e9d5ff 0%, #a5b4fc 50%, #67e8f9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
          }}
        >
          Solace
        </motion.h2>

        <motion.p
          className="text-purple-100/90 mb-6 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          Loading your entrepreneurial journey...
        </motion.p>

        <div className="flex justify-center space-x-2 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #c4b5fd, #818cf8)',
                boxShadow: '0 0 10px rgba(139, 92, 246, 0.7)',
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {startBar && (
          <motion.div
            className="mt-8 w-72 mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div 
              className="h-3 rounded-full overflow-hidden backdrop-blur-md"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset 0 2px 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(139, 92, 246, 0.3)',
              }}
            >
              <motion.div
                className="h-full rounded-full relative"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                style={{
                  background: 'linear-gradient(90deg, #8b5cf6, #a855f7, #c4b5fd)',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.7)',
                }}
              >
                {/* Progress bar shine effect */}
                <motion.div
                  className="absolute top-0 left-0 w-16 h-full bg-white/30"
                  animate={{ x: ['0%', '100%'] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                  style={{
                    transform: 'skewX(-20deg)',
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
        
        <motion.div 
          className="mt-12 text-purple-200/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center justify-center">
            <Zap className="h-4 w-4 mr-2 fill-amber-400/30" />
            <span>Powered by innovation</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}