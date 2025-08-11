import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { formatCents } from '@/app/lib/format';
import AddToCartButton from '@/app/components/AddToCartButton';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug }, include: { category: true } });
  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-100">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-gray-400">No image</div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <div className="text-gray-500">Category: {product.category?.name}</div>
        <div className="text-xl font-semibold">{formatCents(product.priceCents, product.currency)}</div>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
        <div className="mt-4">
          <AddToCartButton product={{ id: product.id, slug: product.slug, title: product.title, priceCents: product.priceCents, imageUrl: product.imageUrl }} />
        </div>
      </div>
    </div>
  );
}