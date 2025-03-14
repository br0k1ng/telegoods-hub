
import { User } from '../cart/types';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  imageUrl?: string;
}

export interface DeliveryDetails {
  city: string;
  address: string;
  deliveryCost: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  createdAt: string;
  user: User;
  delivery?: DeliveryDetails;
  cdekTrackingNumber?: string;
  promoCode?: string;
  discount?: number;
}
