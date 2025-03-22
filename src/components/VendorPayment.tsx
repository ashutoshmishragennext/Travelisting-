// "use client";

// import { useState, useEffect } from "react";
// import Script from "next/script";
// import { useRouter } from "next/navigation";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { commissionService } from "@/utils/commission";
// import { useCurrentUser } from "@/hooks/auth";

// interface VendorData {
//   id: string;
//   userId: string;
//   companyName: string;
//   establishmentYear: number;
//   logo: string;
//   primaryContactName: string;
//   primaryContactEmail: string;
//   primaryContactPhone: string;
//   headquartersAddress: string;
//   state: string;
//   city: string;
//   pincode: string;
// }

// interface QuotationProps {
//   vendorId: string;
//   amount: number;
//   planId: string;
//   onSuccess?: () => void;
//   onError?: (error: string) => void;
// }

// interface PaymentVerificationResponse {
//   status: 'success' | 'error';
//   uuid: string;
//   message?: string;
// }

// interface RazorpayResponse {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }

// // interface SalesPersonData {
// //   createdBy: string;
// // }

// export default function VendorQuotation({
//   vendorId,
//   amount,
//   planId,
//   onSuccess,
//   onError,
// }: QuotationProps) {
//   const [loading, setLoading] = useState(false);
//   const [vendorData, setVendorData] = useState<VendorData | null>(null);
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [salesPersonId, setSalesPersonId] = useState<string | null>(null);
//   const router = useRouter();
//   const user = useCurrentUser();

//   useEffect(() => {
//     const fetchVendorData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/vendor/${vendorId}`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch vendor data");
//         }

//         const data = await response.json();
//         setVendorData(data);

//         // Fetch sales person data
//         const salesPersonResponse = await fetch(`/api/users?id=${user?.id}`);
//         if (!salesPersonResponse.ok) {
//           throw new Error("Failed to fetch sales person data");
//         }
//         const salesPersonData: any = await salesPersonResponse.json();
//         console.log("sale person data",salesPersonData);
        
//         setSalesPersonId(salesPersonData[0].createdBy);

//       } catch (error) {
//         console.error("Error fetching data:", error);
//         onError?.(
//           error instanceof Error ? error.message : "Failed to fetch data"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVendorData();
//   }, [vendorId, onError]);

//   const createCommission = async (paymentId: string, vendorId: string) => {
//     console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM",salesPersonId);
    
//     try {
//       return await commissionService.createCommission({
//         salesPersonId: salesPersonId || "" ,
//         vendorId,
//         paymentId,
//         planId,
//       });
//     } catch (error) {
//       console.error("Error creating commission:", error);
//       throw error;
//     }
//   };

//   const updatePaymentStatus = async (paymentStatus: string) => {
//     try {
//       const response = await fetch(`/api/vendor?id=${vendorId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           paymentStatus: paymentStatus
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update payment status");
//       }
//     } catch (error) {
//       console.error("Error updating payment status:", error);
//       throw error;
//     }
//   };

//   const handlePayment = async () => {
//     if (!vendorData) return;

//     try {
//       setPaymentLoading(true);

//       const response = await fetch("/api/vendor/create-payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ vendorId, amount, planId }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create payment order");
//       }

//       const { orderId, id } = await response.json();

//       const options: any = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: amount * 100,
//         currency: "INR",
//         name: vendorData.companyName,
//         description: "Service Quotation Payment",
//         order_id: orderId,
//         handler: async function (response: RazorpayResponse) {
//           try {
//             const verificationResponse = await fetch(
//               "/api/vendor/verify-payment",
//               {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                   razorpay_order_id: response.razorpay_order_id,
//                   razorpay_payment_id: response.razorpay_payment_id,
//                   razorpay_signature: response.razorpay_signature,
//                   vendorEmail: vendorData.primaryContactEmail,
//                   vendorName: vendorData.primaryContactName,
//                   amount: amount,
//                   id: id,
//                   companyName: vendorData.companyName,
//                   planId: planId,
//                 }),
//               }
//             );

//             if (!verificationResponse.ok) {
//               throw new Error("Payment verification failed");
//             }

//             const data: PaymentVerificationResponse = await verificationResponse.json();

//             if (data.status === "success") {
//               try {
//                 await Promise.all([
//                   createCommission(data.uuid, vendorId),
//                   updatePaymentStatus("success")
//                 ]);
//                 onSuccess?.();
//               } catch (error) {
//                 console.error("Error in post-payment processing:", error);
//                 throw error;
//               }
//             } else {
//               throw new Error(data.message || "Payment verification failed");
//             }
//           } catch (error) {
//             onError?.(
//               error instanceof Error ? error.message : "Payment failed"
//             );
//           }
//         },
//         prefill: {
//           name: vendorData.primaryContactName,
//           email: vendorData.primaryContactEmail,
//           contact: vendorData.primaryContactPhone,
//         },
//       };

//       const paymentObject = new (window as any).Razorpay(options);
//       paymentObject.open();
//     } catch (error) {
//       console.error("Payment error:", error);
//       onError?.(error instanceof Error ? error.message : "Payment failed");
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     );
//   }

//   if (!vendorData) {
//     return (
//       <div className="text-center p-6">
//         <p className="text-red-600">Failed to load vendor data</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Script
//         src="https://checkout.razorpay.com/v1/checkout.js"
//         strategy="lazyOnload"
//       />
//       <Card className="max-w-4xl mx-auto">
//         <CardHeader>
//           <div className="flex items-center space-x-4">
//             {vendorData.logo && (
//               <img
//                 src={vendorData.logo}
//                 alt={`${vendorData.companyName} logo`}
//                 className="w-16 h-16 object-contain"
//               />
//             )}
//             <div>
//               <h1 className="text-2xl font-bold">{vendorData.companyName}</h1>
//               <p className="text-gray-600">
//                 Est. {vendorData.establishmentYear}
//               </p>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent>
//           <div className="space-y-6">
//             <div className="bg-gray-50 px-6 py-2 rounded-lg">
//               <h2 className="text-xl font-semibold mb-4">Vendor Information</h2>
//               <Table>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell className="font-medium">Contact Person</TableCell>
//                     <TableCell>{vendorData.primaryContactName}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell className="font-medium">Email</TableCell>
//                     <TableCell>{vendorData.primaryContactEmail}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell className="font-medium">Phone</TableCell>
//                     <TableCell>{vendorData.primaryContactPhone}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell className="font-medium">Address</TableCell>
//                     <TableCell>
//                       {vendorData.headquartersAddress}, {vendorData.city},{" "}
//                       {vendorData.state} - {vendorData.pincode}
//                     </TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         </CardContent>

//         <CardFooter className="flex justify-end">
//           <Button
//             onClick={handlePayment}
//             disabled={paymentLoading}
//             className="w-full sm:w-auto"
//           >
//             {paymentLoading ? (
//               <>
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               `Pay ₹${amount.toLocaleString()}`
//             )}
//           </Button>
//         </CardFooter>
//       </Card>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { commissionService } from "@/utils/commission";
import { useCurrentUser } from "@/hooks/auth";

interface VendorData {
  id: string;
  userId: string;
  companyName: string;
  establishmentYear: number;
  logo: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  headquartersAddress: string;
  state: string;
  city: string;
  pincode: string;
}

interface QuotationProps {
  vendorId: string;
  amount: number;
  planId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface PaymentVerificationResponse {
  status: 'success' | 'error';
  uuid: string;
  message?: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export default function VendorQuotation({
  vendorId,
  amount,
  planId,
  onSuccess,
  onError,
}: QuotationProps) {
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [salesPersonId, setSalesPersonId] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success'>('idle');
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/vendor/${vendorId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch vendor data");
        }

        const data = await response.json();
        setVendorData(data);

        const salesPersonResponse = await fetch(`/api/users?id=${user?.id}`);
        if (!salesPersonResponse.ok) {
          throw new Error("Failed to fetch sales person data");
        }
        const salesPersonData: any = await salesPersonResponse.json();
        console.log("sale person data", salesPersonData);
        
        setSalesPersonId(salesPersonData[0].id);

      } catch (error) {
        console.error("Error fetching data:", error);
        onError?.(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [vendorId, onError]);

  const createCommission = async (paymentId: string, vendorId: string) => {
    console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM", salesPersonId);
    
    try {
      return await commissionService.createCommission({
        salesPersonId: salesPersonId || "",
        vendorId,
        paymentId,
        planId,
      });
    } catch (error) {
      console.error("Error creating commission:", error);
      throw error;
    }
  };

  const updatePaymentStatus = async (paymentStatus: string) => {
    try {
      const response = await fetch(`/api/vendor?id=${vendorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentStatus: paymentStatus
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!vendorData) return;

    try {
      setPaymentLoading(true);

      const response = await fetch("/api/vendor/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendorId, amount, planId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment order");
      }

      const { orderId, id } = await response.json();

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: vendorData.companyName,
        description: "Service Quotation Payment",
        order_id: orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            setVerificationStatus('verifying');
            const verificationResponse = await fetch(
              "/api/vendor/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  vendorEmail: vendorData.primaryContactEmail,
                  vendorName: vendorData.primaryContactName,
                  amount: amount,
                  id: id,
                  companyName: vendorData.companyName,
                  planId: planId,
                }),
              }
            );

            if (!verificationResponse.ok) {
              throw new Error("Payment verification failed");
            }

            const data: PaymentVerificationResponse = await verificationResponse.json();

            if (data.status === "success") {
              try {
                await Promise.all([
                  createCommission(data.uuid, vendorId),
                  updatePaymentStatus("success")
                ]);
                setVerificationStatus('success');
                setTimeout(() => {
                  onSuccess?.();
                }, 2000);
              } catch (error) {
                console.error("Error in post-payment processing:", error);
                throw error;
              }
            } else {
              throw new Error(data.message || "Payment verification failed");
            }
          } catch (error) {
            setVerificationStatus('idle');
            onError?.(
              error instanceof Error ? error.message : "Payment failed"
            );
          }
        },
        prefill: {
          name: vendorData.primaryContactName,
          email: vendorData.primaryContactEmail,
          contact: vendorData.primaryContactPhone,
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      onError?.(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!vendorData) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600">Failed to load vendor data</p>
      </div>
    );
  }

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
              <p className="text-gray-600">Your payment has been processed successfully.</p>
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
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            {vendorData.logo && (
              <img
                src={vendorData.logo}
                alt={`${vendorData.companyName} logo`}
                className="w-16 h-16 object-contain"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{vendorData.companyName}</h1>
              <p className="text-gray-600">
                Est. {vendorData.establishmentYear}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="bg-gray-50 px-6 py-2 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Vendor Information</h2>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Contact Person</TableCell>
                    <TableCell>{vendorData.primaryContactName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>{vendorData.primaryContactEmail}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Phone</TableCell>
                    <TableCell>{vendorData.primaryContactPhone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Address</TableCell>
                    <TableCell>
                      {vendorData.headquartersAddress}, {vendorData.city},{" "}
                      {vendorData.state} - {vendorData.pincode}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            onClick={handlePayment}
            disabled={paymentLoading}
            className="w-full sm:w-auto"
          >
            {paymentLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${amount.toLocaleString()}`
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}