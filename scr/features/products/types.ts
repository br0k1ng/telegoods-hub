
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  sizes: {
    label: string;
    value: string;
    available: boolean;
  }[];
  frontImage?: string;
  backImage?: string;
}

export interface LookbookImage {
  id: string;
  imageUrl: string;
  description?: string;
}
