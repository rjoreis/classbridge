// app/page.tsx
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <NavBar />
      <Hero />
    </main>
  );
}
