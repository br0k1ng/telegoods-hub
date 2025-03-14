
import { toast } from 'sonner';
import { createPromoCode, deletePromoCode, togglePromoCodeStatus, getAllPromoCodes } from '../features/promocodes';
import { products } from '../features/products/data';
import { TelegramCommandResponse } from './telegramTypes';
import { handleHelpCommand, handleAdminCommand } from './telegramDocs';

export const handleTelegramCommand = async (command: string, params: string[]): Promise<TelegramCommandResponse> => {
  try {
    // Split the command and parameters
    const [mainCommand, ...subCommands] = command.split('_');
    
    switch (mainCommand) {
      case 'start':
        return {
          success: true,
          message: `✅ Бот CIOT RÖSE активирован!\n\nИспользуйте /help для получения списка доступных команд или /admin для просмотра функционала администратора.`
        };
        
      case 'help':
        return handleHelpCommand();
        
      case 'admin':
        return handleAdminCommand();
        
      case 'createpromo':
        return handleCreatePromoCommand(params);
      
      case 'listpromos':
        return handleListPromosCommand();
      
      case 'deletepromo':
        return handleDeletePromoCommand(params);
      
      case 'togglepromo':
        return handleTogglePromoCommand(params);
      
      case 'setdiscount':
        return handleSetDiscountCommand(params);
      
      case 'products':
        return handleProductsCommand(subCommands, params);
      
      default:
        return {
          success: false,
          message: 'Неизвестная команда. Используйте /help для получения списка доступных команд.'
        };
    }
  } catch (error) {
    console.error('Error handling Telegram command:', error);
    return {
      success: false,
      message: 'Произошла ошибка при выполнении команды'
    };
  }
};

const handleCreatePromoCommand = (params: string[]): TelegramCommandResponse => {
  // Expected format: /createpromo CODE DISCOUNT MAXUSES EXPIRYDATE
  // Example: /createpromo SUMMER2023 0.15 100 2023-09-30
  if (params.length < 4) {
    return {
      success: false,
      message: 'Неверный формат команды. Используйте: /createpromo КОД СКИДКА МАКС_ИСПОЛЬЗОВАНИЙ ДАТА_ОКОНЧАНИЯ'
    };
  }
  
  const [code, discountStr, maxUsesStr, ...dateParts] = params;
  const discount = parseFloat(discountStr);
  const maxUses = parseInt(maxUsesStr);
  const expiryDate = dateParts.join(' ');
  
  if (isNaN(discount) || discount <= 0 || discount >= 1) {
    return {
      success: false,
      message: 'Скидка должна быть числом от 0 до 1 (например, 0.15 для 15%)'
    };
  }
  
  if (isNaN(maxUses) || maxUses <= 0) {
    return {
      success: false,
      message: 'Максимальное количество использований должно быть положительным числом'
    };
  }
  
  try {
    const promo = createPromoCode(code, discount, maxUses, new Date(expiryDate).toISOString());
    return {
      success: true,
      message: `Промокод ${code} успешно создан со скидкой ${discount * 100}%, ${maxUses} использований, до ${new Date(expiryDate).toLocaleDateString()}`
    };
  } catch (error) {
    return {
      success: false,
      message: `Ошибка при создании промокода: ${error instanceof Error ? error.message : 'неизвестная ошибка'}`
    };
  }
};

const handleListPromosCommand = (): TelegramCommandResponse => {
  const promos = getAllPromoCodes();
  
  if (promos.length === 0) {
    return {
      success: true,
      message: 'Промокоды не найдены'
    };
  }
  
  const promosInfo = promos.map(promo => {
    const expiryDate = new Date(promo.expiryDate).toLocaleDateString();
    return `${promo.code}: ${promo.discount * 100}%, Осталось: ${promo.usesLeft}/${promo.maxUses}, До: ${expiryDate}, Статус: ${promo.isActive ? 'активен' : 'неактивен'}`;
  }).join('\n');
  
  return {
    success: true,
    message: `Список промокодов:\n${promosInfo}`
  };
};

const handleDeletePromoCommand = (params: string[]): TelegramCommandResponse => {
  if (params.length < 1) {
    return {
      success: false,
      message: 'Неверный формат команды. Используйте: /deletepromo КОД'
    };
  }
  
  const code = params[0];
  const success = deletePromoCode(code);
  
  if (success) {
    return {
      success: true,
      message: `Промокод ${code} успешно удален`
    };
  } else {
    return {
      success: false,
      message: `Промокод ${code} не найден`
    };
  }
};

const handleTogglePromoCommand = (params: string[]): TelegramCommandResponse => {
  if (params.length < 1) {
    return {
      success: false,
      message: 'Неверный формат команды. Используйте: /togglepromo КОД'
    };
  }
  
  const code = params[0];
  const result = togglePromoCodeStatus(code);
  
  if (result) {
    return {
      success: true,
      message: `Промокод ${code} теперь ${result.isActive ? 'активен' : 'неактивен'}`
    };
  } else {
    return {
      success: false,
      message: `Промокод ${code} не найден`
    };
  }
};

const handleSetDiscountCommand = (params: string[]): TelegramCommandResponse => {
  return {
    success: false,
    message: '🔧 Функция установки скидки на товары находится в разработке'
  };
};

const handleProductsCommand = (subCommands: string[], params: string[]): TelegramCommandResponse => {
  return {
    success: false,
    message: '🔧 Функция управления товарами находится в разработке'
  };
};
