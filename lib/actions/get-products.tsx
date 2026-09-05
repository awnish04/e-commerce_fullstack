import { Product } from "@/shared/types";
import { getDefaultStoreId } from "@/lib/store-utils";
import qs from "query-string";

interface Query {
  categoryId?: string;
  isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  const storeId = await getDefaultStoreId();
  
  if (!storeId) {
    return [];
  }
  
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/${storeId}/products`;
  
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      categoryId: query.categoryId,
      isFeatured: query.isFeatured,
    },
  });

  const res = await fetch(url, { cache: 'no-store' });
  
  if (!res.ok) {
    return [];
  }
  
  return res.json();
};

export default getProducts;
