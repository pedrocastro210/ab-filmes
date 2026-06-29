import { Router } from 'express';
import { MovieController } from './movie.controller';
import { authMiddleware } from '../../middlewares/auth.middleware'; // <--- Importamos o guarda
import { upload } from '../../middlewares/upload.middleware';

const router = Router();
const movieController = new MovieController();

// GET /movies (Lista todos)
router.get('/', authMiddleware, movieController.list.bind(movieController));
// GET /movies/:id (Busca um específico)
router.get('/:id', authMiddleware, movieController.getById.bind(movieController));
// POST /movies/:id/rate (Avaliar um específico)
router.post('/:id/rate', authMiddleware, movieController.rate.bind(movieController));
router.post(
  '/',
  authMiddleware,
  upload.single('image'), // 'image' é o nome do campo que o Front deve enviar
  movieController.create.bind(movieController)
);

export const movieRoutes = router;
