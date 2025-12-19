"use client";
import React, { useState } from "react";
import { useGetInventoryItemByIdQuery } from "@/lib/redux/api/inventory.api";
import { useParams } from "next/navigation";
import { useCart } from "@/components/hooks/use-cart.hook";
import {
  GetInventoryItemResponse,
  Review,
  LoadingState,
  ErrorState,
  Breadcrumb,
  ImageGallery,
  ProductHeader,
  ProductSpecifications,
  ProductTags,
  QuantitySelector,
  AddToCartButton,
  ProductFeatures,
  ReviewsSection,
} from "./components";

// Mock reviews - replace with actual reviews API
const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: "Sarah Miller",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Absolutely gorgeous! The quality exceeded my expectations. The colors are vibrant and the material feels premium.",
    verified: true,
  },
  {
    id: 2,
    author: "James Chen",
    rating: 5,
    date: "1 month ago",
    comment:
      "Perfect addition to my home office. Shipped quickly and arrived in perfect condition.",
    verified: true,
  },
  {
    id: 3,
    author: "Emily Rodriguez",
    rating: 4,
    date: "1 month ago",
    comment:
      "Beautiful design and great quality. Would have given 5 stars but it took a bit longer to ship than expected.",
    verified: true,
  },
];

const MOCK_RATING = 4.8;
const MOCK_REVIEW_COUNT = 127;

const parseTags = (tags: string[]): string[] => {
  if (!tags || tags.length === 0) return [];

  // Check if first element is a JSON string
  if (typeof tags[0] === "string" && tags[0].startsWith("[")) {
    try {
      return JSON.parse(tags[0]);
    } catch {
      return tags;
    }
  }
  return tags;
};

const PosterDetailPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { data, isLoading, isError } = useGetInventoryItemByIdQuery(id) as {
    data: GetInventoryItemResponse | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (!data?.data) return;

    if (type === "increment" && quantity < data.data.stock) {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!data?.data) return;

    const poster = data.data;
    const images = poster.images.length > 0 ? poster.images : [];

    const cartItem = {
      _id: poster._id,
      posterId: poster._id,
      title: poster.title,
      price: poster.price,
      quantity: quantity,
      imageUrl: images[0]?.url || "/placeholder.png",
      stock: poster.stock,
      dimensions: poster.dimensions,
      material: poster.material,
    };

    addToCart(cartItem);
    setQuantity(1);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !data?.data) {
    return <ErrorState />;
  }

  const poster = data.data;
  const displayTags = parseTags(poster.tags);
  const images = poster.images.length > 0 ? poster.images : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Breadcrumb category={poster.category} title={poster.title} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ImageGallery
            images={images}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            title={poster.title}
            isAvailable={poster.isAvailable}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <ProductHeader
              title={poster.title}
              price={poster.price}
              rating={MOCK_RATING}
              reviewCount={MOCK_REVIEW_COUNT}
            />

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {poster.description}
            </p>

            <ProductSpecifications
              dimensions={poster.dimensions}
              material={poster.material}
              category={poster.category}
              stock={poster.stock}
            />

            <ProductTags tags={displayTags} />

            <QuantitySelector
              quantity={quantity}
              stock={poster.stock}
              price={poster.price}
              onQuantityChange={handleQuantityChange}
            />

            <AddToCartButton
              isAvailable={poster.isAvailable}
              isInCart={isInCart(poster._id)}
              cartQuantity={getItemQuantity(poster._id)}
              onAddToCart={handleAddToCart}
            />

            <ProductFeatures />
          </div>
        </div>

        <ReviewsSection
          reviews={MOCK_REVIEWS}
          rating={MOCK_RATING}
          reviewCount={MOCK_REVIEW_COUNT}
        />
      </div>
    </div>
  );
};

export default PosterDetailPage;
