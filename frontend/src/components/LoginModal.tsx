import { useState, FormEvent } from 'react';
import { login } from '../api';
import type { Admin } from '../types';

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
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>Acesso Restrito</h3>
          <button className="btn-fechar" onClick={onFechar}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="campo">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@alfredodutra.edu.br"
              required
            />
          </div>
          <div className="campo">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>
          {erro && <p className="erro">{erro}</p>}
          <div className="modal-botoes">
            <button type="button" onClick={onFechar} className="btn-cancelar">Cancelar</button>
            <button type="submit" disabled={carregando} className="btn-primary">
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
