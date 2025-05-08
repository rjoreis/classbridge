export const signupTeacher = async (form: { fullName: string; email: string; password: string }) => {
  const res = await fetch('/api/teacher-signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro no registo');
  return data;
};
