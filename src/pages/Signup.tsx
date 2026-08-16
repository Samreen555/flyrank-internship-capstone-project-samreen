import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ArrowLeft, Lock, Mail, UserPlus } from 'lucide-react';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { pushToast } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signUp(username, email, password);
      pushToast('Your account has been created', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-xl rounded-3xl border border-gray-700 bg-gray-900/90 p-8 shadow-2xl shadow-black/20">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white">
            <UserPlus className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold text-white">Create an Account</h1>
          <p className="mt-2 text-gray-400">Sign up to save favorites and personalize your experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-2xl border border-rose-500 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <label className="block">
            <span className="text-sm font-medium text-gray-300">Username</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-gray-800 px-4 py-3 border border-gray-700">
              <UserPlus className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full bg-transparent text-gray-100 outline-none"
                placeholder="Choose a username"
                aria-label="Username"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-300">Email</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-gray-800 px-4 py-3 border border-gray-700">
              <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent text-gray-100 outline-none"
                placeholder="Enter your email"
                aria-label="Email"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-300">Password</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-gray-800 px-4 py-3 border border-gray-700">
              <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-gray-100 outline-none"
                placeholder="Create a password"
                aria-label="Password"
                required
              />
            </div>
          </label>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg font-semibold">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
          <Link to="/login" className="text-primary-400 hover:text-primary-200">
            Already have an account?
          </Link>
          <button type="button" onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-200">
            <ArrowLeft className="inline h-4 w-4" aria-hidden="true" />
            Back to search
          </button>
        </div>
      </div>
    </div>
  );
};
