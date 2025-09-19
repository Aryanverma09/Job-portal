import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3000/api/users/login', form);
      const { token, user } = res.data;
      if (!token) {
        setMessage('Login failed: no token received');
        return;
      }
      // save token and user
      localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      setMessage(res.data.message || 'Login successful');
      // redirect to main page
      navigate('/main');
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Welcome back</h2>
        <p className="text-gray-500 mb-8 text-sm">Welcome back! Please enter your details.</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <div className="flex justify-between items-center">
           
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gray-900 text-white py-2.5 rounded-md font-medium hover:bg-black transition ${loading ? 'opacity-50 cursor-not-allowed' : '' }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}

        <div className="text-center mt-6">
          <span className="text-gray-500 text-sm">Don&apos;t have an account? </span>
          <button
            onClick={() => navigate('/register')}
            className="text-indigo-600 font-semibold text-sm hover:underline focus:outline-none ml-1"
          >
            Sign up for free
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
