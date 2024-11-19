import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; // Ensure you have prisma instance imported
import { getSession } from 'next-auth/react'; // To access session
import { convertUserIdToNumber } from '@/lib/utils'; // Import the helper function
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',  // Use the version you prefer
});


export async function POST(request: NextRequest) {
    try {
      const { chipsToDeduct, chipsToRaise } = await request.json();
  
      // Validate request params
      if (chipsToDeduct === undefined && chipsToRaise === undefined) {
        return new NextResponse(
          JSON.stringify({ error: 'No chips to deduct or raise provided' }),
          { status: 400 }
        );
      }
  
      const session = await getServerSession(authOptions);
      if (!session) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
  
      const userId = convertUserIdToNumber(session.user.id);
      if (userId === null) {
        return new NextResponse(JSON.stringify({ error: 'Invalid user ID' }), { status: 400 });
      }
  
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
      }
  
      let newBalance = user.balance;
  
      if (chipsToDeduct) {
        if (user.balance < chipsToDeduct) {
          return new NextResponse(
            JSON.stringify({ error: 'Insufficient chips for deduction' }),
            { status: 400 }
          );
        }
        newBalance -= chipsToDeduct;
      }
  
      if (chipsToRaise) {
        newBalance += chipsToRaise;
  

        const sessionId = await createStripeCheckoutSession(chipsToRaise, user.username+"@gmail.com", userId);
        return new NextResponse(JSON.stringify({ sessionId }), { status: 200 });
      }
  
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { balance: newBalance },
      });
  
      return new NextResponse(
        JSON.stringify({
          message: 'Chips updated successfully',
          remainingBalance: updatedUser.balance,
        }),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error:', error);
      return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
  }
  

// Function to create Stripe Checkout session for chip raise
const createStripeCheckoutSession = async (chipsToRaise: number, userEmail: string, userId: number) => {
  try {
    // Creating a Stripe checkout session for the chip raise
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',  // Adjust currency as needed
            product_data: {
              name: 'Pagese per Kredite ',
            },
            unit_amount: chipsToRaise, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-cancelled`,
      customer_email: userEmail, // Sending user's email to Stripe for notification
      metadata: {
        userId: userId.toString(),  // Make sure to pass the user ID as a string here
      },
    });

    // Return the session ID if created successfully
    if (checkoutSession && checkoutSession.id) {
      console.log('Stripe session created successfully:', checkoutSession.id);
      return checkoutSession.id; // Return session ID for redirect
    } else {
      throw new Error('Failed to create Stripe session');
    }
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw new Error('Error creating Stripe checkout session');
  }
};
