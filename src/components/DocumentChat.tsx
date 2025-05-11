import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './DocumentChat.css';

interface Message {
  id: string;
  query: string;
  response: string;
  createdAt: string;
}

interface DocumentChatProps {
  documentId: string;
  token: string;
}

const DocumentChat: React.FC<DocumentChatProps> = ({ documentId, token }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [documentId]);

  const fetchMessages = async () => {
    try {
      setError(null);
      const response = await axios.get(
        `http://localhost:3000/documents/${documentId}/interactions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setMessages(response.data.data);
      } else {
        setError('Erro ao carregar mensagens');
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      setError('Não foi possível carregar o histórico de mensagens');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `http://localhost:3000/documents/${documentId}/ask`,
        { question: newQuestion },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMessages(prev => [response.data.data, ...prev]);
        setNewQuestion('');
      } else {
        setError('Erro ao enviar pergunta');
      }
    } catch (error: any) {
      console.error('Erro ao enviar pergunta:', error);
      setError(error.response?.data?.message || 'Erro ao enviar pergunta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-chat">
      {error && (
        <div className="chat-error">
          {error}
        </div>
      )}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            Nenhuma mensagem ainda. Faça uma pergunta sobre o documento!
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="chat-message">
              <div className="message-user">
                <strong>Você:</strong>
                <p>{message.query}</p>
              </div>
              <div className="message-ai">
                <strong>Assistente:</strong>
                <p>{message.response}</p>
              </div>
              <div className="message-time">
                {new Date(message.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Digite sua pergunta sobre o documento..."
          disabled={loading}
          className="chat-input"
        />
        <button type="submit" disabled={loading} className="chat-submit">
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default DocumentChat; 