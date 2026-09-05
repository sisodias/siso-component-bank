"use client";

import * as React from "react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { useTheme } from "next-themes";

// Icons (can also use lucide-react if you prefer)
import { Sun, Moon, Star, MapPin } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="absolute top-4 right-4 rounded-full shadow-md"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

interface HotelCardProps {
  imageUrl: string;
  imageAlt: string;
  roomType: string;
  hotelName: string;
  location: string;
  rating: number;
  reviewCount: number;
  href?: string;
}

const HotelCard = ({
  imageUrl,
  imageAlt,
  roomType,
  hotelName,
  location,
  rating,
  reviewCount,
  href = "#",
}: HotelCardProps) => {
  return (
    <a
      href={href}
      className="block transition-transform duration-300 ease-in-out hover:-translate-y-1"
    >
      <Card className="group flex flex-col overflow-hidden md:flex-row">
        {/* Image Section */}
        <div className="w-full overflow-hidden md:w-2/5 md:h-auto h-56">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <CardContent className="flex flex-col justify-center p-6 md:w-3/5 space-y-3">
          <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {roomType}
          </span>
          <h3 className="text-2xl font-bold tracking-tight">{hotelName}</h3>

          {/* Location */}
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="ml-2 text-sm">{location}</span>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center pt-2">
            <div className="flex items-center text-sm font-semibold">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1.5 text-primary">
                {rating.toFixed(1)}
              </span>
            </div>
            <span className="ml-2 text-sm text-muted-foreground">
              ({reviewCount.toLocaleString()} Reviews)
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
};

export default function App() {
  const hotels = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
      imageAlt: "Luxury hotel room with a pool view",
      roomType: "Deluxe Room",
      hotelName: "Sao Paulo Hotel",
      location: "Ubud, Bali, Indonesia",
      rating: 4.9,
      reviewCount: 1092,
    },
    
  ];

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 font-sans bg-background">
      <ThemeToggle />
      <div className="w-full max-w-4xl space-y-6">
        {hotels.map((hotel, index) => (
          <HotelCard key={index} {...hotel} />
        ))}
      </div>
    </div>
  );
}
