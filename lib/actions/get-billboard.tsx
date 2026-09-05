import { Billboard } from "@/shared/types";
import { getDefaultStoreId } from "@/lib/store-utils";

const getBillboard = async (id: string): Promise<Billboard | null> => {
  const storeId = await getDefaultStoreId();
  
  if (!storeId) {
    return null;
  }
  
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/${storeId}/billboards`;
  const res = await fetch(`${URL}/${id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
};

export default getBillboard;
