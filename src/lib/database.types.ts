
export interface Database {
  public: {
    Tables: {
      requests: {
        Row: Request;
        Insert: Omit<Request, "id" | "created_at" | "status" | "response_reason">;
        Update: Partial<Request>;
      };
      users: {
        Row: User;
        Insert: User;
        Update: Partial<User>;
      };
    };
  };
}

export interface Request {
  id: string;
  name: string;
  phone: string;
  wished_date: string;
  wished_urgency: "low" | "medium" | "high";
  reason: string;
  person: "dad" | "mom" | "sister" | "her";
  status: "pending" | "approved" | "rejected";
  response_reason?: string;
  created_at: string;
}

export interface User {
  code: string;
  type: "requester" | "approver";
  name?: string;
  created_at?: string;
  phone?: string;
}
