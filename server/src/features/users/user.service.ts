// Responsável pela lógica de negócios e acesso aos dados (ler/escrever no arquivo JSON).

import fs from 'node:fs/promises';
import path from 'path';
import { User } from './user.interface';

// Caminho absoluto para o arquivo JSON
const DB_PATH = path.join(__dirname, '../../../data/users.json');

export class UserService {
  async findByEmail(email: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find((u) => u.email === email);
  }

  async findById(id: number): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find((u) => u.id === id);
  }

  async create(user: User): Promise<User> {
    const users = await this.getUsers();
    users.push(user);
    await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
    return user;
  }

  // Helper privado para garantir que o arquivo e a pasta existam
  private async getUsers(): Promise<User[]> {
    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Se o arquivo não existir, cria a pasta data e retorna array vazio
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      await fs.writeFile(DB_PATH, '[]');
      return [];
    }
  }
}
