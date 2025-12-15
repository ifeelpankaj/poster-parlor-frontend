"use client";
import { collectionFont, titleFont } from "@/app/fonts";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const categories = [
  {
    name: "Anime",
    image:
      "https://res.cloudinary.com/buymybook/image/upload/v1764486496/Posters/Luffy_htrg0a.jpg",
    productCount: 24,
  },
  {
    name: "Sports Bike",
    image:
      "https://res.cloudinary.com/buymybook/image/upload/v1764569307/Posters/bike_650_brhsbn.jpg",
    productCount: 18,
  },
  {
    name: "Car's",
    image:
      "https://res.cloudinary.com/buymybook/image/upload/v1764486496/Posters/DEFENDER_OCTA_tlumso.jpg",
    productCount: 30,
  },
  {
    name: "Super Hero's",
    image:
      "https://res.cloudinary.com/buymybook/image/upload/v1764569307/Posters/spiderman_s29bir.jpg",
    productCount: 12,
  },
  {
    name: "1",
    image:
      "https://res.cloudinary.com/buymybook/image/upload/v1764569307/Posters/spiderman_s29bir.jpg",
    productCount: 12,
  },
  {
    name: "2",
    image:
      "https://res.cloudinary.com/buymybook/image/upload/v1764569307/Posters/spiderman_s29bir.jpg",
    productCount: 12,
  },
  {
    name: "3",
    image:
      "https://res.cloudinary.com/buymybook/image/upload/v1764569307/Posters/spiderman_s29bir.jpg",
    productCount: 12,
  },
];

export default function Category() {
  return (
    <section className="mt-6 pt-12 pb-8 md:mt-0 md:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-10 flex flex-col items-center text-center">
          <h2
            className={`text-3xl md:text-4xl font-bold tracking-tight ${titleFont.className}`}
          >
            Collection&apos;s
          </h2>

          <p className="md:hidden text-sm text-muted-foreground mt-8">
            Discover posters that match your vibe.
          </p>

          <p className="hidden md:block mt-5 max-w-2xl text-gray-600">
            Discover posters that match your vibe.
          </p>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2.5 pb-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/posters?category=${category.name.toLowerCase()}`}
                className="group relative flex-shrink-0 w-[88px] h-[96px] overflow-hidden rounded-md"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-active:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-2">
                  <h3
                    className={`text-[8px] leading-tight text-white font-semibold line-clamp-2`}
                  >
                    {category.name}
                  </h3>
                  <p className="text-[8px] text-gray-300 font-medium">
                    {category.productCount}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Grid (Original Design) */}
        <div className="hidden md:block -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 md:gap-5 pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/posters?category=${category.name.toLowerCase()}`}
                className="group relative flex-shrink-0 w-[280px] lg:w-[320px] h-[240px] lg:h-[260px] overflow-hidden rounded-lg cursor-pointer"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <div className="transition-transform duration-500 group-hover:-translate-y-1">
                    <h3
                      className={`text-2xl md:text-3xl text-white mb-1 tracking-tight ${collectionFont.className}`}
                    >
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-xs md:text-sm text-gray-300 font-medium">
                        {category.productCount} products
                      </p>
                      <div className="h-px w-6 bg-gray-400 opacity-0 group-hover:opacity-100 group-hover:w-10 transition-all duration-500" />
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-xs md:text-sm font-semibold">
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
