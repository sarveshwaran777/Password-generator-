import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/app/lib/prisma';

const CheckoutSchema = z.object({
  email: z.string().email(),
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { email, items } = CheckoutSchema.parse(json);
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    const productById = new Map(products.map((p) => [p.id, p] as const));

    let totalCents = 0;
    const orderItemsData = items.map((i) => {
      const product = productById.get(i.productId);
      if (!product) throw new Error(`Product ${i.productId} not found`);
      const lineTotal = product.priceCents * i.quantity;
      totalCents += lineTotal;
      return {
        productId: product.id,
        title: product.title,
        priceCents: product.priceCents,
        quantity: i.quantity,
      };
    });

    const order = await prisma.order.create({
      data: {
        email,
        totalCents,
        currency: 'USD',
        items: { create: orderItemsData },
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}