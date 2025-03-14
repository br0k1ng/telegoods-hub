
import { toast } from '@/hooks/use-toast';

// СДЭК API credentials
const CDEK_ACCOUNT = 'fSeBePgWFUZAgtUXQZfw0yyCmgpckXzk';
const CDEK_PASSWORD = 'rPwmNRxsAUUqOxVQdi9eFsKaANHcLHm0';
const CDEK_TEST_URL = 'https://api.edu.cdek.ru/v2';

// Define the missing CdekOrderParams interface
export interface CdekOrderParams {
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  toCity: string;
  address: string;
  weight: number; // in kg
  orderNumber: string;
  items: {
    name: string;
    price: number;
    amount: number;
    weight: number; // in kg
  }[];
}

// Cache for the token to avoid multiple requests
let cachedToken: { token: string, expiresAt: number } | null = null;

// CDEK response types
export interface CdekResponse<T> {
  entity?: T;
  requests?: any[];
  related_entities?: any[];
}

export interface CdekErrorResponse {
  errors: {
    code: string;
    message: string;
  }[];
}

// Basic interfaces for CDEK API
export interface Money {
  value: number;
  vat_sum?: number;
  vat_rate?: number;
}

export interface Phone {
  number: string;
  additional?: string;
}

export interface Contact {
  company?: string;
  name: string;
  email?: string;
  phones: Phone[];
}

export interface Location {
  code?: number;
  city?: string;
  address?: string;
  postal_code?: string;
  country_code?: string;
}

export interface Package {
  number: string;
  weight: number; // in grams
  length?: number; // in cm
  width?: number;  // in cm
  height?: number; // in cm
  comment?: string;
  items?: PackageItem[];
}

export interface PackageItem {
  name: string;
  ware_key: string;
  payment?: Money;
  cost: number;
  weight: number; // in grams
  amount: number;
}

export interface CdekOrder {
  uuid?: string;
  cdek_number?: string;
  type: number; // 1 - интернет-магазин, 2 - доставка
  number: string; // номер заказа в ИС клиента
  tariff_code: number;
  comment?: string;
  shipment_point?: string;
  delivery_point?: string;
  sender?: Contact;
  recipient: Contact;
  from_location?: Location;
  to_location?: Location;
  packages: Package[];
}

// Function to get authorization token
export const getCdekToken = async (): Promise<string | null> => {
  // Check if we have a cached valid token
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  try {
    console.log('Getting CDEK token with credentials:', CDEK_ACCOUNT);
    
    const response = await fetch(`${CDEK_TEST_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${CDEK_ACCOUNT}&client_secret=${CDEK_PASSWORD}`,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error getting CDEK token: ${response.status}`, errorText);
      throw new Error(`Error getting CDEK token: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully obtained CDEK token:', data);
    
    // Cache the token with expiration (subtract 300 seconds for safety)
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + ((data.expires_in - 300) * 1000)
    };
    
    return data.access_token;
  } catch (error) {
    console.error('Failed to get CDEK token:', error);
    // Suppress toast as requested by user
    return null;
  }
};

// Calculate delivery cost
export interface DeliveryCalculationParams {
  fromCity: string;
  toCity: string;
  weight: number; // in kg
  length: number; // in cm
  width: number;  // in cm
  height: number; // in cm
}

export const calculateDelivery = async (params: DeliveryCalculationParams) => {
  const token = await getCdekToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const response = await fetch(`${CDEK_TEST_URL}/calculator/tariff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        type: 1, // delivery type (1 - door to door)
        from_location: {
          city: params.fromCity
        },
        to_location: {
          city: params.toCity
        },
        packages: [{
          weight: params.weight * 1000, // convert to grams
          length: params.length,
          width: params.width,
          height: params.height
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error calculating delivery: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to calculate delivery:', error);
    toast({
      title: "Ошибка расчета доставки",
      variant: "destructive",
    });
    return null;
  }
};

// Get CDEK delivery points
export const getDeliveryPoints = async (cityCode: string) => {
  const token = await getCdekToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const response = await fetch(`${CDEK_TEST_URL}/deliverypoints?city_code=${cityCode}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error getting delivery points: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get delivery points:', error);
    toast({
      title: "Не удалось получить пункты выдачи",
      variant: "destructive",
    });
    return null;
  }
};

// Enhanced create CDEK order function
export const createCdekOrder = async (params: CdekOrderParams): Promise<{ uuid?: string, cdek_number?: string } | null> => {
  const token = await getCdekToken();
  
  if (!token) {
    console.error('Failed to get CDEK token for order creation');
    return null;
  }
  
  try {
    const nameParts = params.recipientName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const orderData: CdekOrder = {
      type: 1, // 1 - интернет-магазин
      number: params.orderNumber,
      tariff_code: 136, // tariff code for delivery service
      comment: "Заказ от CIOT RÖSE",
      shipment_point: "MSK67", // Moscow warehouse code
      to_location: {
        city: params.toCity,
        address: params.address
      },
      recipient: {
        name: params.recipientName,
        email: params.recipientEmail,
        phones: [{
          number: params.recipientPhone
        }]
      },
      packages: [{
        number: "1",
        weight: Math.round(params.weight * 1000), // in grams, rounding to ensure integer
        items: params.items.map(item => ({
          name: item.name,
          ware_key: item.name.slice(0, 20), // Limit to 20 chars as per API spec
          payment: {
            value: 0 // 0 means prepaid
          },
          cost: item.price,
          amount: item.amount,
          weight: Math.round(item.weight * 1000), // in grams, rounding to ensure integer
        }))
      }]
    };
    
    console.log('Creating CDEK order with data:', JSON.stringify(orderData, null, 2));
    console.log('Using token:', token.substring(0, 10) + '...');
    
    const response = await fetch(`${CDEK_TEST_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    
    const responseText = await response.text();
    console.log('CDEK raw response:', responseText);
    
    const responseData = responseText ? JSON.parse(responseText) : {};
    
    if (!response.ok) {
      console.error('CDEK API error response:', responseData);
      throw new Error(`Error creating CDEK order: ${response.status} - ${JSON.stringify(responseData)}`);
    }
    
    console.log('CDEK order created successfully:', responseData);
    
    // Extract UUID and CDEK number from the response
    const result = {
      uuid: responseData.entity?.uuid,
      cdek_number: responseData.entity?.cdek_number
    };
    
    toast({
      title: "Заказ доставки в СДЭК создан",
      description: `Номер заказа в СДЭК: ${result.cdek_number || result.uuid || 'в обработке'}`,
    });
    
    return result;
  } catch (error) {
    console.error('Failed to create CDEK order:', error);
    toast({
      title: "Ошибка создания заказа в СДЭК",
      description: error instanceof Error ? error.message : "Неизвестная ошибка",
      variant: "destructive"
    });
    return null;
  }
};

// Get CDEK order status
export const getCdekOrderStatus = async (uuid: string) => {
  const token = await getCdekToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const response = await fetch(`${CDEK_TEST_URL}/orders/${uuid}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error getting order status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get order status:', error);
    // Suppressing error toast as requested
    return null;
  }
};

// Map CDEK status codes to our application status
export const mapCdekStatusToAppStatus = (cdekStatus: string): 'processing' | 'shipped' | 'delivered' | 'cancelled' => {
  // Based on the CDEK status codes in the documentation
  switch (cdekStatus) {
    case 'CREATED':
    case 'ACCEPTED':
    case 'RECEIVED_AT_SHIPMENT_WAREHOUSE':
    case 'READY_FOR_SHIPMENT_FROM_SHIPMENT_WAREHOUSE':
      return 'processing';
    
    case 'TRANSIT':
    case 'ACCEPTED_AT_TRANSIT_WAREHOUSE':
    case 'HANDED_TO_CARRIER':
    case 'ISSUED':
    case 'READY_TO_BE_RECEIVED':
    case 'READY_FOR_SHIPMENT':
      return 'shipped';
    
    case 'DELIVERED':
      return 'delivered';
    
    case 'NOT_DELIVERED':
    case 'CANCELED':
    case 'RETURNED':
      return 'cancelled';
    
    default:
      return 'processing';
  }
};
