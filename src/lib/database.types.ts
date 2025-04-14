
export interface Request {
  id: string;
  name: string;
  wished_date: string;
  wished_urgency: "low" | "medium" | "high";
  reason: string;
  person: "dad" | "mom" | "sister" | "her";
  status: "pending" | "approved" | "rejected";
  response_reason?: string | null;
  created_at: string | null;
}

export interface User {
  code: string;
  type: "requester" | "approver";
  name?: string;
  created_at?: string;
}

export interface Database {
  public: {
    Tables: {
      requests: {
        Row: {
          id: string;
          name: string;
          wished_date: string;
          wished_urgency: string;
          reason: string;
          person: string;
          status: string;
          response_reason: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          wished_date: string;
          wished_urgency: string;
          reason: string;
          person: string;
          status?: string;
          response_reason?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          wished_date?: string;
          wished_urgency?: string;
          reason?: string;
          person?: string;
          status?: string;
          response_reason?: string | null;
          created_at?: string | null;
        };
      };
      users: {
        Row: {
          code: string;
          type: string;
          name: string | null;
          created_at: string | null;
        };
        Insert: {
          code: string;
          type: string;
          name?: string | null;
          created_at?: string | null;
        };
        Update: {
          code?: string;
          type?: string;
          name?: string | null;
          created_at?: string | null;
        };
      };
    };
  };
}
