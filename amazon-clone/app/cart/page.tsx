'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCartStore } from '@/app/cart/store';
import { formatCents } from '@/app/lib/format';

export default function CartPage() {
  const { items, setQuantity, removeItem, clear } = useCartStore();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const totalCents = items.reduce((sum, it) => sum + it.priceCents * it.quantity, 0);

  async function checkout() {
    if (!email) return alert('Enter an email');
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })) }),
      });
      if (!res.ok) throw new Error('Checkout failed');
      const data = (await res.json()) as { orderId: number };
      clear();
      alert(`Order placed! ID: ${data.orderId}`);
    } catch (e) {
      console.error(e);
      alert('Failed to checkout');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-gray-600">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.productId} className="flex items-center gap-4 rounded-lg border bg-white p-4">
                <div className="relative h-20 w-24 overflow-hidden rounded bg-gray-100">
                  {it.imageUrl ? (
                    <Image src={it.imageUrl} alt={it.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-gray-400">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm text-gray-500">{formatCents(it.priceCents)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="h-8 w-8 rounded border" onClick={() => setQuantity(it.productId, it.quantity - 1)}>-</button>
                    <div className="w-10 text-center">{it.quantity}</div>
                    <button className="h-8 w-8 rounded border" onClick={() => setQuantity(it.productId, it.quantity + 1)}>+</button>
                    <button className="ml-4 text-sm text-red-600" onClick={() => removeItem(it.productId)}>Remove</button>
                  </div>
                </div>
                <div className="font-semibold">{formatCents(it.priceCents * it.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border bg-white p-4 h-max">
            <div className="flex items-center justify-between">
              <div className="text-gray-600">Subtotal</div>
              <div className="font-semibold">{formatCents(totalCents)}</div>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">Email for receipt</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="you@example.com"
              />
            </div>
            <button
              onClick={checkout}
              disabled={submitting || items.length === 0}
              className="mt-4 w-full rounded-md bg-black px-4 py-2 text-white font-semibold disabled:opacity-50"
            >
              {submitting ? 'Processing…' : 'Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}