import express from 'express';
import cors from 'cors';
import { userRoutes } from './features/users/user.routes';
import { movieRoutes } from './features/movies/movie.routes';
import { favoriteRoutes } from './features/favorites/favorite.routes';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Libera acesso para o Angular
app.use(express.json()); // Permite ler JSON no corpo das requisições

// Servir arquivos estáticos
// // Ex: http://localhost:3000/uploads/minha-imagem.jpg
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Rotas
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/favorites', favoriteRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Funcionando 🚀');
});

// Inicialização
app.listen(PORT, () => {
  console.log(`🎬 Servidor de filmes rodando em http://localhost:${PORT}`);
});
