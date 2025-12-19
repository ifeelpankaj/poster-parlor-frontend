export interface ImageData {
  url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  _id: string;
}

export interface PosterData {
  _id: string;
  title: string;
  description: string;
  price: number;
  dimensions: string;
  material: string;
  isAvailable: boolean;
  tags: string[];
  stock: number;
  category: string;
  images: ImageData[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface GetInventoryItemResponse {
  success: boolean;
  message: string;
  data: PosterData;
  path: string;
  timestamp: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}
