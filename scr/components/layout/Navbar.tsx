
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, ShoppingBag, User, Package, Instagram, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/features/cart/CartContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const closeMenu = () => setIsMenuOpen(false);
  
  const menuItems = [
    { title: 'Каталог', path: '/catalog' },
    { title: 'Лукбук', path: '/lookbook/1' },
    { title: 'Контакты', path: '/contacts' },
  ];

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const socialLinks = [
    { 
      icon: <Instagram className="h-5 w-5" />, 
      url: 'https://www.instagram.com/ciotrose?igsh=MTRycW92azUxd3ZjcA%3D%3D&utm_source=qr',
      label: 'Instagram'
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
        <path d="M16.5 7.5v.001"></path>
        <path d="M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0"></path>
      </svg>, 
      url: 'https://www.tiktok.com/@ciotrose?_t=ZN-8uUKfZvBjgA&_r=1',
      label: 'TikTok'
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M22.2 2L11.1 13.1"></path>
        <path d="M1.9 8.5l9.4 9.4L22.5 2.9c.4-.7-.5-1.6-1.3-1.2L11.1 9"></path>
      </svg>, 
      url: 'https://t.me/ciotrose',
      label: 'Telegram'
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container px-4 mx-auto flex justify-between items-center h-16">
        <button
          onClick={toggleMenu}
          className="p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img src="/lovable-uploads/29616dac-0000-4850-97f6-fed3c4b10ca4.png" alt="CIOT RÖSE" className="h-14 object-contain" />
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/orders" className="text-gray-700 hover:text-black">
            <Package className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="text-gray-700 hover:text-black relative">
            <ShoppingBag className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <Link to="/registration" className="text-gray-700 hover:text-black">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-black z-50"
          >
            <div className="flex justify-between items-center p-4">
              <Link to="/" onClick={closeMenu} className="font-medium text-white">
                Меню
              </Link>
              <button onClick={closeMenu} className="p-2 text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav>
              <ul className="divide-y-0">
                {menuItems.map((item) => (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: menuItems.indexOf(item) * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={closeMenu}
                      className="flex justify-between items-center p-4 bg-black text-white font-medium border-b-0"
                    >
                      {item.title}
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Link>
                  </motion.li>
                ))}
                
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: menuItems.length * 0.1 }}
                  className="mt-4 p-4"
                >
                  <p className="text-white font-medium mb-3">Мы в социальных сетях:</p>
                  <div className="flex space-x-4">
                    {socialLinks.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        aria-label={link.label}
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </motion.li>
                
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: (menuItems.length + 1) * 0.1 }}
                  className="mt-2 p-4"
                >
                  <p className="text-white font-medium mb-2">Техническая поддержка:</p>
                  <a 
                    href="https://t.me/ciotrose_support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    @ciotrose_support
                  </a>
                </motion.li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
