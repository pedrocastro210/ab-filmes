export interface Movie {
  id: number;
  titulo: string;
  descricao: string;
  qtdVotos: number;
  mediaVotos: number;
  genero: string;
  anoLancamento: number;
  caminhoImagem: string; // Ex: url da internet ou caminho local
}
