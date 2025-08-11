'use client';

import Link from 'next/link';
import { useCartStore } from '@/app/cart/store';

export default function Header() {
  const totalQuantity = useCartStore((s) => s.items.reduce((sum, it) => sum + it.quantity, 0));

  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-black">
          Shop
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-700 hover:text-black">Home</Link>
          <Link href="/cart" className="relative text-sm text-gray-700 hover:text-black">
            Cart
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-2 text-xs font-semibold text-white">
              {totalQuantity}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}