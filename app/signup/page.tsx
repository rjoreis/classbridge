"use client";

import { useState } from "react";
import Link from "next/link";
import { signupTeacher } from "@/utils/signupTeacher";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await signupTeacher({ fullName, email, password });
      setMessage("Conta criada com sucesso!");
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        {/* Voltar button */}
        <div className="mb-4">
          <Link href="/" className="text-indigo-600 hover:underline">
            &larr; Voltar
          </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-6 text-center text-indigo-700">
          Registar Professor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Nome completo
            </label>
            <input
              type="text"
              id="fullName"
              className="mt-1 w-full border text-gray-700 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email institucional
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full border text-gray-700 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Palavra-passe
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full border text-gray-700 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-md transition text-white ${
              loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "A criar conta..." : "Criar Conta"}
          </button>
        </form>

        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
