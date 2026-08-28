import { SearchX } from "lucide-react";
import ProductCard from "./ProductCard";

function ProductGrid({ products = [] }) {
  if (!products.length) {
    return (
      <div className="flex min-h-[320px] w-full flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <SearchX className="h-7 w-7 text-neutral-500" />
        </div>

        <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl">
          No Results Found
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
          We couldn't find any products matching your search or selected
          category. Try changing your filters or search for something else.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid w-full
        grid-cols-2
        gap-x-3 gap-y-6
        sm:grid-cols-2
        sm:gap-x-4 sm:gap-y-8
        md:grid-cols-3
        lg:grid-cols-4
        lg:gap-x-5 lg:gap-y-10
        xl:gap-x-6
      "
    >
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}

export default ProductGrid;