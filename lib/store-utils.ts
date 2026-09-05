import prismadb from "@/lib/db/prismadb";

/**
 * Get the first available store (for store frontend display)
 * This is used when there's no specific storeId in the URL
 */
export async function getDefaultStoreId(): Promise<string | null> {
  try {
    const store = await prismadb.store.findFirst({
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    return store?.id || null;
  } catch (error) {
    console.error("[GET_DEFAULT_STORE_ID]", error);
    return null;
  }
}
