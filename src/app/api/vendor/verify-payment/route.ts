import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Interface for the expected request body
interface PaymentVerificationRequest {
  id:string,
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  vendorEmail: string;
  vendorName: string;
  amount: number;
  services: string[];
  companyName: string;
}

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL_USER,
    pass: process.env.NODEMAILER_EMAIL_PASSWORD // Use App Password for Gmail
  }
});

// Check if required environment variables are present
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const EMAIL_USER = process.env.NODEMAILER_EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.NODEMAILER_EMAIL_PASSWORD;

export async function POST(req: Request) {
  try {
    // Validate Razorpay secret key
    if (!RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET is not configured');
      return NextResponse.json(
        { status: 'error', message: 'Payment service is not configured' },
        { status: 500 }
      );
    }

    // Validate email configuration
    if (!EMAIL_USER || !EMAIL_APP_PASSWORD) {
      console.error('Email configuration is missing');
      return NextResponse.json(
        { status: 'error', message: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Parse and validate request body
    const paymentData: PaymentVerificationRequest = await req.json();
    const {
      id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      vendorEmail,
      vendorName,
      amount,
      services,
      companyName
    } = paymentData;


    
    // Verify payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Try to send confirmation email
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .details { margin: 20px 0; }
            .details li { margin-bottom: 10px; }
            .amount { color: #28a745; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Confirmation</h1>
            </div>
            <div class="content">
              <p>Dear ${vendorName},</p>
              <p>Thank you for your payment. Here are the details of your transaction:</p>
              <div class="details">
                <ul>
                  <li><strong>Company:</strong> ${companyName}</li>
                  <li><strong>Amount Paid:</strong> <span class="amount">₹${amount}</span></li>
                  <li><strong>Payment ID:</strong> ${razorpay_payment_id}</li>
                  <li><strong>Order ID:</strong> ${razorpay_order_id}</li>
                </ul>
              </div>
              <h2>Services Included:</h2>
       
              <p>If you have any questions, please don't hesitate to contact us.</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"Gennextit" <${EMAIL_USER}>`,
        to: vendorEmail,
        subject: 'Payment Confirmation',
        html: emailHtml,
      });
    } catch (emailError) {
      // Log email error but don't fail the payment verification
      console.error('Failed to send confirmation email:', emailError);
    }

    // Return success even if email fails
    return NextResponse.json({
      status: 'success',
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      uuid: id, // Replace this with actual payment UUID from your database
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Payment verification failed' 
      },
      { status: 500 }
    );
  }
}