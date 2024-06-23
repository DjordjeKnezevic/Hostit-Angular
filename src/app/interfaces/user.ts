export interface User {
  id: string | number;
  name: string;
  email: string;
  role: {
    id: string | number;
    name: string;
  };
}
