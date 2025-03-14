
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, ArrowLeft, ShoppingBag, Minus, Plus } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useCart } from '../features/cart/CartContext';
import { getProductById } from '../features/products/data';
import { useOrders } from '../features/orders/OrderContext';
import { toast } from 'sonner';
import PromoCodeInput from '../components/PromoCodeInput';

const Cart = () => {
  const { items, removeItem, updateQuantity, user } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  
  // Load promo code if applied
  useEffect(() => {
    const appliedPromoCode = localStorage.getItem('appliedPromoCode');
    const savedDiscount = localStorage.getItem('promoDiscount');
    
    if (appliedPromoCode && savedDiscount) {
      setPromoCode(appliedPromoCode);
      setPromoDiscount(parseFloat(savedDiscount));
    }
  }, []);
  
  const cartItems = items.map(item => {
    const product = getProductById(item.productId);
    if (!product) return null;
    
    return {
      ...item,
      product,
      totalPrice: product.price * item.quantity
    };
  }).filter(Boolean);
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item?.totalPrice || 0), 0);
  
  // Calculate discount amount
  useEffect(() => {
    if (promoDiscount > 0) {
      const discount = subtotal * promoDiscount;
      setDiscountAmount(Math.round(discount));
    } else {
      setDiscountAmount(0);
    }
  }, [subtotal, promoDiscount]);
  
  const totalAmount = subtotal - discountAmount;
  
  const handleApplyPromoCode = async (code: string, discount: number): Promise<boolean> => {
    setPromoCode(code);
    setPromoDiscount(discount);
    toast.success(`Промокод ${code} применен. Скидка: ${discount * 100}%`);
    return true;
  };
  
  const handleCheckout = async () => {
    if (!user) {
      toast.error('Для оформления заказа необходимо заполнить данные пользователя');
      navigate('/registration');
      return;
    }
    
    const orderId = await placeOrder();
    if (orderId) {
      navigate(`/orders/${orderId}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/catalog"
            className="flex items-center space-x-2 mb-6 text-gray-700 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Вернуться в каталог</span>
          </Link>
          
          <h1 className="text-2xl font-medium mb-6">Корзина</h1>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">Ваша корзина пуста</h2>
              <p className="text-gray-500 mb-6">Добавьте товары в корзину для оформления заказа</p>
              <Link to="/catalog" className="inline-block px-6 py-3 bg-black text-white rounded-md font-medium">
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="space-y-4">
                  {cartItems.map(item => item && (
                    <motion.div
                      key={`${item.productId}-${item.size}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-4 border border-gray-100 rounded-md p-4"
                    >
                      <Link to={`/product/${item.productId}`} className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/product/${item.productId}`} className="font-medium hover:underline">
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-gray-500">Размер: {item.size.toUpperCase()}</div>
                        <div className="text-sm font-medium mt-1">{item.product.price.toLocaleString()} ₽</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right w-24">
                        <div className="font-medium">{item.totalPrice.toLocaleString()} ₽</div>
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          className="text-gray-400 hover:text-black mt-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <PromoCodeInput onApply={handleApplyPromoCode} />
              </div>
              
              <div className="md:col-span-1">
                <div className="border border-gray-100 rounded-md p-4 bg-gray-50 sticky top-24">
                  <h2 className="text-lg font-medium mb-4">Итого</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Товары ({items.length})</span>
                      <span>{subtotal.toLocaleString()} ₽</span>
                    </div>
                    
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Скидка по промокоду</span>
                        <span>-{discountAmount.toLocaleString()} ₽</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Доставка</span>
                      <span>Бесплатно</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between font-medium">
                      <span>К оплате:</span>
                      <span>{totalAmount.toLocaleString()} ₽</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 transition-colors"
                  >
                    Оформить заказ
                  </button>
                  
                  {!user && (
                    <div className="mt-4 text-sm text-gray-500 text-center">
                      Для оформления заказа необходимо{' '}
                      <Link to="/registration" className="text-black underline">
                        заполнить данные пользователя
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Cart;
