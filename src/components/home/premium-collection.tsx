"use client";

import { titleFont } from "@/app/fonts";
import { PosterCard } from "../ui/poster-card";
import Link from "next/link";

// --- MOCK DATA HERE ---
const featuredPosters = [
  {
    _id: "p1",
    title: "Luffy Gear 5 – Anime Poster",
    price: 299,
    stock: 12,
    isAvailable: true,
    category: "Anime",
    dimensions: "12 x 18 inches",
    tags: ["anime", "luffy", "one piece"],
    images: [
      {
        url: "https://res.cloudinary.com/buymybook/image/upload/v1764486496/Posters/Luffy_htrg0a.jpg",
      },
    ],
  },
  {
    _id: "p2",
    title: "Ducati Monster – Bike Poster",
    price: 349,
    stock: 5,
    isAvailable: true,
    category: "Bikes",
    dimensions: "12 x 18 inches",
    tags: ["bike", "racing", "ducati"],
    images: [
      {
        url: "https://res.cloudinary.com/buymybook/image/upload/v1764569307/Posters/bike_650_brhsbn.jpg",
      },
    ],
  },
  {
    _id: "p3",
    title: "Land Rover Defender OCTA – Car Poster",
    price: 399,
    stock: 0,
    isAvailable: false,
    category: "Cars",
    dimensions: "18 x 24 inches",
    tags: ["car", "defender", "luxury"],
    images: [
      {
        url: "https://res.cloudinary.com/buymybook/image/upload/v1764486496/Posters/DEFENDER_OCTA_tlumso.jpg",
      },
    ],
  },
  {
    _id: "p4",
    title: "Lord Shiva Trance – Divine Poster",
    price: 249,
    stock: 20,
    isAvailable: true,
    category: "Divine",
    dimensions: "12 x 18 inches",
    tags: ["shiva", "divine", "spiritual"],
    images: [
      {
        url: "https://res.cloudinary.com/buymybook/image/upload/v1764486496/Posters/Lord_Shiva_Wallpaper_dlj9i0.jpg",
      },
    ],
  },
  {
    _id: "p5",
    title: "Spiderman Neon – Marvel Poster",
    price: 329,
    stock: 7,
    isAvailable: true,
    category: "Marvel",
    dimensions: "12 x 18 inches",
    tags: ["spiderman", "marvel", "superhero"],
    images: [
      {
        url: "https://res.cloudinary.com/buymybook/image/upload/v1764569307/Posters/spiderman_s29bir.jpg",
      },
    ],
  },
  {
    _id: "p6",
    title: "Cristiano Ronaldo CR7 – Football Poster",
    price: 279,
    stock: 3,
    isAvailable: true,
    category: "Sports",
    dimensions: "18 x 24 inches",
    tags: ["football", "cr7", "sports"],
    images: [
      {
        url: "https://res.cloudinary.com/buymybook/image/upload/v1764486496/Posters/Ronaldo_T-shirt_Design_Football_PNG_Download_Cristiano_Ronaldo_CR7_Football_Shirt_Png_T-shirt_Sublimation__-_Etsy_j0p8sf.jpg",
      },
    ],
  },
];

// --- COMPONENT ---
export function PremiumCollection() {
  return (
    <section className="py-8 md:py-12">
      <div className="w-full px-6 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 md:mb-10 flex flex-col items-center text-center">
          <h2
            className={`font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl ${titleFont.className}`}
          >
            Premium <br className="md:hidden" />
            <br className="md:hidden" /> Collection&apos;s
          </h2>
          <p className="mt-3 md:mt-4 max-w-2xl text-center text-sm md:text-base text-muted-foreground">
            Check out our latest and most premium posters.
          </p>
        </div>

        {/* Grid - More spacious on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 lg:gap-5">
          {featuredPosters.map((poster) => (
            <PosterCard key={poster._id} poster={poster} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-8 md:mt-10 flex justify-center">
          <Link
            href="/posters"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            View All Posters
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
