import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, prenom, nomBoutique, message, carteUrl } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "ElitaPass <onboarding@resend.dev>",
      to: email,
      subject: `✦ Message de ${nomBoutique}`,
      html: `
        <div style="background:#000;padding:40px;font-family:sans-serif;max-width:500px;margin:0 auto;">
          <p style="color:#B8965A;font-weight:700;letter-spacing:3px;font-size:13px;">ELITAPASS</p>
          <h1 style="color:#fff;font-size:24px;margin-top:16px;">
            Bonjour ${prenom} ! 👑
          </h1>
          <p style="color:rgba(255,255,255,0.4);font-size:13px;margin-top:8px;">
            Message de votre boutique préférée
          </p>
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(184,150,90,0.2);border-radius:16px;padding:24px;margin-top:24px;">
            <p style="color:#fff;font-size:16px;line-height:1.6;margin:0;">${message}</p>
          </div>
          <a href="${carteUrl}" style="display:inline-block;background:#B8965A;color:#000;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px;margin-top:24px;">
            Voir ma carte fidélité →
          </a>
          <p style="color:rgba(255,255,255,0.3);font-size:11px;margin-top:40px;">
            L'art de fidéliser · ElitaPass · ${nomBoutique}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
  }
}