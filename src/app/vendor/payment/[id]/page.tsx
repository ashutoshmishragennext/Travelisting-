'use client';

import { useEffect, useState } from 'react';
import VendorPayment from '@/components/VendorPayment';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/pages/Navbar';
import { Check, AlertCircle, X } from 'lucide-react';
import { Plan } from '@/components/Plans';

interface PlanFeature {
  icon: string;
  text: string;
}

const VendorRegistration = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [vendorId, setVendorId] = useState<string>("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setVendorId(params.id);
    fetchPlans();
  }, [params.id]);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      const data = await response.json();
      if (data) {
        const activePlans = data.filter((plan: Plan) => plan.isActive);
        setPlans(activePlans);
        // const defaultPlan = activePlans.find((plan: { name: string; }) => plan.name.toLowerCase() === 'gold') || activePlans[0];
        // setSelectedPlan(defaultPlan || null);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    console.log('Payment successful');
    router.push(`/vendor/edit/${vendorId}`);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
  };

  const handleClose = () => {
    setSelectedPlan(null);
  };

  const parseFeatures = (features: Record<string, any>): PlanFeature[] => {
    if (typeof features === 'object' && features !== null) {
      return Object.entries(features).map(([key, value]) => ({
        icon: '✓',
        text: `${key}: ${value}`
      }));
    }
    return [];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Our pricing is fair and competitive for businesses of all sizes
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const features = parseFeatures(plan.features);
            const isSelected = selectedPlan?.id === plan.id;
            const isGold = plan.name.toLowerCase() === 'gold';

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl bg-white p-8 shadow-lg transition-transform hover:scale-105 cursor-pointer
                  ${isSelected ? 'ring-2 ring-blue-500 scale-105' : ''}
                  ${isGold ? 'border-2 border-blue-200' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                {isGold && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full">
                      Best Value
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-6">
                    <span className="text-4xl font-bold">₹</span>
                    <span className="text-6xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-2">
                      /{plan.validityYears} year{plan.validityYears > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="ml-3 text-gray-600">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 px-6 rounded-lg transition-colors">
                    Upgrade to {plan.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Sheet */}
        <div
          className={`fixed top-0 right-0 w-2/5 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            selectedPlan ? 'translate-x-0' : 'translate-x-full'
          } border-l border-gray-200 overflow-y-auto`}
        >
          {selectedPlan && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Payment Details</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Selected Plan: {selectedPlan.name}
                    </h3>
                    <p className="mt-2 text-sm text-blue-700">
                      Amount to be paid: ₹{selectedPlan.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* <VendorPayment
                vendorId={vendorId}
                amount={selectedPlan.price}
                planId={selectedPlan.id}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration;