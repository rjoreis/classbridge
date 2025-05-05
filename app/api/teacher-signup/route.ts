import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { email, password, fullName } = await req.json();

  const domain = email.split('@')[1];

  // Check if the domain is in the allowed list
  const { data: allowed, error } = await supabaseAdmin
    .from('allowed_domains')
    .select('domain')
    .eq('domain', domain)
    .single();

  if (error || !allowed) {
    return NextResponse.json({ error: 'Erro ao criar conta.' }, { status: 403 });
  }

  // Create the user using the Admin API
  const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      fullName,
      role: 'teacher'
    }
  });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'User created', user });
}
