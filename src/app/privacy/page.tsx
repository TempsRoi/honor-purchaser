export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">プライバシーポリシー</h1>
      <p>当サービスは、ユーザーのプライバシーを尊重し、適切に個人情報を取り扱います。</p>

      <h2 className="text-2xl font-bold mt-6">1. 収集する情報</h2>
      <p>当サービスは、以下の情報を収集することがあります。</p>
      <ul className="list-disc pl-6">
        <li>氏名、メールアドレス</li>
        <li>クレジットカード情報（Stripeを利用し、当社では保存しません）</li>
      </ul>

      <h2 className="text-2xl font-bold mt-6">2. 情報の利用目的</h2>
      <p>当サービスは、収集した情報を以下の目的で使用します。</p>
      <ul className="list-disc pl-6">
        <li>サービスの提供・改善</li>
        <li>お問い合わせ対応</li>
      </ul>

      <h2 className="text-2xl font-bold mt-6">3. 情報の共有</h2>
      <p>当サービスは、ユーザーの同意なしに個人情報を第三者と共有しません。</p>

      <p className="mt-6">本ポリシーは、必要に応じて変更することがあります。</p>
    </div>
  );
}
