// app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

import { eq } from 'drizzle-orm';
import { addDays } from 'date-fns';
import { db } from '@/lib/db';
import { PlanTable, VendorAdvertisementPurchaseTable, VendorPaymentTable } from '@/drizzle/schema';

// Razorpay signature verification
function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(orderId + '|' + paymentId)
    .digest('hex');
    
  return generatedSignature === signature;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify payment signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
    
    // Update payment record
    const [payment] = await db
      .update(VendorPaymentTable)
      .set({
        paymentId: razorpay_payment_id,
        status: 'COMPLETED',
        isVerified: true,
        updatedAt: new Date()
      })
      .where(eq(VendorPaymentTable.orderId, razorpay_order_id))
      .returning();
      
    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment record not found' },
        { status: 404 }
      );
    }
    
    // Get plan details
    const [plan] = await db
      .select()
      .from(PlanTable)
      .where(eq(PlanTable.id, payment.planId));
      
    // Create advertisement purchase
    const startDate = new Date();
    const endDate = addDays(startDate, plan.duration);
    
    const [purchase] = await db
      .insert(VendorAdvertisementPurchaseTable)
      .values({
        vendorId: payment.vendorId,
        advertisementTypeId: plan.adType,
        paymentId: payment.id,
        startDate,
        endDate,
        status: 'ACTIVE',
        adContent: {}
      })
      .returning();
    
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: payment.id,
        purchaseId: purchase.id,
        startDate: purchase.startDate,
        endDate: purchase.endDate
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}