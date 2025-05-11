import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
  onRegisterClick: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/auth/login', { email, password });
      if (res.data && res.data.access_token) {
        onLoginSuccess(res.data.access_token);
      } else {
        setError(res.data.message || 'Erro ao fazer login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <div className="login-register">
          Not a member yet?{' '}
          <span className="register-link" onClick={onRegisterClick}>
            Register!
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login; 