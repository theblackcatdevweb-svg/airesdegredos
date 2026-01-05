import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { items } = await request.json();

    const line_items = items.map((item: any) => {
      // Creamos la base del objeto del producto
      const productData: any = {
        name: item.nombre,
        images: [item.imagen.startsWith('http') ? item.imagen : `${request.headers.get('origin')}${item.imagen}`],
      };

      // SOLO añadimos la descripción si existe y no es una cadena vacía
      if (item.descripcion && item.descripcion.trim() !== "") {
        productData.description = item.descripcion;
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: productData,
          unit_amount: Math.round(parseFloat(item.precio) * 100),
        },
        quantity: item.cantidad,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success`,
      cancel_url: `${request.headers.get('origin')}/carrito`,
      shipping_address_collection: { 
        allowed_countries: ['ES'] 
      },
      phone_number_collection: {
        enabled: true,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Error en Checkout:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};