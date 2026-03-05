import ProductCard from "./ProductCard";
import { useFeaturedProducts } from "@/hooks/useProducts";

const FeaturedProducts = () => {
  const { data: featured = [], isLoading } = useFeaturedProducts();

  if (isLoading) return null;

  return (
    <section className="py-20">
      <div className="container">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Featured <span className="text-primary">Drops</span>
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
