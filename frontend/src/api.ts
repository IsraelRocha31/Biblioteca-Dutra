import type { LoginResponse, ListaLivrosResponse, LivroResponse, Admin } from './types';
import { appConfig } from './config/env';

const API = appConfig.apiBasePath;

function getToken(): string | null {
  return localStorage.getItem(appConfig.authTokenStorageKey);
}

export function setToken(token: string) {
  localStorage.setItem(appConfig.authTokenStorageKey, token);
}

export function clearToken() {
  localStorage.removeItem(appConfig.authTokenStorageKey);
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

  try {
    const res = await fetch(API + url, {
      ...options,
      headers: { ...headers, ...(options.headers as Record<string, string>) }
    });

    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await res.json()
      : { erro: await res.text() };

    if (!res.ok) {
      throw new Error(data.erro || `Erro HTTP ${res.status}`);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Não foi possível comunicar com o servidor.');
  }
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
  });
}

export async function getPerfil(): Promise<{ admin: Admin }> {
  return apiFetch<{ admin: Admin }>('/auth/perfil');
}

export async function getLivros(busca?: string): Promise<ListaLivrosResponse> {
  const params = new URLSearchParams({ limit: String(appConfig.booksDefaultPageSize) });
  if (busca) params.set('busca', busca);
  return apiFetch<ListaLivrosResponse>(`/livros?${params.toString()}`);
}

export async function getLivro(id: number): Promise<LivroResponse> {
  return apiFetch<LivroResponse>(`/livros/${id}`);
}

export async function criarLivro(formData: FormData): Promise<LivroResponse> {
  return apiFetch<LivroResponse>('/livros', {
    method: 'POST',
    body: formData
  });
}

export async function atualizarLivro(id: number, formData: FormData): Promise<LivroResponse> {
  return apiFetch<LivroResponse>(`/livros/${id}`, {
    method: 'PUT',
    body: formData
  });
}

export async function deletarLivro(id: number): Promise<{ mensagem: string }> {
  return apiFetch<{ mensagem: string }>(`/livros/${id}`, {
    method: 'DELETE'
  });
}
