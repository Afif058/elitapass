"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RetrouverCarte() {
  const router = useRouter();
  const [recherche, setRecherche] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleRecherche = async () => {
    setLoading(true);
    setErreur("");

    const { data: clients } = await supabase
      .from("clients")
      .select("*")
      .or(`email.eq.${recherche},pseudo.eq.${recherche}`)
      .limit(1);

    if (!clients || clients.length === 0) {
      setErreur("Aucune carte trouvée avec cet email ou pseudo");
      setLoading(false);
      return;
    }

    router.push(`/carte/${clients[0].id}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "#000" }}>
      <div style={{
        width: "100%", maxWidth: "380px",
        background: "#111", borderRadius: "24px",
        padding: "32px", display: "flex",
        flexDirection: "column", gap: "24px",
        border: "1px solid rgba(184,150,90,0.2)",
      }}>
        <div className="text-center">
          <p style={{ color: "#B8965A", fontWeight: "700", letterSpacing: "3px", fontSize: "13px" }}>ELITAPASS</p>
          <h1 style={{ color: "#fff", fontWeight: "800", fontSize: "24px", marginTop: "8px" }}>
            Retrouver ma carte
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "8px" }}>
            Entre ton email ou pseudo pour accéder à ta carte
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="text"
            placeholder="Email ou pseudo"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRecherche()}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px", padding: "14px 16px",
              color: "#fff", fontSize: "15px", outline: "none",
              width: "100%",
            }}
          />
          {erreur && <p style={{ color: "#ff4444", fontSize: "13px", textAlign: "center" }}>{erreur}</p>}
          <button
            onClick={handleRecherche}
            disabled={loading || !recherche}
            style={{
              background: "#B8965A", color: "#000",
              fontWeight: "700", fontSize: "16px",
              padding: "14px", borderRadius: "12px",
              border: "none", cursor: "pointer",
              opacity: loading || !recherche ? 0.5 : 1,
            }}
          >
            {loading ? "Recherche..." : "Trouver ma carte →"}
          </button>
        </div>

        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", textAlign: "center" }}>
          L'art de fidéliser
        </p>
      </div>
    </main>
  );
}