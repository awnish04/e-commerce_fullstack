import getCategories from "@/lib/actions/get-categories";
import { MainNavbar } from "@/components/store/main-navbar";

export const revalidate = 0;

const Navbar = async () => {
  try {
    const categories = await getCategories();
    return <MainNavbar categories={categories || []} />;
  } catch (error) {
    console.error("[NAVBAR_ERROR]", error);
    // Return navbar with empty categories if there's an error
    return <MainNavbar categories={[]} />;
  }
};
 
export default Navbar;