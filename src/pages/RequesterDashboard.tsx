
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, ClipboardList, LogOut, Heart } from "lucide-react";

const RequesterDashboard = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <div className="min-h-screen bg-background heart-bg">
      <div className="container max-w-md mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-cute-pink" />
            <h1 className="text-2xl font-bold text-foreground">Love Request</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>

        <div className="cute-card text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
          <p className="text-muted-foreground">What would you like to do today?</p>
        </div>

        <div className="grid gap-6">
          <Link to="/new-request">
            <Card className="cute-card flex items-center p-6 hover:shadow-xl hover:border-cute-purple transition-all duration-300">
              <div className="bg-cute-pink/20 p-3 rounded-full mr-4">
                <PlusCircle className="w-8 h-8 text-cute-pink" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Create New Request</h3>
                <p className="text-muted-foreground">Submit a new meeting request</p>
              </div>
            </Card>
          </Link>

          <Link to="/request-status">
            <Card className="cute-card flex items-center p-6 hover:shadow-xl hover:border-cute-blue transition-all duration-300">
              <div className="bg-cute-blue/20 p-3 rounded-full mr-4">
                <ClipboardList className="w-8 h-8 text-cute-blue" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Check Request Status</h3>
                <p className="text-muted-foreground">View your previous requests</p>
              </div>
            </Card>
          </Link>
        </div>

        <div className="floating-element mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ Make your request special ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequesterDashboard;
