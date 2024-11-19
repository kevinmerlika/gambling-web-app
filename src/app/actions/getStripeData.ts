'use server';

import Stripe from 'stripe';
import { CheckoutSession, LineItem } from '../models/stripeData'; // Import your CheckoutSession and custom LineItem types

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

export const getSessionData = async (sessionId: string): Promise<CheckoutSession | undefined> => {
  try {
    // Retrieve the session from Stripe with expanded line_items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'], // This ensures line_items are included in the response
    });

    // Map Stripe's LineItems to your custom LineItem type
    const mappedLineItems: LineItem[] = session.line_items?.data.map(item => ({
      id: item.id,
      object: item.object,
      amount_subtotal: item.amount_subtotal ?? null,
      amount_total: item.amount_total ?? null,
      description: item.description ?? '',
      price_data: item.price_data
        ? {
            currency: item.price_data.currency,
            product: item.price_data.product,
            unit_amount: item.price_data.unit_amount ?? 0,
          }
        : undefined,
      quantity: item.quantity,
    })) ?? [];

    // Cast the Stripe session to the CheckoutSession type
    const checkoutSession: CheckoutSession = {
      id: session.id,
      object: session.object,
      amount_subtotal: session.amount_subtotal ?? null,
      amount_total: session.amount_total ?? null,
      cancel_url: session.cancel_url ?? null,
      client_reference_id: session.client_reference_id ?? null,
      created: session.created,
      currency: session.currency,
      paymentMethod: session.payment_method_types[0],
      customer_details: {
        address: {
          city: session.customer_details?.address?.city ?? null,
          country: session.customer_details?.address?.country ?? '',
          line1: session.customer_details?.address?.line1 ?? null,
          line2: session.customer_details?.address?.line2 ?? null,
          postal_code: session.customer_details?.address?.postal_code ?? null,
          state: session.customer_details?.address?.state ?? null,
        },
        email: session.customer_details?.email ?? '',
        name: session.customer_details?.name ?? '',
        phone: session.customer_details?.phone ?? null,
        tax_exempt: session.customer_details?.tax_exempt ?? 'none',
        tax_ids: session.customer_details?.tax_ids ?? [],
      },
      customer_email: session.customer_email ?? '',
      expires_at: session.expires_at,
      line_items: {
        object: 'list' ,
        data: mappedLineItems, // Use the mapped line items here
        has_more: session.line_items?.has_more ?? false,
        url: session.line_items?.url ?? '',
      },
      payment_status: session.payment_status ?? 'unpaid',
      success_url: session.success_url ?? '',
      total_details: {
        amount_discount: session.total_details?.amount_discount ?? 0,
        amount_shipping: session.total_details?.amount_shipping ?? 0,
        amount_tax: session.total_details?.amount_tax ?? 0,
      },
      status: session.status ?? 'incomplete',
      metadata: session.metadata
    };

    return checkoutSession;
  } catch (error) {
    console.error('Error retrieving session:', error);
    return undefined;
  }
};
