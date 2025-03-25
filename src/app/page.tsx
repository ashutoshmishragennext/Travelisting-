
"use client"
import Hero1 from "@/components/Hero";
import Navigation from "@/components/Navigation";
import PlanManagement from "@/components/Plans";

import FoodCarousel from "@/components/shared/Banner";
import Footer from "@/components/shared/Gennextfooter";

import Navbar from "@/components/shared/Navebar";
import MakeMyTripClone from "@/components/shared/travlisting/Travlisting";

// In your page/component:

export default function Home() {
  return (
    <main className="relative">
      {/* <NavBar /> */}

      {/* <Navbar/> */}
      <Navigation  />
 
      {/* <MakeMyTripClone/> */}
      
      {/* <Hero1/> */}
      <div className="font-bold text-[50px] text-yellow-500 align-middle h-screen text-center">Travelisting</div>
      

      {/* <div className=" mt-6 w-full  bg-red-500 h-32"></div> */}
      <Footer/>
    </main>
  ); 
}
