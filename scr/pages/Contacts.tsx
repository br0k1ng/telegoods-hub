
import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, MessageCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Contacts = () => {
  const contactLinks = [
    { 
      icon: <Instagram className="h-6 w-6" />, 
      title: 'Instagram', 
      description: 'Следите за нашими новостями',
      url: 'https://www.instagram.com/ciotrose?igsh=MTRycW92azUxd3ZjcA%3D%3D&utm_source=qr',
      username: '@ciotrose'
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
        <path d="M16.5 7.5v.001"></path>
        <path d="M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0"></path>
      </svg>, 
      title: 'TikTok', 
      description: 'Смотрите наши видео',
      url: 'https://www.tiktok.com/@ciotrose?_t=ZN-8uUKfZvBjgA&_r=1',
      username: '@ciotrose'
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M22.2 2L11.1 13.1"></path>
        <path d="M1.9 8.5l9.4 9.4L22.5 2.9c.4-.7-.5-1.6-1.3-1.2L11.1 9"></path>
      </svg>, 
      title: 'Telegram', 
      description: 'Наш официальный канал',
      url: 'https://t.me/ciotrose',
      username: '@ciotrose'
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M22.2 2L11.1 13.1"></path>
        <path d="M1.9 8.5l9.4 9.4L22.5 2.9c.4-.7-.5-1.6-1.3-1.2L11.1 9"></path>
      </svg>, 
      title: 'Поддержка', 
      description: 'Техническая поддержка',
      url: 'https://t.me/ciotrose_support',
      username: '@ciotrose_support'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-medium mb-8 text-center">Контакты</h1>
          
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactLinks.map((contact, index) => (
                <motion.a
                  key={index}
                  href={contact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {contact.icon}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{contact.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{contact.description}</p>
                      <p className="text-black font-medium">{contact.username}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
            
            <div className="mt-12 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-medium mb-4">Проблема с заказом?</h2>
              <p className="text-gray-700 mb-4">
                Если у вас возникла какая-либо проблема с заказом – мы готовы вам помочь.
                Свяжитесь с нами, мы отслеживаем каждое обращение в порядке очереди.
              </p>
              <a 
                href="https://t.me/ciotrose_support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-black font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22.2 2L11.1 13.1"></path>
                  <path d="M1.9 8.5l9.4 9.4L22.5 2.9c.4-.7-.5-1.6-1.3-1.2L11.1 9"></path>
                </svg>
                <span>@ciotrose_support</span>
              </a>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contacts;
