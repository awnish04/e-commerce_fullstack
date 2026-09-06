import { Product } from "@/shared/types";
import qs from "query-string";

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;
  
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      categoryId: query.categoryId,
      colorId: query.colorId,
      sizeId: query.sizeId,
      isFeatured: query.isFeatured,
    },
  });

  const res = await fetch(url, { cache: 'no-store' });
  
  if (!res.ok) {
    console.error("Failed to fetch products");
    return [];
  }
  
  return res.json();
};

export default getProducts;

