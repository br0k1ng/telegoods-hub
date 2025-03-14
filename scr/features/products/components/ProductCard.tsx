
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  index?: number;
  size?: string;
  quantity?: number;
  showControls?: boolean;
  onRemove?: () => void;
  onUpdateQuantity?: (quantity: number) => void;
  discountedPrice?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  name, 
  price, 
  imageUrl, 
  index = 0,
  size,
  quantity = 1,
  showControls = false,
  onRemove,
  onUpdateQuantity,
  discountedPrice
}) => {
  const hasDiscount = discountedPrice !== undefined && discountedPrice < price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={showControls ? "flex items-center space-x-4 p-3 border-b border-gray-100" : "product-card"}
    >
      {showControls ? (
        <>
          <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-grow">
            <Link to={`/product/${id}`} className="block">
              <h3 className="font-medium text-sm tracking-wide">{name}</h3>
              <div>
                {hasDiscount ? (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400 line-through">{price.toLocaleString()} ₽</p>
                    <p className="text-sm text-red-600 font-medium">{discountedPrice.toLocaleString()} ₽</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">{price.toLocaleString()} ₽</p>
                )}
              </div>
              {size && <p className="text-xs text-gray-500 mt-1">Размер: {size.toUpperCase()}</p>}
            </Link>
          </div>
          {showControls && onUpdateQuantity && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onUpdateQuantity(quantity - 1)}
                className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-sm w-6 text-center">{quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(quantity + 1)}
                className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md"
              >
                +
              </button>
            </div>
          )}
          {showControls && onRemove && (
            <button 
              onClick={onRemove}
              className="text-xs text-gray-500 hover:text-black"
            >
              Удалить
            </button>
          )}
        </>
      ) : (
        <Link to={`/product/${id}`} className="block">
          <div className="aspect-[3/4] overflow-hidden rounded-md bg-gray-50">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="mt-3 space-y-1 px-1">
            <h3 className="font-medium text-sm tracking-wide">{name}</h3>
            <div className="flex justify-between items-center">
              {hasDiscount ? (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-400 line-through">{price.toLocaleString()} ₽</p>
                  <p className="text-sm text-red-600 font-medium">{discountedPrice.toLocaleString()} ₽</p>
                </div>
              ) : (
                <p className="text-sm">{price.toLocaleString()} ₽</p>
              )}
            </div>
          </div>
        </Link>
      )}
    </motion.div>
  );
};

export default ProductCard;

