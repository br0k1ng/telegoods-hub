import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Truck, MapPin, User, Phone, Mail, CheckCircle, Clock, Package } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useOrders } from '../features/orders/OrderContext';
import { getProductById } from '../features/products/data';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, updateOrderStatus } = useOrders();
  const navigate = useNavigate();
  
  const order = id ? getOrderById(id) : undefined;
  
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Заказ не найден</p>
        <button 
          onClick={() => navigate('/orders')}
          className="mt-4 px-4 py-2 bg-black text-white rounded-md"
        >
          К заказам
        </button>
      </div>
    );
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Ждёт отправки';
      case 'shipped':
        return 'В пути';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменён';
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
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDeliveryTimeline = () => {
    const steps = [
      { id: 'processing', label: 'Ждёт отправки', icon: <Clock className="h-5 w-5" /> },
      { id: 'shipped', label: 'В пути', icon: <Truck className="h-5 w-5" /> },
      { id: 'delivered', label: 'Доставлен', icon: <CheckCircle className="h-5 w-5" /> }
    ];
    
    const currentStepIndex = steps.findIndex(step => step.id === order.status);
    
    return (
      <div className="mt-4 space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div 
              key={step.id} 
              className={`flex items-center ${isCompleted ? 'text-black' : 'text-gray-400'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                isCompleted ? 'bg-black text-white' : 'bg-gray-100'
              } ${isCurrent ? 'ring-2 ring-black ring-offset-2' : ''}`}>
                {step.icon}
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isCompleted ? 'text-black' : 'text-gray-500'}`}>{step.label}</p>
                {isCurrent && (
                  <p className="text-xs text-gray-500">
                    {order.status === 'processing' ? 'Заказ обрабатывается' : 
                     order.status === 'shipped' ? 'Заказ отправлен' : 
                     'Заказ доставлен'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
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
            onClick={() => navigate('/orders')}
            className="flex items-center space-x-2 mb-6 text-gray-700 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>К заказам</span>
          </button>
          
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-medium">Заказ №{order.id}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="border border-gray-100 rounded-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h2 className="font-medium">Товары</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {order.items.map((item, index) => {
                      const product = getProductById(item.productId);
                      return (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-md overflow-hidden">
                            <img 
                              src={product?.imageUrl || ''} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">Размер: {item.size.toUpperCase()}</div>
                            <div className="text-sm text-gray-500">Количество: {item.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{(item.price * item.quantity).toLocaleString()} ₽</div>
                            <div className="text-sm text-gray-500">{item.price.toLocaleString()} ₽ за шт.</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                  <span className="font-medium">Итого:</span>
                  <span className="font-medium">{order.total.toLocaleString()} ₽</span>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1 space-y-6">
              <div className="border border-gray-100 rounded-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h2 className="font-medium">Статус доставки</h2>
                </div>
                <div className="p-4">
                  {renderDeliveryTimeline()}
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h2 className="font-medium">Адрес доставки</h2>
                </div>
                <div className="p-4">
                  <div className="flex items-start space-x-3 text-sm">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      {order.delivery?.address || order.user.address || order.user.cdekAddress || 'Не указан'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h2 className="font-medium">Контактная информация</h2>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>{order.user.fullName}</div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>{order.user.phone}</div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>{order.user.email}</div>
                  </div>
                </div>
              </div>
              
              {order.cdekTrackingNumber && (
                <div className="border border-gray-100 rounded-md overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <h2 className="font-medium">Информация СДЭК</h2>
                  </div>
                  <div className="p-4">
                    <div className="text-sm">
                      <span className="font-medium">Номер отслеживания:</span> {order.cdekTrackingNumber}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/catalog" className="inline-block px-6 py-3 bg-black text-white rounded-md font-medium">
              Продолжить покупки
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default OrderDetail;
