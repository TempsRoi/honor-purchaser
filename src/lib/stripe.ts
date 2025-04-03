import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useMockData } from './utils';

// クライアント側Stripe初期化
let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (useMockData()) {
    // モックモードの場合はダミーのPromiseを返す
    return Promise.resolve({
      redirectToCheckout: async () => ({ error: null })
    } as unknown as Stripe);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};