export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  billboard: Billboard;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  category: Category;
  price: string | number;
  size?: string;
  color?: string;
  stock: number;
  isFeatured: boolean;
  isArchived: boolean;
  images: Image[];
}

export interface Image {
  id: string;
  url: string;
}
