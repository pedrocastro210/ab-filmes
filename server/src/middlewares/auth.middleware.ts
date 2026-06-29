// Esse código verifica se o cabeçalho Authorization veio com o formato Bearer <token> e valida a assinatura.

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// DICA: Em um projeto real, mova isso para um arquivo de configuração ou .env
const JWT_SECRET = 'minha_chave_secreta_super_segura';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  // O formato geralmente é "Bearer <TOKEN>"
  const [, token] = authHeader.split(' ');

  if (!token) {
    res.status(401).json({ message: 'Formato de token inválido' });
    return;
  }

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };

    (req as AuthenticatedRequest).user = decoded;

    next(); // Tudo certo, pode passar para o Controller!
  } catch (error) {
    res.status(403).json({ message: 'Token inválido ou expirado' });
    return;
  }
};
