// src/types/store.ts
import { Timestamp } from "firebase/firestore"; // Use client-side Timestamp for type def

export interface Category {
  id: string; // Document ID
  name: string;
  description?: string;
  parentCategoryId: string | null;
  ancestorIds: string[];
  path?: string;
  productCount?: number;
  createdAt?: Timestamp; // Keep Timestamp type for consistency if needed client-side
  updatedAt?: Timestamp;
}

export interface Product {
  id: string; // Document ID
  name: string;
  description: string;
  price: number;
  sku?: string;
  imageUrl: string;
  stockQuantity: number;
  isActive: boolean;
  categoryIds: string[];
  allCategoryIds: string[];
  categoryNames?: string[]; // Optional denormalized field
  createdAt: Timestamp; // Use server timestamp type on server
  updatedAt: Timestamp; // Use server timestamp type on server
}

// Type for data sent from client to server API
export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryIds: string[];
  // Add other optional fields like sku, stockQuantity, isActive if set on client
  sku?: string;
  stockQuantity?: number;
  isActive?: boolean;
}