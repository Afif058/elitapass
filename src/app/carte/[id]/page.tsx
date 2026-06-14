"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import QRCode from "react-qrcode-logo";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const romains = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX"];

const ICONS: Record<string, string> = {
  scissors: "✂", coffee: "☕", flower: "✿", pizza: "◈",
  dumbbell: "◉", book: "◎", music: "♪", shopping: "◇",
  heart: "♡", star: "★", gem: "◆", crown: "♛",
  cake: "✦", wine: "♜", leaf: "❧", gift: "✿",
  dog: "❖", car: "◐", shirt: "◑", fish: "≋",
};

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
    <main className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <p className="text-white text-xl">Chargement...</p>
    </main>
  );

  if (!client) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <p className="text-white text-xl">Carte introuvable</p>
    </main>
  );

  const couleurFond = commercant?.couleur_principale || "#B8965A";
  const couleurTexte = commercant?.couleur_secondaire || "#000000";
  const systeme = commercant?.systeme_fidelite || "tampons";
  const nbTampons = commercant?.nb_tampons || 10;
  const recompense = commercant?.recompense || "1 offert";
  const pourcentage = commercant?.pourcentage_cagnotte || 5;
  const symbole = ICONS[commercant?.emoji_carte] || "★";
  const pointsActuels = client.points || 0;
  const pointsManquants = Math.max(0, nbTampons - pointsActuels);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: "linear-gradient(135deg, #0a0a0a, #111111)" }}>

      {/* iPhone mockup */}
      <div style={{ width: "300px" }}>
        <div style={{
          width: "300px", height: "620px",
          background: "linear-gradient(160deg, #2c2c2e, #1c1c1e)",
          borderRadius: "52px", padding: "12px",
          boxShadow: "0 50px 100px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1)",
          position: "relative",
        }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "42px", overflow: "hidden", background: "#f2f2f7", position: "relative" }}>
            
            {/* Dynamic Island */}
            <div style={{
              position: "absolute", top: "12px", left: "50%", transform: "translateX(-50%)",
              width: "100px", height: "28px", background: "#000", borderRadius: "20px", zIndex: 10,
            }} />

            {/* Contenu écran */}
            <div style={{ width: "100%", height: "100%", background: "#f2f2f7", display: "flex", flexDirection: "column", paddingTop: "52px" }}>
              
              {/* Header Wallet */}
              <div style={{ padding: "0 18px 10px" }}>
                <p style={{ color: "#000", fontWeight: "800", fontSize: "24px", letterSpacing: "-0.5px" }}>Cartes</p>
              </div>

              {/* Carte fidélité */}
              <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{
                  background: couleurFond, borderRadius: "18px", padding: "18px",
                  display: "flex", flexDirection: "column", gap: "12px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                }}>
                  {/* Header carte */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ color: couleurTexte, fontWeight: "700", fontSize: "15px" }}>{commercant?.nom_boutique}</p>
                      <p style={{ color: couleurTexte, fontSize: "11px", opacity: 0.6 }}>✦ VIP</p>
                    </div>
                    <span style={{ color: couleurTexte, fontSize: "22px" }}>{symbole}</span>
                  </div>

                  {/* Titulaire */}
                  <div>
                    <p style={{ color: couleurTexte, fontSize: "10px", opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px" }}>Titulaire de la carte</p>
                    <p style={{ color: couleurTexte, fontWeight: "700", fontSize: "16px" }}>{client.prenom} {client.nom}</p>
                  </div>

                  {/* Système tampons */}
                  {systeme === "tampons" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {Array.from({ length: nbTampons }).map((_, i) => (
                          <span key={i} style={{
                            opacity: i < pointsActuels ? 1 : 0.25,
                            color: couleurTexte, fontWeight: "bold", fontSize: "11px",
                          }}>
                            {romains[i]}
                          </span>
                        ))}
                      </div>
                      <p style={{ color: couleurTexte, fontSize: "10px", opacity: 0.7 }}>
                        {pointsManquants > 0 ? `${pointsManquants} manquants avant ${recompense}` : `🎉 Récompense disponible : ${recompense}`}
                      </p>
                    </div>
                  )}

                  {/* Système cagnotte */}
                  {systeme === "cagnotte" && (
                    <div>
                      <p style={{ color: couleurTexte, fontSize: "24px", fontWeight: "bold" }}>{pointsActuels}€</p>
                      <p style={{ color: couleurTexte, fontSize: "10px", opacity: 0.6 }}>{pourcentage}% reversé à chaque achat</p>
                    </div>
                  )}

                  {/* Système paliers */}
                  {systeme === "paliers" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {["Bronze", "Silver", "Gold"].map((p, i) => (
                          <div key={i} style={{
                            flex: 1, borderRadius: "8px", padding: "4px 0", textAlign: "center",
                            background: i === 1 ? couleurTexte : "transparent",
                            color: i === 1 ? couleurFond : couleurTexte,
                            border: `1px solid ${couleurTexte}`,
                            opacity: i === 1 ? 1 : 0.5,
                            fontSize: "9px", fontWeight: "bold",
                          }}>{p}</div>
                        ))}
                      </div>
                      <p style={{ color: couleurTexte, fontSize: "10px", opacity: 0.6 }}>
                        {pointsActuels} points · {recompense}
                      </p>
                    </div>
                  )}

                  {/* QR Code */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "10px" }}>
                    <QRCode value={`carte-${client.id}`} size={100} bgColor="transparent" fgColor={couleurTexte} />
                    <p style={{ color: couleurTexte, fontSize: "9px", opacity: 0.6 }}>Présenter en caisse</p>
                  </div>
                </div>

                {/* Autre carte simulée */}
                <div style={{ background: "#e5e5ea", borderRadius: "16px", padding: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#c7c7cc" }} />
                  <div>
                    <p style={{ color: "rgba(0,0,0,0.3)", fontSize: "11px", fontWeight: "bold" }}>Autre carte</p>
                    <p style={{ color: "rgba(0,0,0,0.2)", fontSize: "10px" }}>••••</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reflet */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%)", borderRadius: "42px", pointerEvents: "none" }} />
          </div>

          {/* Barre home */}
          <div style={{ position: "absolute", bottom: "18px", left: "50%", transform: "translateX(-50%)", width: "80px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "4px" }} />
        </div>
      </div>

      {/* Nom app en bas */}
      <p className="mt-8 font-bold" style={{ color: "#B8965A", letterSpacing: "2px", fontSize: "14px" }}>ELITAPASS</p>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>L'art de fidéliser</p>
    </main>
  );
}