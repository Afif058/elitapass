"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function InscriptionClient() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refId = searchParams.get("ref");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    age: "",
    pseudo: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setErreur("");

    if (!form.nom || !form.prenom || !form.pseudo) {
      setErreur("Nom, prénom et pseudo sont obligatoires");
      setLoading(false);
      return;
    }

    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .insert({
        nom: form.nom,
        prenom: form.prenom,
        age: form.age ? parseInt(form.age) : null,
        pseudo: form.pseudo,
        email: form.email,
        commercant_id: id,
        points: 0,
      })
      .select()
      .single();

    if (clientError) {
      setErreur("Erreur lors de la création de votre carte");
      setLoading(false);
      return;
    }

    const qrCode = `carte-${clientData.id}`;
    await supabase.from("cartes").insert({
      client_id: clientData.id,
      commercant_id: id,
      qr_code: qrCode,
    });

    // Gérer l'affiliation
    console.log("refId:", refId);
    if (refId) {
      const { data: parrain } = await supabase
        .from("clients")
        .select("*")
        .eq("id", refId)
        .single();

      const { data: commData } = await supabase
        .from("commercants")
        .select("*")
        .eq("id", id)
        .single();

      console.log("parrain trouvé:", parrain);

      if (parrain) {
        const maintenant = new Date();
        const dernierReset = new Date(parrain.affiliation_last_reset || maintenant);
        const moisDiff = (maintenant.getFullYear() - dernierReset.getFullYear()) * 12 + maintenant.getMonth() - dernierReset.getMonth();

        let countMois = parrain.affiliation_count_mois || 0;
        if (moisDiff >= 1) countMois = 0;

        if (countMois < 3) {
          const tamponsParrain = commData?.affiliation_tampons_parrain || 2;
          const tamponsFilleul = commData?.affiliation_tampons_filleul || 1;

          await supabase
            .from("clients")
            .update({
              points: (parrain.points || 0) + tamponsParrain,
              affiliation_count: (parrain.affiliation_count || 0) + 1,
              affiliation_count_mois: countMois + 1,
              affiliation_last_reset: moisDiff >= 1 ? maintenant.toISOString() : parrain.affiliation_last_reset,
            })
            .eq("id", refId);

          await supabase
            .from("clients")
            .update({
              points: tamponsFilleul,
              affilie_par: refId,
            })
            .eq("id", clientData.id);
        }
      }
    }

    if (form.email) {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          prenom: form.prenom,
          nom: form.nom,
          carteUrl: `https://elitapass.vercel.app/carte/${clientData.id}`,
        }),
      });
    }

    router.push(`/carte/${clientData.id}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-purple-600 mb-2 text-center">
          Créer ma carte fidélité
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Remplis ce formulaire pour obtenir ta carte
        </p>
        {refId && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 mb-4 text-center">
            <p className="text-purple-600 text-sm font-bold">🎁 Tu as été parrainé ! Tu recevras des tampons bonus à l'inscription.</p>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Prénom *"
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-400"
            value={form.prenom}
            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
          />
          <input
            type="text"
            placeholder="Nom *"
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-400"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
          />
          <input
            type="number"
            placeholder="Âge"
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-400"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
          <input
            type="text"
            placeholder="Pseudo *"
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-400"
            value={form.pseudo}
            onChange={(e) => setForm({ ...form, pseudo: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email (optionnel)"
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {erreur && (
            <p className="text-red-500 text-sm text-center">{erreur}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Création en cours..." : "Créer ma carte 🎴"}
          </button>
          <Link
            href="/retrouver-carte"
            className="text-center text-sm"
            style={{ color: "rgba(0,0,0,0.4)" }}
          >
            Déjà une carte ? Retrouve-la ici
          </Link>
        </div>
      </div>
    </main>
  );
}