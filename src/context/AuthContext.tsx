import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "../lib/database.types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (code: string) => Promise<void>;
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

  const login = async (code: string) => {
    try {
      setLoading(true);
      
      // Determine user type based on the code
      let userType: "requester" | "approver";
      
      // Check if the code matches one of our predefined codes
      if (code.toLowerCase() === "manjot") {
        userType = "requester";
      } else if (code.toLowerCase() === "monkeyman") {
        userType = "approver";
      } else {
        throw new Error("Invalid code");
      }

      // Check if user exists in the database with this code
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("code", code.toLowerCase())
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (!data) {
        // Create new user with this code
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            code: code.toLowerCase(),
            type: userType,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        
        // Convert the database type to our application type
        const typedUser: User = {
          code: newUser.code,
          type: newUser.type as "requester" | "approver",
          name: newUser.name || undefined,
          created_at: newUser.created_at || undefined,
          phone: newUser.phone || undefined
        };
        
        setUser(typedUser);
        localStorage.setItem("user", JSON.stringify(typedUser));
        toast({
          title: "Welcome!",
          description: userType === "requester" ? "You can now create requests." : "You can now review requests.",
        });
      } else {
        // Existing user - ensure type safety
        const typedUser: User = {
          code: data.code,
          type: data.type as "requester" | "approver",
          name: data.name || undefined,
          created_at: data.created_at || undefined,
          phone: data.phone || undefined
        };
        
        setUser(typedUser);
        localStorage.setItem("user", JSON.stringify(typedUser));
        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "There was an issue logging in. Please try again.";
      
      if (error instanceof Error && error.message === "Invalid code") {
        errorMessage = "Invalid code. Please try again with a valid code.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
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
