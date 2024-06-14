export interface User {
  id: string | number;
  role_id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  password: string;
  remember_token: string | null;
  roleName?: string;
}
