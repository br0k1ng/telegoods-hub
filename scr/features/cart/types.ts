
export interface CartItem {
  productId: string;
  size: string;
  quantity: number;
}

export interface User {
  fullName: string;
  phone: string;
  email: string;
  cdekAddress: string;
  firstName?: string;
  lastName?: string;
  address?: string;
}
