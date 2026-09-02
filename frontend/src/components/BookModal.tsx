import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import type { Livro } from '../types';
import { appConfig } from '../config/env';
import AccessibleModal from './AccessibleModal';

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
  const isbnRef = useRef<HTMLInputElement>(null);

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
    setErro('');
  }, [livro, aberto]);

  const handleFoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > appConfig.coverMaxSizeBytes) {
      setErro(`A imagem deve ter no máximo ${appConfig.coverMaxSizeMb}MB.`);
      e.target.value = '';
      return;
    }

    setErro('');
    setFoto(file);
    const reader = new FileReader();
    reader.onload = event => setPreview(event.target?.result as string);
    reader.readAsDataURL(file);
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

  const titulo = livro ? 'Editar Livro' : 'Novo Livro';

  return (
    <AccessibleModal
      onFechar={onFechar}
      labelledBy="book-modal-title"
      initialFocusRef={isbnRef}
    >
      <div className="modal-header">
        <h2 id="book-modal-title">{titulo}</h2>
        <button type="button" className="btn-fechar" onClick={onFechar} aria-label="Fechar">&times;</button>
      </div>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="campo">
          <label htmlFor="book-isbn">ISBN *</label>
          <input ref={isbnRef} id="book-isbn" name="isbn" type="text" value={isbn} onChange={e => setIsbn(e.target.value)} placeholder="978-85-359-0237-2" required />
        </div>
        <div className="campo">
          <label htmlFor="book-name">Nome do Livro *</label>
          <input id="book-name" name="nome" type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="O Alquimista" required />
        </div>
        <div className="campo">
          <label htmlFor="book-author">Autor *</label>
          <input id="book-author" name="autor" type="text" value={autor} onChange={e => setAutor(e.target.value)} placeholder="Paulo Coelho" required />
        </div>
        <div className="campo">
          <label htmlFor="book-description">Descrição</label>
          <textarea id="book-description" name="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Sinopse do livro…" />
        </div>
        <div className="campo">
          <label htmlFor="book-cover">Foto da Capa</label>
          <input
            id="book-cover"
            name="foto_capa"
            type="file"
            onChange={handleFoto}
            accept={appConfig.coverAllowedMimeTypes.join(',')}
            aria-describedby="book-cover-help"
          />
          <small id="book-cover-help">{appConfig.coverFormatsLabel}. Máx {appConfig.coverMaxSizeMb}MB.</small>
          {preview && <img src={preview} alt={`Pré-visualização da capa de ${nome || 'livro'}`} className="preview-img" />}
        </div>
        {erro && <p className="erro" role="alert">{erro}</p>}
        <div className="modal-botoes">
          <button type="button" onClick={onFechar} className="btn-cancelar">Cancelar</button>
          <button type="submit" disabled={salvando} className="btn-primary">
            {salvando ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </AccessibleModal>
  );
}
