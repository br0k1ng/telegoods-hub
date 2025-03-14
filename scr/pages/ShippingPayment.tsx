
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const ShippingPayment = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-28 pb-16">
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
          
          <h1 className="text-3xl font-medium mb-8">Доставка и оплата</h1>
          
          <div className="max-w-3xl">
            <section className="mb-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Truck className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-medium">Доставка</h2>
              </div>
              
              <div className="pl-12">
                <p className="text-gray-700 mb-4">
                  Отправка занимает 5-15 рабочих дней.
                </p>
                
                <h3 className="font-medium mb-2">Сроки доставки:</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-1">
                  <li>Москва и Санкт-Петербург: 1-3 рабочих дня</li>
                  <li>Другие города России: 3-7 рабочих дней</li>
                  <li>Отдаленные регионы: до 14 рабочих дней</li>
                </ul>
                
                <p className="text-gray-700 mb-4">
                  Доставка осуществляется курьерской службой СДЭК. После оформления заказа вам будет предоставлен трек-номер для отслеживания посылки.
                </p>
              </div>
            </section>
            
            <section className="mb-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-full">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-medium">Оплата</h2>
              </div>
              
              <div className="pl-12">
                <p className="text-gray-700 mb-4">
                  Оплата товаров происходит только через сайт ciotrose.ru
                </p>
                
                <ol className="list-decimal pl-5 mb-4 text-gray-700 space-y-2">
                  <li>Выберите понравившиеся товары</li>
                  <li>Заполните форму с вашими данными</li>
                  <li>После заполнения данных откроется страница оплаты</li>
                  <li>Оплатите товар через платежную систему ЮMoney</li>
                </ol>
                
                <h3 className="font-medium mb-2">Реквизиты:</h3>
                <p className="text-gray-700 mb-4">
                  ИНН 344407583773
                </p>
              </div>
            </section>
            
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-full">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-medium">Информация по возврату</h2>
              </div>
              
              <div className="pl-12">
                <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-2">
                  <li>При дистанционной покупке срок возврата - 7 дней после получения товара покупателем.</li>
                  <li>Товар должен иметь первоначальный внешний вид.</li>
                  <li>Если вам не подошел размер, возможен обмен, если этот товар есть в наличии на складе, так же замена на другую вещь по желанию.</li>
                  <li>Для оформления возврата свяжитесь с нами.</li>
                  <li>Возврат оформляется после получения вами посылки, отказаться от посылки в пункте выдачи - НЕЛЬЗЯ.</li>
                  <li>Данные для возврата/обмена высылаются вам после одобрения в поддержке.</li>
                </ul>
                
                <p className="text-gray-700">
                  Если у вас возникли вопросы по доставке или оплате, свяжитесь с нами через{" "}
                  <a 
                    href="https://t.me/ciotrose_support" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-black font-medium underline"
                  >
                    Telegram
                  </a>.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShippingPayment;
