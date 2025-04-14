
import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Request } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Heart, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  LogOut,
  HeartCrack,
} from "lucide-react";

const ApproverDashboard = () => {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [processedRequests, setProcessedRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [reasonInputs, setReasonInputs] = useState<Record<string, string>>({});
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        console.log("Fetching requests for approver dashboard...");
        const { data, error } = await supabase
          .from("requests")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching requests:", error);
          throw error;
        }
        
        console.log("Fetched requests:", data);
        
        // Type assertion to ensure the data conforms to our Request interface
        const typedData = data as Request[] || [];
        setRequests(typedData);
        setPendingRequests(typedData.filter(req => req.status === "pending"));
        setProcessedRequests(typedData.filter(req => req.status !== "pending"));
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Failed to load requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel("approver-requests-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
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
  }, []);

  const handleReasonChange = (id: string, value: string) => {
    setReasonInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    setProcessingIds(prev => [...prev, id]);
    
    try {
      const reason = reasonInputs[id] || (status === "approved" ? "Looks good!" : "Not available at this time.");
      
      const { error } = await supabase
        .from("requests")
        .update({
          status,
          response_reason: reason
        })
        .eq("id", id);
        
      if (error) throw error;
      
      // Show cute animation based on status
      if (status === "approved") {
        toast.custom((t) => (
          <div className={`bg-white p-4 rounded-lg shadow-lg border-2 border-cute-pink transform transition-all duration-500 ${t.visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-cute-pink to-cute-purple p-3 rounded-full">
                <Heart className="w-6 h-6 text-white animate-pulse-gentle" fill="#FFF" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Request Approved!</h3>
                <p className="text-sm text-gray-600">Love is in the air! 💖</p>
              </div>
            </div>
          </div>
        ), { duration: 4000 });
      } else {
        toast.custom((t) => (
          <div className={`bg-white p-4 rounded-lg shadow-lg border-2 border-muted transform transition-all duration-500 ${t.visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 p-3 rounded-full">
                <HeartCrack className="w-6 h-6 text-red-500 animate-pulse-gentle" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Request Declined</h3>
                <p className="text-sm text-gray-600">Maybe next time...</p>
              </div>
            </div>
          </div>
        ), { duration: 4000 });
      }
      
      // Clear the reason input
      setReasonInputs(prev => {
        const newInputs = { ...prev };
        delete newInputs[id];
        return newInputs;
      });

      // Update local state immediately to reflect the change
      // Find the request that was just processed
      const updatedRequest = requests.find(req => req.id === id);
      if (updatedRequest) {
        // Create an updated version of the request with the new status
        const processedRequest = {
          ...updatedRequest,
          status,
          response_reason: reason
        };

        // Update all three state variables
        setRequests(prev => 
          prev.map(req => req.id === id ? processedRequest : req)
        );
        
        // Remove from pending requests
        setPendingRequests(prev => 
          prev.filter(req => req.id !== id)
        );
        
        // Add to processed requests
        setProcessedRequests(prev => 
          [processedRequest, ...prev]
        );
      }
      
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      toast.error(`Failed to ${status} the request. Please try again.`);
    } finally {
      setProcessingIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
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

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "low":
        return <Badge className="bg-blue-500">Low Priority</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium Priority</Badge>;
      case "high":
        return <Badge className="bg-red-500">High Priority</Badge>;
      default:
        return <Badge>{urgency} Priority</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background heart-bg">
      <div className="container max-w-md mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-cute-pink" />
            <h1 className="text-xl font-bold">Love Requests</h1>
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
          <h2 className="text-xl font-semibold mb-2">Request Approval Portal</h2>
          <p className="text-muted-foreground">View and manage meeting requests</p>
        </div>
        
        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pending" className="rounded-full">
              <Clock className="w-4 h-4 mr-2" />
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="processed" className="rounded-full">
              <CheckCircle className="w-4 h-4 mr-2" />
              Processed ({processedRequests.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading requests...</p>
            ) : pendingRequests.length === 0 ? (
              <div className="cute-card text-center py-8">
                <div className="text-cute-pink mb-4">
                  <Heart className="w-12 h-12 mx-auto opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Pending Requests</h3>
                <p className="text-muted-foreground">You've handled all the requests! Great job!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingRequests.map((request) => (
                  <Card key={request.id} className="cute-card p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">{request.name}</h3>
                      {getUrgencyBadge(request.wished_urgency)}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(request.wished_date)}</span>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md mb-3">
                      <p className="text-sm font-medium mb-1">Reason:</p>
                      <p className="text-sm">{request.reason}</p>
                    </div>
                    
                    <div className="flex items-center text-sm mb-4">
                      <span>Meeting with:</span>
                      <span className="font-medium ml-1 capitalize">{request.person}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add a response reason (optional)"
                        className="cute-input"
                        value={reasonInputs[request.id] || ""}
                        onChange={(e) => handleReasonChange(request.id, e.target.value)}
                      />
                      
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-green-500 hover:bg-green-600 cute-button"
                          onClick={() => handleUpdateStatus(request.id, "approved")}
                          disabled={processingIds.includes(request.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        
                        <Button 
                          className="flex-1 bg-red-500 hover:bg-red-600 cute-button"
                          onClick={() => handleUpdateStatus(request.id, "rejected")}
                          disabled={processingIds.includes(request.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="processed">
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading requests...</p>
            ) : processedRequests.length === 0 ? (
              <div className="cute-card text-center py-8">
                <div className="text-cute-pink mb-4">
                  <Clock className="w-12 h-12 mx-auto opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Processed Requests</h3>
                <p className="text-muted-foreground">You haven't processed any requests yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {processedRequests.map((request) => (
                  <Card key={request.id} className="cute-card p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{request.name}</h3>
                      <Badge className={request.status === "approved" ? "bg-green-500" : "bg-red-500"}>
                        {request.status === "approved" ? "Approved" : "Rejected"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(request.wished_date)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm mb-2">
                      <span>Meeting with:</span>
                      <span className="font-medium ml-1 capitalize">{request.person}</span>
                    </div>
                    
                    {request.response_reason && (
                      <div className="bg-muted p-2 rounded-md text-sm mt-2">
                        <span className="font-medium">Your response:</span> {request.response_reason}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApproverDashboard;
