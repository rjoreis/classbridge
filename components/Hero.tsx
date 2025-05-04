// components/Hero.tsx

import Link from 'next/link';
import React from 'react';

export default function Hero() {
  return (
    <section className="py-20 px-4 text-center bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-indigo-700">
          Aproximar Professores e Encarregados de Educação
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Uma plataforma simples e segura que permite aos professores partilhar, de forma anónima,
          os desafios e acontecimentos do dia a dia escolar com os pais e encarregados de educação.
        </p>
        <Link
          href="/about"
          className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Saber Mais
        </Link>
      </div>
    </section>
  );
}
