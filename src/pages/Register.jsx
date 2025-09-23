import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('/api/users/register', form);
      const { token, user } = res.data;
      if (!token) {
        setMessage('Registration succeeded but no token returned');
        return;
      }
      localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      setMessage(res.data.message || 'Registered');
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/main');
      }
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900">Create your account</h2>
        <p className="text-center text-gray-500 mb-4 text-sm">Please fill in the information below to register.</p>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your username"
            className="appearance-none block w-full rounded-md border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
            required
            autoComplete="username"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="appearance-none block w-full rounded-md border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="appearance-none block w-full rounded-md border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gray-900 text-white py-2.5 rounded-md font-medium hover:bg-black transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        {message && (
          <p className={`text-center text-sm mt-4 ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
        )}

        <div className="text-center mt-4">
          <span className="text-gray-500 text-sm">Have an account? </span>
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 font-semibold text-sm hover:underline ml-1"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
