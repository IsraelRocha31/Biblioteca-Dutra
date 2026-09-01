export interface Admin {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export interface Livro {
  id: number;
  isbn: string;
  nome: string;
  foto_capa: string | null;
  descricao: string | null;
  autor: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Paginacao {
  total: number;
  pagina: number;
  limite: number;
  paginas: number;
}

export interface ListaLivrosResponse {
  livros: Livro[];
  paginacao: Paginacao;
}

export interface LoginResponse {
  mensagem: string;
  token: string;
  admin: Admin;
}

export interface LivroResponse {
  mensagem: string;
  livro: Livro;
}
