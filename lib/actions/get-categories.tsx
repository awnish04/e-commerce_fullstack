import { Category } from "@/shared/types";

const getCategories = async (): Promise<Category[]> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;
  const res = await fetch(URL, { cache: 'no-store' });
  
  if (!res.ok) {
    console.error("Failed to fetch categories");
    return [];
  }
  
  return res.json();
};

export default getCategories;

