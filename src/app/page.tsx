
"use client"
import Hero1 from "@/components/Hero";
import Navigation from "@/components/Navigation";
import PlanManagement from "@/components/Plans";
import Homebar from "@/components/search/Homebar";

import FoodCarousel from "@/components/shared/Banner";
import Footer from "@/components/shared/Gennextfooter";

import Navbar from "@/components/shared/Navebar";
import MakeMyTripClone from "@/components/shared/travlisting/Travlisting";
import TravelDealSearch from "./search/page";

// In your page/component:

export default function Home() {
  return (
    <main className="relative">
      {/* <NavBar /> */}

      {/* <Navbar/> */}
      <Navigation  />
 
      
      <TravelDealSearch/>
      
      <Footer/>
    </main>
  ); 
}
