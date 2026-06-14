"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ICONS = [
  { id: "scissors", label: "Coiffeur", symbol: "✂" },
  { id: "coffee", label: "Café", symbol: "☕" },
  { id: "flower", label: "Fleuriste", symbol: "✿" },
  { id: "pizza", label: "Restaurant", symbol: "◈" },
  { id: "dumbbell", label: "Sport", symbol: "◉" },
  { id: "book", label: "Librairie", symbol: "◎" },
  { id: "music", label: "Musique", symbol: "♪" },
  { id: "shopping", label: "Boutique", symbol: "◇" },
  { id: "heart", label: "Bien-être", symbol: "♡" },
  { id: "star", label: "VIP", symbol: "★" },
  { id: "gem", label: "Bijoux", symbol: "◆" },
  { id: "crown", label: "Luxe", symbol: "♛" },
  { id: "cake", label: "Pâtisserie", symbol: "✦" },
  { id: "wine", label: "Bar", symbol: "♜" },
  { id: "leaf", label: "Bio", symbol: "❧" },
  { id: "gift", label: "Cadeaux", symbol: "✿" },
  { id: "dog", label: "Animaux", symbol: "❖" },
  { id: "car", label: "Auto", symbol: "◐" },
  { id: "shirt", label: "Mode", symbol: "◑" },
  { id: "fish", label: "Poisson", symbol: "≋" },
];

const romains = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX"];

export default function Parametres() {
  const router = useRouter();
  const [nomBoutique, setNomBoutique] = useState("Ma Boutique");
  const [form, setForm] = useState({
    couleur_principale: "#B8965A",
    couleur_secondaire: "#000000",
    systeme_fidelite: "tampons",
    emoji_carte: "star",
    nb_tampons: 10,
    recompense: "1 offert",
    pourcentage_cagnotte: 5,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [succes, setSucces] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: comm } = await supabase.from("commercants").select("*").eq("id", user.id).single();
      if (comm) {
        setNomBoutique(comm.nom_boutique || "Ma Boutique");
        setForm({
          couleur_principale: comm.couleur_principale || "#B8965A",
          couleur_secondaire: comm.couleur_secondaire || "#000000",
          systeme_fidelite: comm.systeme_fidelite || "tampons",
          emoji_carte: comm.emoji_carte || "star",
          nb_tampons: comm.nb_tampons || 10,
          recompense: comm.recompense || "1 offert",
          pourcentage_cagnotte: comm.pourcentage_cagnotte || 5,
        });
      }
      setLoading(false);
    };
    getData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("commercants").update(form).eq("id", user?.id);
    setSucces("✅ Paramètres sauvegardés !");
    setSaving(false);
    setTimeout(() => setSucces(""), 3000);
  };

  const currentIcon = ICONS.find(ic => ic.id === form.emoji_carte);
  const tamponsRemplis = Math.floor(form.nb_tampons / 2);

  if (loading) return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
      <p className="text-white text-xl">Chargement...</p>
    </main>
  );

  const IphoneMockup = () => (
    <div className="flex justify-center items-center">
      <div>
        <p className="text-gray-400 text-sm text-center mb-4 font-bold">Aperçu en temps réel</p>
        <div style={{ width: "260px" }}>
          <div style={{
            width: "260px", height: "540px",
            background: "linear-gradient(160deg, #2c2c2e, #1c1c1e)",
            borderRadius: "46px", padding: "10px",
            boxShadow: "0 50px 100px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1)",
            position: "relative",
          }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "38px", overflow: "hidden", background: "#f2f2f7", position: "relative" }}>
              <div style={{
                position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)",
                width: "90px", height: "26px", background: "#000", borderRadius: "20px", zIndex: 10,
              }} />
              <div style={{ width: "100%", height: "100%", background: "#f2f2f7", display: "flex", flexDirection: "column", paddingTop: "48px" }}>
                <div style={{ padding: "0 16px 8px" }}>
                  <p style={{ color: "#000", fontWeight: "800", fontSize: "22px", letterSpacing: "-0.5px" }}>Cartes</p>
                </div>
                <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ background: form.couleur_principale, borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ color: form.couleur_secondaire, fontWeight: "700", fontSize: "13px" }}>{nomBoutique}</p>
                        <p style={{ color: form.couleur_secondaire, fontSize: "10px", opacity: 0.6 }}>✦ VIP</p>
                      </div>
                      <span style={{ color: form.couleur_secondaire, fontSize: "20px" }}>{currentIcon?.symbol}</span>
                    </div>
                    <div>
                      <p style={{ color: form.couleur_secondaire, fontSize: "9px", opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px" }}>Titulaire de la carte</p>
                      <p style={{ color: form.couleur_secondaire, fontWeight: "700", fontSize: "13px" }}>Prénom</p>
                    </div>
                    {form.systeme_fidelite === "tampons" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                          {Array.from({ length: Math.min(form.nb_tampons, 20) }).map((_, i) => (
                            <span key={i} style={{ opacity: i < tamponsRemplis ? 1 : 0.25, color: form.couleur_secondaire, fontWeight: "bold", fontSize: "9px" }}>
                              {romains[i]}
                            </span>
                          ))}
                        </div>
                        <p style={{ color: form.couleur_secondaire, fontSize: "9px", opacity: 0.6 }}>
                          {form.nb_tampons - tamponsRemplis} manquants avant {form.recompense}
                        </p>
                      </div>
                    )}
                    {form.systeme_fidelite === "cagnotte" && (
                      <div>
                        <p style={{ color: form.couleur_secondaire, fontSize: "20px", fontWeight: "bold" }}>12,50€</p>
                        <p style={{ color: form.couleur_secondaire, fontSize: "9px", opacity: 0.6 }}>{form.pourcentage_cagnotte}% reversé à chaque achat</p>
                      </div>
                    )}
                    {form.systeme_fidelite === "paliers" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {["Bronze", "Silver", "Gold"].map((p, i) => (
                            <div key={i} style={{
                              flex: 1, borderRadius: "6px", padding: "3px 0", textAlign: "center",
                              background: i === 1 ? form.couleur_secondaire : "transparent",
                              color: i === 1 ? form.couleur_principale : form.couleur_secondaire,
                              border: `1px solid ${form.couleur_secondaire}`,
                              opacity: i === 1 ? 1 : 0.5, fontSize: "8px", fontWeight: "bold",
                            }}>{p}</div>
                          ))}
                        </div>
                        <p style={{ color: form.couleur_secondaire, fontSize: "9px", opacity: 0.6 }}>Gold → {form.recompense}</p>
                      </div>
                    )}
                  </div>
                  <div style={{ background: "#e5e5ea", borderRadius: "16px", padding: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#c7c7cc" }} />
                    <div>
                      <p style={{ color: "rgba(0,0,0,0.3)", fontSize: "11px", fontWeight: "bold" }}>Autre carte</p>
                      <p style={{ color: "rgba(0,0,0,0.2)", fontSize: "10px" }}>••••</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%)", borderRadius: "38px", pointerEvents: "none" }} />
            </div>
            <div style={{ position: "absolute", bottom: "18px", left: "50%", transform: "translateX(-50%)", width: "80px", height: "4px", background: "rgba(0,0,0,0.3)", borderRadius: "4px" }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Personnaliser ma carte</h1>
        <button onClick={() => router.push("/dashboard")} className="text-white border border-white px-4 py-2 rounded-xl hover:bg-white hover:text-purple-600 transition text-sm">
          Dashboard
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* iPhone EN PREMIER */}
        <IphoneMockup />

        {/* Formulaire en dessous */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800">Système de fidélité</h2>
            <div className="flex flex-col gap-3">
              {[
                { id: "tampons", titre: "Tampons", desc: "Ex: 10 achats = 1 offert" },
                { id: "cagnotte", titre: "Cagnotte", desc: "Ex: 5% reversé à chaque achat" },
                { id: "paliers", titre: "Paliers", desc: "Bronze → Silver → Gold" },
              ].map((s) => (
                <button key={s.id} onClick={() => setForm({ ...form, systeme_fidelite: s.id })}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition text-left ${form.systeme_fidelite === s.id ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <div className="flex-1">
                    <p className={`font-bold ${form.systeme_fidelite === s.id ? "text-purple-600" : "text-gray-800"}`}>{s.titre}</p>
                    <p className="text-gray-400 text-sm">{s.desc}</p>
                  </div>
                  {form.systeme_fidelite === s.id && <span className="text-purple-600 text-xl">✓</span>}
                </button>
              ))}
            </div>
            {form.systeme_fidelite === "tampons" && (
              <div className="flex flex-col gap-3 mt-2">
                <div>
                  <label className="text-gray-600 text-sm font-bold">Nombre de tampons</label>
                  <input type="number" min={1} max={20} value={form.nb_tampons}
                    onChange={(e) => setForm({ ...form, nb_tampons: parseInt(e.target.value) })}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 w-full mt-1 focus:outline-none focus:border-purple-400" />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-bold">Récompense</label>
                  <input type="text" placeholder="Ex: 1 offert, -50%..." value={form.recompense}
                    onChange={(e) => setForm({ ...form, recompense: e.target.value })}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 w-full mt-1 focus:outline-none focus:border-purple-400" />
                </div>
              </div>
            )}
            {form.systeme_fidelite === "cagnotte" && (
              <div className="mt-2">
                <label className="text-gray-600 text-sm font-bold">% reversé à chaque achat</label>
                <input type="number" min={1} max={50} value={form.pourcentage_cagnotte}
                  onChange={(e) => setForm({ ...form, pourcentage_cagnotte: parseInt(e.target.value) })}
                  className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 w-full mt-1 focus:outline-none focus:border-purple-400" />
              </div>
            )}
            {form.systeme_fidelite === "paliers" && (
              <div className="mt-2">
                <label className="text-gray-600 text-sm font-bold">Récompense palier Gold</label>
                <input type="text" placeholder="Ex: -20% permanent..." value={form.recompense}
                  onChange={(e) => setForm({ ...form, recompense: e.target.value })}
                  className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 w-full mt-1 focus:outline-none focus:border-purple-400" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800">Symbole de ta carte</h2>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map((item) => (
                <button key={item.id} onClick={() => setForm({ ...form, emoji_carte: item.id })}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition border-2 ${form.emoji_carte === item.id ? "border-purple-600 bg-purple-50" : "border-transparent hover:bg-gray-100"}`}>
                  <span className="text-xl" style={{ color: form.emoji_carte === item.id ? "#7C3AED" : "#6B7280" }}>{item.symbol}</span>
                  <span className="text-xs text-gray-400">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800">Couleurs</h2>
            <div className="flex gap-6">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-600 text-sm font-bold">Fond de la carte</label>
                <input type="color" value={form.couleur_principale}
                  onChange={(e) => setForm({ ...form, couleur_principale: e.target.value })}
                  className="w-full h-14 rounded-xl cursor-pointer border-2 border-gray-200 p-1" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-600 text-sm font-bold">Texte de la carte</label>
                <input type="color" value={form.couleur_secondaire}
                  onChange={(e) => setForm({ ...form, couleur_secondaire: e.target.value })}
                  className="w-full h-14 rounded-xl cursor-pointer border-2 border-gray-200 p-1" />
              </div>
            </div>
          </div>

          {succes && <p className="text-green-500 font-bold text-center text-lg">{succes}</p>}

          <button onClick={handleSave} disabled={saving}
            className="bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 transition disabled:opacity-50 text-lg">
            {saving ? "Sauvegarde..." : "💾 Sauvegarder ma carte"}
          </button>
        </div>
      </div>
    </main>
  );
}