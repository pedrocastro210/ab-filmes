export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Interface auxiliar para o retorno sem a senha
export type UserResponse = Omit<User, 'password'>;
