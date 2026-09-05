import { Category } from "@/shared/types";
import { getDefaultStoreId } from "@/lib/store-utils";

const getCategories = async (): Promise<Category[]> => {
  const storeId = await getDefaultStoreId();
  
  if (!storeId) {
    return [];
  }
  
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/${storeId}/categories`;
  const res = await fetch(URL, { cache: 'no-store' });
  
  if (!res.ok) {
    return [];
  }
  
  return res.json();
};

export default getCategories;
