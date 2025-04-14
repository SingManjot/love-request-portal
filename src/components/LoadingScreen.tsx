
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background heart-bg overflow-hidden"
    >
      {/* Portal circle animation */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cute-pink via-cute-purple to-cute-blue opacity-20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.5, 1],
          opacity: [0, 0.8, 0.2]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      />
      
      {/* Secondary pulse effect */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-cute-blue via-cute-purple to-cute-pink opacity-30"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.2, 0.8, 1],
          opacity: [0, 0.6, 0.4, 0.2]
        }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          delay: 0.2
        }}
      />

      <div className="flex space-x-4 animate-pulse-gentle z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart className="text-cute-pink w-12 h-12 animate-bounce" />
        </motion.div>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        >
          <Heart className="text-cute-purple w-12 h-12 animate-bounce delay-200" />
        </motion.div>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4
          }}
        >
          <Heart className="text-cute-blue w-12 h-12 animate-bounce delay-500" />
        </motion.div>
      </div>

      {/* Text with staggered entry */}
      <motion.h2 
        className="mt-6 text-xl font-semibold z-10" 
        style={{ 
          color: '#FFA6C9',  
          fontFamily: 'Poppins, sans-serif',
          textShadow: '1px 1px 2px rgba(255, 166, 201, 0.3)' 
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Loading Love...
      </motion.h2>
      
      {/* Sparkles effect */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              repeatDelay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
