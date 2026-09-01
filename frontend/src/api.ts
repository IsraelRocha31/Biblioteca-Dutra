import type { LoginResponse, ListaLivrosResponse, LivroResponse, Admin } from './types';

const API = '';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(API + url, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || 'Erro na requisição');
  }

  return data as T;
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
  });
}

export async function getPerfil(): Promise<{ admin: Admin }> {
  return apiFetch<{ admin: Admin }>('/api/auth/perfil');
}

export async function getLivros(busca?: string): Promise<ListaLivrosResponse> {
  const params = busca ? `?busca=${encodeURIComponent(busca)}` : '';
  return apiFetch<ListaLivrosResponse>(`/api/livros${params}`);
}

export async function getLivro(id: number): Promise<LivroResponse> {
  return apiFetch<LivroResponse>(`/api/livros/${id}`);
}

export async function criarLivro(formData: FormData): Promise<LivroResponse> {
  return apiFetch<LivroResponse>('/api/livros', {
    method: 'POST',
    body: formData
  });
}

export async function atualizarLivro(id: number, formData: FormData): Promise<LivroResponse> {
  return apiFetch<LivroResponse>(`/api/livros/${id}`, {
    method: 'PUT',
    body: formData
  });
}

export async function deletarLivro(id: number): Promise<{ mensagem: string }> {
  return apiFetch<{ mensagem: string }>(`/api/livros/${id}`, {
    method: 'DELETE'
  });
}
