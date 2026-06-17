"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import QRCode from "react-qrcode-logo";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const router = useRouter();
  const [commercant, setCommercant] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: comm } = await supabase
        .from("commercants")
        .select("*")
        .eq("id", user.id)
        .single();

      setCommercant(comm);

      const { data: clientsData } = await supabase
        .from("clients")
        .select("*")
        .eq("commercant_id", user.id);

      setClients(clientsData || []);
      setLoading(false);
    };
    getData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
      <p className="text-white text-xl">Chargement...</p>
    </main>
  );

  const qrUrl = commercant ? `https://elitapass.vercel.app/inscription/${commercant.id}` : "";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-white text-2xl font-bold">{commercant?.nom_boutique}</h1>
          <span className="text-purple-200 text-sm capitalize">
            Abonnement {commercant?.abonnement}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-white border border-white px-4 py-2 rounded-xl hover:bg-white hover:text-purple-600 transition text-sm"
        >
          Déconnexion
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* QR Code */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Mon QR Code boutique</h2>
          <p className="text-gray-500 text-sm text-center">
            Affichez ce QR code en caisse — vos clients le scannent pour créer leur carte fidélité
          </p>
          {qrUrl ? <QRCode value={qrUrl} size={200} /> : <p className="text-gray-400">Chargement...</p>}
          <p className="text-xs text-gray-400 text-center break-all">{qrUrl}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow text-center">
            <p className="text-4xl font-bold text-purple-600">{clients.length}</p>
            <p className="text-gray-500 mt-1">Clients fidèles</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow text-center">
            <p className="text-4xl font-bold text-blue-500">
              {clients.reduce((acc, c) => acc + (c.points || 0), 0)}
            </p>
            <p className="text-gray-500 mt-1">Points distribués</p>
          </div>
        </div>
{/* Affiliation */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-3">
          <h2 className="text-xl font-bold text-gray-800">🤝 Mon lien d'affiliation</h2>
          <p className="text-gray-400 text-sm">Partagez ce lien — pour chaque commerçant inscrit via votre lien, vous gagnez 1 mois offert !</p>
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-600 text-sm break-all">
            {`https://elitapass.vercel.app/register-commercant?ref=${commercant?.code_affiliation}`}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`https://elitapass.vercel.app/register-commercant?ref=${commercant?.code_affiliation}`);
              alert("Lien copié !");
            }}
            className="bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition"
          >
            📋 Copier mon lien
          </button>
        </div>
        
       {/* Boutons */}
       <button
  onClick={() => router.push("/parametres")}
  className="bg-white text-purple-600 font-bold py-4 rounded-2xl hover:bg-purple-50 transition text-lg w-full border-2 border-purple-600"
>
  🎨 Personnaliser ma carte
</button>
        <button
          onClick={() => router.push("/scanner")}
          className="bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 transition text-lg w-full"
        >
          📷 Scanner une carte client
        </button>

        <button
          onClick={() => router.push("/abonnements")}
          className="bg-white text-purple-600 font-bold py-4 rounded-2xl hover:bg-purple-50 transition text-lg w-full border-2 border-purple-600"
        >
          ⭐ Gérer mon abonnement
        </button>

        <button
          onClick={() => router.push("/notifications")}
          className="bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 transition text-lg w-full"
        >
          📣 Envoyer une notification
        </button>
<button
  onClick={() => router.push("/statistiques")}
  className="bg-white text-purple-600 font-bold py-4 rounded-2xl hover:bg-purple-50 transition text-lg w-full border-2 border-purple-600"
>
  📊 Mes statistiques
</button>

        {/* Liste clients */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mes clients</h2>
          {clients.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Aucun client encore — partagez votre QR code !
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {clients.map((client) => (
                <div key={client.id} className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-bold text-gray-800">{client.prenom} {client.nom}</p>
                    <p className="text-gray-400 text-sm">@{client.pseudo}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{client.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
<p className="text-gray-500 mt-1">Points distribués</p>
