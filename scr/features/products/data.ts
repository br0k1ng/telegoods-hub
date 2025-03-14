
import { Product } from './types';

export const products: Product[] = [
  {
    id: 'ciot-rose-love',
    name: "'CIOT RÖSE LOVE' T-shirt",
    price: 3500,
    description: `Информация о товаре 

–100% Хлопок
–250 гр. плотность
–Шелкография 
–Оверсайз крой 
–Лэйбл бирка хлопок 

Инструкция по уходу`,
    imageUrl: '/lovable-uploads/1c5ec1cf-723a-408e-91bf-730f29922bb0.png',
    frontImage: '/lovable-uploads/1c5ec1cf-723a-408e-91bf-730f29922bb0.png',
    backImage: '/lovable-uploads/a15a733d-2e58-4e3c-9298-cf5177b8c904.png',
    sizes: [
      { label: 'XS', value: 'xs', available: true },
      { label: 'S', value: 's', available: true },
      { label: 'M', value: 'm', available: true },
      { label: 'L', value: 'l', available: true },
      { label: 'XL', value: 'xl', available: true },
    ]
  }
];

export const lookbookImages = [
  // Empty lookbook array since we're removing the current lookbook
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getLookbookById = (id: string) => {
  return lookbookImages.find(lookbook => lookbook.id === id);
};

export const generateOrderId = () => {
  return `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

export const getEstimatedDeliveryDate = () => {
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 7);
  return deliveryDate.toLocaleDateString('ru-RU');
};
