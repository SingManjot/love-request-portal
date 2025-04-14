import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Calendar, Heart, Send } from "lucide-react";

const NewRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    wished_date: "",
    wished_urgency: "medium" as "low" | "medium" | "high",
    reason: "",
    person: "her" as "dad" | "mom" | "sister" | "her"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to submit a request.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting request with phone:", user.phone);
      console.log("Form data:", formData);
      
      const { data, error } = await supabase
        .from("requests")
        .insert({
          ...formData,
          phone: user.phone,
        })
        .select();
        
      if (error) throw error;
      
      console.log("Request submitted successfully:", data);
      
      toast({
        title: "Request submitted!",
        description: "Your request has been sent successfully.",
      });
      
      navigate("/request-status");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Submission failed",
        description: "There was an issue submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
            New Request
          </h1>
        </div>
        
        <div className="cute-card mb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Your Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                className="cute-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="wished_date" className="text-sm font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-cute-pink" />
                Preferred Date
              </label>
              <Input
                id="wished_date"
                name="wished_date"
                type="date"
                className="cute-input"
                value={formData.wished_date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="wished_urgency" className="text-sm font-medium">
                Urgency Level
              </label>
              <Select 
                value={formData.wished_urgency} 
                onValueChange={(value) => handleSelectChange("wished_urgency", value)}
              >
                <SelectTrigger className="cute-input">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Whenever Convenient</SelectItem>
                  <SelectItem value="medium">Medium - Soon Please</SelectItem>
                  <SelectItem value="high">High - As Soon As Possible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="person" className="text-sm font-medium">
                Who Would You Like to Meet?
              </label>
              <Select 
                value={formData.person} 
                onValueChange={(value) => handleSelectChange("person", value)}
              >
                <SelectTrigger className="cute-input">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="her">Her</SelectItem>
                  <SelectItem value="mom">Her Mom</SelectItem>
                  <SelectItem value="dad">Her Dad</SelectItem>
                  <SelectItem value="sister">Her Sister</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for Meeting
              </label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Tell us why you'd like to meet..."
                className="cute-input min-h-[100px]"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full cute-button primary-gradient"
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Send Request"}
            </Button>
          </form>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>✨ Be creative with your reason! ✨</p>
        </div>
      </div>
    </div>
  );
};

export default NewRequest;
