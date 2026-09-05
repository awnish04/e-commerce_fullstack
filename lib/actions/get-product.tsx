import { Product } from "@/shared/types";
import { getDefaultStoreId } from "@/lib/store-utils";

const getProduct = async (id: string): Promise<Product | null> => {
  const storeId = await getDefaultStoreId();
  
  if (!storeId) {
    return null;
  }
  
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/${storeId}/products`;
  const res = await fetch(`${URL}/${id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
};

export default getProduct;
