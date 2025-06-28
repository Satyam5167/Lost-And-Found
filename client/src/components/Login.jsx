import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NET from 'vanta/src/vanta.net';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isAuthenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState('');

  if (typeof window !== 'undefined' && !document.vantaLoginInit) {
    const el = document.getElementById('vanta');
    if (el) {
      NET({ el: '#vanta', color: 0xfacc15, backgroundColor: 0x000000 });
      document.vantaLoginInit = true;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    const { email, password } = form;
    if (isAuthenticating) return;

    setAuthenticating(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        throw new Error(data.message || '❌ Failed to authenticate');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" id="vanta">
      <div className="bg-white/60 backdrop-blur p-8 rounded-xl w-96 space-y-4 text-center">
        <h2 className="text-xl font-bold">Login</h2>
        {error && <p className="text-red-500">{error}</p>}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full h-12 p-3 rounded-xl border placeholder:text-gray-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full h-12 p-3 rounded-xl border placeholder:text-gray-500"
        />

        <button
          onClick={handleLogin}
          disabled={isAuthenticating}
          className="w-full p-3 bg-yellow-400 rounded-xl text-gray-700"
        >
          {isAuthenticating ? 'Loading...' : 'Submit'}
        </button>

        <hr className="border-t border-gray-400" />
        <p>Don't have an account?</p>
        <a href="/register" className="text-blue-600 underline">
          Sign up
        </a>
      </div>
    </div>
  );
};

export default Login;
