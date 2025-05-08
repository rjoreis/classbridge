import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();
    console.log('[API] Received signup request:', { email, fullName });

    const domain = email.split('@')[1];
    console.log('[API] Extracted domain:', domain);

    // Check allowed domain
    const { data: allowed, error: domainError } = await supabaseAdmin
      .from('allowed_domains')
      .select('domain')
      .eq('domain', domain)
      .single();

    if (domainError || !allowed) {
      return NextResponse.json({ error: 'Email domain not allowed.' }, { status: 403 });
    }

    // Create auth user
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (createError || !user) {
      console.error('[API] Supabase user creation error:', createError);
      return NextResponse.json({ error: 'Error creating auth user.' }, { status: 500 });
    }

    // Add to teachers table
    const { error: insertError } = await supabaseAdmin.from('teachers').insert({
      id: user.user.id,
      email,
      full_name: fullName,
      school_domain: domain,
      role: 'teacher',
      verified: false
    });

    if (insertError) {
      console.error('[API] Error inserting into teachers:', insertError);
      return NextResponse.json({ error: 'User created but failed to save teacher info.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User created and teacher added.' });

  } catch (err) {
    console.error('[API] Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}
