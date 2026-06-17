import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const commercantId = session.metadata?.commercantId;
    const priceId = session.line_items?.data[0]?.price?.id;

    const abonnement = priceId === process.env.STRIPE_PRICE_PREMIUM ? "premium" : "basic";

    await supabase
      .from("commercants")
      .update({
        abonnement,
        trial_actif: false,
        stripe_customer_id: session.customer as string,
      })
      .eq("id", commercantId);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    await supabase
      .from("commercants")
      .update({ abonnement: "basic", trial_actif: false })
      .eq("stripe_customer_id", customerId);
  }

  return NextResponse.json({ received: true });
}