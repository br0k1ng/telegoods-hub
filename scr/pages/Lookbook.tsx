import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { getLookbookById } from '../features/products/data';

const Lookbook = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lookbook = id ? getLookbookById(id) : null;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  if (!lookbook) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Лукбук не найден</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-black text-white rounded-md"
        >
          На главную
        </button>
      </div>
    );
  }
  
  const goToPrevious = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? lookbook.images.length - 1 : prev - 1
    );
  };
  
  const goToNext = () => {
    setCurrentImageIndex(prev => 
      prev === lookbook.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    else if (e.key === 'ArrowRight') goToNext();
    else if (e.key === 'Escape') setIsFullscreen(false);
  };
  
  return (
    <div className="min-h-screen bg-white" onKeyDown={handleKeyDown} tabIndex={0}>
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 mb-6 text-gray-700 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Вернуться</span>
          </button>
          
          <h1 className="text-2xl font-medium mb-6">{lookbook.title}</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {lookbook.images.map((image, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index);
                  setIsFullscreen(true);
                }}
                className="aspect-[3/4] overflow-hidden rounded-md cursor-pointer"
              >
                <motion.img
                  src={image}
                  alt={`${lookbook.title} - фото ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white p-2 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <button
              onClick={goToPrevious}
              className="absolute left-4 text-white p-2 z-10"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 text-white p-2 z-10"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center p-4"
            >
              <img
                src={lookbook.images[currentImageIndex]}
                alt={`${lookbook.title} - фото ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {lookbook.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Lookbook;
