import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import DocumentChat from '../components/DocumentChat';
import './History.css';

interface HistoryProps {
  token: string;
}

interface Document {
  id: string;
  fileName: string;
  createdAt: string;
  status: string;
  extractedText?: string;
  imageBase64?: string;
}

const History: React.FC<HistoryProps> = ({ token }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:3000/documents/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao buscar histórico');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  // Função para baixar imagem + texto extraído em um zip
  const handleDownload = async (doc: Document) => {
    const zip = new JSZip();

    // Adicionar a imagem do base64
    if (doc.imageBase64) {
      // Converter base64 para blob
      const byteString = atob(doc.imageBase64.split(',')[1]);
      const mimeString = doc.imageBase64.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const imageBlob = new Blob([ab], { type: mimeString });
      zip.file(doc.fileName, imageBlob);
    }

    // Adicionar o texto extraído como .txt
    if (doc.extractedText) {
      zip.file(
        doc.fileName.replace(/\.[^/.]+$/, '') + '.txt',
        doc.extractedText
      );
    }

    // Gerar o zip e baixar
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${doc.fileName.replace(/\.[^/.]+$/, '')}.zip`);
  };

  return (
    <div className="history-center">
      <h1 className="history-title">Histórico de Documentos</h1>
      <div className="history-list">
        {documents.map((doc) => (
          <div className="history-card" key={doc.id}>
            <img
              src={doc.imageBase64 || '/placeholder.png'}
              alt={doc.fileName}
              className="history-card-img"
            />
            <div className="history-card-info">
              <div className="history-card-title">{doc.fileName}</div>
              <div className="history-card-date">{new Date(doc.createdAt).toLocaleString()}</div>
            </div>
            <div className="history-card-actions">
              <button
                className="history-btn"
                onClick={() => setOpenId(openId === doc.id ? null : doc.id)}
              >
                {openId === doc.id ? 'Fechar' : 'Ver'}
              </button>
              <button
                className="history-btn"
                onClick={() => handleDownload(doc)}
              >
                Baixar
              </button>
            </div>
            {openId === doc.id && (
              <div className="history-card-details">
                {doc.extractedText && (
                  <div className="upload-extracted" style={{ marginTop: '1rem', width: '100%' }}>
                    <h3 className="upload-extracted-title">Texto extraído:</h3>
                    <pre className="upload-extracted-pre">{doc.extractedText}</pre>
                  </div>
                )}
                <div className="chat-container" style={{ marginTop: '1rem' }}>
                  <h3 className="chat-title">Chat com IA</h3>
                  <DocumentChat documentId={doc.id} token={token} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History; 