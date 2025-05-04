// components/NavBar.tsx
'use client';

import Link from 'next/link';
import React from 'react';

export default function NavBar() {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">Classbridge</h1>
        <nav className="space-x-6 text-sm">
          <Link href="/login" className="hover:text-indigo-600">Entrar</Link>
          <Link href="/signup" className="hover:text-indigo-600">Registar Professor</Link>
          <Link href="/request-school" className="hover:text-indigo-600">Pedir Agrupamento</Link>
        </nav>
      </div>
    </header>
  );
}
