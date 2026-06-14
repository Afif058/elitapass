"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import QRCode from "react-qrcode-logo";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CarteClient() {
  const { id } = useParams();
  const [client, setClient] = useState<any>(null);
  const [commercant, setCommercant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const { data: clientData } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

      setClient(clientData);

      if (clientData?.commercant_id) {
        const { data: commData } = await supabase
          .from("commercants")
          .select("*")
          .eq("id", clientData.commercant_id)
          .single();
        setCommercant(commData);
      }

      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
      <p className="text-white text-xl">Chargement...</p>
    </main>
  );

  if (!client) return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
      <p className="text-white text-xl">Carte introuvable</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl flex flex-col items-center gap-6">
        {/* Header carte */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-600">
            {commercant?.nom_boutique}
          </h1>
          <p className="text-gray-400 text-sm">Carte de fidélité</p>
        </div>

        {/* Infos client */}
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800">
            {client.prenom} {client.nom}
          </p>
          <p className="text-gray-400">@{client.pseudo}</p>
        </div>

        {/* Points */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl px-8 py-4 text-center w-full">
          <p className="text-white text-4xl font-bold">{client.points}</p>
          <p className="text-purple-200 text-sm">points fidélité</p>
        </div>

        {/* QR Code personnel */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-500 text-sm">Mon QR code personnel</p>
          <QRCode value={`carte-${client.id}`} size={150} />
          <p className="text-xs text-gray-400 text-center">
            Présentez ce QR code en caisse
          </p>
        </div>
      </div>
    </main>
  );
}
