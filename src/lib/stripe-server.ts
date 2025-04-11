import { useMockData } from './utils';
import Stripe from 'stripe';

// モックモードのチェック
const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'false';

// モックStripeオブジェクト
const mockStripe = {
  checkout: {
    sessions: {
      create: async () => ({
        id: 'mock-session-id',
        url: 'https://example.com/checkout'
      })
    }
  },
  webhooks: {
    constructEvent: () => ({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'mock-session-id',
          metadata: {
            userId: 'mock-user-id',
            amount: '1000'
          },
          payment_intent: 'mock-payment-intent'
        }
      }
    })
  }
};

// 実際のStripeか、モックStripeを条件に応じて使用
let stripe: Stripe | typeof mockStripe;

if (isMockMode) {
  stripe = mockStripe;
} else {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16'
  });
}

export default stripe;