
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, User } from './types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  user: User | null;
  addItem: (productId: string, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  saveUserInfo: (user: User) => void;
  getUserInfo: () => User | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Save user info to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const addItem = (productId: string, size: string) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(
        item => item.productId === productId && item.size === size
      );

      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map(item => 
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...prevItems, { productId, size, quantity: 1 }];
      }
    });
    
    toast.success('Товар добавлен в корзину');
  };

  const removeItem = (productId: string, size: string) => {
    setItems(prevItems => 
      prevItems.filter(item => !(item.productId === productId && item.size === size))
    );
    toast.success('Товар удален из корзины');
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    setItems(prevItems => 
      prevItems.map(item => 
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const saveUserInfo = (userData: User) => {
    setUser(userData);
  };

  const getUserInfo = () => {
    return user;
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      user,
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      saveUserInfo,
      getUserInfo
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
