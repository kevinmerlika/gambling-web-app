// app/api/refund/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',  // Make sure to use the correct API version
});

export async function POST(req: Request) {
  try {
    const { chargeId } = await req.json(); // Extract chargeId from request body

    // Ensure chargeId is provided
    if (!chargeId) {
      return NextResponse.json({ error: 'chargeId is required' }, { status: 400 });
    }

    // Create a refund for the charge
    const refund = await stripe.refunds.create({
      charge: chargeId, // The charge ID you want to refund
    });

    // Return the refund result as a response
    return NextResponse.json(refund);
  } catch (error) {
    console.error('Error processing refund:', error);
    return NextResponse.json({ error: 'Refund failed' }, { status: 500 });
  }
}
