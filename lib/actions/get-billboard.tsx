import { Billboard } from "@/shared/types";

const getBillboard = async (id: string): Promise<Billboard | null> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;
  const res = await fetch(`${URL}/${id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    console.error(`Failed to fetch billboard: ${id}`);
    return null;
  }
  
  return res.json();
};

export default getBillboard;

