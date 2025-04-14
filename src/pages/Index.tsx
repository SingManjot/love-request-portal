
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login after a short delay
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background heart-bg">
      <div className="text-center animate-pulse-gentle">
        <Heart className="w-16 h-16 text-cute-pink mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Meet Request Portal</h1>
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default Index;
