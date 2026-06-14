import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, prenom, nom, carteUrl } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "ElitaPass <onboarding@resend.dev>",
      to: email,
      subject: "✦ Votre carte fidélité ElitaPass",
      html: `
        <div style="background:#000;padding:40px;font-family:sans-serif;max-width:500px;margin:0 auto;">
          <p style="color:#B8965A;font-weight:700;letter-spacing:3px;font-size:13px;">ELITAPASS</p>
          <h1 style="color:#fff;font-size:24px;margin-top:16px;">
            Bonjour ${prenom} ! 👑
          </h1>
          <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;">
            Votre carte fidélité VIP a été créée avec succès. Retrouvez-la à tout moment en cliquant sur le bouton ci-dessous.
          </p>
          <a href="${carteUrl}" style="display:inline-block;background:#B8965A;color:#000;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px;margin-top:24px;">
            Accéder à ma carte →
          </a>
          <p style="color:rgba(255,255,255,0.3);font-size:11px;margin-top:40px;">
            L'art de fidéliser · ElitaPass
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
  }
}