"use client"
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/shared/Gennextfooter";
import TravelDealSearch from "./search/page";
import { useSession } from "next-auth/react";
import Homepage from "@/components/Homepage";
 
export default function Home() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  console.log(status)
  
  // Use useEffect to handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return <p>Loading...</p>;
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    
    return (<p>Loading...</p>);
    
  }

  // If user is not authenticated, show the Homepage component
  if (status === "authenticated") {
    
    return (
      <main className="relative">
        <Navigation />
        <TravelDealSearch />
        <Footer />
      </main>
    );
    
  }

  // If user is authenticated, show the main application
  return <Homepage />;
 
}