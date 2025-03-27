import PayButton from "@/components/PayButton";
import RankingList from "@/components/RankingList";

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Honor Purchaser</h1>

      {/* 支払いボタン */}
      <PayButton />

      {/* ランキング枠 */}
      <div className="mt-8 w-full max-w-2xl">
        <RankingList />
      </div>
    </div>
  );
}
