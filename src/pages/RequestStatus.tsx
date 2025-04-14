
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Request } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  Heart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const RequestStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("requests")
          .select("*")
          .eq("phone", user.phone)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        setRequests(data || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel("requests-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
          filter: `phone=eq.${user?.phone}`,
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          fetchRequests();
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date specified";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background heart-bg">
      <div className="container max-w-md mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold flex items-center">
            <Heart className="w-5 h-5 text-cute-pink mr-2" />
            Request Status
          </h1>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </Card>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="cute-card text-center py-10">
            <div className="text-cute-pink mb-4">
              <Calendar className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Requests Yet</h3>
            <p className="text-muted-foreground mb-6">You haven't created any meeting requests yet.</p>
            <Button 
              onClick={() => navigate("/new-request")} 
              className="cute-button primary-gradient"
            >
              Create Your First Request
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="cute-card overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{request.name}</h3>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(request.wished_date)}</span>
                  <span className="mx-2">•</span>
                  <span className="capitalize">{request.wished_urgency} Priority</span>
                </div>
                
                <div className="bg-muted p-3 rounded-md mb-3">
                  <p className="text-sm font-medium mb-1">Reason:</p>
                  <p className="text-sm">{request.reason}</p>
                </div>
                
                <div className="flex items-center text-sm">
                  <span>Meeting with:</span>
                  <span className="font-medium ml-1 capitalize">{request.person}</span>
                </div>
                
                {request.status !== "pending" && (
                  <div className="mt-4 p-3 border rounded-md flex items-start">
                    {getStatusIcon(request.status)}
                    <div className="ml-2">
                      <p className="text-sm font-medium">
                        {request.status === "approved" 
                          ? "Your request was approved!" 
                          : "Your request was declined"}
                      </p>
                      {request.response_reason && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {request.response_reason}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestStatus;
