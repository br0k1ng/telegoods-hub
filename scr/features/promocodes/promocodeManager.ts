
import { PromoCode } from './types';

// Load promocodes from localStorage
const loadPromoCodes = (): PromoCode[] => {
  const savedCodes = localStorage.getItem('promocodes');
  if (savedCodes) {
    try {
      return JSON.parse(savedCodes);
    } catch (error) {
      console.error('Error parsing promocodes:', error);
    }
  }
  return [];
};

// Save promocodes to localStorage
const savePromoCodes = (promocodes: PromoCode[]): void => {
  localStorage.setItem('promocodes', JSON.stringify(promocodes));
};

// Get all promocodes
export const getAllPromoCodes = (): PromoCode[] => {
  return loadPromoCodes();
};

// Create a new promocode
export const createPromoCode = (
  code: string,
  discount: number,
  maxUses: number,
  expiryDate: string
): PromoCode => {
  const promocodes = loadPromoCodes();
  
  // Check if code already exists
  if (promocodes.some(promo => promo.code.toLowerCase() === code.toLowerCase())) {
    throw new Error(`Промокод ${code} уже существует`);
  }
  
  const newPromoCode: PromoCode = {
    code,
    discount,
    maxUses,
    usesLeft: maxUses,
    expiryDate,
    isActive: true
  };
  
  promocodes.push(newPromoCode);
  savePromoCodes(promocodes);
  
  return newPromoCode;
};

// Delete a promocode
export const deletePromoCode = (code: string): boolean => {
  const promocodes = loadPromoCodes();
  const filteredCodes = promocodes.filter(promo => promo.code.toLowerCase() !== code.toLowerCase());
  
  if (filteredCodes.length === promocodes.length) {
    return false; // Code not found
  }
  
  savePromoCodes(filteredCodes);
  return true;
};

// Toggle promocode active status
export const togglePromoCodeStatus = (code: string): PromoCode | null => {
  const promocodes = loadPromoCodes();
  const index = promocodes.findIndex(promo => promo.code.toLowerCase() === code.toLowerCase());
  
  if (index === -1) {
    return null; // Code not found
  }
  
  promocodes[index].isActive = !promocodes[index].isActive;
  savePromoCodes(promocodes);
  
  return promocodes[index];
};

// Validate and use a promocode
export const validatePromoCode = (code: string): { valid: boolean; discount: number; message: string } => {
  const promocodes = loadPromoCodes();
  const promocode = promocodes.find(promo => promo.code.toLowerCase() === code.toLowerCase());
  
  if (!promocode) {
    return { valid: false, discount: 0, message: 'Промокод не найден' };
  }
  
  if (!promocode.isActive) {
    return { valid: false, discount: 0, message: 'Промокод не активен' };
  }
  
  if (promocode.usesLeft <= 0) {
    return { valid: false, discount: 0, message: 'Промокод использован максимальное количество раз' };
  }
  
  const now = new Date();
  const expiryDate = new Date(promocode.expiryDate);
  
  if (now > expiryDate) {
    return { valid: false, discount: 0, message: 'Срок действия промокода истек' };
  }
  
  return { valid: true, discount: promocode.discount, message: 'Промокод применен' };
};

// Use a promocode (decrease usesLeft)
export const usePromoCode = (code: string): boolean => {
  const promocodes = loadPromoCodes();
  const index = promocodes.findIndex(promo => promo.code.toLowerCase() === code.toLowerCase());
  
  if (index === -1) {
    return false; // Code not found
  }
  
  if (promocodes[index].usesLeft <= 0) {
    return false; // No uses left
  }
  
  promocodes[index].usesLeft -= 1;
  savePromoCodes(promocodes);
  
  return true;
};
