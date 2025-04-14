import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { User } from "../lib/database.types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for user in localStorage on mount
    const checkUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (phone: string) => {
    try {
      setLoading(true);
      
      // Check if user exists in the database
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone", phone)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (!data) {
        // This is the first login, determine user type based on phone number
        // For this demo, we'll use a simple rule:
        // If the phone number ends with "1", it's an approver, otherwise a requester
        const userType: "requester" | "approver" = phone.endsWith("1") ? "approver" : "requester";
        
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            phone,
            type: userType,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        toast({
          title: "Welcome!",
          description: `You've been registered as a ${userType}.`,
        });
      } else {
        // Existing user
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "There was an issue logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
