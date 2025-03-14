import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import ProductCard from '../features/products/components/ProductCard';
import { products } from '../features/products/data';

const Catalog = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-medium">Каталог</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-md ${view === 'grid' ? 'bg-gray-100' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-md ${view === 'list' ? 'bg-gray-100' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          
          <div className={view === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
            {products.map((product, index) => (
              <div key={product.id} className={view === 'list' ? 'border rounded-md p-3' : ''}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  index={index}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Catalog;
