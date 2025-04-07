import React, { useState, useEffect } from 'react';
import Script from "next/script";
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useCurrentUser } from '@/hooks/auth';

interface AdvertisementPaymentProps {
  selectedTypes: string[];
  totalPrice: number;
  getAdByType: (type: string) => any;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface PaymentVerificationResponse {
  status: 'success' | 'error';
  uuid: string;
  message?: string;
}

const AdvertisementPayment = ({
  selectedTypes,
  totalPrice,
  getAdByType,
  onPaymentSuccess,
  onPaymentError
}: AdvertisementPaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success'>('idle');
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);
  const user = useCurrentUser();
  useEffect(() => {
    // Fetch user data for Razorpay prefill
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user?id=${user?.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handlePayment = async () => {
    if (selectedTypes.length === 0) {
      toast({
        title: "No advertisements selected",
        description: "Please select at least one advertisement type.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Construct the payload with selected advertisement types
      const payload = {

        adTypes: selectedTypes.map(type => ({
          type,
          name: getAdByType(type)?.name || type,
          price: getAdByType(type)?.price || 0
        })),
        totalAmount: totalPrice
      };

      // Create order for Razorpay
      const response = await fetch('/api/advertisements/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const { orderId, id } = await response.json();

      // Initialize Razorpay
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalPrice * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Advertisement Purchase",
        description: "Advertisement Service Payment",
        order_id: orderId,
        userId:user?.id,
        handler: async function (response: RazorpayResponse) {
          try {
            setVerificationStatus('verifying');
            const verificationResponse = await fetch(
              "/api/advertisements/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  id: id,
                  adTypes: selectedTypes,
                  amount: totalPrice,
                  userId: user?.id,
                }),
              }
            );

            if (!verificationResponse.ok) {
              throw new Error("Payment verification failed");
            }

            const data: PaymentVerificationResponse = await verificationResponse.json();

            if (data.status === "success") {
              setVerificationStatus('success');
              setTimeout(() => {
                toast({
                  title: "Payment Successful",
                  description: "Your advertisements have been purchased successfully.",
                });
                onPaymentSuccess();
              }, 2000);
            } else {
              throw new Error(data.message || "Payment verification failed");
            }
          } catch (error) {
            setVerificationStatus('idle');
            console.error('Verification error:', error);
            toast({
              title: "Verification Failed",
              description: error instanceof Error ? error.message : "Payment verification failed",
              variant: "destructive",
            });
            onPaymentError(error instanceof Error ? error.message : "Payment verification failed");
          }
        },
        prefill: {
          name: userData?.name || '',
          email: userData?.email || '',
          contact: userData?.phone || '',
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An error occurred during payment.",
        variant: "destructive",
      });
      
      onPaymentError(error instanceof Error ? error.message : "Payment processing error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (verificationStatus === 'verifying' || verificationStatus === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          {verificationStatus === 'verifying' ? (
            <>
              <Loader2 className="w-16 h-16 animate-spin mx-auto text-blue-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Verifying Payment</h2>
              <p className="text-gray-600">Please wait while we process your payment...</p>
            </>
          ) : (
            <>
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
              <p className="text-gray-600">Your advertisement purchase has been confirmed.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div className="flex flex-wrap justify-between gap-4 w-full">
        <div className="text-lg font-semibold">
          Total: ₹{Number(totalPrice).toLocaleString()}
        </div>
        <Button 
          onClick={handlePayment} 
          className="flex items-center gap-2"
          disabled={isProcessing || selectedTypes.length === 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              Pay (₹{Number(totalPrice).toLocaleString()})
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default AdvertisementPayment;