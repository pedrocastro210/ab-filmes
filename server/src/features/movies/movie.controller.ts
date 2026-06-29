import { Request, Response } from 'express';
import { MovieService } from './movie.service';

const movieService = new MovieService();

export class MovieController {
  async list(req: Request, res: Response): Promise<void> {
    // Como o authMiddleware já rodou antes, sabemos que o usuário está logado
    const movies = await movieService.findAll();
    res.json(movies);
  }

  async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    // O id vem como string na URL, precisamos converter
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const movie = await movieService.findById(id);

    if (!movie) {
      res.status(404).json({ message: 'Filme não encontrado' });
      return;
    }

    res.json(movie);
  }

  async rate(req: Request<{ id: string }>, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const { rating } = req.body; // Esperamos { "rating": 5 }

    if (isNaN(id)) {
      res.status(400).json({ message: 'ID de filme inválido' });
      return;
    }

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      res.status(400).json({ message: 'A nota deve ser um número entre 1 e 5' });
      return;
    }

    const updatedMovie = await movieService.rate(id, rating);

    if (!updatedMovie) {
      res.status(404).json({ message: 'Filme não encontrado' });
      return;
    }

    res.json(updatedMovie);
  }

  async create(req: Request, res: Response): Promise<void> {
    // 1. Verifica se a imagem veio
    if (!req.file) {
      res.status(400).json({ message: 'A imagem do filme é obrigatória' });
      return;
    }

    const { titulo, descricao, anoLancamento, genero } = req.body;

    // 2. Validações básicas
    if (!titulo || !descricao || !anoLancamento || !genero) {
      res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      return;
    }

    // 3. Monta o caminho da imagem para salvar no banco
    // O Multer salva o arquivo, nós só pegamos o nome dele
    const caminhoImagem = `/uploads/${req.file.filename}`;

    try {
      const newMovie = await movieService.create({
        titulo,
        descricao,
        genero,
        anoLancamento: parseInt(anoLancamento), // Vem como string no FormData
        caminhoImagem,
      });

      res.status(201).json(newMovie);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao salvar filme' });
    }
  }
}
