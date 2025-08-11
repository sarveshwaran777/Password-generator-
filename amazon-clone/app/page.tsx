import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/app/lib/prisma";
import AddToCartButton from "@/app/components/AddToCartButton";
import { formatCents } from "@/app/lib/format";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Latest Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="rounded-lg border bg-white p-4 flex flex-col gap-3">
            <Link href={`/product/${p.slug}`} className="block">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-100">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-gray-400">No image</div>
                )}
              </div>
              <h3 className="mt-3 text-base font-medium text-gray-900">{p.title}</h3>
            </Link>
            <div className="text-sm text-gray-500">{p.category?.name}</div>
            <div className="mt-auto flex items-center justify-between">
              <div className="text-lg font-semibold">{formatCents(p.priceCents, p.currency)}</div>
              <AddToCartButton product={{ id: p.id, slug: p.slug, title: p.title, priceCents: p.priceCents, imageUrl: p.imageUrl }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
