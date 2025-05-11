import { useState, useRef, useEffect } from 'react';
import '../upload.css';

interface UploadProps {
  token: string;
}

export default function UploadComponent({ token }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limpar o URL do objeto quando o componente desmontar ou quando o arquivo mudar
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Criar preview quando um arquivo for selecionado
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      // Para PDFs ou outros tipos, podemos usar um ícone genérico
      setPreview(null);
    }
  }, [file]);

  // Manipuladores de eventos de drag and drop
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (!files[0].type.startsWith('image/')) {
        setError('Por favor, envie apenas imagens.');
        setFile(null);
        setPreview(null);
        return;
      }
      setFile(files[0]);
      setError('');
      setSuccess('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (!e.target.files[0].type.startsWith('image/')) {
        setError('Por favor, envie apenas imagens.');
        setFile(null);
        setPreview(null);
        return;
      }
      setFile(e.target.files[0]);
      setError('');
      setSuccess('');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Selecione uma imagem para enviar.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    setExtractedText('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:3000/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok && data.document) {
        setSuccess('Imagem enviada e texto extraído com sucesso!');
        setExtractedText(data.document.extractedText || '');
      } else {
        setError(data.message || 'Erro ao enviar imagem');
      }
      
    } catch (err: any) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-center">
      <div className="upload-card">
        <h2 className="upload-title">Upload de Documento</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <div
            className={`upload-dropzone${isDragging ? ' dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="upload-preview-img"
                />
              ) : (
                <>
                  <p className="upload-dropzone-text">Arraste e solte sua imagem aqui</p>
                  <p className="upload-dropzone-subtext">ou clique para selecionar arquivos</p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          {file && (
            <div className="upload-file-row">
              <span className="upload-file-name">{file.name}</span>
              <button
                type="button"
                className="upload-remove-btn"
                onClick={() => { setFile(null); setPreview(null); }}
              >
                Remover
              </button>
            </div>
          )}
          {error && <div className="upload-error">{error}</div>}
          {success && <div className="upload-success">{success}</div>}
          <button
            type="submit"
            className="upload-btn"
            disabled={loading || !file}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
        {extractedText && (
          <div className="upload-extracted">
            <h3 className="upload-extracted-title">Texto extraído:</h3>
            <pre className="upload-extracted-pre">{extractedText}</pre>
          </div>
        )}
      </div>
    </div>
  );
}