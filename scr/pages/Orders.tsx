import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useOrders } from '../features/orders/OrderContext';

const Orders = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();
  
  // Sort orders by date - newest first
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'В обработке';
      case 'shipped':
        return 'В пути';
      case 'delivered':
        return 'Доставлен';
      default:
        return 'Неизвестный статус';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 mb-6 text-gray-700 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>На главную</span>
          </button>
          
          <h1 className="text-2xl font-medium mb-6">Мои заказы</h1>
          
          {sortedOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">У вас пока нет заказов</h2>
              <p className="text-gray-500 mb-6">Ваши заказы будут отображаться здесь после оформления</p>
              <Link to="/catalog" className="inline-block px-6 py-3 bg-black text-white rounded-md font-medium">
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-100 rounded-md overflow-hidden"
                >
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <div>
                      <div className="font-medium">Заказ №{order.id}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <Link to={`/orders/${order.id}`} className="text-gray-500 hover:text-black">
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Товары: {order.items.length}</div>
                        <div className="text-sm text-gray-500">Сумма: {order.total.toLocaleString()} ₽</div>
                      </div>
                      <Link
                        to={`/orders/${order.id}`}
                        className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Orders;
