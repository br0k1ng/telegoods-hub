
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, ArrowRight, ArrowLeft as PrevIcon } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { SizeSelector } from '../features/products/components';
import PromoCodeInput from '../components/PromoCodeInput';
import { getProductById } from '../features/products/data';
import { toast } from 'sonner';
import { useCart } from '../features/cart/CartContext';
import { Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : null;
  const { addItem } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImage, setCurrentImage] = useState<'front' | 'back'>('front');
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Товар не найден</p>
        <button 
          onClick={() => navigate('/catalog')}
          className="mt-4 px-4 py-2 bg-black text-white rounded-md"
        >
          В каталог
        </button>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Выберите размер');
      return;
    }
    
    setIsAddingToCart(true);
    
    // Add to cart
    setTimeout(() => {
      addItem(product.id, selectedSize);
      setIsAddingToCart(false);
    }, 500);
  };
  
  const handleApplyPromoCode = async (code: string, discount: number): Promise<boolean> => {
    // Validate and apply the promo code
    if (code.toLowerCase() === 'bylosikgroup') {
      toast.success(`Промокод применен! Скидка ${discount * 100}%`);
      return true;
    } else {
      toast.error('Неверный промокод');
      return false;
    }
  };

  const toggleImage = () => {
    setCurrentImage(currentImage === 'front' ? 'back' : 'front');
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
          <button
            onClick={() => navigate('/catalog')}
            className="flex items-center space-x-2 mb-6 text-gray-700 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Вернуться в каталог</span>
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={currentImage === 'front' 
                    ? (product.frontImage || product.imageUrl) 
                    : (product.backImage || product.imageUrl)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {product.frontImage && product.backImage && (
                <button 
                  onClick={toggleImage}
                  className="absolute bottom-4 right-4 bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md"
                >
                  {currentImage === 'front' ? <ArrowRight className="h-5 w-5" /> : <PrevIcon className="h-5 w-5" />}
                </button>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-2xl font-medium mb-2">{product.name}</h1>
              <p className="text-xl mb-6">{product.price.toLocaleString()} ₽</p>
              
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />
              
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || isAddingToCart}
                className="mt-6 w-full bg-black text-white py-3 rounded-md font-medium flex items-center justify-center space-x-2 hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    <span>Добавить в корзину</span>
                  </>
                )}
              </button>
              
              <PromoCodeInput onApply={handleApplyPromoCode} />
              
              <div className="mt-8">
                <h2 className="text-lg font-medium mb-2">Информация о товаре</h2>
                <ul className="text-gray-700 space-y-1">
                  <li>–100% Хлопок</li>
                  <li>–250 гр. плотность</li>
                  <li>–Шелкография</li>
                  <li>–Оверсайз крой</li>
                  <li>–Лэйбл бирка хлопок</li>
                </ul>
                
                <h2 className="text-lg font-medium mt-4 mb-2">Инструкция по уходу</h2>
                <p className="text-gray-700">Стирать вывернутой наизнанку при температуре не выше 30°C. Не отбеливать. Гладить при низкой температуре с изнаночной стороны.</p>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h2 className="text-lg font-medium mb-2">Доставка & Оплата</h2>
                  <p className="text-gray-700 mb-2">Отправка занимает 5-15 рабочих дней.</p>
                  <p className="text-gray-700">
                    С условиями возврата, спецификой доставки & оплаты можно ознакомиться на странице{" "}
                    <Link to="/shipping-payment" className="text-black underline">
                      Доставка и оплата
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProductDetail;
