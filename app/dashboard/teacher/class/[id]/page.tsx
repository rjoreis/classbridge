'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

export default function ClassDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [classInfo, setClassInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar turma:', error.message);
        return;
      }

      setClassInfo(data);
      setLoading(false);
    };

    fetchClass();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">A carregar informações da turma...</div>;
  }

  if (!classInfo) {
    return <div className="p-6 text-center text-red-600">Turma não encontrada.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">
          Turma {classInfo.grade}º - {classInfo.class_name}
        </h1>
        <p className="text-gray-700 mb-4">ID da Turma: {classInfo.id}</p>

        {/* Add more class-related controls/info here */}

        <Link href="/dashboard/teacher">
          <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Voltar ao Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
