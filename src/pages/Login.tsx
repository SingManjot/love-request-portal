
import { useState, FormEvent, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, KeyRound } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

const Login = () => {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, loading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      // Wait for 3 seconds to show the loading animation
      setTimeout(async () => {
        await login(code);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is already logged in, redirect to the appropriate dashboard
  if (user && !loading && !isLoading) {
    if (user.type === "approver") {
      return <Navigate to="/approve" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Show loading screen during the 3-second animation
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background heart-bg">
      <div className="container max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-4">
        <div className="cute-card w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-3 mb-4 rounded-full bg-pink-100">
              <Heart className="w-10 h-10 text-cute-pink" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Viswanathan's Official Meet Request Portal</h1>
            <p className="mt-2 text-muted-foreground">Enter your secret code to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Secret Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="cute-input pl-10"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full cute-button primary-gradient"
              disabled={isSubmitting || !code}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            
            <div className="text-xs text-center text-muted-foreground mt-4">
              <p>Access codes will be shared personally.</p>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center text-muted-foreground">
          <p className="text-sm">Made with 💖 just for you</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
