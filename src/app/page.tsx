
"use client"
import Hero1 from "@/components/Hero";
import Navigation from "@/components/Navigation";
import PlanManagement from "@/components/Plans";

import FoodCarousel from "@/components/shared/Banner";
import Footer from "@/components/shared/Gennextfooter";

import Navbar from "@/components/shared/Navebar";

// In your page/component:

export default function Home() {
  return (
    <main className="relative">
      {/* <NavBar /> */}

      {/* <Navbar/> */}
      <Navigation  />
 
   
      
      <Hero1/>
      {/* <div className=" mt-6 w-full  bg-red-500 h-32"></div> */}
      <Footer/>
    </main>
  ); 
}
