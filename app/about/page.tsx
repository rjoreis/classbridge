// app/about/page.tsx

import React from "react";
import Link from 'next/link';

// inside return

export default function AboutPage() {
    return (
      <div className="min-h-screen bg-white px-6 py-16 text-gray-800">
        <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-indigo-600 hover:underline">&larr; Voltar</Link>
          <h1 className="text-3xl font-bold mb-6 text-indigo-700">
            Sobre o Classbridge
          </h1>
          <p className="mb-4 text-lg">
            O Classbridge é uma plataforma projetada para fortalecer a comunicação entre professores e encarregados de educação,
            com foco na realidade do sistema educativo português. Acreditamos que a transparência e a empatia são essenciais para
            melhorar o ambiente escolar.
          </p>
  
          <p className="mb-4 text-lg">
            Professores podem partilhar informações e acontecimentos de forma anónima e segura, enquanto os pais têm acesso direto
            ao que se passa na sala de aula do seu educando — sem redes sociais, sem ruído, apenas educação.
          </p>
  
          <p className="text-lg">
            Estamos a começar por Portugal, mas com os olhos postos no mundo. Em breve, mais funcionalidades, idiomas e
            integrações serão disponibilizados!
          </p>
        </div>
      </div>
    );
  }
  