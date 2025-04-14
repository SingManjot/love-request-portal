
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
  Heart,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const RequestStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchRequests = async () => {
    if (!user) {
      console.log("No user found, cannot fetch requests");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Fetching requests for phone:", user.phone);
      
      // Fetch ALL requests to debug
      const allRequestsResult = await supabase
        .from("requests")
        .select("*");
        
      console.log("All requests in database:", allRequestsResult);
      
      // Now fetch user-specific requests
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("phone", user.phone);
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Raw data from Supabase for this user:", data);
      console.log("User phone used for query:", user.phone);
      
      if (!data || data.length === 0) {
        console.log("No requests found for this user");
        setRequests([]);
        setLoading(false);
        return;
      }
      
      // Type cast the data to ensure wished_urgency, person, and status are correctly typed
      const typedData = data.map(item => ({
        ...item,
        wished_urgency: item.wished_urgency as "low" | "medium" | "high",
        person: item.person as "dad" | "mom" | "sister" | "her",
        status: item.status as "pending" | "approved" | "rejected"
      }));
      
      console.log("Processed requests:", typedData);
      console.log("Number of requests found:", typedData.length);
      
      setRequests(typedData);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error fetching requests",
        description: "Could not retrieve your requests. Please try again.",
        variant: "destructive",
      });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    console.log("RequestStatus component mounted, user:", user);
    
    if (user) {
      fetchRequests();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('requests-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'requests',
          },
          (payload) => {
            console.log("Real-time update received:", payload);
            fetchRequests();
          }
        )
        .subscribe();
        
      console.log("Subscription created to requests table");
        
      return () => {
        console.log("Cleaning up subscription");
        channel.unsubscribe();
      };
    }
  }, [user, refreshTrigger]);

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

  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background heart-bg">
      <div className="container max-w-md mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
            <div className="mt-4 text-sm text-muted-foreground">
              <p>If you've already created a request and don't see it here, try refreshing.</p>
            </div>
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
