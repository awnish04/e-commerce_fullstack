import getProducts from "@/lib/actions/get-products";
import getCategory from "@/lib/actions/get-category";
import Container from "@/components/store/ui/container";
import Billboard from "@/components/store/billboard";
import NoResults from "@/components/store/ui/no-results";
import ProductCard from "@/components/store/ui/product-card";

export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const { categoryId } = await params;

  const products = await getProducts({
    categoryId,
  });

  const category = await getCategory(categoryId);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <p className="text-muted-foreground">
            The category you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container>
        {category.billboard && <Billboard data={category.billboard} />}
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">
                {products.length} products
              </p>
            </div>

            {products.length === 0 ? (
              <NoResults />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((item) => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
