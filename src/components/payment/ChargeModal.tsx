import { User } from 'firebase/auth';

async function handlePayment(user: User | null) {
  if (!user) {
    console.error('User is not authenticated');
    return;
  }

  try {
    // ユーザーオブジェクトが正しいかチェック
    if ('getIdToken' in user && typeof user.getIdToken === 'function') {
      const token = await user.getIdToken();
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: 1000 }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();
      console.log('Payment successful', data);
    } else {
      console.error('Invalid user object: missing getIdToken');
    }
  } catch (err) {
    console.error('Payment error:', err);
  }
}
