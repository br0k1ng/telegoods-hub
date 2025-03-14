
import React, { useState } from 'react';
import { toast } from 'sonner';

interface TelegramBotSettingsProps {
  onSave: (token: string, chatId: string) => void;
  initialToken?: string;
  initialChatId?: string;
}

const TelegramBotSettings: React.FC<TelegramBotSettingsProps> = ({ 
  onSave, 
  initialToken = '', 
  initialChatId = '' 
}) => {
  const [botToken, setBotToken] = useState(initialToken);
  const [chatId, setChatId] = useState(initialChatId);
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!botToken || !chatId) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('telegramBotToken', botToken);
    localStorage.setItem('telegramChatId', chatId);
    
    onSave(botToken, chatId);
    toast.success('Настройки Telegram сохранены');
    setIsVisible(false);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="text-sm font-medium text-black hover:underline focus:outline-none flex items-center"
      >
        {isVisible ? 'Скрыть настройки Telegram' : 'Настройки Telegram-бота для уведомлений'}
      </button>
      
      {isVisible && (
        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-md font-medium mb-3">Настройка Telegram-бота</h3>
          <p className="text-sm text-gray-600 mb-4">
            Для отправки уведомлений о заказах в Telegram, вам необходимо создать бота через @BotFather 
            и указать полученный токен и ID чата для получения уведомлений.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Токен бота</label>
              <input
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="123456789:ABCdefGhIJklmnOPQrsTUVwxyz"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">ID чата</label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="-1001234567890"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <p>Как получить ID чата:</p>
              <ol className="list-decimal ml-5">
                <li>Добавьте своего бота в чат или канал</li>
                <li>Отправьте сообщение в этот чат</li>
                <li>Откройте URL: https://api.telegram.org/bot[ВАШ_ТОКЕН]/getUpdates</li>
                <li>Найдите "chat": &#123; "id": ЧИСЛО &#125;</li>
              </ol>
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Сохранить настройки
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TelegramBotSettings;
