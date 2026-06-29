import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// Usamos .bind(userController) para não perder o contexto do 'this'
router.post('/', userController.register.bind(userController)); // POST /users
router.post('/login', userController.login.bind(userController)); // POST /users/login
router.get('/validate-token', authMiddleware, userController.validateToken.bind(userController)); // GET /users/validate-token

export const userRoutes = router;
