"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Html5Qrcode } from "html5-qrcode";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Scanner() {
  const router = useRouter();
  const [points, setPoints] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [client, setClient] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [modeManuel, setModeManuel] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
    };
    checkAuth();
  }, []);

  const startScanner = async () => {
    setScanning(true);
    setMessage("");
    const html5Qrcode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5Qrcode;

    try {
      await html5Qrcode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await html5Qrcode.stop();
          setScanning(false);
          await handleScan(decodedText);
        },
        () => {}
      );
    } catch {
      setMessage("❌ Impossible d'accéder à la caméra");
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleScan = async (qrCodeValue: string) => {
    setLoading(true);
    setMessage("");
    setClient(null);

    const { data: carte } = await supabase
      .from("cartes")
      .select("*, clients(*), commercants(*)")
      .eq("qr_code", qrCodeValue)
      .single();

    if (!carte) {
      setMessage("❌ Carte introuvable");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const nouveauxPoints = (carte.clients.points || 0) + points;
const nbTampons = carte.commercants?.nb_tampons || 10;
const pointsFinaux = nouveauxPoints >= nbTampons ? 0 : nouveauxPoints;
const recompenseAtteinte = nouveauxPoints >= nbTampons;

await supabase
      .from("clients")
      .update({ points: pointsFinaux })
      .eq("id", carte.client_id);

if (recompenseAtteinte) {
  setMessage(`🎉 Récompense débloquée ! Carte remise à zéro !`);
} else {
  setMessage(`✅ ${points} point(s) ajouté(s) à ${carte.clients.prenom} ${carte.clients.nom} !`);
}

    await supabase.from("transactions").insert({
      client_id: carte.client_id,
      commercant_id: user?.id,
      points_ajoutes: points,
    });

    setClient(carte.clients);
    setMessage(`✅ ${points} point(s) ajouté(s) à ${carte.clients.prenom} ${carte.clients.nom} !`);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Scanner une carte</h1>
        <button onClick={() => router.push("/dashboard")} className="text-white border border-white px-4 py-2 rounded-xl hover:bg-white hover:text-purple-600 transition text-sm">
          Dashboard
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Points */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-800">Points à ajouter</h2>
          <div className="flex items-center gap-4 justify-center">
            <button onClick={() => setPoints(Math.max(1, points - 1))} className="bg-gray-100 text-gray-800 font-bold w-12 h-12 rounded-xl hover:bg-gray-200 transition text-xl">-</button>
            <span className="text-3xl font-bold text-purple-600">{points}</span>
            <button onClick={() => setPoints(points + 1)} className="bg-gray-100 text-gray-800 font-bold w-12 h-12 rounded-xl hover:bg-gray-200 transition text-xl">+</button>
          </div>
        </div>

        {/* Scanner caméra */}
        {!modeManuel && (
          <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800">📷 Scanner avec la caméra</h2>
            <div id="qr-reader" className="w-full rounded-xl overflow-hidden" />
            {!scanning ? (
              <button onClick={startScanner} className="bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition">
                Lancer la caméra
              </button>
            ) : (
              <button onClick={stopScanner} className="bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition">
                Arrêter la caméra
              </button>
            )}
          </div>
        )}

        {/* Mode manuel */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
          <button onClick={() => setModeManuel(!modeManuel)} className="text-purple-600 font-bold text-sm text-center">
            {modeManuel ? "📷 Utiliser la caméra" : "⌨️ Saisir le code manuellement"}
          </button>
          {modeManuel && (
            <>
              <input
                type="text"
                placeholder="Code QR du client (ex: carte-xxxx)"
                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-400"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
              />
              <button
                onClick={() => handleScan(qrCode)}
                disabled={loading || !qrCode}
                className="bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? "Traitement..." : "Valider ✓"}
              </button>
            </>
          )}
        </div>

        {message && (
          <p className={`text-center font-bold text-lg ${message.includes("✅") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}

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