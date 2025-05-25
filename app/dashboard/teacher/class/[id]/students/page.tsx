'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';
import { format, differenceInYears } from 'date-fns';

interface Student {
  id: string;
  class_id: string;
  full_name: string;
  birthdate: string;
  responsible_parent_name: string;
  notes?: string;
}

export default function StudentsPage() {
  const { id: classId } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', classId)
        .order('full_name', { ascending: true });

      if (!error && data) {
        setStudents(data);
      }

      setLoading(false);
    };

    fetchStudents();
  }, [classId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-indigo-700">Alunos da Turma</h1>
          <Link href={`/dashboard/teacher/class/${classId}/add-student`}>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              ➕ Adicionar Aluno
            </button>
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">A carregar alunos...</p>
        ) : students.length === 0 ? (
          <p className="text-gray-500">Nenhum aluno adicionado ainda.</p>
        ) : (
          <div className="space-y-4">
            {students.map((student) => {
              const age = differenceInYears(new Date(), new Date(student.birthdate));
              return (
                <div key={student.id} className="border border-gray-300 rounded p-4 bg-gray-50">
                  <p className="font-semibold text-gray-800">{student.full_name} ({age} anos)</p>
                  <p className="text-sm text-gray-600">
                    Data de nascimento: {format(new Date(student.birthdate), 'dd/MM/yyyy')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Encarregado de educação: {student.responsible_parent_name}
                  </p>
                  {student.notes && (
                    <p className="text-sm text-gray-500 italic mt-1">Nota: {student.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <Link href={`/dashboard/teacher/class/${classId}`}>
        <button className="mt-6 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
          ← Voltar
        </button>
      </Link>
      </div>
    </div>
  );
}
