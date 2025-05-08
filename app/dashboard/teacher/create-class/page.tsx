'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

export default function CreateClassPage() {
  const [grade, setGrade] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('Usuário não autenticado.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('classes').insert([
      {
        grade: parseInt(grade),
        class_name: className.toUpperCase(),
        teacher_id: user.id,
      },
    ]);

    if (error) {
      alert('Erro ao criar turma: ' + error.message);
    } else {
      setSuccessMessage(`Turma ${grade}º${className.toUpperCase()} criada com sucesso! Redirecionando...`);
      setTimeout(() => {
        router.push('/dashboard/teacher');
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar nova turma</h1>

        {successMessage ? (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-center font-medium">
            {successMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Ano (1-4)</label>
              <input
                type="number"
                min={1}
                max={4}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Letra da turma</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
                maxLength={1}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar turma'}
            </button>
          </form>
        )}

        <Link href="/dashboard/teacher" className="block text-center mt-6 text-green-600 hover:underline">
          Voltar
        </Link>
      </div>
    </div>
  );
}
