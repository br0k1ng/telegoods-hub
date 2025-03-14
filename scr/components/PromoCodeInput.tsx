import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { validatePromoCode, usePromoCode } from '../features/promocodes';

interface PromoCodeInputProps {
  onApply: (code: string, discount: number) => Promise<boolean>;
}

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({ onApply }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    const appliedPromoCode = localStorage.getItem('appliedPromoCode');
    if (appliedPromoCode) {
      setCode(appliedPromoCode);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    const normalizedCode = code.trim().toLowerCase();
    
    setIsLoading(true);
    try {
      // Validate the promocode
      const { valid, discount, message } = validatePromoCode(normalizedCode);
      
      if (!valid) {
        setIsValid(false);
        setTimeout(() => setIsValid(null), 2000);
        setIsLoading(false);
        return;
      }
      
      // Save promo code in localStorage
      localStorage.setItem('appliedPromoCode', normalizedCode);
      localStorage.setItem('promoDiscount', discount.toString());
      
      const isSuccess = await onApply(normalizedCode, discount);
      setIsValid(isSuccess);
      
      if (isSuccess) {
        // Use the promocode (decrease usesLeft)
        usePromoCode(normalizedCode);
      } else {
        // If unsuccessful, clear localStorage
        localStorage.removeItem('appliedPromoCode');
        localStorage.removeItem('promoDiscount');
        setTimeout(() => setIsValid(null), 2000);
      }
    } catch (error) {
      // Clear localStorage on error
      localStorage.removeItem('appliedPromoCode');
      localStorage.removeItem('promoDiscount');
      
      setIsValid(false);
      setTimeout(() => setIsValid(null), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm font-medium flex items-center text-gray-700 underline"
      >
        {isExpanded ? 'Скрыть промокод' : 'У меня есть промокод'}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="mt-3 flex relative">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Введите промокод"
                  className="w-full border border-gray-200 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="flex items-center">
                <AnimatePresence>
                  {isValid !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="mr-2"
                    >
                      {isValid ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  type="submit"
                  disabled={isLoading || !code.trim()}
                  className="bg-black text-white px-4 py-2 text-sm rounded-r-md hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'Применить'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromoCodeInput;
