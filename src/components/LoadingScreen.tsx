
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
      {/* Heart Background Animation */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cute-pink/20 via-cute-purple/20 to-cute-blue/20"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ 
          scale: [0.6, 1.1, 1],
          opacity: [0, 0.5, 0.2]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      />

      <div className="flex space-x-4 z-10">
        {[1, 2, 3].map((_, index) => (
          <motion.div
            key={index}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          >
            <Heart 
              className={`w-10 h-10 ${
                index === 0 ? 'text-cute-pink' : 
                index === 1 ? 'text-cute-purple' : 
                'text-cute-blue'
              } opacity-70`} 
            />
          </motion.div>
        ))}
      </div>
      
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
        Loading...
      </motion.h2>
    </motion.div>
  );
};

export default LoadingScreen;
