
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background heart-bg">
      <div className="text-center cute-card max-w-md">
        <Heart className="w-12 h-12 text-cute-pink mx-auto mb-4 animate-float" />
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-6">Oops! This page has wandered off</p>
        <Link to="/login">
          <Button className="cute-button primary-gradient">Return to Login</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
