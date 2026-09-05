import { Billboard } from "@/shared/types";
import { getDefaultStoreId } from "@/lib/store-utils";

const getFeaturedBillboard = async (): Promise<Billboard | null> => {
  const storeId = await getDefaultStoreId();
  
  if (!storeId) {
    console.error("No store found");
    return null;
  }
  
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/${storeId}/billboards`;
  
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error("NEXT_PUBLIC_API_URL is not set");
    return null;
  }
  
  try {
    // Fetch all billboards for this store
    const res = await fetch(URL, { cache: 'no-store' });
    
    if (!res.ok) {
      console.error(`Billboard fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }
    
    const billboards: Billboard[] = await res.json();
    
    // Return the first billboard (or you could add a "featured" flag to the schema)
    return billboards.length > 0 ? billboards[0] : null;
  } catch (error) {
    console.error("Error fetching featured billboard:", error);
    return null;
  }
};

export default getFeaturedBillboard;
