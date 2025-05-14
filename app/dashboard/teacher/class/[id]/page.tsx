'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ClassPage() {
  const { id: classId } = useParams();
  const [classData, setClassName] = useState<{ class_name: string; year: string } | null>(null);
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [mood, setMood] = useState<string | null>(null);
  const [engagement, setEngagement] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkinId, setCheckinId] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassName = async () => {
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id, class_name, grade')
        .eq('id', classId)
        .single();
        if (!classError && classData) {
            setClassName({ class_name: classData.class_name, year: classData.grade });
        }          
    };

    fetchClassName();
  }, [classId]);

  useEffect(() => {
    const fetchCheckin = async () => {
      setLoading(true);
      setMood(null);
      setEngagement(null);
      setNotes('');
      setCheckinId(null);

      const { data, error } = await supabase
        .from('class_checkins')
        .select('*')
        .eq('class_id', classId)
        .eq('date', date)
        .single();

      if (data) {
        setMood(data.mood);
        setEngagement(data.engagement);
        setNotes(data.notes || '');
        setCheckinId(data.id);
      }

      setLoading(false);
    };

    fetchCheckin();
  }, [classId, date]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      class_id: classId,
      date,
      mood,
      engagement,
      notes,
    };

    if (checkinId) {
      await supabase.from('class_checkins').update(payload).eq('id', checkinId);
    } else {
      const { data } = await supabase.from('class_checkins').insert(payload).select().single();
      if (data) setCheckinId(data.id);
    }

    setSaving(false);
  };

  const moods = [
    { label: '😃', value: 'happy' },
    { label: '😐', value: 'neutral' },
    { label: '😟', value: 'sad' },
  ];

  const engagementOptions = [
    'Calmo',
    'Maioritariamente focado',
    'Disruptivo',
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">Turma {classData?.year}º {classData?.class_name}</h1>
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Data:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 text-slate-500 rounded px-3 py-2"
          />
        </label>

        <div className="mb-4">
          <p className="text-gray-700 font-medium mb-1">Humor da turma:</p>
          <div className="flex gap-4">
            {moods.map((m) => {
              let selectedBg = '';
              if (mood === m.value) {
                if (m.value === 'happy') selectedBg = 'bg-green-600 text-white';
                if (m.value === 'neutral') selectedBg = 'bg-yellow-400 text-white';
                if (m.value === 'sad') selectedBg = 'bg-red-500 text-white';
              } else {
                selectedBg = 'bg-white text-gray-800 border-gray-300';
              }

              return (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`text-2xl px-4 py-2 rounded border ${selectedBg}`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 font-medium mb-1">Comportamento / Envolvimento:</p>
          <div className="flex flex-wrap gap-4">
            {engagementOptions.map((option) => (
              <button
                key={option}
                onClick={() => setEngagement(option)}
                className={`px-4 py-2 rounded border ${
                  engagement === option
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-800 border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Notas (opcional):</span>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Escreva alguma observação..."
          />
        </label>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {saving ? 'A guardar...' : 'Guardar'}
        </button>
        <Link href="/dashboard/teacher">
            <button className="mb-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                ← Voltar
            </button>
        </Link>
      </div>
    </div>
  );
}
