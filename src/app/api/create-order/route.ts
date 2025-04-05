// app/api/payments/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { PlanTable, VendorPaymentTable } from '@/drizzle/schema';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, vendorId } = body;
    
    if (!planId || !vendorId) {
      return NextResponse.json(
        { success: false, error: 'Plan ID and Vendor ID are required' },
        { status: 400 }
      );
    }
    
    // Get plan details
    const [plan] = await db.select().from(PlanTable).where(eq(PlanTable.id, planId));
    
    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }
    
    // Create Razorpay order
    const amountInPaise = Math.round(Number(plan.price) * 100);
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: plan.currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId: planId,
        vendorId: vendorId
      }
    });
    
    // Save payment record
    await db.insert(VendorPaymentTable).values({
      vendorId,
      planId,
      orderId: order.id,
      amount: plan.price,
      currency: plan.currency || 'INR',
      status: 'PENDING',
    });
    
    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: amountInPaise,
        currency: plan.currency || 'INR',
        key: process.env.RAZORPAY_KEY_ID
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}