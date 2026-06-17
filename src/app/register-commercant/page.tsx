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
    code_promo: "",
  });
  const [choix, setChoix] = useState<"essai" | "direct">("essai");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setErreur("");

    // Vérifier code promo si renseigné
    let dureeBonus = 0;
    if (form.code_promo) {
      const { data: codeData } = await supabase
        .from("codes_promo")
        .select("*")
        .eq("code", form.code_promo.toUpperCase())
        .eq("utilise", false)
        .single();

      if (!codeData) {
        setErreur("Code promo invalide ou déjà utilisé");
        setLoading(false);
        return;
      }
      dureeBonus = codeData.duree_jours;

      // Marquer le code comme utilisé
      await supabase
        .from("codes_promo")
        .update({ utilise: true })
        .eq("code", form.code_promo.toUpperCase());
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setErreur(error.message);
      setLoading(false);
      return;
    }

    const trialEnd = new Date();
    if (choix === "essai") {
      trialEnd.setDate(trialEnd.getDate() + 14 + dureeBonus);
    } else if (dureeBonus > 0) {
      trialEnd.setDate(trialEnd.getDate() + dureeBonus);
    }

    const { error: dbError } = await supabase.from("commercants").insert({
      id: data.user?.id,
      email: form.email,
      nom_boutique: form.nom_boutique,
      abonnement: choix === "essai" || dureeBonus > 0 ? "premium" : "basic",
      trial_actif: choix === "essai" || dureeBonus > 0,
      trial_end: choix === "essai" || dureeBonus > 0 ? trialEnd.toISOString() : null,
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

          {/* Choix essai ou direct */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setChoix("essai")}
              className={`p-4 rounded-2xl border-2 transition text-left ${choix === "essai" ? "border-purple-600 bg-purple-50" : "border-gray-200"}`}
            >
              <p className={`font-bold text-sm ${choix === "essai" ? "text-purple-600" : "text-gray-700"}`}>🎁 Essai gratuit</p>
              <p className="text-gray-400 text-xs mt-1">14 jours Premium offerts</p>
            </button>
            <button
              onClick={() => setChoix("direct")}
              className={`p-4 rounded-2xl border-2 transition text-left ${choix === "direct" ? "border-purple-600 bg-purple-50" : "border-gray-200"}`}
            >
              <p className={`font-bold text-sm ${choix === "direct" ? "text-purple-600" : "text-gray-700"}`}>⚡ S'abonner direct</p>
              <p className="text-gray-400 text-xs mt-1">Dès 19,90€/mois</p>
            </button>
          </div>

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
          <input
            type="text"
            placeholder="Code promo (optionnel)"
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-400"
            value={form.code_promo}
            onChange={(e) => setForm({ ...form, code_promo: e.target.value })}
          />

          {erreur && (
            <p className="text-red-500 text-sm text-center">{erreur}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Création en cours..." : choix === "essai" ? "Démarrer l'essai gratuit →" : "Créer mon compte →"}
          </button>
        </div>
      </div>
    </main>
  );
}