import { Category } from "@/shared/types";

const getCategory = async (id: string): Promise<Category | null> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;
  const res = await fetch(`${URL}/${id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    console.error(`Failed to fetch category: ${id}`);
    return null;
  }
  
  return res.json();
};

export default getCategory;

