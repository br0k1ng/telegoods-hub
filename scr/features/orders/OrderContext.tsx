
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, DeliveryDetails } from './types';
import { generateOrderId, getProductById } from '../products/data';
import { useCart } from '../cart/CartContext';
import { toast } from '@/hooks/use-toast';
import { createCdekOrder } from '@/utils/cdekService';
import { sendTelegramNotification, formatOrderForTelegram } from '@/utils/telegramService';

interface OrderContextType {
  orders: Order[];
  placeOrder: (deliveryDetails?: DeliveryDetails) => Promise<string | null>;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: 'processing' | 'shipped' | 'delivered' | 'cancelled') => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { items, user, clearCart } = useCart();
  
  const getPromoCodeInfo = () => {
    const appliedPromoCodeFromStorage = localStorage.getItem('appliedPromoCode');
    const promoDiscountFromStorage = localStorage.getItem('promoDiscount');
    
    console.log('PromoCode from storage:', appliedPromoCodeFromStorage);
    console.log('PromoDiscount from storage:', promoDiscountFromStorage);
    
    return {
      appliedPromoCode: appliedPromoCodeFromStorage || '',
      promoDiscount: promoDiscountFromStorage ? parseFloat(promoDiscountFromStorage) : 0
    };
  };

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = async (deliveryDetails?: DeliveryDetails): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Заполните данные пользователя",
        description: "Для оформления заказа необходимо заполнить данные пользователя",
        variant: "destructive"
      });
      return null;
    }
    
    if (items.length === 0) {
      toast({
        title: "Корзина пуста",
        variant: "destructive"
      });
      return null;
    }

    const orderId = generateOrderId();
    const orderItems = items.map(item => {
      const product = getProductById(item.productId);
      if (!product) throw new Error(`Product with id ${item.productId} not found`);
      
      return {
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        imageUrl: product.imageUrl
      };
    });

    let total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    if (deliveryDetails?.deliveryCost) {
      total += deliveryDetails.deliveryCost;
    }
    
    const { appliedPromoCode, promoDiscount } = getPromoCodeInfo();
    
    if (appliedPromoCode && promoDiscount > 0) {
      console.log('Applying promo discount:', appliedPromoCode, promoDiscount);
      const discountAmount = total * promoDiscount;
      total -= discountAmount;
      
      total = Math.round(total);
      
      console.log('Original total:', total + discountAmount);
      console.log('Discount amount:', discountAmount);
      console.log('New total after discount:', total);
    }

    let firstName = '';
    let lastName = '';
    
    if (user.fullName) {
      const nameParts = user.fullName.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    // Set a default estimated delivery date (7 days from now)
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
    
    const newOrder: Order = {
      id: orderId,
      items: orderItems,
      total,
      status: 'processing',
      createdAt: new Date().toISOString(),
      estimatedDelivery: estimatedDeliveryDate.toISOString(),
      user: { 
        ...user,
        firstName: user.firstName || firstName,
        lastName: user.lastName || lastName,
        address: user.address || user.cdekAddress || ''
      },
      delivery: deliveryDetails,
      promoCode: appliedPromoCode,
      discount: promoDiscount > 0 ? promoDiscount : undefined
    };

    if (deliveryDetails) {
      try {
        const totalWeight = orderItems.reduce((sum, item) => sum + (0.3 * item.quantity), 0);
        
        const cdekItems = orderItems.map(item => ({
          name: item.name,
          price: item.price,
          amount: item.quantity,
          weight: 0.3
        }));
        
        console.log('Creating CDEK order for order:', orderId);
        
        const cdekOrder = await createCdekOrder({
          recipientName: `${newOrder.user.firstName || ''} ${newOrder.user.lastName || ''}`,
          recipientPhone: newOrder.user.phone,
          recipientEmail: newOrder.user.email,
          toCity: deliveryDetails.city,
          address: deliveryDetails.address,
          weight: totalWeight,
          orderNumber: orderId,
          items: cdekItems
        });
        
        if (cdekOrder) {
          console.log('CDEK order created successfully:', cdekOrder);
          newOrder.cdekTrackingNumber = cdekOrder.cdek_number || cdekOrder.uuid;
        }
      } catch (error) {
        console.error('Failed to create CDEK order:', error);
        // Continue with order placement even if CDEK fails
      }
    }

    setOrders(prevOrders => [...prevOrders, newOrder]);
    clearCart();
    
    localStorage.removeItem('appliedPromoCode');
    localStorage.removeItem('promoDiscount');
    
    try {
      const botToken = localStorage.getItem('telegramBotToken');
      const chatId = "873712320";
      
      if (botToken && chatId) {
        console.log('Preparing to send Telegram notification for new order');
        const notificationMessage = formatOrderForTelegram(newOrder);
        await sendTelegramNotification(botToken, chatId, notificationMessage);
        console.log('Telegram notification sent successfully');
      } else {
        console.warn('Telegram notification not sent: missing botToken or chatId');
      }
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }
    
    toast({
      title: "Заказ успешно оформлен",
      description: `Заказ №${orderId} успешно оформлен`,
    });
    
    return orderId;
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const updateOrderStatus = (orderId: string, status: 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrderById, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
