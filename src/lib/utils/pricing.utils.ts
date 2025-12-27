/**
 * Pricing utilities for the frontend
 * NOTE: These calculations must match the backend at:
 * api/libs/orders/src/lib/order.service.ts
 */

// Remote states that have additional shipping charges
export const REMOTE_STATES = [
  "Jammu and Kashmir",
  "Arunachal Pradesh",
  "Ladakh",
] as const;

// All Indian states for the dropdown
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];

// Pricing constants
const BASE_SHIPPING = 50;
const FREE_SHIPPING_THRESHOLD = 250;
const REMOTE_STATE_CHARGE = 150;
const GST_RATE = 0.18; // 18% GST

/**
 * Calculate shipping cost based on subtotal and delivery state
 * @param subtotal - Cart subtotal amount
 * @param state - Delivery state name
 * @returns Shipping cost in INR
 */
export function calculateShipping(subtotal: number, state: string): number {
  // Free shipping if subtotal >= ₹250, otherwise ₹50 flat fee
  const baseShipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING;

  // Add state-based shipping (higher for remote areas)
  const isRemoteState = REMOTE_STATES.includes(
    state as (typeof REMOTE_STATES)[number]
  );
  const remoteCharge = isRemoteState ? REMOTE_STATE_CHARGE : 0;

  // Formula: (0 or 50) + remote charge (150 for remote states)
  return baseShipping + remoteCharge;
}

/**
 * Calculate tax (GST) on subtotal
 * @param subtotal - Cart subtotal amount
 * @returns Tax amount in INR
 */
export function calculateTax(subtotal: number): number {
  // 18% GST for India
  return Math.round(subtotal * GST_RATE);
}

/**
 * Calculate total order price
 * @param subtotal - Cart subtotal amount
 * @param state - Delivery state name
 * @returns Object with all pricing breakdown
 */
export function calculateOrderTotal(
  subtotal: number,
  state: string
): {
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalPrice: number;
  freeShippingEligible: boolean;
  isRemoteState: boolean;
} {
  const shippingCost = calculateShipping(subtotal, state);
  const taxAmount = calculateTax(subtotal);
  const totalPrice = subtotal + shippingCost + taxAmount;

  return {
    subtotal,
    shippingCost,
    taxAmount,
    totalPrice,
    freeShippingEligible: subtotal >= FREE_SHIPPING_THRESHOLD,
    isRemoteState: REMOTE_STATES.includes(
      state as (typeof REMOTE_STATES)[number]
    ),
  };
}

/**
 * Format price in Indian Rupees
 * @param amount - Amount to format
 * @returns Formatted string with ₹ symbol
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get shipping message for UI
 * @param subtotal - Cart subtotal
 * @returns Message about shipping status
 */
export function getShippingMessage(subtotal: number): string {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return "🎉 You qualify for free shipping!";
  }
  const amountNeeded = FREE_SHIPPING_THRESHOLD - subtotal;
  return `Add ₹${amountNeeded} more for free shipping`;
}
