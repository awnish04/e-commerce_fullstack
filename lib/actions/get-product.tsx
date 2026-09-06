import { Product } from "@/shared/types";

const getProduct = async (id: string): Promise<Product | null> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;
  const res = await fetch(`${URL}/${id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    console.error(`Failed to fetch product: ${id}`);
    return null;
  }
  
  return res.json();
};

export default getProduct;

