export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">利用規約</h1>
      <p>この利用規約（以下、「本規約」といいます。）は、Honor Purchaser（以下、「当サービス」といいます。）の利用に関する条件を定めるものです。</p>

      <h2 className="text-2xl font-bold mt-6">第1条（適用）</h2>
      <p>本規約は、ユーザー（以下、「利用者」といいます。）が当サービスを利用する際の一切の行為に適用されます。</p>

      <h2 className="text-2xl font-bold mt-6">第2条（禁止事項）</h2>
      <p>利用者は、以下の行為を禁止します。</p>
      <ul className="list-disc pl-6">
        <li>法令または公序良俗に違反する行為</li>
        <li>当サービスの運営を妨害する行為</li>
      </ul>

      <h2 className="text-2xl font-bold mt-6">第3条（免責事項）</h2>
      <p>当サービスは、提供する情報の正確性・完全性を保証しません。</p>

      <p className="mt-6">本規約の内容は、必要に応じて変更することがあります。</p>
    </div>
  );
}
