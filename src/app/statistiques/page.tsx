"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Statistiques() {
  const router = useRouter();
  const [commercant, setCommercant] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
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

      if (comm && comm.abonnement !== "premium") {
        router.push("/abonnements");
        return;
      }

      setCommercant(comm);

      const { data: clientsData } = await supabase
        .from("clients")
        .select("*")
        .eq("commercant_id", user.id)
        .order("points", { ascending: false });

      setClients(clientsData || []);

      const { data: transactionsData } = await supabase
        .from("transactions")
        .select("*")
        .eq("commercant_id", user.id)
        .order("created_at", { ascending: false });

      setTransactions(transactionsData || []);
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
      <p className="text-white text-xl">Chargement...</p>
    </main>
  );

  const totalPoints = clients.reduce((acc, c) => acc + (c.points || 0), 0);
  const top3 = clients.slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Statistiques</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-white border border-white px-4 py-2 rounded-xl hover:bg-white hover:text-purple-600 transition text-sm"
        >
          Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Stats globales */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-white rounded-2xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-purple-600">{clients.length}</p>
            <p className="text-gray-500 text-sm mt-1">Clients total</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-blue-500">{totalPoints}</p>
            <p className="text-gray-500 text-sm mt-1">Points distribués</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-green-500">{transactions.length}</p>
            <p className="text-gray-500 text-sm mt-1">Transactions</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-yellow-500">
              {clients.length > 0 ? Math.round(totalPoints / clients.length) : 0}
            </p>
            <p className="text-gray-500 text-sm mt-1">Moy. points/client</p>
          </div>
        </div>

        {/* Top clients */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Top clients</h2>
          {top3.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Aucun client encore</p>
          ) : (
            <div className="flex flex-col gap-3">
              {top3.map((client, index) => (
                <div key={client.id} className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>
                    <div>
                      <p className="font-bold text-gray-800">{client.prenom} {client.nom}</p>
                      <p className="text-gray-400 text-sm">@{client.pseudo}</p>
                    </div>
                  </div>
                  <p className="font-bold text-purple-600">{client.points} pts</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dernières transactions */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Dernières transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Aucune transaction encore</p>
          ) : (
            <div className="flex flex-col gap-3">
              {transactions.slice(0, 10).map((t) => (
                <div key={t.id} className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3">
                  <p className="text-gray-600 text-sm">
                    {new Date(t.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                  <p className="font-bold text-green-500">+{t.points_ajoutes} pts</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}