import { useEffect } from "react";
import { login } from "@/lib/auth";
import { fetchItems } from "@/lib/firestore";

export default function Home() {
  useEffect(() => {
    const run = async () => {
      try {
        await login("example@example.com", "password123");
        const items = await fetchItems();
        console.log(items);
      } catch (err) {
        console.error("エラー:", err);
      }
    };
    run();
  }, []);

  return (
    <div>
      <h1>Firebase 接続テスト</h1>
    </div>
  );
}
