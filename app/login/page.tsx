'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from 'utils/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Step 1: Login using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (authError || !authData.user) {
      setError(authError?.message || 'Erro ao iniciar sessão.');
      setLoading(false);
      return;
    }

    const userEmail = authData.user.email;

    // Step 2: Check if the user is a teacher
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (teacher && !teacherError) {
      router.push('/dashboard/teacher');
    } else {
      // 🔜 Add parent check here later
      setError('Utilizador não autorizado ou função não reconhecida.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl text-indigo-600 font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-md mb-4 text-slate-500 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-md mb-6 text-slate-500 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? 'A entrar...' : 'Entrar'}
        </button>

        <div className="mt-4 text-center">
          <Link href="/" className="text-indigo-600">&larr; Voltar</Link>
        </div>
      </form>
    </div>
  );
}
