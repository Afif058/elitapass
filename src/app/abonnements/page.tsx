"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Abonnements() {
  const router = useRouter();
  const [commercant, setCommercant] = useState<any>(null);
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
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
      <p className="text-white text-xl">Chargement...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Abonnements</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-white border border-white px-4 py-2 rounded-xl hover:bg-white hover:text-purple-600 transition text-sm"
        >
          Dashboard
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <p className="text-center text-gray-500">
          Abonnement actuel : <span className="font-bold text-purple-600 capitalize">{commercant?.abonnement}</span>
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Basic */}
          <div className={`bg-white rounded-2xl p-6 shadow flex flex-col gap-4 border-2 ${commercant?.abonnement === "basic" ? "border-purple-600" : "border-transparent"}`}>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Basic</h2>
              <p className="text-3xl font-bold text-purple-600 mt-2">19,90€<span className="text-sm text-gray-400">/mois</span></p>
            </div>
            <ul className="flex flex-col gap-2 text-gray-600 text-sm">
              <li>✅ Carte fidélité digitale</li>
              <li>✅ QR code boutique</li>
              <li>✅ Gestion des points</li>
              <li>❌ Notifications clients</li>
              <li>❌ Statistiques avancées</li>
            </ul>
            {commercant?.abonnement === "basic" ? (
              <div className="bg-purple-100 text-purple-600 font-bold py-3 rounded-xl text-center">
                Abonnement actuel
              </div>
            ) : (
              <button className="bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition">
                Choisir Basic
              </button>
            )}
          </div>

          {/* Premium */}
          <div className={`bg-white rounded-2xl p-6 shadow flex flex-col gap-4 border-2 ${commercant?.abonnement === "premium" ? "border-purple-600" : "border-yellow-400"}`}>
            <div>
              <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full w-fit">
                ⭐ PREMIUM
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-2">Premium</h2>
              <p className="text-3xl font-bold text-purple-600 mt-2">24,90€<span className="text-sm text-gray-400">/mois</span></p>
            </div>
            <ul className="flex flex-col gap-2 text-gray-600 text-sm">
              <li>✅ Carte fidélité digitale</li>
              <li>✅ QR code boutique</li>
              <li>✅ Gestion des points</li>
              <li>✅ Notifications clients</li>
              <li>✅ Statistiques avancées</li>
            </ul>
            {commercant?.abonnement === "premium" ? (
              <div className="bg-purple-100 text-purple-600 font-bold py-3 rounded-xl text-center">
                Abonnement actuel
              </div>
            ) : (
              <button className="bg-yellow-400 text-yellow-900 font-bold py-3 rounded-xl hover:bg-yellow-500 transition w-full">
                Passer en Premium ⭐
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
