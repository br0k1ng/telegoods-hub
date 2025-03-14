
import env from './env';
import { handleTelegramCommand } from './telegramCommands';
import { toast } from 'sonner';
import { Order } from '@/features/orders/types';

// Function to send a message to Telegram
export const sendTelegramMessage = async (message: string): Promise<boolean> => {
  const botToken = localStorage.getItem('telegramBotToken') || env.TELEGRAM_BOT_TOKEN;
  const chatId = localStorage.getItem('telegramChatId') || env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.error('Telegram credentials not found');
    return false;
  }
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }),
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      console.error('Error sending Telegram message:', data.description);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};

// Function to get updates from Telegram
export const getTelegramUpdates = async (offset = 0): Promise<any> => {
  const botToken = localStorage.getItem('telegramBotToken') || env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    console.error('Telegram bot token not found');
    return null;
  }
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=10`, {
      method: 'GET',
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error getting Telegram updates:', error);
    return null;
  }
};

// Function to handle incoming updates from Telegram
export const handleTelegramUpdates = async (): Promise<void> => {
  const botToken = localStorage.getItem('telegramBotToken') || env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    console.error('Telegram bot token not found');
    return;
  }
  
  try {
    console.log('Telegram updates handler initialized');
    
    // Implement long polling to check for new messages
    let lastUpdateId = 0;
    
    const checkUpdates = async () => {
      const updates = await getTelegramUpdates(lastUpdateId);
      
      if (updates && updates.ok && updates.result.length > 0) {
        for (const update of updates.result) {
          if (update.update_id >= lastUpdateId) {
            lastUpdateId = update.update_id + 1;
          }
          
          // Process message
          if (update.message && update.message.text) {
            const text = update.message.text.trim();
            
            // Handle commands
            if (text.startsWith('/')) {
              const commandText = text.substring(1);
              const parts = commandText.split(/\s+/);
              const command = parts[0].toLowerCase();
              const params = parts.slice(1);
              
              console.log(`Processing command: ${command} with params:`, params);
              
              const response = await handleTelegramCommand(command, params);
              await sendTelegramMessage(response.message);
            }
          }
        }
      }
      
      // Continue checking for updates every 3 seconds
      setTimeout(checkUpdates, 3000);
    };
    
    // Start checking for updates
    checkUpdates();
    
  } catch (error) {
    console.error('Error handling Telegram updates:', error);
  }
};

// Function to setup the bot commands
export const setupBotCommands = async (): Promise<boolean> => {
  const botToken = localStorage.getItem('telegramBotToken') || env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    console.error('Telegram bot token not found');
    return false;
  }
  
  try {
    const commands = [
      {
        command: 'start',
        description: 'Запустить бота'
      },
      {
        command: 'help',
        description: 'Список доступных команд'
      },
      {
        command: 'admin',
        description: 'Функционал администратора'
      },
      {
        command: 'createpromo',
        description: 'Создать промокод. Пример: /createpromo CODE 0.15 100 2023-12-31'
      },
      {
        command: 'listpromos',
        description: 'Список всех промокодов'
      },
      {
        command: 'deletepromo',
        description: 'Удалить промокод. Пример: /deletepromo CODE'
      },
      {
        command: 'togglepromo',
        description: 'Включить/выключить промокод. Пример: /togglepromo CODE'
      },
      {
        command: 'setdiscount',
        description: 'Установить скидку на товар. Пример: /setdiscount PRODUCT_ID 0.2'
      },
      {
        command: 'products_list',
        description: 'Список всех товаров'
      },
      {
        command: 'products_add',
        description: 'Добавить новый товар'
      },
      {
        command: 'products_update',
        description: 'Обновить товар'
      },
      {
        command: 'products_delete',
        description: 'Удалить товар'
      }
    ];
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commands: commands
      }),
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      console.error('Error setting bot commands:', data.description);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error setting bot commands:', error);
    return false;
  }
};

// Call this function to initialize the bot when the app starts
export const initializeBot = async (): Promise<void> => {
  await setupBotCommands();
  await handleTelegramUpdates();
};

// Functions needed for OrderContext.tsx
export const sendTelegramNotification = async (botToken: string, chatId: string, message: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }),
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      console.error('Error sending Telegram notification:', data.description);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
};

// Function to format an order for Telegram notification
export const formatOrderForTelegram = (order: Order): string => {
  let message = `<b>🛍️ Новый заказ #${order.id}</b>\n\n`;
  message += `<b>Дата:</b> ${new Date(order.createdAt).toLocaleString()}\n`;
  message += `<b>Статус:</b> ${getStatusText(order.status)}\n`;
  message += `<b>Сумма:</b> ${order.total} ${env.CURRENCY}\n\n`;
  
  if (order.promoCode) {
    message += `<b>Промокод:</b> ${order.promoCode}\n`;
    if (order.discount) {
      message += `<b>Скидка:</b> ${order.discount * 100}%\n\n`;
    }
  }
  
  message += `<b>Клиент:</b>\n`;
  message += `${order.user.firstName} ${order.user.lastName}\n`;
  message += `📱 ${order.user.phone}\n`;
  if (order.user.email) {
    message += `📧 ${order.user.email}\n`;
  }
  
  if (order.delivery) {
    message += `\n<b>Доставка:</b>\n`;
    message += `${order.cdekTrackingNumber ? 'СДЭК' : 'Самовывоз'}\n`;
    if (order.delivery.address) {
      message += `📍 ${order.delivery.address}, ${order.delivery.city}\n`;
    }
    if (order.delivery.deliveryCost) {
      message += `Стоимость доставки: ${order.delivery.deliveryCost} ${env.CURRENCY}\n`;
    }
    if (order.cdekTrackingNumber) {
      message += `Трек-номер: ${order.cdekTrackingNumber}\n`;
    }
  }
  
  message += `\n<b>Товары:</b>\n`;
  order.items.forEach(item => {
    message += `- ${item.name} x${item.quantity}`;
    if (item.size) {
      message += ` (${item.size})`;
    }
    message += `: ${item.price * item.quantity} ${env.CURRENCY}\n`;
  });
  
  return message;
};

// Helper function to get readable status text
const getStatusText = (status: string): string => {
  switch (status) {
    case 'processing':
      return 'В обработке';
    case 'shipped':
      return 'Отправлен';
    case 'delivered':
      return 'Доставлен';
    case 'cancelled':
      return 'Отменен';
    default:
      return status;
  }
};
