import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onLoginClick: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await axios.post('http://localhost:3000/users/register', { name, email, password });
      if (res.status === 201 || res.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
      } else {
        setError(res.data.message || 'Erro ao cadastrar');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-6 text-center">Cadastro</h1>
        <input
          type="text"
          placeholder="Nome"
          className="w-full p-2 mb-4 border rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-2 text-center">Cadastro realizado com sucesso!</div>}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        <div className="register-login">
          Já tem uma conta?{' '}
          <span className="login-link" onClick={onLoginClick}>
            Entrar
          </span>
        </div>
      </form>
    </div>
  );
}; 