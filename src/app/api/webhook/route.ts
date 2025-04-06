// Next.js 14.0.0 対応
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe-server';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  const sig = headers().get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // 処理が続く...
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
