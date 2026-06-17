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
    <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#ffffff" }}>
      
      {/* Carte plein écran style Wallet */}
      <div style={{
        width: "100%",
        maxWidth: "380px",
        background: couleurFond,
        borderRadius: "24px",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        boxShadow: `0 30px 80px rgba(0,0,0,0.5)`,
      }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: couleurTexte, fontWeight: "800", fontSize: "22px", letterSpacing: "-0.5px" }}>
              {commercant?.nom_boutique}
            </p>
            <p style={{ color: couleurTexte, fontSize: "13px", opacity: 0.6, marginTop: "2px" }}>✦ VIP</p>
          </div>
          <span style={{ color: couleurTexte, fontSize: "32px" }}>{symbole}</span>
        </div>

        {/* Titulaire */}
        <div>
          <p style={{ color: couleurTexte, fontSize: "11px", opacity: 0.5, textTransform: "uppercase", letterSpacing: "2px" }}>
            Titulaire de la carte
          </p>
          <p style={{ color: couleurTexte, fontWeight: "700", fontSize: "20px", marginTop: "4px" }}>
            {client.prenom} {client.nom}
          </p>
        </div>

        {/* Système tampons */}
        {systeme === "tampons" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {Array.from({ length: nbTampons }).map((_, i) => (
                <span key={i} style={{
                  opacity: i < pointsActuels ? 1 : 0.2,
                  color: couleurTexte,
                  fontWeight: "bold",
                  fontSize: "16px",
                  letterSpacing: "1px",
                }}>
                  {romains[i]}
                </span>
              ))}
            </div>
            <p style={{ color: couleurTexte, fontSize: "13px", opacity: 0.7 }}>
              {pointsManquants > 0
                ? `${pointsManquants} tampon${pointsManquants > 1 ? "s" : ""} manquant${pointsManquants > 1 ? "s" : ""} avant ${recompense}`
                : `🎉 Récompense disponible : ${recompense} !`}
            </p>
          </div>
        )}

        {/* Système cagnotte */}
        {systeme === "cagnotte" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ color: couleurTexte, fontSize: "11px", opacity: 0.5, textTransform: "uppercase", letterSpacing: "2px" }}>
              Cagnotte disponible
            </p>
            <p style={{ color: couleurTexte, fontWeight: "800", fontSize: "36px" }}>{pointsActuels}€</p>
            <p style={{ color: couleurTexte, fontSize: "12px", opacity: 0.6 }}>
              {pourcentage}% reversé à chaque achat
            </p>
          </div>
        )}

        {/* Système paliers */}
        {systeme === "paliers" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {["🥉 Bronze", "🥈 Silver", "🥇 Gold"].map((p, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: "10px", padding: "8px 0", textAlign: "center",
                  background: i === 1 ? couleurTexte : "transparent",
                  color: i === 1 ? couleurFond : couleurTexte,
                  border: `1.5px solid ${couleurTexte}`,
                  opacity: i === 1 ? 1 : 0.4,
                  fontSize: "11px", fontWeight: "bold",
                }}>{p}</div>
              ))}
            </div>
            <p style={{ color: couleurTexte, fontSize: "12px", opacity: 0.6 }}>
              {pointsActuels} points · Récompense : {recompense}
            </p>
          </div>
        )}

        {/* Séparateur */}
        <div style={{ height: "1px", background: couleurTexte, opacity: 0.15 }} />

        {/* QR Code */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
          background: "rgba(255,255,255,0.12)", borderRadius: "16px", padding: "16px",
        }}>
          <QRCode value={`carte-${client.id}`} size={140} bgColor="transparent" fgColor={couleurTexte} />
          <p style={{ color: couleurTexte, fontSize: "11px", opacity: 0.6, letterSpacing: "1px" }}>
            PRÉSENTER EN CAISSE
          </p>
        </div>
      </div>

      {/* Bouton partager */}
      <div style={{ marginTop: "16px", width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={() => {
            const url = `https://elitapass.vercel.app/inscription/${client.commercant_id}`;
            if (navigator.share) {
              navigator.share({
                title: `Carte fidélité ${commercant?.nom_boutique}`,
                text: `Rejoins le programme fidélité de ${commercant?.nom_boutique} et gagne des récompenses !`,
                url,
              });
            } else {
              navigator.clipboard.writeText(url);
              alert("Lien copié !");
            }
          }}
          style={{
            background: "#B8965A", color: "#000",
            fontWeight: "700", fontSize: "15px",
            padding: "14px", borderRadius: "14px",
            border: "none", cursor: "pointer", width: "100%",
          }}
        >
          🎁 Partager à mes amis
        </button>
      </div>

      {/* Branding */}
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <p style={{ color: "#B8965A", fontWeight: "700", letterSpacing: "3px", fontSize: "13px" }}>ELITAPASS</p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "4px" }}>L'art de fidéliser</p>
      </div>
    </main>
  );
}