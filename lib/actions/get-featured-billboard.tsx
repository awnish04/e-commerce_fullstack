import { Billboard } from "@/shared/types";

const getFeaturedBillboard = async (): Promise<Billboard | null> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error("NEXT_PUBLIC_API_URL is not set");
    return null;
  }

  try {
    const res = await fetch(URL, { cache: "no-store" });

    if (!res.ok) {
      console.error(`Billboard fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const billboards: Billboard[] = await res.json();

    // Return the first active billboard
    const activeBillboard = billboards.find((b) => b.isActive);
    return activeBillboard || (billboards.length > 0 ? billboards[0] : null);
  } catch (error) {
    console.error("Error fetching featured billboard:", error);
    return null;
  }
};

export default getFeaturedBillboard;
