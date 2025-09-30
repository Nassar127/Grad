// Login.tsx

import React, { useState } from 'react';
import { api } from '../lib/api';
import { userStore } from '../lib/auth';

const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginIdentifier, setLoginIdentifier] = useState(''); // ✅ State for email or phone
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // ✅ State for phone number
  const [name, setName]   = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'login') {
        // ✅ Use the generic login identifier
        await api.login(loginIdentifier.trim(), password);
      } else {
        // ✅ Pass email, phone, password, and name to signup
        await api.signup(email.trim(), phone.trim(), password, name.trim() || undefined);
      }
      window.location.href = '/'; 
    } catch (err: any) {
      setError(err.message?.replace(/[\r\n]+/g, ' ') || 'Request failed');
    } finally {
      setBusy(false);
    }
  };

  const u = userStore.get();

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            {mode === 'login' ? 'Login' : 'Create account'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'login'
              ? 'Use your MediLearn account to continue.'
              : 'Sign up with your email or phone number.'}
          </p>

          {u ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700 text-sm">You are already logged in as <b>{u.email}</b>.</p>
            </div>
          ) : null}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
            )}

            {mode === 'login' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
                <input
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Sign in using Email or Phone number"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Your phone number"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {busy ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <div className="text-sm text-gray-600 mt-4 text-center">
            {mode === 'login' ? (
              <>
                Don’t have an account?{' '}
                <button className="text-blue-700 underline" onClick={() => setMode('signup')}>
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button className="text-blue-700 underline" onClick={() => setMode('login')}>
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;