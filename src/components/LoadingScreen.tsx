
import { HeartCrack, Heart } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background heart-bg">
      <div className="flex space-x-4 animate-pulse-gentle">
        <Heart className="text-cute-pink w-8 h-8 animate-bounce" />
        <Heart className="text-cute-purple w-8 h-8 animate-bounce delay-200" />
        <Heart className="text-cute-blue w-8 h-8 animate-bounce delay-500" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-foreground">Loading...</h2>
    </div>
  );
};

export default LoadingScreen;
