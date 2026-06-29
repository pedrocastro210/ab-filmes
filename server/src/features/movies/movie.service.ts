// Responsável por ler o movies.json.

import fs from 'node:fs/promises';
import path from 'path';
import { Movie } from './movie.interface';

const DB_PATH = path.join(__dirname, '../../../data/movies.json');

export class MovieService {
  // Lê o arquivo json e retorna a lista
  async findAll(): Promise<Movie[]> {
    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Se não existir arquivo ainda, cria e retorna vazio
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      await fs.writeFile(DB_PATH, '[]');
      return [];
    }
  }

  async findById(id: number): Promise<Movie | undefined> {
    const movies = await this.findAll();
    return movies.find((movie) => movie.id === id);
  }

  async rate(id: number, rating: number): Promise<Movie | null> {
    const movies = await this.findAll();
    const movieIndex = movies.findIndex((m) => m.id === id);

    if (movieIndex === -1) {
      return null; // Filme não encontrado
    }

    const movie = movies[movieIndex];

    if (!movie) {
      return null;
    }

    // 1. Calcular a soma atual dos votos (Reverter a média)
    // Se qtdVotos for 0, a soma é 0.
    const currentTotalScore = movie.mediaVotos * movie.qtdVotos;

    // 2. Incrementar a quantidade de votos
    movie.qtdVotos += 1;

    // 3. Calcular a nova média
    // (Soma antiga + Nova Nota) / Nova quantidade
    const newAverage = (currentTotalScore + rating) / movie.qtdVotos;

    // 4. Arredondar para 1 casa decimal (ex: 8.5) para ficar bonito
    movie.mediaVotos = parseFloat(newAverage.toFixed(4));

    // 5. Atualizar o array e Salvar no arquivo
    movies[movieIndex] = movie;
    await fs.writeFile(DB_PATH, JSON.stringify(movies, null, 2));

    return movie;
  }

  async create(movieData: Omit<Movie, 'id' | 'qtdVotos' | 'mediaVotos'>): Promise<Movie> {
    const movies = await this.findAll();

    const newMovie: Movie = {
      id: Date.now(),
      ...movieData,
      qtdVotos: 0, // Inicia zerado
      mediaVotos: 0, // Inicia zerado
    };

    movies.push(newMovie);
    await fs.writeFile(DB_PATH, JSON.stringify(movies, null, 2));

    return newMovie;
  }
}
