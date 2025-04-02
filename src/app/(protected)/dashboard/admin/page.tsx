"use client";


import { toast } from "@/components/ui/use-toast";
import VendorBasicInfo from '@/components/vendorpage/VendorBasicInfo';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
// import ContactInfo from '@/components/vendorpage/ContectInfo';
import ContactInfo from '@/components/vendorpage/ContectInfo';
import ContactInfo2 from '@/components/vendorpage/SelectDate';
import { useCurrentUser } from '@/hooks/auth';
import AgentInfo from "@/components/vendorpage/AgentInfo";


// import ContactInfo from '@/components/vendorpage/ContectInfo';

type FormDataType = {
  [key: string]: any;
};

type StepType = {
  component: React.ComponentType<any>;
  title: string;
  img:string;
};

const StepCompletionScreen = ({ title, onContinue }:any) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title} Completed!</h2>
    <p className="text-gray-600 mb-6">Great job! You're one step closer to setting up your vendor profile.</p>
    <button
      onClick={onContinue}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
    >
      Continue to Next Step
    </button>
  </div>
);

const VendorRegistrationForm: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormDataType>({});
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showOptionsStep, setShowOptionsStep] = useState<boolean>(true);
  const [selectedOptions, setSelectedOptions] = useState<Set<'service' | 'product'>>(new Set());
  const [currentForm, setCurrentForm] = useState<'service' | 'product' | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'service' | 'product' | null>(null);
  
 const role = useCurrentUser();
 const handleOptionSelect = (option: 'service' | 'product') => {
  setSelectedOption(option);
  setShowOptionsStep(false);
  setCurrentForm(option);
};

const steps: StepType[] = [
  { component: VendorBasicInfo, title: 'Basic Information', img: '/basic.gif' },
  { component: ContactInfo, title: 'Contact Information', img: '/basic2.gif' },
  { component: AgentInfo, title: 'Contact Information', img: '/basic2.gif' },
  { component: ContactInfo2, title: 'Contact Information', img: '/basic2.gif' },

  // { component: () => {
  //   if (showOptionsStep) {
  //     return (
  //       <div className="flex flex-col items-center space-y-8 py-6">
  //         <h2 className="text-2xl font-bold text-gray-800 mb-8">What would you like to add?</h2>
          
  //         <div className="flex flex-col space-y-4">
  //           <div className="flex items-center space-x-4">
  //             <input
  //             hidden
  //               type="radio"
  //               id="service-option"
  //               name="vendor-type"
  //               value="service"
  //               checked={selectedOption === 'service'}
  //               onChange={() => handleOptionSelect('service')}
  //               className="w-5 h-5"
  //             />
  //             <label htmlFor="service-option" className="flex items-center space-x-4 flex-1 p-4 bg-white rounded-xl shadow-lg cursor-pointer hover:bg-blue-50 transition-colors">
  //               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
  //                 <Briefcase className="w-6 h-6 text-blue-600" />
  //               </div>
  //               <div>
  //                 <span className="text-lg font-semibold text-gray-800">Add Services</span>
  //                 <p className="text-sm text-gray-600">List your professional services and expertise</p>
  //               </div>
  //             </label>
  //           </div>

  //           <div className="flex items-center space-x-4">
  //             <input
  //               hidden
  //               type="radio"
  //               id="product-option"
  //               name="vendor-type"
  //               value="product"
  //               checked={selectedOption === 'product'}
  //               onChange={() => handleOptionSelect('product')}
  //               className="w-5 h-5"
  //             />
  //             <label htmlFor="product-option" className="flex items-center space-x-4 flex-1 p-4 bg-white rounded-xl shadow-lg cursor-pointer hover:bg-green-50 transition-colors">
  //               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
  //                 <Package className="w-6 h-6 text-green-600" />
  //               </div>
  //               <div>
  //                 <span className="text-lg font-semibold text-gray-800">Add Products</span>
  //                 <p className="text-sm text-gray-600">Showcase your products and inventory</p>
  //               </div>
  //             </label>
  //           </div>
  //         </div>

  //         <button
  //           onClick={handleFinalSubmit}
  //           className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
  //         >
  //           {loading ? "Submitting..." : 'Skip for Now'}
  //         </button>
  //       </div>
  //     );
  //   }

  //   // Show the appropriate form based on selection
  //   if (currentForm === 'service') {
  //     return (
  //       <div>
  //         <h3 className="text-xl font-semibold mb-6">Add Services</h3>
  //         <ServicesInfo data={formData} updateData={updateData} />
  //       </div>
  //     );
  //   }
    
  //   return (
  //     <div>
  //       <h3 className="text-xl font-semibold mb-6">Add Products</h3>
  //       <VendorProductForm data={formData} updateData={updateData} />
  //     </div>
  //   );
  // }, title: 'Services & Products', img: '/basic3.gif' },
];
 

  const updateData = (newData: FormDataType) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };
  const handleStepComplete = () => {
    setShowCompletion(true);
  };
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleVendorSubmit = async () => {
    try {
      const vendorSubmitData = {
        ...formData,
        userId: role?.id,
        paymentStatus: "draft",
        services: undefined,
        products: undefined,
        certifications: undefined,
        references: undefined,
      };
  
      // Create vendor profile
      const vendorResponse = await fetch('/api/vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorSubmitData),
      });
  
      if (!vendorResponse.ok) {
        const errorData = await vendorResponse.json();
        throw new Error(errorData.error || 'Failed to create vendor profile');
      }
      
      const vendorData = await vendorResponse.json();
      const newVendorId = vendorData.data.id;
      setVendorId(newVendorId);
  
      if (role?.id) {
        // Update user with vendor profile ID
        const updateData = {
          vendorProfileId: newVendorId,
          role:"VENDOR",
          updatedAt: new Date().toISOString(),
        };
  
        const updateUserResponse = await fetch(`/api/users/${role.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });
  
        if (!updateUserResponse.ok) {
          const errorData = await updateUserResponse.json();
          throw new Error(errorData.error || 'Failed to update user profile with vendor ID');
        }
  
        const updateUserData = await updateUserResponse.json();
        console.log('User updated successfully:', updateUserData);
      }
  
      toast({
        title: "Success",
        description: "Vendor profile created successfully",
      });
      
      return newVendorId;
    } catch (error) {
      console.error('Error submitting vendor:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit vendor information",
        variant: "destructive"
      });
      throw error;
    }
  };

    


        
      
      
      

    
  

  const handleServicesSubmit = async (vendorId: string) => {
    if (!formData.services?.length) return;
    
    try {
      await Promise.all(formData.services.map((service: any) =>
        fetch('/api/vendorservice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...service, vendorId }),
        })
      ));
    } catch (error) {
      console.error('Error submitting services:', error);
      toast({
        title: "Error",
        description: "Failed to submit vendor services",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleProductsSubmit = async (vendorId: string) => {
    if (!formData.products?.length) return;
    
    try {
      await Promise.all(formData.products.map((product: any) =>
        fetch('/api/vendorproduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...product, vendorId }),
        })
      ));
    } catch (error) {
      console.error('Error submitting products:', error);
      toast({
        title: "Error",
        description: "Failed to submit vendor products",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const vendorId = await handleVendorSubmit();
     
      
      if (selectedOptions.has('service')) {
        await handleServicesSubmit(vendorId);
      }
      
      if (selectedOptions.has('product')) {
        await handleProductsSubmit(vendorId);
      }

      toast({
        title: "Registration Successful! 🎉",
        description: "Your vendor profile has been created successfully. Redirecting to your profile page...",
        variant: "default",
        duration: 3000,
      });

      
        router.push(`/vendor/${vendorId}`);
     

    } catch (error) {
      console.error('Final submission error:', error);
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Form Section */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
            {/* Progress Steps */}
            <div className=" justify-between hidden mb-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index === currentStep
                      ? 'text-blue-600'
                      : index < currentStep
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                    ${
                      index === currentStep
                        ? 'border-blue-600 bg-blue-50'
                        : index < currentStep
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-400'
                    }`}
                  >
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-px w-24 mx-2 ${
                      index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Current Step Form */}
            <CurrentStepComponent
              data={formData}
              updateData={updateData}
              vendorId={vendorId}
              handleNextStep = {handleNextStep}
            />

            {/* Navigation Buttons */}
            {/* <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 0}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  currentStep === 0
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              <button
                onClick={handleNextStep}
                className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div> */}
          </div>

          {/* GIF/Animation Section */}
          {/* <div className="hidden md:block flex-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <img
                  src={steps[currentStep].img}
                  alt="Registration process animation"
                  className="w-full h-auto rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-600">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default VendorRegistrationForm;