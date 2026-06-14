"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Notifications() {
  const router = useRouter();
  const [commercant, setCommercant] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState("");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: comm } = await supabase
        .from("commercants")
        .select("*")
        .eq("id", user.id)
        .single();

      if (comm && comm.abonnement !== "premium") {
        router.push("/abonnements");
        return;
      }

      setCommercant(comm);

      const { data: clientsData } = await supabase
        .from("clients")
        .select("*")
        .eq("commercant_id", user.id);

      setClients(clientsData || []);
    };
    getData();
  }, []);

  const handleEnvoyer = async () => {
    if (!message) { setErreur("Écris un message !"); return; }
    setLoading(true);
    setErreur("");
    setSucces("");

    const { error } = await supabase.from("notifications").insert({
      commercant_id: commercant.id,
      message: message,
      nb_clients: clients.length,
    });

    if (error) {
      setErreur("Erreur lors de l'envoi");
      setLoading(false);
      return;
    }

    setSucces(`✅ Message envoyé à ${clients.length} clients !`);
    setMessage("");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Notifications</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-white border border-white px-4 py-2 rounded-xl hover:bg-white hover:text-purple-600 transition text-sm"
        >
          Dashboard
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-800">Envoyer un message</h2>
          <p className="text-gray-400 text-sm">
            Ce message sera envoyé à tous vos <span className="font-bold text-purple-600">{clients.length} clients</span>
          </p>
          <textarea
            placeholder="Ex: Offre spéciale ce weekend -20% sur tout le magasin !"
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-purple-400 h-32 resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {erreur && <p className="text-red-500 text-sm text-center">{erreur}</p>}
          {succes && <p className="text-green-500 text-sm text-center font-bold">{succes}</p>}
          <button
            onClick={handleEnvoyer}
            disabled={loading}
            className="bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Envoi en cours..." : "📣 Envoyer à tous mes clients"}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mes clients</h2>
          {clients.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Aucun client encore</p>
          ) : (
            <div className="flex flex-col gap-3">
              {clients.map((client) => (
                <div key={client.id} className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-bold text-gray-800">{client.prenom} {client.nom}</p>
                    <p className="text-gray-400 text-sm">{client.email || "Pas d'email"}</p>
                  </div>
                  <p className="font-bold text-purple-600">{client.points} pts</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
