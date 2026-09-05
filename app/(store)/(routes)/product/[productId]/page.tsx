import getProduct from "@/lib/actions/get-product";
import getProducts from "@/lib/actions/get-products";
import ProductList from "@/components/store/product-list";
import Container from "@/components/store/ui/container";
import { ProductDetailModern } from "@/components/store/product-detail-modern";

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const suggestedProducts = await getProducts({
    categoryId: product?.category?.id,
  });

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <ProductDetailModern product={product} />
      
      {suggestedProducts.length > 0 && (
        <Container>
          <div className="px-4 py-16 sm:px-6 lg:px-8">
            <hr className="mb-10" />
            <ProductList title="You might also like" items={suggestedProducts} />
          </div>
        </Container>
      )}
    </div>
  );
};

export default ProductPage;