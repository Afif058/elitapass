"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegisterCommercant() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    nom_boutique: "",
  });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setErreur("");

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setErreur(error.message);
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase.from("commercants").insert({
      id: data.user?.id,
      email: form.email,
      nom_boutique: form.nom_boutique,
      abonnement: "basic",
    });

    if (dbError) {
      setErreur(dbError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-purple-600 mb-6 text-center">
          Créer mon compte commerçant
        </h1>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom de votre boutique"
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-400"
            value={form.nom_boutique}
            onChange={(e) => setForm({ ...form, nom_boutique: e.target.value })}
          />
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
            {loading ? "Création en cours..." : "Créer mon compte"}
          </button>
        </div>
      </div>
    </main>
  );
}
