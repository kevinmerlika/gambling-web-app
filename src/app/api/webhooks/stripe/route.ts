import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { convertUserIdToNumber } from '@/lib/utils';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    const body = await req.text();
    if (!sig) throw new Error('Stripe signature missing');

    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Session metadata userId: ', session.metadata?.userId);

        await handleCheckoutSession(session);
        break;
      }
      case 'refund.created':{
        const refundData = event.data.object as Stripe.Refund
        console.log('charge id is '+refundData.charge+" on REFUND");
        
        await refundTransaction(refundData!!.charge!!.toString(), 'refunded')
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Webhook error: ${err.message}`);
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }
}

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  try {
    if (!session.metadata?.userId) {
      console.error('User ID missing in session metadata');
      return;
    }

    const userId = convertUserIdToNumber(session.metadata.userId);
    const amountPaid = (session.amount_total ?? 0);
    const currency = session.currency;

    // Retrieve the payment intent to get the charge ID
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

    const chargeId = paymentIntent.latest_charge?.toString();
    if (chargeId) {
      console.log(`Charge ID: ${chargeId}`);
      // Store the transaction in the database
      await createTransaction(userId!, chargeId, amountPaid, currency!, session.id);
    } else {
      console.error('Charge ID not found');
    }

    await updateUserBalance(userId!, amountPaid);
    console.log(`Payment successful. User ID: ${userId}, Amount: ${amountPaid}`);
  } catch (error) {
    console.error('Error handling checkout session:', error);
  }
}

import { Prisma } from '@prisma/client';

async function createTransaction(userId: number, chargeId: string, amount: number, currency: string, referenceLink?: string) {
    try {
      const transactionData: Prisma.TransactionCreateInput = {
        transactionId: chargeId,
        total: amount,
        type: 'Top Up',
        currency: currency,
        status: 'completed',
        referenceLink: referenceLink || '',  // Default to empty string if undefined
        date: new Date(),  // You may want to set this based on the current time
        user: {
          connect: { id: userId },  // Use the 'connect' method to link the existing user by ID
        },
      };
  
      const transaction = await prisma.transaction.create({
        data: transactionData,
      });
  
      console.log('Transaction created successfully:', transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  }
  
  async function refundTransaction(
    chargeId: string,
    status: string = 'Refunded'
  ) {
    try {
      // Update the transaction status
      const updatedTransaction = await prisma.transaction.update({
        where: { transactionId: chargeId },
        data: { status, date: new Date() }, // Optionally update the date to reflect the refund time
      });
  
      console.log('Transaction updated successfully:', updatedTransaction);
  
      // Return the updated transaction
      return updatedTransaction;
    } catch (error: any) {
      if (error.code === 'P2025') {
        console.error('Transaction not found for refund:', chargeId);
        throw new Error('Transaction not found');
      }
  
      console.error('Error updating transaction status:', error.message || error);
      throw new Error('Failed to update transaction status');
    }
  }
  
  
  


async function updateUserBalance(userId: number, amountPaid: number) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return;
    }

    console.log('Updating balance for user: ', user);

    const newBalance = user.balance + amountPaid;

    await prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });

    console.log(`User ID: ${userId} balance updated to ${newBalance}`);
  } catch (error) {
    console.error('Error updating user balance:', error);
  }
}
