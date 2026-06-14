"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Scanner() {
  const router = useRouter();
  const [qrCode, setQrCode] = useState("");
  const [points, setPoints] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
    };
    checkAuth();
  }, []);

  const handleScan = async () => {
    setLoading(true);
    setMessage("");
    setClient(null);

    const { data: carte } = await supabase
      .from("cartes")
      .select("*, clients(*)")
      .eq("qr_code", qrCode)
      .single();

    if (!carte) {
      setMessage("❌ Carte introuvable");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from("clients")
      .update({ points: (carte.clients.points || 0) + points })
      .eq("id", carte.client_id);

    await supabase.from("transactions").insert({
      client_id: carte.client_id,
      commercant_id: user?.id,
      points_ajoutes: points,
    });

    setClient(carte.clients);
    setMessage(`✅ ${points} point(s) ajouté(s) à ${carte.clients.prenom} ${carte.clients.nom} !`);
    setQrCode("");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Scanner une carte</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-white border border-white px-4 py-2 rounded-xl hover:bg-white hover:text-purple-600 transition text-sm"
        >
          Dashboard
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-800">Ajouter des points</h2>
          <input
            type="text"
            placeholder="Code QR du client (ex: carte-xxxx)"
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-400"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
          />
          <div className="flex items-center gap-4">
            <p className="text-gray-600">Points à ajouter :</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPoints(Math.max(1, points - 1))}
                className="bg-gray-100 text-gray-800 font-bold w-10 h-10 rounded-xl hover:bg-gray-200 transition"
              >
                -
              </button>
              <span className="text-xl font-bold text-purple-600">{points}</span>
              <button
                onClick={() => setPoints(points + 1)}
                className="bg-gray-100 text-gray-800 font-bold w-10 h-10 rounded-xl hover:bg-gray-200 transition"
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={handleScan}
            disabled={loading || !qrCode}
            className="bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Traitement..." : "Valider le scan ✓"}
          </button>
          {message && (
            <p className={`text-center font-bold ${message.includes("✅") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </div>

        {client && (
          <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-center gap-2">
            <p className="text-gray-500 text-sm">Client</p>
            <p className="text-xl font-bold text-gray-800">{client.prenom} {client.nom}</p>
            <p className="text-gray-400">@{client.pseudo}</p>
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl px-8 py-3 text-center mt-2">
              <p className="text-white text-2xl font-bold">{client.points + points}</p>
              <p className="text-purple-200 text-sm">points total</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
