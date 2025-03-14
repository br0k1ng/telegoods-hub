
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Помощь',
      links: [
        { label: 'Проблема с заказом', path: '/help/order-issue' },
        { label: 'Таблица размеров', path: '/help/size-chart' },
        { label: 'Рекомендации по уходу', path: '/help/care-instructions' },
        { label: 'Доставка и оплата', path: '/shipping-payment' },
      ]
    },
    {
      title: 'Информация',
      links: [
        { label: 'Политика конфиденциальности', path: '/privacy-policy' },
        { label: 'Публичная оферта', path: '/terms' },
      ]
    },
    {
      title: 'Контакты',
      links: [
        { label: 'Instagram', path: 'https://www.instagram.com/ciotrose?igsh=MTRycW92azUxd3ZjcA%3D%3D&utm_source=qr', external: true },
        { label: 'TikTok', path: 'https://www.tiktok.com/@ciotrose?_t=ZN-8uUKfZvBjgA&_r=1', external: true },
        { label: 'Telegram', path: 'https://t.me/ciotrose', external: true },
        { label: 'Поддержка', path: 'https://t.me/ciotrose_support', external: true },
      ]
    }
  ];

  const socialLinks = [
    { icon: <Instagram className="h-5 w-5" />, url: 'https://www.instagram.com/ciotrose?igsh=MTRycW92azUxd3ZjcA%3D%3D&utm_source=qr', label: 'Instagram' },
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
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-medium mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.external ? (
                      <a 
                        href={link.path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        to={link.path}
                        className="text-gray-600 hover:text-black transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mb-8 border-t border-gray-200 pt-8">
          <div className="bg-gray-50 p-6 rounded-lg">
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
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Доставка и оплата</h3>
            <p className="text-gray-700 mb-4">
              Отправка занимает 5-15 рабочих дней.
            </p>
            <Link 
              to="/shipping-payment"
              className="text-black font-medium hover:underline"
            >
              С условиями возврата, спецификой доставки и оплаты можно ознакомиться на странице Доставка и оплата
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-200">
          <div className="mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/29616dac-0000-4850-97f6-fed3c4b10ca4.png" 
              alt="CIOT RÖSE" 
              className="h-8 object-contain"
            />
          </div>
          
          <div className="flex space-x-4 mb-4 md:mb-0">
            {socialLinks.map((link, idx) => (
              <a 
                key={idx}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
          
          <p className="text-sm text-gray-500">
            &copy; {currentYear} CIOT RÖSE. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
