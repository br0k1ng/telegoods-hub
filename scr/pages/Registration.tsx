
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useCart } from '../features/cart/CartContext';
import { toast } from 'sonner';

const Registration = () => {
  const navigate = useNavigate();
  const { saveUserInfo, getUserInfo } = useCart();
  const userData = getUserInfo();
  
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    phone: userData?.phone || '',
    email: userData?.email || '',
    cdekAddress: userData?.cdekAddress || ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.email || !formData.cdekAddress) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Введите корректный email');
      return;
    }
    
    // Simple phone validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Введите корректный номер телефона');
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      saveUserInfo(formData);
      setIsSaving(false);
      toast.success('Данные успешно сохранены');
      
      // Navigate back or to cart if coming from checkout
      const referrer = document.referrer;
      if (referrer.includes('/cart')) {
        navigate('/cart');
      }
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 mb-6 text-gray-700 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Назад</span>
          </button>
          
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <User className="h-8 w-8 text-gray-700" />
            </div>
            <h1 className="text-2xl font-medium">Личные данные</h1>
            <p className="text-gray-500 mt-2">Данные используются для доставки заказов</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                ФИО
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Иванов Иван Иванович"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Номер телефона
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="+7 999 123 45 67"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Электронная почта
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="example@mail.ru"
              />
            </div>
            
            <div>
              <label htmlFor="cdekAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Адрес ближайшего пункта СДЭК
              </label>
              <textarea
                id="cdekAddress"
                name="cdekAddress"
                value={formData.cdekAddress}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="г. Москва, ул. Пушкина, д. 10"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-black text-white py-3 rounded-md font-medium flex items-center justify-center space-x-2 hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Сохранить</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Registration;
