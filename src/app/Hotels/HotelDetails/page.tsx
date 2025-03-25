// app/hotels/[hotelId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { format, addDays, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  StarIcon,
  MapPinIcon,
  CheckIcon,
  WifiIcon,
  UtensilsIcon,
  PhoneIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Types
const hotelData: HotelData = {
  hotelId: "200911161557592821",
  name: "Sunset Beach Resort & Spa",
  location: {
    city: "Goa",
    cityCode: "CTGOI",
    country: "IN",
    coordinates: {
      latitude: 15.24582,
      longitude: 73.92972,
    },
    address: "Candolim Beach Road, Goa 403515, India",
    locusId: "CTGOI",
    locusType: "city",
  },
  checkInDate: "03242025",
  checkOutDate: "03252025",
  stayDuration: 1,
  roomConfiguration: {
    roomStayQualifier: "2e0e",
    rooms: 1,
    adults: 2,
    children: 0,
  },
  rank: 1,
  currency: "INR",
  description:
    "Nestled on the pristine shores of Candolim Beach, Sunset Beach Resort & Spa offers a perfect blend of luxury and tranquility. With stunning ocean views, world-class amenities, and exceptional service, our resort promises an unforgettable Goan experience.",
  amenities: [
    "WiFi",
    "Swimming Pool",
    "Restaurant",
    "Room Service",
    "Air Conditioning",
    "Spa",
    "Bar",
    "Fitness Center",
  ],
  images: [
    {
      url: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
      caption: "Hotel Exterior",
    },
    {
      url: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      caption: "Deluxe Room",
    },
    {
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
      caption: "Swimming Pool",
    },
    {
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      caption: "Restaurant",
    },
  ],
  roomsData: [
    {
      roomType: "Deluxe Room",
      basePrice: 4500,
      taxAmount: 810,
      totalPrice: 5310,
      pricePerNight: 5310,
      availableRooms: 5,
      cancellationPolicy: "Free cancellation before 48 hours",
      mealPlan: "Breakfast Included",
      features: ["King Size Bed", "Sea View", "32 sq.m", "Free WiFi"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
          caption: "Deluxe Room",
        },
        {
          url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
          caption: "Deluxe Room Bathroom",
        },
        {
          url: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
          caption: "Deluxe Room View",
        },
      ],
    },
    {
      roomType: "Premium Suite",
      basePrice: 7500,
      taxAmount: 1350,
      totalPrice: 8850,
      pricePerNight: 8850,
      availableRooms: 2,
      cancellationPolicy: "Non-refundable",
      mealPlan: "Breakfast and Dinner",
      features: [
        "King Size Bed",
        "Ocean View",
        "55 sq.m",
        "Private Balcony",
        "Jacuzzi",
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
          caption: "Premium Suite",
        },
        {
          url: "https://images.unsplash.com/photo-1591088398332-8a7791972843",
          caption: "Premium Suite Balcony",
        },
        {
          url: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6",
          caption: "Premium Suite Bathroom",
        },
      ],
    },
  ],
  reviews: {
    averageRating: 4.2,
    totalReviews: 256,
    categories: {
      location: 4.5,
      cleanliness: 4.3,
      service: 4.0,
      valueForMoney: 3.9,
    },
    userReviews: [
      {
        userId: "user123",
        userName: "John D.",
        rating: 5,
        date: "2025-03-01",
        title: "Excellent beach getaway",
        comment:
          "Beautiful property with amazing views. The staff was very attentive and friendly. Would definitely come back!",
        categoryRatings: {
          location: 5,
          cleanliness: 5,
          service: 5,
          valueForMoney: 4,
        },
      },
      {
        userId: "user456",
        userName: "Sarah M.",
        rating: 4,
        date: "2025-02-15",
        title: "Great location, good amenities",
        comment:
          "Loved the beach access and pool area. Room was clean but slightly smaller than expected. Overall a pleasant stay.",
        categoryRatings: {
          location: 5,
          cleanliness: 4,
          service: 4,
          valueForMoney: 3,
        },
      },
      {
        userId: "user789",
        userName: "Rahul K.",
        rating: 3,
        date: "2025-02-08",
        title: "Mixed experience",
        comment:
          "The location is fantastic, but the rooms need renovation. Service was inconsistent - some staff were excellent while others seemed disinterested.",
        categoryRatings: {
          location: 5,
          cleanliness: 3,
          service: 2,
          valueForMoney: 3,
        },
      },
    ],
  },
  nearbyAttractions: [
    {
      name: "Candolim Beach",
      distance: "0.3 km",
    },
    {
      name: "Fort Aguada",
      distance: "3.2 km",
    },
    {
      name: "Calangute Market",
      distance: "2.5 km",
    },
  ],
};

// Update HotelData interface to match the new structure
interface HotelData {
  hotelId: string;
  name: string;
  location: {
    city: string;
    cityCode: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address: string;
    locusId: string;
    locusType: string;
  };
  checkInDate: string;
  checkOutDate: string;
  stayDuration: number;
  roomConfiguration: {
    roomStayQualifier: string;
    rooms: number;
    adults: number;
    children: number;
  };
  rank: number;
  currency: string;
  description: string;
  amenities: string[];
  images: {
    url: string;
    caption: string;
  }[];
  roomsData: {
    roomType: string;
    basePrice: number;
    taxAmount: number;
    totalPrice: number;
    pricePerNight: number;
    availableRooms: number;
    cancellationPolicy: string;
    mealPlan: string;
    features: string[];
    images: {
      url: string;
      caption: string;
    }[];
  }[];
  reviews: {
    averageRating: number;
    totalReviews: number;
    categories: {
      location: number;
      cleanliness: number;
      service: number;
      valueForMoney: number;
    };
    userReviews: {
      userId: string;
      userName: string;
      rating: number;
      date: string;
      title: string;
      comment: string;
      categoryRatings: {
        location: number;
        cleanliness: number;
        service: number;
        valueForMoney: number;
      };
    }[];
  };
  nearbyAttractions: {
    name: string;
    distance: string;
  }[];
}

// Date formatting helper
const formatDateString = (dateStr: string) => {
  const year = parseInt(dateStr.substring(4, 8));
  const month = parseInt(dateStr.substring(0, 2)) - 1;
  const day = parseInt(dateStr.substring(2, 4));
  return new Date(year, month, day);
};

const HotelDetailsPage = () => {
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [checkInDate, setCheckInDate] = useState<Date>(
    formatDateString(hotelData.checkInDate)
  );
  const [checkOutDate, setCheckOutDate] = useState<Date>(
    formatDateString(hotelData.checkOutDate)
  );
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [stayDuration, setStayDuration] = useState(1);
  const [totalPrice, setTotalPrice] = useState(
    hotelData.roomsData[0].totalPrice
  );

  // Update stay duration when check-in or check-out dates change
  useEffect(() => {
    const duration = Math.max(1, differenceInDays(checkOutDate, checkInDate));
    setStayDuration(duration);
  }, [checkInDate, checkOutDate]);

  // Update total price when room selection, stay duration, or number of rooms changes
  useEffect(() => {
    const selectedRoom = hotelData.roomsData[selectedRoomIndex];
    const newTotal = selectedRoom.pricePerNight * stayDuration * rooms;
    const newTaxes = selectedRoom.taxAmount * stayDuration * rooms;
    setTotalPrice(newTotal + newTaxes);
  }, [selectedRoomIndex, stayDuration, rooms]);

  // Generate star rating display
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <StarIcon
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ));
  };

  // Handle date selection
  const handleCheckInSelect = (date: Date) => {
    setCheckInDate(date);
    // If check-out date is before new check-in date, set check-out to the next day
    if (checkOutDate <= date) {
      setCheckOutDate(addDays(date, 1));
    }
  };

  const handleCheckOutSelect = (date: Date) => {
    // Only allow dates after check-in
    if (date > checkInDate) {
      setCheckOutDate(date);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, "EEE, MMM d, yyyy");
  };

  // Handle booking
  const handleBookNow = () => {
    alert(`Booking confirmed!
    
Hotel: ${hotelData.name}
Room: ${hotelData.roomsData[selectedRoomIndex].roomType}
Check-in: ${formatDate(checkInDate)}
Check-out: ${formatDate(checkOutDate)}
Guests: ${adults} adults, ${children} children
Total: ₹${totalPrice}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Hotel Details */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-6">
            {/* Hotel Header */}
            <div>
              <h1 className="text-3xl font-bold">{hotelData.name}</h1>
              <div className="flex items-center mt-2 space-x-2">
                <div className="flex">
                  {renderStars(hotelData.reviews.averageRating)}
                </div>
                <span className="text-sm text-gray-500">
                  ({hotelData.reviews.totalReviews} reviews)
                </span>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {hotelData.location.address}
                </div>
              </div>
            </div>

            {/* Hotel Images */}
            <div className="grid grid-cols-4 gap-2 h-80">
              <div className="col-span-2 row-span-2 relative rounded-l-lg overflow-hidden">
                <Image
                  src={hotelData.images[0].url}
                  alt={hotelData.images[0].caption}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-tr-lg overflow-hidden">
                <Image
                  src={hotelData.images[1].url}
                  alt={hotelData.images[1].caption}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-br-lg overflow-hidden">
                <Image
                  src={hotelData.images[2].url}
                  alt={hotelData.images[2].caption}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src={hotelData.images[3].url}
                  alt={hotelData.images[3].caption}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src={hotelData.images[0].url}
                  alt={hotelData.images[0].caption}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowAllPhotos(true)}
                      >
                        View All Photos
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <h2 className="text-xl font-bold mb-4">Hotel Photos</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {hotelData.images.map((image, i) => (
                          <div
                            key={i}
                            className="relative h-64 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={image.url}
                              alt={image.caption}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2">
                              <p className="text-white text-sm">
                                {image.caption}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Hotel Information Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      About This Hotel
                    </h3>
                    <p className="text-gray-600">{hotelData.description}</p>
                    <h3 className="text-lg font-semibold mt-6 mb-4">
                      Location Highlights
                    </h3>
                    <ul className="space-y-2">
                      {hotelData.nearbyAttractions.map((attraction, index) => (
                        <li key={index} className="flex items-start">
                          <MapPinIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span>
                            {attraction.name} -{" "}
                            <span className="text-gray-500">
                              {attraction.distance}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Hotel Amenities
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {hotelData.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          {amenity === "WiFi" && (
                            <WifiIcon className="h-5 w-5 text-primary mr-2" />
                          )}
                          {/* {amenity === "Swimming Pool" && (
                            // <PoolIcon className="h-5 w-5 text-primary mr-2" />
                          )} */}
                          {amenity === "Restaurant" && (
                            <UtensilsIcon className="h-5 w-5 text-primary mr-2" />
                          )}
                          {amenity !== "WiFi" &&
                            amenity !== "Swimming Pool" &&
                            amenity !== "Restaurant" && (
                              <CheckIcon className="h-5 w-5 text-primary mr-2" />
                            )}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="mt-6">
                <div className="space-y-6">
                  {hotelData.roomsData.map((room, index) => (
                    <Card
                      key={index}
                      className={`overflow-hidden ${
                        selectedRoomIndex === index ? "border-primary" : ""
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="md:col-span-1 relative h-40 md:h-full">
                          <Image
                            src={room.images[index % room.images.length].url}
                            alt={room.roomType}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="md:col-span-3 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <h3 className="text-xl font-semibold">
                                {room.roomType}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {room.features.map((feature, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="font-normal"
                                  >
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-4">
                                <div className="flex items-center text-green-600">
                                  <CheckIcon className="h-4 w-4 mr-2" />
                                  <span>{room.mealPlan}</span>
                                </div>
                                <div className="flex items-center mt-1 text-blue-600">
                                  <CheckIcon className="h-4 w-4 mr-2" />
                                  <span>{room.cancellationPolicy}</span>
                                </div>
                                <div className="flex items-center mt-1 text-gray-600">
                                  <CheckIcon className="h-4 w-4 mr-2" />
                                  <span>{room.availableRooms} rooms left</span>
                                </div>
                              </div>
                            </div>
                            <div className="md:col-span-1 flex flex-col items-end justify-between">
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  Per Night
                                </div>
                                <div className="text-2xl font-bold">
                                  ₹{room.pricePerNight}
                                </div>
                                <div className="text-sm text-gray-500">
                                  +₹{room.taxAmount} taxes & fees
                                </div>
                              </div>
                              <Button
                                className="mt-4 w-full"
                                onClick={() => setSelectedRoomIndex(index)}
                                variant={
                                  selectedRoomIndex === index
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {selectedRoomIndex === index
                                  ? "Selected"
                                  : "Select"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Property Amenities
                    </h3>
                    <ul className="space-y-3">
                      {hotelData.amenities
                        .slice(0, Math.ceil(hotelData.amenities.length / 3))
                        .map((amenity, index) => (
                          <li key={index} className="flex items-center">
                            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span>{amenity}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Room Features
                    </h3>
                    <ul className="space-y-3">
                      {hotelData.amenities
                        .slice(
                          Math.ceil(hotelData.amenities.length / 3),
                          Math.ceil(hotelData.amenities.length / 3) * 2
                        )
                        .map((amenity, index) => (
                          <li key={index} className="flex items-center">
                            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span>{amenity}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Services</h3>
                    <ul className="space-y-3">
                      {hotelData.amenities
                        .slice(Math.ceil(hotelData.amenities.length / 3) * 2)
                        .map((amenity, index) => (
                          <li key={index} className="flex items-center">
                            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span>{amenity}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg">
                    <div className="text-center">
                      <div className="text-5xl font-bold">
                        {hotelData.reviews.averageRating.toFixed(1)}
                      </div>
                      <div className="flex justify-center mt-2">
                        {renderStars(hotelData.reviews.averageRating)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Based on {hotelData.reviews.totalReviews} reviews
                      </div>
                    </div>
                    <Separator className="my-6" />
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Location</span>
                          <span className="font-medium">
                            {hotelData.reviews.categories.location.toFixed(1)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${
                                (hotelData.reviews.categories.location / 5) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Cleanliness</span>
                          <span className="font-medium">
                            {hotelData.reviews.categories.cleanliness.toFixed(
                              1
                            )}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${
                                (hotelData.reviews.categories.cleanliness / 5) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Service</span>
                          <span className="font-medium">
                            {hotelData.reviews.categories.service.toFixed(1)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${
                                (hotelData.reviews.categories.service / 5) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Value for Money</span>
                          <span className="font-medium">
                            {hotelData.reviews.categories.valueForMoney.toFixed(
                              1
                            )}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${
                                (hotelData.reviews.categories.valueForMoney /
                                  5) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">
                      Guest Reviews
                    </h3>
                    <div className="space-y-6">
                      {hotelData.reviews.userReviews
                        .slice(0, 3)
                        .map((review, index) => (
                          <Card key={index}>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-base">
                                    {review.userName}
                                  </CardTitle>
                                  <CardDescription>
                                    Stayed in{" "}
                                    {new Date(review.date).toLocaleString(
                                      "default",
                                      { month: "long" }
                                    )}{" "}
                                    {new Date(review.date).getFullYear()}
                                  </CardDescription>
                                </div>
                                <div className="flex">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600">
                                {review.comment}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      <Button variant="outline" className="w-full">
                        View All Reviews
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Column - Booking Information */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card>
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
                <CardDescription>Select dates and rooms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dates */}
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Check-in & Check-out
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="border rounded-lg p-3 hover:border-primary cursor-pointer">
                          <div className="text-xs text-gray-500">Check-in</div>
                          <div className="font-medium">
                            {format(checkInDate, "EEE, MMM d, yyyy")}
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkInDate}
                          onSelect={(date) => date && handleCheckInSelect(date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="border rounded-lg p-3 hover:border-primary cursor-pointer">
                          <div className="text-xs text-gray-500">Check-out</div>
                          <div className="font-medium">
                            {format(checkOutDate, "EEE, MMM d, yyyy")}
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOutDate}
                          onSelect={(date) =>
                            date && handleCheckOutSelect(date)
                          }
                          disabled={(date) => date <= checkInDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>
                      {stayDuration} {stayDuration === 1 ? "night" : "nights"}{" "}
                      stay
                    </span>
                  </div>
                </div>

                {/* Room & Guests */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Rooms & Guests</h3>
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Rooms</div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setRooms(Math.max(1, rooms - 1))}
                          disabled={rooms <= 1}
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium w-4 text-center">
                          {rooms}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setRooms(rooms + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Adults</div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium w-4 text-center">
                          {adults}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setAdults(adults + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Children</div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children <= 0}
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium w-4 text-center">
                          {children}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setChildren(children + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Room */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Selected Room</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">
                        {hotelData.roomsData[selectedRoomIndex].roomType}
                      </h4>
                      <Badge variant="outline">
                        ₹{hotelData.roomsData[selectedRoomIndex].pricePerNight}
                        /night
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {hotelData.roomsData[selectedRoomIndex].features
                        .slice(0, 2)
                        .map((feature, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="font-normal text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      {hotelData.roomsData[selectedRoomIndex].features.length >
                        2 && (
                        <Badge
                          variant="secondary"
                          className="font-normal text-xs"
                        >
                          +
                          {hotelData.roomsData[selectedRoomIndex].features
                            .length - 2}{" "}
                          more
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {hotelData.roomsData[selectedRoomIndex].mealPlan}
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Price Summary</h3>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>
                        Room Price ({stayDuration}{" "}
                        {stayDuration === 1 ? "night" : "nights"} × {rooms}{" "}
                        {rooms === 1 ? "room" : "rooms"})
                      </span>
                      <span>
                        ₹
                        {hotelData.roomsData[selectedRoomIndex].basePrice *
                          stayDuration *
                          rooms}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes & Fees</span>
                      <span>
                        ₹
                        {hotelData.roomsData[selectedRoomIndex].taxAmount *
                          stayDuration *
                          rooms}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total Amount</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" size="lg" onClick={handleBookNow}>
                  Book Now
                </Button>
                <div className="text-sm text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span>
                      Free cancellation before{" "}
                      {format(addDays(new Date(), -2), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-center">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            {/* Map */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPinIcon className="h-8 w-8 text-primary mx-auto" />
                      <p className="mt-2 text-sm font-medium">
                        {hotelData.location.address}
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
                        View on Map
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {hotelData.nearbyAttractions.map((attraction, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{attraction.name}</span>
                      <span className="text-gray-500">
                        {attraction.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
