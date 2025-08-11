'use client';

import { useCartStore } from '@/app/cart/store';

export type AddToCartProduct = {
  id: number;
  slug: string;
  title: string;
  priceCents: number;
  imageUrl?: string | null;
};

export default function AddToCartButton({ product }: { product: AddToCartProduct }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      onClick={() => addItem({
        productId: product.id,
        slug: product.slug,
        title: product.title,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl ?? undefined,
        quantity: 1,
      })}
      className="inline-flex items-center justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-900"
    >
      Add to Cart
    </button>
  );
}