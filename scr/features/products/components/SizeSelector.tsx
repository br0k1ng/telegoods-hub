
import React from 'react';
import { motion } from 'framer-motion';

interface Size {
  label: string;
  value: string;
  available: boolean;
}

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ sizes, selectedSize, onSelectSize }) => {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Размер</h3>
      <div className="grid grid-cols-5 gap-2">
        {sizes.map((size) => (
          <motion.button
            key={size.value}
            whileTap={{ scale: 0.95 }}
            disabled={!size.available}
            onClick={() => size.available && onSelectSize(size.value)}
            className={`
              h-10 flex items-center justify-center rounded-md border transition-all duration-200
              ${selectedSize === size.value 
                ? 'border-black bg-black text-white' 
                : 'border-gray-200 hover:border-gray-300'
              }
              ${!size.available && 'opacity-30 cursor-not-allowed bg-gray-50'}
            `}
          >
            {size.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
