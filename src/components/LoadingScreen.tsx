
import { HeartCrack, Heart } from "lucide-react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background heart-bg"
    >
      <div className="flex space-x-4 animate-pulse-gentle">
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
      <h2 className="mt-6 text-xl font-semibold text-foreground" style={{ 
        color: '#FFA6C9',  // Soft pastel pink for a cute look
        fontFamily: 'Poppins, sans-serif',
        textShadow: '1px 1px 2px rgba(255, 166, 201, 0.3)' 
      }}>
        Loading Love...
      </h2>
    </motion.div>
  );
};

export default LoadingScreen;

