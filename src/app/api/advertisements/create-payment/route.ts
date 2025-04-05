import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/db';
import { AdvertisementPaymentTable } from '@/drizzle/schema';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { adTypes, totalAmount } = body;
    
    if (!adTypes || !Array.isArray(adTypes) || adTypes.length === 0 || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'Advertisement types and total amount are required' },
        { status: 400 }
      );
    }
    
    // Generate unique ID for this order
    const paymentId = uuidv4();
    
    // Create a shorter receipt ID (using just the first 8 characters of the UUID)
    const shortReceiptId = paymentId.substring(0, 8);
    
    // Create Razorpay order
    const amountInPaise = Math.round(Number(totalAmount) * 100);
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `ad_${shortReceiptId}`, // Shortened receipt ID
      notes: {
        paymentId,
        adTypes: JSON.stringify(adTypes.map(ad => ad.type))
      }
    });
    
    // Save payment record to database
    await db.insert(AdvertisementPaymentTable).values({
      id: paymentId,
      orderId: order.id,
      amount: totalAmount,
      currency: 'INR',
      status: 'PENDING',
      adTypes: JSON.stringify(adTypes),
      createdAt: new Date(),
    });
    
    return NextResponse.json({
      orderId: order.id,
      id: paymentId,
      amount: amountInPaise
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error creating advertisement payment order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}