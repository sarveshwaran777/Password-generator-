import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = await prisma.$transaction([
    prisma.category.create({ data: { name: "Electronics", slug: "electronics" } }),
    prisma.category.create({ data: { name: "Books", slug: "books" } }),
    prisma.category.create({ data: { name: "Home", slug: "home" } }),
  ]);

  const [electronics, books, home] = categories;

  await prisma.product.createMany({
    data: [
      {
        title: "Wireless Headphones",
        slug: "wireless-headphones",
        description: "Noise-cancelling over-ear headphones with 30h battery.",
        priceCents: 12999,
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1518449021569-eb63bd6dbcbb?w=800&q=80&auto=format&fit=crop",
        categoryId: electronics.id,
      },
      {
        title: "4K Smart TV 55\"",
        slug: "4k-smart-tv-55",
        description: "55-inch UHD with HDR10 and built-in streaming apps.",
        priceCents: 39999,
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1593359677879-2b4b32d61d0d?w=800&q=80&auto=format&fit=crop",
        categoryId: electronics.id,
      },
      {
        title: "TypeScript Handbook",
        slug: "typescript-handbook",
        description: "Practical guide to TypeScript for large-scale apps.",
        priceCents: 2999,
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=800&q=80&auto=format&fit=crop",
        categoryId: books.id,
      },
      {
        title: "Non-stick Pan 12\"",
        slug: "non-stick-pan-12",
        description: "Durable non-stick skillet for everyday cooking.",
        priceCents: 2499,
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&q=80&auto=format&fit=crop",
        categoryId: home.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });