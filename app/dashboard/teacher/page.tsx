// app/dashboard/teacher/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>('Olá');

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 7 && hour < 13) return 'Bom dia';
        if (hour >= 13 && hour < 20) return 'Boa tarde';
        return 'Boa noite';
      };

      if (user?.email) {
        const { data, error } = await supabase
          .from('teachers')
          .select('full_name')
          .eq('email', user.email)
          .single();

        if (!error && data?.full_name) {
          setFirstName(data.full_name.split(' ')[0]);
        } else {
          setFirstName('Usuário');
        }
      }

      setGreeting(getGreeting());

      if (error || !user) {
        router.push('/login');
      } else {
        setUser(user);
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <div className="p-6 text-center">A carregar...</div>;
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">
          {greeting}, {firstName}!
        </h1>
        <p className="mb-6 text-gray-700">Esta é a área reservada a professores.</p>
        
        <Link href="/dashboard/teacher/create-class">
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Criar nova turma
            </button>
        </Link>
        
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Terminar Sessão
        </button>
      </div>
    </div>
  );
}
