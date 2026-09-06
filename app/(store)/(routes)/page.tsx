import getFeaturedBillboard from "@/lib/actions/get-featured-billboard";
import getProducts from "@/lib/actions/get-products";
import Container from "@/components/store/ui/container";
import ProductCard from "@/components/store/ui/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeroCarousel from "@/components/store/hero-carousel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const HomePage = async () => {
  const products = await getProducts({ isFeatured: true });
  const billboard = await getFeaturedBillboard();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Large billboard area */}
      <section className="relative h-[100vh] md:h-[100vh] w-full overflow-hidden">
        {billboard ? (
          <HeroCarousel billboard={billboard} />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="text-center px-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                BUILT FOR THE BOLD
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Performance meets style in every step
              </p>
              <Link href="/category">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full"
                >
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      {products.length > 0 && (
        <section className="py-16 md:py-24">
          <Container>
            <div className="mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Most Popular
              </h2>
              <p className="text-lg text-gray-600">
                Discover our best-selling styles
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Split Hero Section 1 - Image + Text */}
      <section className="grid md:grid-cols-2 gap-0 min-h-[600px]">
        <div className="relative bg-gradient-to-br from-stone-400 to-stone-500 flex items-center justify-center p-8 md:p-16">
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight uppercase">
              Built For The Bold
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Performance meets style in every step you take
            </p>
            <Link href="/category">
              <Button
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-6 rounded-full transition-all duration-300"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative h-[400px] md:h-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-4">
                Premium Collection
              </p>
              <p className="text-6xl md:text-8xl font-bold text-gray-800">
                2024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Split Hero Section 2 - Reversed */}
      <section className="grid md:grid-cols-2 gap-0 min-h-[600px]">
        <div className="relative h-[400px] md:h-auto order-2 md:order-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-4">
                New Arrivals
              </p>
              <p className="text-6xl md:text-8xl font-bold text-white">Fresh</p>
            </div>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center p-8 md:p-16 order-1 md:order-2">
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight uppercase">
              Statement, Not Subtle
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Stand out with bold designs that turn heads
            </p>
            <Link href="/category">
              <Button
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-6 rounded-full transition-all duration-300"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial / Quote Section */}
      <section className="bg-black py-20 md:py-32">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl md:text-4xl lg:text-5xl font-bold text-white/90 mb-8 leading-tight">
              "ON AND I MOVE — SIMPLE AS THAT. I CAN FEEL BUILT FOR MOMENTUM,
              NOT JUST COMFORT. EVERY STEP FEELS LIKE PURPOSE."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500" />
              <div className="text-left">
                <p className="text-white font-semibold">Marcus Embury</p>
                <p className="text-white/60 text-sm">
                  Customer from Netherlands
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Follow @nivest
            </h2>
            <p className="text-lg text-gray-600">
              Join the movement on Instagram
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden group cursor-pointer"
              >
                <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <p className="text-gray-400 text-sm">
                    Follow @nivest on Instagram
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust Badges */}
      <section className="py-16 border-t border-gray-200">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                FSC® certified packaging
              </h3>
              <p className="text-sm text-gray-600">and paper only.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Orders ship in 3-7 days
              </h3>
              <p className="text-sm text-gray-600">
                with full tracking included.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Long-wear materials
              </h3>
              <p className="text-sm text-gray-600">that hold shape and age.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                30-day easy exchange.
              </h3>
              <p className="text-sm text-gray-600">No questions asked.</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
