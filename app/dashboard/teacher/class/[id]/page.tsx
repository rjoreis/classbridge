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
  const [class_mood, setMood] = useState<string | null>(null);
  const [engagement, setEngagement] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkinId, setCheckinId] = useState<string | null>(null);
  const [noClass, setNoClass] = useState(false);

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
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      console.log("USER ID: ", user?.id);
      console.log("Get session: " + await supabase.auth.getSession());
      const userEmail = user?.email;
      console.log("user email: " + userEmail);
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
        setMood(data.class_mood?.toLowerCase() || null);
        setEngagement(data.engagement);
        setNotes(data.notes || '');
        setCheckinId(data.id);
        setNoClass(data.no_class || false);
      }

      setLoading(false);
    };

    fetchCheckin();
  }, [classId, date]);

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700 text-lg">Carregando dados...</p>
    </div>
  );
}


  const handleSave = async () => {
    setSaving(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Failed to get user', userError);
      setSaving(false);
      return;
    }

    const { data: teacherData, error: teacherError } = await supabase
      .from('teachers')
      .select('id')
      .eq('email', user.email)
      .single();

    if (teacherError || !teacherData) {
      console.error('Failed to fetch teacher id', teacherError);
      setSaving(false);
      return;
    }

    const payload = {
      class_id: classId,
      teacher_id: teacherData.id,
      date,
      class_mood: noClass ? null : class_mood?.toLowerCase() || null,
      engagement: noClass ? null : engagement,
      notes: noClass ? '' : notes,
      no_class: noClass,
    };

    console.log('Inserting checkin:', payload);

    try {
      if (checkinId) {
        const { error: updateError } = await supabase
          .from('class_checkins')
          .update(payload)
          .eq('id', checkinId);

        if (updateError) {
          console.error('Update failed:', updateError);
        }
      } else {
        const { data, error: insertError } = await supabase
          .from('class_checkins')
          .insert(payload)
          .select()
          .single();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }

    setSaving(false);
  };

  const moods = [
    { label: '😃', value: 'happy' },
    { label: '😐', value: 'neutral' },
    { label: '😟', value: 'sad' },
  ];

  const engagementOptions = ['Calmo', 'Maioritariamente focado', 'Disruptivo'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 text-lg">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">
          Turma {classData?.year}º {classData?.class_name}
        </h1>
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
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={noClass}
              onChange={() => setNoClass(!noClass)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="text-gray-700 font-medium">Não houve aula neste dia</span>
          </label>
        </div>

      <fieldset disabled={noClass} className={noClass ? 'opacity-50 pointer-events-none' : ''}>
        <div className="mb-4">
          <p className="text-gray-700 font-medium mb-1">Humor da turma:</p>
          <div className="flex gap-4">
            {moods.map((m) => {
              let selectedBg = '';
              if (class_mood === m.value) {
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
                  className={`text-2xl px-4 py-2 rounded border transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow ${selectedBg} cursor-pointer`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>


      <fieldset disabled={noClass} className={noClass ? 'opacity-50 pointer-events-none' : ''}>
        <div className="mb-4">
          <p className="text-gray-700 font-medium mb-1">Comportamento / Envolvimento:</p>
          <div className="flex flex-wrap gap-4">
            {engagementOptions.map((option) => {
              const isSelected = engagement === option;
              return (
                <button
                  key={option}
                  onClick={() => setEngagement(option)}
                  className={`px-4 py-2 rounded border transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-800 border-gray-300'
                  } cursor-pointer`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>


      <fieldset disabled={noClass} className={noClass ? 'opacity-50 pointer-events-none' : ''}>
        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Notas (opcional):</span>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 text-slate-500 rounded px-3 py-2"
            placeholder="Escreva alguma observação..."
          />
        </label>
      </fieldset>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {saving ? 'A guardar...' : 'Guardar'}
        </button>
        <Link href="/dashboard/teacher">
          <button className="mb-4 bg-gray-300 ml-3 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
            ← Voltar
          </button>
        </Link>
      </div>
    </div>
  );
}
