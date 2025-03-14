
export interface PromoCode {
  code: string;
  discount: number; // Value between 0 and 1 (e.g., 0.1 for 10%)
  maxUses: number;
  usesLeft: number;
  expiryDate: string; // ISO date string
  isActive: boolean;
}
