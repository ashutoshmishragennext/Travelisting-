"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Star, StarHalf, Phone, Mail, MapPin } from 'lucide-react';
import indiaHotelAgents from './data';

// Types
interface Agent {
  name: string;
  email: string;
  phone: string;
  commission: string;
  specialization: string;
  region: string;
  experience: number;
  rating: number;
}

interface HotelAgentInfo {
  category: string;
  subcategory: string;
  chain: string;
  location: string;
  city: string;
  state: string;
  country: string;
  ranking: number;
  rate: number;
  discount: string;
  agent: Agent;
}

// Star Rating Component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const cappedRating = Math.min(rating, 5);
  
  const fullStars = Math.floor(cappedRating);
  const hasHalfStar = cappedRating % 1 !== 0;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <Star key={`full-${index}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(Math.max(0, 5 - Math.ceil(cappedRating)))].map((_, index) => (
        <Star key={`empty-${index}`} className="w-4 h-4 text-gray-300" />
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating})</span>
    </div>
  );
};

// Agent Card Component
const AgentCard: React.FC<{ hotel: HotelAgentInfo }> = ({ hotel }) => {
  const { agent } = hotel;

  return (
    <Card className="w-full hover:shadow-xl transition-all duration-300 ease-in-out border-gray-200 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold text-gray-800">{agent.name}</span>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {agent.specialization}
            </Badge>
          </div>
          <StarRating rating={agent.rating} />
        </CardTitle>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              <strong className="text-gray-800">Contact Details</strong>
            </p>
            <p className="mb-1">
              <strong>Phone:</strong> {agent.phone}
            </p>
            <p>
              <strong>Email:</strong> {agent.email}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">
              <strong className="text-gray-800">Professional Details</strong>
            </p>
            <p>
              <strong>Region:</strong> {agent.region}
            </p>
            <p>
              <strong>Experience:</strong> {agent.experience} years
            </p>
          </div>
        </div>
        <div className="mt-4">
          <strong className="text-gray-800">Associated Hotel</strong>
          <Badge variant="outline">{hotel.category}</Badge>
          <div className="mt-2 flex justify-between items-center">
            <Badge variant="outline">{hotel.chain}</Badge>
            <Badge variant="outline">{hotel.location}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Page Component
export default function AgentSearchPage() {
  const hotelsData: HotelAgentInfo[] = indiaHotelAgents;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Get unique filter options
  const categories = [...new Set(hotelsData.map(hotel => hotel.category))];
  const starRatings = Array.from({length: 5}, (_, i) => i + 1);
  const states = [...new Set(hotelsData.map(hotel => hotel.state))];
  const chains = [...new Set(hotelsData.map(hotel => hotel.chain))];
  const subcategories = [...new Set(hotelsData.map(hotel => hotel.subcategory))];

  // Filtering logic
  const filteredHotels = hotelsData.filter(hotel => {
    const matchesSearch = !searchTerm || 
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.chain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.state.toLowerCase().includes(searchTerm.toLowerCase())||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ;

    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(hotel.category);

    const matchesStates = selectedStates.length === 0 || 
      selectedStates.includes(hotel.state);

    const matchesChains = selectedChains.length === 0 || 
      selectedChains.includes(hotel.chain);

    const matchesSubcategories = selectedSubcategories.length === 0 || 
      selectedSubcategories.includes(hotel.subcategory);
    
    const matchesStars = selectedStars.length === 0 || 
      selectedStars.includes(hotel.ranking);
    
    const matchesCities = selectedCities.length === 0 ||
      selectedCities.includes(hotel.city);
    const matchesLocations = selectedLocations.length === 0 ||
      selectedLocations.includes(hotel.location);

    return matchesSearch && 
           matchesCategory && 
           matchesStates && 
           matchesChains && 
           matchesStars && 
           matchesSubcategories&&
            matchesCities &&
            matchesLocations;
  });

  // Toggle handlers
  const createToggleHandler = (setter: React.Dispatch<React.SetStateAction<any[]>>) => 
    (value: any) => {
      setter(prev => 
        prev.includes(value) 
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    };

  const toggleCategory = createToggleHandler(setSelectedCategories);
  const toggleState = createToggleHandler(setSelectedStates);
  const toggleChain = createToggleHandler(setSelectedChains);
  const toggleSubcategory = createToggleHandler(setSelectedSubcategories);
  const toggleStarRating = createToggleHandler(setSelectedStars);
  const toggleCity = createToggleHandler(setSelectedCities);
  const toggleLocation = createToggleHandler(setSelectedLocations);

  // Render filter section
  const renderFilterSection = (
    title: string, 
    options: any[], 
    selectedOptions: any[], 
    onToggle: (value: any) => void,
    renderOption?: (option: any) => React.ReactNode
  ) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">{title}</h3>
      <div className="space-y-2">
        {options.map(option => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${title.toLowerCase()}-${option}`}
              checked={selectedOptions.includes(option)}
              onCheckedChange={() => onToggle(option)}
            />
            <Label 
              htmlFor={`${title.toLowerCase()}-${option}`}
              className="text-gray-600 flex items-center"
            >
              {renderOption ? renderOption(option) : option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 p-6">
      {/* Filters Section */}
      <div className="w-72 mr-6 bg-white p-5 rounded-xl shadow-lg overflow-y-auto max-h-[calc(100vh-3rem)]">
        <div className="mb-4">
          <Label htmlFor="search" className="text-gray-700">Search</Label>
          <Input 
            id="search"
            placeholder="Search hotels, cities, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2"
          />
        </div>

        <Separator className="my-4" />

        {renderFilterSection("Categories", categories, selectedCategories, toggleCategory)}
        {renderFilterSection("States", states, selectedStates, toggleState)}
        {renderFilterSection("Chains", chains, selectedChains, toggleChain)}
        {renderFilterSection("Subcategories", subcategories, selectedSubcategories, toggleSubcategory)}
        {renderFilterSection("Cities", hotelsData.map(hotel => hotel.city), selectedCities, toggleCity)}
        {renderFilterSection("Locations", hotelsData.map(hotel => hotel.location), selectedLocations, toggleLocation)}
        
        {/* Star Ratings filter moved to the last */}
        {renderFilterSection(
          "Star Ratings", 
          starRatings, 
          selectedStars, 
          toggleStarRating,
          (rating) => (
            <div className="flex items-center">
              <StarRating rating={rating} />
            </div>
          )
        )}
      </div>

      {/* Agents List Section */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Agents ({filteredHotels.length})
          </h2>
        </div>
        <ScrollArea className="h-[calc(100vh-100px)] w-full pr-4">
          {filteredHotels.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow">
              No agents found matching your criteria.
            </div>
          ) : (
            filteredHotels.map((hotel, index) => (
              <AgentCard key={index} hotel={hotel} />
            ))
          )}
        </ScrollArea>
      </div>
    </div>
  );
}