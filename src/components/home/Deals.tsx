"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertCircle, Calendar, MapPin, Tag, Clock, Info } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import CreateDealPage from "./CreateDeals";
import DealDetailsSidebar from "./DealDetailsSidebar";

// Type definition for a Deal
interface Deal {
  id: string;
  title: string;
  travelType: string;
  description?: string;
  price?: number;
  discount?: number;
  images?: string;
  country?: string;
  state?: string;
  city?: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  isPromoted: boolean;
  createdAt: string;
  contactEmails?: string[];
  contactPhones?: string[];
  flightDetails?: any;
  hotelDetails?: any;
  metadata?: Record<string, string>;
}

export default function Deals() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Fetch deals on component mount and when refreshTrigger changes
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        // In a real application, you would filter by the logged-in travel agent's ID
        const response = await fetch("/api/deals");

        if (!response.ok) {
          throw new Error("Failed to fetch deals");
        }

        const data = await response.json();
        console.log(data);
        setDeals(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [refreshTrigger]); // Added refreshTrigger as a dependency

  // Toggle create deal form
  const handleCreateDeal = () => {
    setShowCreateForm(true);
  };

  // Handle back to deals list and refresh data
  const handleBackToDealsList = (dealCreated = false) => {
    setShowCreateForm(false);
    if (dealCreated) {
      // Increment the refresh trigger to cause a re-fetch
      setRefreshTrigger(prev => prev + 1);
    }
  };

  // Handle view deal details
  const handleViewDeal = (deal: Deal) => {
    setSelectedDeal(deal);
  };

  // Close sidebar
  const handleCloseSidebar = () => {
    setSelectedDeal(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <AlertCircle className="mr-2" />
        Error: {error}
      </div>
    );
  }

  // If showing create form, render the CreateDealPage component
  if (showCreateForm) {
    return <CreateDealPage onBack={handleBackToDealsList} />;
  }

  // Otherwise, show the deals list with the sidebar if a deal is selected
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Deals</h1>
          <p className="text-muted-foreground">Manage your travel deals</p>
        </div>

        <Button onClick={handleCreateDeal} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add New Deal
        </Button>
      </div>

      {deals.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 p-4 rounded-full bg-muted">
              <Tag className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Create your first deal
            </h2>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start attracting customers by creating attractive travel deals.
              Showcase your best offers to increase bookings.
            </p>
            <Button onClick={handleCreateDeal} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Deal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-96 bg-muted">
                {deal.images ? (
                  <Image
                    src={deal.images}
                    alt={deal.title || "Travel deal"}
                    fill
                    className="object-fit"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    <MapPin className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {deal.isPromoted && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500">
                    Featured
                  </Badge>
                )}
                {deal.travelType && (
                  <Badge variant="outline" className="absolute top-2 left-2 bg-background">
                    {deal.travelType}
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  {/* <CardTitle className="text-lg">
                    {deal.title || (deal.metadata?.Description || "")}
                  </CardTitle> */}
                  {/* <div
                    className={`h-3 w-3 rounded-full ${
                      deal.isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                    title={deal.isActive ? "Active" : "Inactive"}
                  ></div> */}
                </div>
                
                {(deal.validFrom && deal.validTo) && (
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {format(new Date(deal.validFrom), "MMM d")} -{" "}
                      {format(new Date(deal.validTo), "MMM d, yyyy")}
                    </span>
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-2">

                {deal.price ? (
                  <div className="flex items-center">
                    <span className="text-lg font-bold">
                      ${deal.price.toLocaleString()}
                    </span>
                    {/* {deal.discount && deal.discount > 0 && (
                      <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">
                        {deal.discount}% OFF
                      </Badge>
                    )} */}
                  </div>
                ) : null}

                {/* Show description or metadata description if available */}
                {/* {(deal.description || deal.metadata?.Description) && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {deal.description || deal.metadata?.Description}
                  </p>
                )} */}
              </CardContent>

              <CardFooter className="flex justify-between items-center ">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {format(new Date(deal.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDeal(deal)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Render the Details Sidebar when a deal is selected */}
      {selectedDeal && (
        <DealDetailsSidebar deal={selectedDeal} onClose={handleCloseSidebar} />
      )}
    </div>
  );
}