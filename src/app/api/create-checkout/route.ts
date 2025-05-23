import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe-server';
import { useMockData } from '@/lib/utils';

interface RequestBody {
  amount: number;
  userId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { amount, userId } = body;
    
    // 金額のバリデーション
    if (!amount || amount < 100 || amount > 100000) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // モックモードでは常に成功
    if (useMockData()) {
      return NextResponse.json({ 
        sessionId: 'mock-session-id', 
        url: '/charge/success?session_id=mock-session-id' 
      });
    }
    
    // Stripe Checkout Sessionの作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: 'Honor Purchaser チャージ',
              description: `${amount}円のチャージ`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/charge/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/charge/cancel`,
      metadata: {
        userId,
        amount: amount.toString(),
      },
    });
    
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}