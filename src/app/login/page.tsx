"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setErreur("");

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setErreur("Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-purple-600 mb-6 text-center">
          Connexion commerçant
        </h1>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Votre email"
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-400"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {erreur && (
            <p className="text-red-500 text-sm text-center">{erreur}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <p className="text-center text-gray-500 text-sm">
            Pas encore de compte ?{" "}
            <a href="/register-commercant" className="text-purple-600 font-bold">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
