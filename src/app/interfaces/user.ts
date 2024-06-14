export interface User {
  id: string | number;
  role_id: string;
  name: string;
  email: string;
  password: string;
  roleName?: string;
}
