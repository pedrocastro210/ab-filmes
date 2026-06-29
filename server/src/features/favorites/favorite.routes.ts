import { Router } from 'express';
import { FavoriteController } from './favorite.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const favoriteController = new FavoriteController();

// Todas as rotas aqui são protegidas
router.use(authMiddleware);

router.get('/', favoriteController.list.bind(favoriteController));
router.post('/:movieId', favoriteController.add.bind(favoriteController));
router.delete('/:movieId', favoriteController.remove.bind(favoriteController));

export const favoriteRoutes = router;
