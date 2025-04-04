"use client";

import { useState, useEffect } from "react";
import { X, Calendar, MapPin, Tag, Phone, Mail, Info, Hotel, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Type definition for a Deal including extra metadata
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

interface DealDetailsSidebarProps {
  deal: Deal | null;
  onClose: () => void;
}

export default function DealDetailsSidebar({ deal, onClose }: DealDetailsSidebarProps) {
  if (!deal) return null;

  // Determine if the deal has any location info
  const hasLocation = deal.city || deal.state || deal.country;
  
  // Format dates
  const validFromDate = deal.validFrom ? format(new Date(deal.validFrom), "MMM d, yyyy") : "";
  const validToDate = deal.validTo ? format(new Date(deal.validTo), "MMM d, yyyy") : "";
  const createdDate = deal.createdAt ? format(new Date(deal.createdAt), "MMM d, yyyy") : "";

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-background shadow-lg z-50 overflow-y-auto border-l">
      <div className="p-4 sticky top-0 bg-background z-10 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold">Deal Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        {/* Deal Image */}
        <div className="relative h-96 w-full bg-muted rounded-lg mb-4 overflow-hidden">
          {deal.images ? (
            <Image
              src={deal.images}
              alt={deal.title || "Deal image"}
              fill
              className="object-fit"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Tag className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {deal.isPromoted && (
            <Badge className="absolute top-2 right-2 bg-yellow-500">Featured</Badge>
          )}
        </div>

        {/* Basic Details */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            {/* <CardTitle className="text-lg">{deal.title || "Untitled Deal"}</CardTitle>
            {deal.travelType && (
              <Badge variant="outline" className="mt-1">
                {deal.travelType === "DOMESTIC" ? "Domestic" : "International"}
              </Badge>
            )} */}
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* Description from metadata or regular description */}
            {(deal.metadata?.Description || deal.description) && (
              <div className="text-sm">
                <h3 className="font-medium mb-1 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Description
                </h3>
                <p className="text-muted-foreground">
                  {deal.metadata?.Description || deal.description}
                </p>
              </div>
            )}

            {/* Price and Discount */}
            {deal.price && (
              <div className="text-sm">
                <h3 className="font-medium mb-1">Price</h3>
                <div className="flex items-center">
                  <span className="text-lg font-bold">${deal.price.toLocaleString()}</span>
                  {deal.discount && deal.discount > 0 && (
                    <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">
                      {deal.discount}% OFF
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Validity Period */}
            <div className="text-sm">
              <h3 className="font-medium mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Validity Period
              </h3>
              <p className="text-muted-foreground">
                {validFromDate} - {validToDate}
              </p>
            </div>

            {/* Location Details */}
            {/* {hasLocation && (
              <div className="text-sm">
                <h3 className="font-medium mb-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </h3>
                <p className="text-muted-foreground">
                  {[deal.city, deal.state, deal.country].filter(Boolean).join(", ")}
                </p>
              </div>
            )} */}

            {/* Status */}
            <div className="text-sm">
              <h3 className="font-medium mb-1">Status</h3>
              <Badge variant={deal.isActive ? "default" : "secondary"}>
                {deal.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Type-specific Details */}
        {deal.hotelDetails && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Hotel className="h-5 w-5 mr-2" />
                Hotel Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {Object.entries(deal.hotelDetails).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium">{key}: </span>
                  <span className="text-muted-foreground">{String(value)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {deal.flightDetails && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                Flight Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {Object.entries(deal.flightDetails).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium">{key}: </span>
                  <span className="text-muted-foreground">{String(value)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Additional Metadata */}
        {deal.metadata && Object.keys(deal.metadata).length > 0 && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {Object.entries(deal.metadata).map(([key, value]) => (
                key !== "Description" && (
                  <div key={key}>
                    <span className="font-medium">{key}: </span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                )
              ))}
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {deal.contactPhones && deal.contactPhones.length > 0 && (
              <div>
                <h3 className="font-medium mb-1 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone
                </h3>
                {deal.contactPhones.map((phone, index) => (
                  <p key={index} className="text-muted-foreground">{phone}</p>
                ))}
              </div>
            )}
            
            {deal.contactEmails && deal.contactEmails.length > 0 && (
              <div>
                <h3 className="font-medium mb-1 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </h3>
                {deal.contactEmails.map((email, index) => (
                  <p key={index} className="text-muted-foreground break-all">{email}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Creation Information */}
        <div className="text-xs text-muted-foreground mb-6">
          Created on {createdDate}
        </div>
      </div>
    </div>
  );
}