import fs from 'node:fs/promises';
import path from 'path';
import { Movie } from '../movies/movie.interface';
import { MovieService } from '../movies/movie.service'; // Reutilizamos o service de filmes

const DB_PATH = path.join(__dirname, '../../../data/favorites.json');

interface UserFavorite {
  userId: number;
  movieIds: number[];
}

export class FavoritesService {
  private movieService = new MovieService();

  // Adicionar Favorito
  async add(userId: number, movieId: number): Promise<void> {
    const allFavorites = await this.getAll();

    // Busca registro do usuário ou cria novo
    let userFav = allFavorites.find((f) => f.userId === userId);

    if (!userFav) {
      userFav = { userId, movieIds: [] };
      allFavorites.push(userFav);
    }

    // Evita duplicados
    if (!userFav.movieIds.includes(movieId)) {
      userFav.movieIds.push(movieId);
      await fs.writeFile(DB_PATH, JSON.stringify(allFavorites, null, 2));
    }
  }

  // Remover Favorito
  async remove(userId: number, movieId: number): Promise<void> {
    const allFavorites = await this.getAll();
    const userFav = allFavorites.find((f) => f.userId === userId);

    if (userFav) {
      userFav.movieIds = userFav.movieIds.filter((id) => id !== movieId);
      await fs.writeFile(DB_PATH, JSON.stringify(allFavorites, null, 2));
    }
  }

  // Listar Filmes Favoritos (Retorna objetos Movie completos)
  async listByUser(userId: number): Promise<Movie[]> {
    const allFavorites = await this.getAll();
    const userFav = allFavorites.find((f) => f.userId === userId);

    if (!userFav || userFav.movieIds.length === 0) {
      return [];
    }

    // Busca TODOS os filmes do sistema
    const allMovies = await this.movieService.findAll();

    // Filtra apenas os que estão na lista de IDs do usuário
    return allMovies.filter((movie) => userFav.movieIds.includes(movie.id));
  }

  private async getAll(): Promise<UserFavorite[]> {
    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch {
      // Se não existir, cria
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      await fs.writeFile(DB_PATH, '[]');
      return [];
    }
  }
}
