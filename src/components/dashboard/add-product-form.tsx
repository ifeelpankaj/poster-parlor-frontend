"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, CloudCog, Upload, X } from "lucide-react";
import { useAddInventoryItemMutation } from "@/lib/redux/api/admin.api";
import { toast } from "sonner";

interface ImagePreview {
  file: File;
  preview: string;
}

interface FormData {
  title: string;
  description: string;
  price: number | "";
  dimensions: string;
  material: string;
  stock: number | "";
  category: string;
  isAvailable: boolean;
  tags: string[];
}

const CATEGORIES = ["Anime", "Bikes", "Cars", "Divine", "Marvel", "Sports"];

const MATERIALS = [
  "Paper",
  "Canvas",
  "Poster Board",
  "Vinyl",
  "Acrylic",
  "Wood",
];

const DIMENSIONS = [
  "8x10 inches",
  "11x14 inches",
  "16x20 inches",
  "18x24 inches",
  "24x36 inches",
  "27x40 inches",
];

export function AddProductForm() {
  const [addInventoryItem, { isLoading: isSubmitting }] =
    useAddInventoryItemMutation();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    dimensions: "",
    material: "",
    stock: "",
    category: "",
    isAvailable: true,
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? ""
            : parseFloat(value)
          : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            file,
            preview: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (formData.price === "" || formData.price < 0) {
      toast.error("Valid price is required");
      return;
    }

    if (formData.stock === "" || formData.stock < 0) {
      toast.error("Valid stock quantity is required");
      return;
    }

    if (!formData.category) {
      toast.error("Category is required");
      return;
    }

    if (!formData.dimensions) {
      toast.error("Dimensions are required");
      return;
    }

    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    if (formData.tags.length === 0) {
      toast.error("At least one tag is required");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Add images
      images.forEach((img) => {
        formDataToSend.append("images", img.file);
      });

      // Add form fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("stock", formData.stock.toString());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("dimensions", formData.dimensions);
      formDataToSend.append("material", formData.material);
      formDataToSend.append("isAvailable", formData.isAvailable.toString());
      formDataToSend.append("tags", JSON.stringify(formData.tags));

      const res = await addInventoryItem(formDataToSend).unwrap();

      if (res) {
        toast.success("Poster added successfully!");
      }
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        dimensions: "",
        material: "",
        stock: "",
        category: "",
        isAvailable: true,
        tags: [],
      });
      setImages([]);
      setTagInput("");
      setStatus("draft");
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || "Failed to add poster. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-muted rounded-lg transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">Add Products</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button variant="outline" size="sm">
                Save Draft
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                size="sm"
                className="bg-black text-white hover:bg-black/80"
              >
                {isSubmitting ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two Column Layout: Left and Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Details Card */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Product Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">
                      Name *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category *
                      </Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-3 py-2 border rounded-md text-sm bg-transparent border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label
                        htmlFor="dimensions"
                        className="text-sm font-medium"
                      >
                        Dimensions *
                      </Label>
                      <select
                        id="dimensions"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-3 py-2 border rounded-md text-sm bg-transparent border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">Select dimensions</option>
                        {DIMENSIONS.map((dim) => (
                          <option key={dim} value={dim}>
                            {dim}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="material" className="text-sm font-medium">
                      Material
                    </Label>
                    <select
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="w-full mt-2 px-3 py-2 border rounded-md text-sm bg-transparent border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Select material</option>
                      {MATERIALS.map((mat) => (
                        <option key={mat} value={mat}>
                          {mat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description (Optional)
                    </Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Set a description to the product for better visibility."
                      rows={4}
                      className="w-full mt-2 px-3 py-2 border rounded-md text-sm bg-transparent border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </Card>

              {/* Images Card */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Product Images</h2>
                <div className="space-y-4">
                  <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={images.length >= 5}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">
                        Drag and drop images or click to select
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Max 5 images
                      </p>
                      {images.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {images.length}/5 selected
                        </p>
                      )}
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded"
                          >
                            <X className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Tags Card */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Tags *</h2>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add a tag"
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Pricing</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium">
                      Base Price *
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock" className="text-sm font-medium">
                      Stock Quantity *
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="mt-2"
                    />
                  </div>

                  <label className="flex items-center space-x-3 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium">In stock</span>
                  </label>
                </div>
              </Card>

              {/* Status Card */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Status</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status" className="text-sm font-medium">
                      Product Status
                    </Label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as "draft" | "published")
                      }
                      className="w-full mt-2 px-3 py-2 border rounded-md text-sm bg-transparent border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">
                      Set the product status
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
