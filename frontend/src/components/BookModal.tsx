import { useState, useEffect, FormEvent } from 'react';
import type { Livro } from '../types';

interface Props {
  aberto: boolean;
  livro: Livro | null;
  onFechar: () => void;
  onSalvar: (formData: FormData) => Promise<void>;
}

export default function BookModal({ aberto, livro, onFechar, onSalvar }: Props) {
  const [isbn, setIsbn] = useState('');
  const [nome, setNome] = useState('');
  const [autor, setAutor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (livro) {
      setIsbn(livro.isbn);
      setNome(livro.nome);
      setAutor(livro.autor);
      setDescricao(livro.descricao || '');
      setPreview(livro.foto_capa);
    } else {
      setIsbn('');
      setNome('');
      setAutor('');
      setDescricao('');
      setFoto(null);
      setPreview(null);
    }
  }, [livro, aberto]);

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setErro('A imagem deve ter no máximo 4MB.');
        e.target.value = '';
        return;
      }
      setErro('');
      setFoto(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    const formData = new FormData();
    formData.append('isbn', isbn);
    formData.append('nome', nome);
    formData.append('autor', autor);
    formData.append('descricao', descricao);
    if (foto) formData.append('foto_capa', foto);

    try {
      await onSalvar(formData);
      onFechar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro desconhecido ao salvar o livro.');
    } finally {
      setSalvando(false);
    }
  };

  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal-box" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>{livro ? 'Editar Livro' : 'Novo Livro'}</h3>
          <button type="button" className="btn-fechar" onClick={onFechar} aria-label="Fechar">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="campo">
            <label>ISBN *</label>
            <input type="text" value={isbn} onChange={e => setIsbn(e.target.value)} placeholder="978-85-359-0237-2" required />
          </div>
          <div className="campo">
            <label>Nome do Livro *</label>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="O Alquimista" required />
          </div>
          <div className="campo">
            <label>Autor *</label>
            <input type="text" value={autor} onChange={e => setAutor(e.target.value)} placeholder="Paulo Coelho" required />
          </div>
          <div className="campo">
            <label>Descrição</label>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Sinopse do livro..." />
          </div>
          <div className="campo">
            <label>Foto da Capa</label>
            <input type="file" onChange={handleFoto} accept="image/jpeg,image/png,image/webp" />
            <small>JPG, PNG ou WebP. Máx 4MB.</small>
            {preview && <img src={preview} alt="Preview" className="preview-img" />}
          </div>
          {erro && <p className="erro" role="alert">{erro}</p>}
          <div className="modal-botoes">
            <button type="button" onClick={onFechar} className="btn-cancelar">Cancelar</button>
            <button type="submit" disabled={salvando} className="btn-primary">
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
