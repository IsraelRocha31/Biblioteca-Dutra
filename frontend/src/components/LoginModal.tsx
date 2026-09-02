import { FormEvent, useRef, useState } from 'react';
import { login } from '../api';
import { appConfig } from '../config/env';
import type { Admin } from '../types';
import AccessibleModal from './AccessibleModal';

interface Props {
  aberto: boolean;
  onLogin: (admin: Admin, token: string) => void;
  onFechar: () => void;
}

export default function LoginModal({ aberto, onLogin, onFechar }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const data = await login(email, senha);
      onLogin(data.admin, data.token);
      setEmail('');
      setSenha('');
      onFechar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  if (!aberto) return null;

  return (
    <AccessibleModal
      onFechar={onFechar}
      labelledBy="login-modal-title"
      initialFocusRef={emailRef}
    >
      <div className="modal-header">
        <h2 id="login-modal-title">Acesso Restrito</h2>
        <button type="button" className="btn-fechar" onClick={onFechar} aria-label="Fechar">&times;</button>
      </div>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="campo">
          <label htmlFor="login-email">Email</label>
          <input
            ref={emailRef}
            id="login-email"
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={appConfig.superAdminEmail}
            autoComplete="username"
            spellCheck={false}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="login-password">Senha</label>
          <input
            id="login-password"
            name="senha"
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="Sua senha"
            autoComplete="current-password"
            required
          />
        </div>
        {erro && <p className="erro" role="alert">{erro}</p>}
        <div className="modal-botoes">
          <button type="button" onClick={onFechar} className="btn-cancelar">Cancelar</button>
          <button type="submit" disabled={carregando} className="btn-primary">
            {carregando ? 'Entrando…' : 'Entrar'}
          </button>
        </div>
      </form>
    </AccessibleModal>
  );
}
