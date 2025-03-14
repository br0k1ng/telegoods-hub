
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import LoadingScreen from '../components/LoadingScreen';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../features/products/components/ProductCard';
import { products } from '../features/products/data';
import { initializeBot } from '../utils/telegramService';
import env from '../utils/env';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setContentLoaded(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  useEffect(() => {
    // Store Telegram credentials in localStorage
    const botToken = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;
    
    localStorage.setItem('telegramBotToken', botToken);
    localStorage.setItem('telegramChatId', chatId);
    
    if (contentLoaded) {
      // Initialize the Telegram bot once the content is loaded
      initializeBot().catch(error => {
        console.error('Failed to initialize Telegram bot:', error);
      });
    }
  }, [contentLoaded]);
  
  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      
      <div className={`min-h-screen bg-white flex flex-col ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
        <Navbar />
        
        <main className="container mx-auto px-4 pt-28 pb-16 flex-grow">
          <AnimatePresence>
            {contentLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1
                  }}
                  transition={{ 
                    delay: 0.2, 
                    duration: 0.5
                  }}
                  className="text-2xl font-medium tracking-wider mb-8 relative"
                >
                  <motion.span 
                    className="relative z-10 inline-block"
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [0, 1, 0, -1, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3,
                      ease: "easeInOut" 
                    }}
                  >
                    НОВИНКИ
                  </motion.span>
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-pink-200/30 to-blue-200/30 blur-xl rounded-full -z-10"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.7, 0.5]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 5,
                      ease: "easeInOut" 
                    }}
                  />
                </motion.h1>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-full"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 mb-10">
                    <h2 className="font-medium p-4 border-b border-gray-100">Популярные товары</h2>
                    <div className="grid grid-cols-2 gap-4 p-4">
                      {products.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          imageUrl={product.imageUrl}
                          index={index}
                        />
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <Link 
                        to="/catalog"
                        className="block text-center py-2 px-4 border border-black rounded-md text-sm font-medium hover:bg-black hover:text-white transition-colors duration-200"
                      >
                        Смотреть все
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
