'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { differenceInYears } from 'date-fns';
import Link from 'next/link';

export default function AddStudentPage() {
    const { id: classId } = useParams();
    const router = useRouter();
    const [age, setAge] = useState<number | null>(null);
    const [studentName, setStudentName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [responsibleName, setResponsibleName] = useState('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        console.log('DEBUG: user =', user);
        console.log('DEBUG: authError =', authError);

        if (authError || !user) {
            alert('Erro ao obter o utilizador atual. Por favor, autentique-se novamente.');
            setSaving(false);
            return;
        }

        const { error } = await supabase.from('students').insert([
            {
                class_id: classId,
                full_name: studentName,
                birthdate: birthDate,
                responsible_parent_name: responsibleName,
                notes,
            },
        ]);

        console.log('DEBUG: insert error =', error);

        setSaving(false);

        if (!error) {
            router.push(`/dashboard/teacher/class/${classId}/students`);
        } else {
            alert('Erro ao adicionar aluno: ' + error.message);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
                <h1 className="text-2xl font-bold text-indigo-700 mb-6">Adicionar Aluno</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome do Aluno</label>
                        <input
                            type="text"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 text-slate-700 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                        <input
                            type="date"
                            required
                            value={birthDate}
                            onChange={(e) => {
                                const date = e.target.value;
                                setBirthDate(date);
                                if (date) {
                                    setAge(differenceInYears(new Date(), new Date(date)));
                                } else {
                                    setAge(null);
                                }
                            }}
                            className="mt-1 block w-full border border-gray-300 text-slate-700 rounded px-3 py-2"
                        />
                        {age !== null && (
                            <p className="text-sm text-gray-500 mt-1">Idade: {age} anos</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome do Encarregado de Educação</label>
                        <input
                            type="text"
                            required
                            value={responsibleName}
                            onChange={(e) => setResponsibleName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 text-slate-700 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notas (opcional)</label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 text-slate-700 rounded px-3 py-2"
                            placeholder="Notas importantes sobre o aluno..."
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                        >
                            {saving ? 'A guardar...' : 'Guardar Aluno'}
                        </button>

                        <Link href={`/dashboard/teacher/class/${classId}/students`}>
                            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                                ← Voltar
                            </button>
                        </Link>
                    </div>
                </form>

            </div>
        </div>
    );
}
