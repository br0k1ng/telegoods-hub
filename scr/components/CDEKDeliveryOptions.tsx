
import React, { useState, useEffect } from 'react';
import { calculateDelivery, DeliveryCalculationParams } from '../utils/cdekService';
import { toast } from 'sonner';

interface CDEKDeliveryOptionsProps {
  weight: number;
  onSelectDelivery: (cost: number) => void;
}

const CDEKDeliveryOptions: React.FC<CDEKDeliveryOptionsProps> = ({ weight, onSelectDelivery }) => {
  const [city, setCity] = useState('');
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const handleCalculate = async () => {
    if (!city) {
      toast.error('Пожалуйста, введите город доставки');
      return;
    }
    
    setIsCalculating(true);
    
    // T-shirt package parameters (approximate)
    const params: DeliveryCalculationParams = {
      fromCity: 'Москва', // default shipping from Moscow
      toCity: city,
      weight: weight || 0.3, // if not provided, assume 300g per t-shirt
      length: 30,
      width: 20,
      height: 5
    };
    
    try {
      const result = await calculateDelivery(params);
      
      if (result && result.tariff_codes && result.tariff_codes.length > 0) {
        // Get the first available tariff
        const deliveryPrice = result.tariff_codes[0].delivery_sum;
        setDeliveryCost(deliveryPrice);
        onSelectDelivery(deliveryPrice);
      } else {
        toast.error('Не удалось рассчитать стоимость доставки');
        setDeliveryCost(null);
      }
    } catch (error) {
      console.error('Error calculating delivery:', error);
      toast.error('Ошибка при расчете доставки');
    } finally {
      setIsCalculating(false);
    }
  };
  
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Доставка СДЭК</h3>
      
      <div className="flex flex-col space-y-3">
        <div>
          <label className="block text-sm mb-1">Город доставки</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Например: Санкт-Петербург"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        >
          {isCalculating ? (
            <span className="flex items-center justify-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Расчет...
            </span>
          ) : 'Рассчитать стоимость'}
        </button>
        
        {deliveryCost !== null && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="font-medium">Стоимость доставки: {deliveryCost.toLocaleString()} ₽</p>
            <p className="text-sm text-gray-600 mt-1">Срок доставки: 3-5 дней</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CDEKDeliveryOptions;
