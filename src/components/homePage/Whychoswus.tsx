"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Users, GraduationCap, Store } from "lucide-react";

interface StatProps {
  endValue: number;
  label: string;
  icon: React.ReactNode;
}

const StatCounter = ({ endValue, label, icon }: StatProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = endValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      setCount(Math.min(Math.floor(current * stepValue), endValue));
      if (current >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [endValue]);

  return (
    <Card className="flex flex-col items-center justify-center p-6 rounded-xl shadow-md bg-white w-40 h-28">
      <div className="text-primary mb-2">{icon}</div>
      <h2 className="text-xl  font-bold text-primary">{count}+</h2>
      <p className="text-sm text-gray-600 text-center">{label}</p>
    </Card>
  );
};

const WhyChooseUs = () => {
  const stats = [
    {
      endValue: 294,
      label: "Registered Vendors",
      icon: <ShoppingCart size={32} />,
    },
    {
      endValue: 117,
      label: "Vendor Trainings",
      icon: <GraduationCap size={32} />,
    },
  ];
  const stats1 = [
    {
      endValue: 117,
      label: "Vendor Trainings",
      icon: <GraduationCap size={32} />,
    },
    { endValue: 258, label: "Active Customers", icon: <Users size={32} /> },
  ];

  return (
    <section className="py-12 bg-gray-100 text-center">
      <h2 className="text-3xl font-bold text-primary mb-4">Why Choose Us</h2>
      <p className="text-gray-600 max-w-2xl mx-auto px-4">
        Join our trusted vendor network where we prioritize quality,
        reliability, and growth. Our platform connects quality vendors with
        consumers, ensuring optimal service delivery and product excellence. We
        provide comprehensive support and tools to help your business thrive in
        the digital marketplace.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-6">
        <div className="mt-8 md:mr-24 flex flex-col justify-between py-20 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StatCounter {...stat} />
            </motion.div>
          ))}
        </div>
        <div className=" flex justify-center space-x-4 items-start">
          <div className="relative bg-gray-900 rounded-3xl p-3 shadow-xl max-w-xs">
            <div className="relative bg-white rounded-2xl overflow-hidden h-[500px] w-64">
              {/* Preview Content */}
              <div>
                {/* Cover Image */}
                <img
                  src="/pic1.png"
                  alt="Business Cover"
                  className="w-full h-24 object-cover"
                />

                <div className="p-4 relative">
                  {/* Business Card */}
                  <div className="bg-white rounded-lg shadow-md p-3 mb-4 -mt-6 relative z-10">
                    <div className="flex items-center">
                      <div className="w-14 h-14 mr-3 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-400">
                          CW
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Cafe Wink</h3>
                        <p className="text-xs text-gray-500">
                          Restaurant and Coffee
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Reviews</h4>
                    <div className="flex items-center">
                      <div className="flex text-amber-500">
                        {"★★★★★".split("").map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        (101 Reviews)
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Open until 9:00 PM today - 9:30 AM to 9:00 PM
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-4">
                    <button className="bg-amber-500 text-white text-xs rounded-full px-4 py-1">
                      Message
                    </button>
                    <button className="bg-amber-500 text-white text-xs rounded-full px-4 py-1">
                      Call
                    </button>
                  </div>

                  {/* Items */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Items</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-100 rounded-lg h-16 flex items-center justify-center overflow-hidden">
                        <img
                          src="/pic3.png"
                          alt="Coffee"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="bg-gray-100 rounded-lg h-16 flex items-center justify-center overflow-hidden">
                        <img
                          src="/pic2.png"
                          alt="Pastry"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-9  md:ml-24 flex flex-col justify-between py-20 gap-6">
          {stats1.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StatCounter {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
