import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">© 2024 Honor Purchaser. All rights reserved.</p>
        <div className="mt-2">
          <Link href="/terms" className="text-gray-400 hover:text-white mx-2">
            利用規約
          </Link>
          |
          <Link href="/privacy" className="text-gray-400 hover:text-white mx-2">
            プライバシーポリシー
          </Link>
        </div>
      </div>
    </footer>
  );
}
