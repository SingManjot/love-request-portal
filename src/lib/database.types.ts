
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
