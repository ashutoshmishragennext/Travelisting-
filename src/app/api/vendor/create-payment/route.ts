import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm'
import { VendorPaymentTable } from '@/drizzle/schema';
import { db } from '@/lib/db';
import { razorpay } from '@/utils/razorpay';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const orderId = searchParams.get('orderId');

    const query = db.select().from(VendorPaymentTable);

    if (vendorId) {
      query.where(eq(VendorPaymentTable.vendorId, vendorId));
    }
    if (orderId) {
      query.where(eq(VendorPaymentTable.orderId, orderId));
    }

    const payments = await query;

    if (!payments.length) {
      return NextResponse.json({
        success: false,
        error: 'No payments found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: payments
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching vendor payments:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch payments'
    }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const { vendorId, amount, planId } = await req.json();

    if (!vendorId || !amount) {
      return NextResponse.json(
        { error: 'Vendor ID and amount are required' },
        { status: 400 }
      );
    }

    // Verify vendor exists
    const vendor = await db.query.VendorProfileTable.findFirst({
      where: (vendor) => eq(vendor.id, vendorId)
    });

    // const id = await db.query.VendorPaymentTable.findFirst({
    //   where: (pay) => eq(pay.id, vendorId)
    // });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Generate a shorter receipt ID (max 40 chars)
    const timestamp = Date.now().toString().slice(-8);
    const receiptId = `vp_${vendorId}_${timestamp}`.slice(0, 40);

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: receiptId,
    });

    // Store payment details and get the inserted record
    const [paymentRecord] = await db.insert(VendorPaymentTable).values({
      vendorId,
      orderId: order.id,
      amount,
      planId,
      status: 'created',
    }).returning({ id: VendorPaymentTable.id });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      id: paymentRecord.id  // Added this line to include the payment ID
    });
  } catch (error: any) {
    console.error('Error creating vendor payment:', error);
    
    // Handle Razorpay specific errors
    if (error.statusCode === 400) {
      return NextResponse.json(
        { 
          error: 'Invalid payment details',
          details: error.error?.description || 'Bad request'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}