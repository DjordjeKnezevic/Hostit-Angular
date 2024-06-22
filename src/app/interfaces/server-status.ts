export interface ServerStatus {
  id: string;
  subscription_id: string;
  status: string;
  last_started_at: string;
  last_stopped_at?: string | null;
  last_crashed_at?: string | null;
  uptime: number;
  downtime: number;
}
