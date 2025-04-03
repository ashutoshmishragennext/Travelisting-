'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Tag, 
  Clock
} from "lucide-react";
import { format } from 'date-fns';
import Image from 'next/image';
import CreateDealPage from './CreateDeals';

// Type definition for a Deal
interface Deal {
  id: string;
  title: string;
  travelType: string;
  description?: string;
  price?: number;
  discount?: number;
  images?: string[];
  country?: string;
  state?: string;
  city?: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  isPromoted: boolean;
  createdAt: string;
}

export default function Deals() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  // Fetch deals on component mount
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        // In a real application, you would filter by the logged-in travel agent's ID
        const response = await fetch('/api/deals');
        
        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }
        
        const data = await response.json();
        setDeals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Toggle create deal form
  const handleCreateDeal = () => {
    setShowCreateForm(true);
  };

  // Handle back to deals list
  const handleBackToDealsList = () => {
    setShowCreateForm(false);
  };

  // View deal details
  const handleViewDeal = (dealId: string) => {
    router.push(`/travel-agent/deals/${dealId}`);
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

  // Otherwise, show the deals list
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
            <h2 className="text-xl font-semibold mb-2">Create your first deal</h2>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start attracting customers by creating attractive travel deals. Showcase your best offers to increase bookings.
            </p>
            <Button onClick={handleCreateDeal} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Deal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map(deal => (
            <Card key={deal.id} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                {deal.images && deal.images[0] ? (
                  <Image
                    src={deal.images[0]}
                    alt={deal.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    <MapPin className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {deal.isPromoted && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{deal.title}</CardTitle>
                  <div className={`h-3 w-3 rounded-full ${deal.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <CardDescription className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Valid: {format(new Date(deal.validFrom), 'MMM d')} - {format(new Date(deal.validTo), 'MMM d, yyyy')}
                  </span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{[deal.city, deal.state, deal.country].filter(Boolean).join(', ') || 'Location not specified'}</span>
                </div>
                
                {deal.price && (
                  <div className="flex items-center mb-3">
                    <span className="text-xl font-bold">
                      ${deal.price.toLocaleString()}
                    </span>
                    {deal.discount && deal.discount > 0 && (
                      <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        {deal.discount}% OFF
                      </span>
                    )}
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {deal.description || "No description provided."}
                </p>
              </CardContent>
              
              <CardFooter className="flex justify-between items-center pt-0">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Added {format(new Date(deal.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewDeal(deal.id)}
                >
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}