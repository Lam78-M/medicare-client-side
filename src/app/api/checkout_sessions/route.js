import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe' 

export async function POST(req) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    
    const { doctorName, consultationFee, appointmentId, userEmail } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      
      line_items: [
        {
          price_data: {
            currency: 'bdt', 
            product_data: {
              name: `Consultation with ${doctorName}`,
              description: `Appointment Payment Reference ID: ${appointmentId}`,
            },
            unit_amount: consultationFee * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      
      // 🚀 FIX: Comment out or remove this line to bypass "Confirm it's you" / Link login trigger
      // customer_email: userEmail, 

      metadata: {
        appointmentId: appointmentId,
      },
      success_url: `${origin}/dashboard/patient?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/patient?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    return NextResponse.json(      
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}