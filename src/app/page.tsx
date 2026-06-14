"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

const romains = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];
const gold = "#B8965A";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 150, 90, ${p.opacity})`;
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const IphoneMockup = () => (
    <div style={{ width: "260px" }}>
      <div style={{
        width: "260px", height: "540px",
        background: "linear-gradient(160deg, #2c2c2e, #1c1c1e)",
        borderRadius: "46px", padding: "10px",
        boxShadow: "0 50px 100px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1)",
        position: "relative",
      }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "38px", overflow: "hidden", background: "#f2f2f7", position: "relative" }}>
          {/* Dynamic Island */}
          <div style={{
            position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)",
            width: "90px", height: "26px", background: "#000", borderRadius: "20px", zIndex: 10,
          }} />
          <div style={{ width: "100%", height: "100%", background: "#f2f2f7", display: "flex", flexDirection: "column", paddingTop: "48px" }}>
            {/* Header Wallet */}
            <div style={{ padding: "0 16px 8px" }}>
              <p style={{ color: "#000", fontWeight: "800", fontSize: "22px", letterSpacing: "-0.5px" }}>Cartes</p>
            </div>
            {/* Carte */}
            <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{
                background: gold, borderRadius: "16px", padding: "16px",
                display: "flex", flexDirection: "column", gap: "10px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: "#000", fontWeight: "700", fontSize: "13px" }}>Maison Dorée</p>
                    <p style={{ color: "#000", fontSize: "10px", opacity: 0.5 }}>✦ VIP</p>
                  </div>
                  <span style={{ color: "#000", fontSize: "20px" }}>★</span>
                </div>
                <div>
                  <p style={{ color: "#000", fontSize: "9px", opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px" }}>Titulaire de la carte</p>
                  <p style={{ color: "#000", fontWeight: "700", fontSize: "13px" }}>Alexandre</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {romains.map((r, i) => (
                    <span key={i} style={{
                      opacity: i < 7 ? 1 : 0.25,
                      color: "#000", fontWeight: "bold", fontSize: "9px",
                    }}>{r}</span>
                  ))}
                </div>
                <p style={{ color: "#000", fontSize: "9px", opacity: 0.6 }}>3 tampons manquants avant 1 offert</p>
              </div>
              {/* Autre carte */}
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
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%)", borderRadius: "38px", pointerEvents: "none" }} />
        </div>
        {/* Barre home */}
        <div style={{ position: "absolute", bottom: "18px", left: "50%", transform: "translateX(-50%)", width: "80px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "4px" }} />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0a00 100%)" }}>

      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 0 }} />

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-8 py-4 border-b" style={{ borderColor: "rgba(184,150,90,0.1)" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight" style={{ color: gold }}>ElitaPass</span>
            <span className="text-xs font-light opacity-40 tracking-widest uppercase">Premium</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-white/50 hover:text-white transition text-sm">Connexion</Link>
            <Link href="/register-commercant" className="font-bold px-4 py-2 rounded-xl text-sm transition text-black" style={{ background: gold }}>
              Commencer
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="flex flex-col lg:flex-row items-center justify-center px-8 py-20 gap-16 max-w-6xl mx-auto">
          {/* Texte gauche */}
          <div className="flex flex-col gap-8 flex-1 text-center lg:text-left">
            <div className="text-xs font-bold px-4 py-2 rounded-full border w-fit mx-auto lg:mx-0" style={{ color: gold, borderColor: gold, background: "rgba(184,150,90,0.06)" }}>
              ✦ La carte fidélité du 21ème siècle
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              L'art de <span style={{ color: gold }}>fidéliser</span>
            </h1>
            <p className="text-white/50 text-lg max-w-md">
              Offrez à vos clients une expérience VIP avec une carte de fidélité digitale élégante. Fini le papier, place au prestige.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register-commercant" className="font-bold px-8 py-4 rounded-2xl text-lg transition text-black text-center" style={{ background: gold }}>
                Essai gratuit 14 jours →
              </Link>
              <Link href="#comment" className="border text-white px-8 py-4 rounded-2xl text-lg hover:bg-white/5 transition text-center" style={{ borderColor: "rgba(184,150,90,0.25)" }}>
                Comment ça marche
              </Link>
            </div>
          </div>

          {/* iPhone droite */}
          <div className="flex-1 flex justify-center items-center">
            <IphoneMockup />
          </div>
        </section>

        {/* Comment ça marche */}
        <section id="comment" className="px-4 py-24 border-t" style={{ borderColor: "rgba(184,150,90,0.1)" }}>
          <div className="max-w-4xl mx-auto flex flex-col gap-16">
            <h2 className="text-4xl font-bold text-center">Comment ça marche ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: "01", titre: "Créez votre carte", desc: "Personnalisez votre carte aux couleurs de votre boutique en quelques minutes." },
                { num: "02", titre: "Vos clients scannent", desc: "Ils scannent votre QR code et reçoivent leur carte fidélité VIP instantanément." },
                { num: "03", titre: "Fidélisez & récompensez", desc: "Ajoutez des points à chaque achat et récompensez vos meilleurs clients." },
              ].map((step) => (
                <div key={step.num} className="flex flex-col gap-4 p-6 rounded-2xl border" style={{ borderColor: "rgba(184,150,90,0.15)", background: "rgba(184,150,90,0.03)" }}>
                  <span className="font-bold text-5xl" style={{ color: gold }}>{step.num}</span>
                  <h3 className="text-xl font-bold">{step.titre}</h3>
                  <p className="text-white/50">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="px-4 py-24 border-t" style={{ borderColor: "rgba(184,150,90,0.1)" }}>
          <div className="max-w-4xl mx-auto flex flex-col gap-16">
            <h2 className="text-4xl font-bold text-center">Tarifs simples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto w-full">
              <div className="rounded-3xl p-8 flex flex-col gap-6 border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <div>
                  <h3 className="text-xl font-bold text-white/70">Basic</h3>
                  <p className="text-4xl font-bold mt-2">19,90€<span className="text-sm text-white/30">/mois</span></p>
                </div>
                <ul className="flex flex-col gap-3 text-white/50 text-sm">
                  <li>✦ Carte fidélité digitale</li>
                  <li>✦ QR code boutique</li>
                  <li>✦ Gestion des points</li>
                  <li>✦ Partage carte entre amis</li>
                  <li>✦ Système d'affiliation</li>
                  <li className="opacity-30">◇ Notifications clients</li>
                  <li className="opacity-30">◇ Statistiques avancées</li>
                  <li className="opacity-30">◇ Profil boutique complet</li>
                </ul>
                <Link href="/register-commercant" className="border text-white font-bold py-3 rounded-xl text-center hover:bg-white/5 transition" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  Essai gratuit 14 jours
                </Link>
              </div>
              <div className="rounded-3xl p-8 flex flex-col gap-6 border relative" style={{ borderColor: gold, background: "rgba(184,150,90,0.04)" }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-black text-xs font-bold px-4 py-1 rounded-full" style={{ background: gold }}>
                  ✦ RECOMMANDÉ
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: gold }}>Premium</h3>
                  <p className="text-4xl font-bold mt-2">24,90€<span className="text-sm text-white/30">/mois</span></p>
                </div>
                <ul className="flex flex-col gap-3 text-white/50 text-sm">
                  <li>✦ Carte fidélité digitale</li>
                  <li>✦ QR code boutique</li>
                  <li>✦ Gestion des points</li>
                  <li>✦ Partage carte entre amis</li>
                  <li>✦ Système d'affiliation</li>
                  <li>✦ Notifications clients</li>
                  <li>✦ Statistiques avancées</li>
                  <li>✦ Profil boutique complet</li>
                </ul>
                <Link href="/register-commercant" className="font-bold py-3 rounded-xl text-center transition text-black" style={{ background: gold }}>
                  Essai gratuit 14 jours
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-4 py-24 border-t" style={{ borderColor: "rgba(184,150,90,0.1)" }}>
          <div className="max-w-2xl mx-auto text-center flex flex-col gap-8">
            <h2 className="text-4xl font-bold">Prêt à fidéliser vos clients ?</h2>
            <p className="text-white/50 text-lg">Rejoignez les commerçants qui ont choisi l'élégance digitale.</p>
            <Link href="/register-commercant" className="font-bold px-8 py-4 rounded-2xl text-lg transition text-black mx-auto" style={{ background: gold }}>
              Commencer gratuitement →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t px-8 py-8 flex justify-between items-center text-sm" style={{ borderColor: "rgba(184,150,90,0.1)", color: "rgba(255,255,255,0.2)" }}>
          <p>© 2026 ElitaPass. Tous droits réservés.</p>
          <p style={{ color: gold }}>L'art de fidéliser</p>
        </footer>
      </div>
    </main>
  );
}