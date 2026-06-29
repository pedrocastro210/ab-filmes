import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { FavoritesService } from './favorites.service';

const favoritesService = new FavoritesService();

export class FavoriteController {
  // POST /favorites/:movieId
  async add(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id; // O '!' diz: tenho certeza que o middleware auth preencheu isso
    const movieId = parseInt(req.params.movieId as string);

    if (isNaN(movieId)) {
      res.status(400).json({ message: 'ID do filme inválido' });
      return;
    }

    await favoritesService.add(userId, movieId);
    res.status(201).json({ message: 'Filme adicionado aos favoritos' });
  }

  // DELETE /favorites/:movieId
  async remove(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const movieId = parseInt(req.params.movieId as string);

    if (isNaN(movieId)) {
      res.status(400).json({ message: 'ID do filme inválido' });
      return;
    }

    await favoritesService.remove(userId, movieId);
    res.status(204).send(); // Sucesso sem conteúdo
  }

  // GET /favorites
  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const movies = await favoritesService.listByUser(userId);
    res.json(movies);
  }
}
