import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Sparkles,
} from "lucide-react";

import { getProducts } from "../services/productService";

const CATEGORIES = ["Women", "Men", "Kids"];

const SUBCATEGORIES = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Shoes",
  "Accessories",
  "Jewellery",
  "Watches",
  "Glasses",
];

function matchesFilter(product, value) {
  const text = `
    ${product.category || ""}
    ${product.name || ""}
    ${product.description || ""}
  `.toLowerCase();

  return text.includes(value.toLowerCase());
}

function GarmentSelector({
  selectedProduct,
  onSelect,
}) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (mounted) {
          setProducts(data || []);
        }
      } catch (err) {
        console.error(
          "Failed to load try-on products:",
          err,
        );

        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load products.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        category === "All" ||
        matchesFilter(product, category);

      const subcategoryMatch =
        subcategory === "All" ||
        matchesFilter(product, subcategory);

      return (
        categoryMatch &&
        subcategoryMatch
      );
    });
  }, [
    products,
    category,
    subcategory,
  ]);

  return (
    <section className="space-y-5">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-start justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <Sparkles className="h-4 w-4 text-neutral-400" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Garment Catalog
            </p>

          </div>

          <h3 className="mt-1 text-lg font-semibold tracking-tight">
            Choose your look
          </h3>

        </div>

        {selectedProduct && (
          <div className="hidden rounded-full bg-black px-3 py-1.5 text-[10px] font-medium text-white sm:block">

            <span className="mr-1 text-white/50">
              Selected:
            </span>

            {selectedProduct.name}

          </div>
        )}

      </div>

      {/* ==================================================
          FILTERS
      ================================================== */}

      <div className="space-y-4">

        {/* CATEGORY */}

        <div>

          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Category
          </p>

          <div className="flex flex-wrap gap-2">

            {["All", ...CATEGORIES].map(
              (item) => {

                const active =
                  category === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setCategory(item)
                    }
                    className={`
                      rounded-full px-4 py-2
                      text-xs font-medium
                      transition-all
                      ${
                        active
                          ? "bg-black text-white"
                          : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
                      }
                    `}
                  >
                    {item}
                  </button>
                );
              },
            )}

          </div>

        </div>

        {/* SUBCATEGORY */}

        <div>

          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Style
          </p>

          <div className="flex flex-wrap gap-2">

            {[
              "All",
              ...SUBCATEGORIES,
            ].map((item) => {

              const active =
                subcategory === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setSubcategory(item)
                  }
                  className={`
                    rounded-full px-3 py-1.5
                    text-[11px] font-medium
                    transition-all
                    ${
                      active
                        ? "border border-neutral-950 bg-neutral-950 text-white"
                        : "border border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400 hover:text-neutral-900"
                    }
                  `}
                >
                  {item}
                </button>
              );
            })}

          </div>

        </div>

      </div>

      {/* ==================================================
          RESULT COUNT
      ================================================== */}

      {!loading && !error && (
        <div className="flex items-center justify-between border-y border-neutral-100 py-3">

          <p className="text-xs text-neutral-400">

            <span className="font-medium text-neutral-700">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1
              ? "garment"
              : "garments"}{" "}
            available

          </p>

          {(category !== "All" ||
            subcategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setSubcategory("All");
              }}
              className="text-xs font-medium text-neutral-500 hover:text-black"
            >
              Clear filters
            </button>
          )}

        </div>
      )}

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading && (
        <div className="grid grid-cols-2 gap-3">

          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50"
              >

                <div className="aspect-[3/4] animate-pulse bg-neutral-200" />

                <div className="space-y-2 p-3">

                  <div className="h-2.5 w-16 animate-pulse rounded bg-neutral-200" />

                  <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />

                  <div className="h-2.5 w-12 animate-pulse rounded bg-neutral-200" />

                </div>

              </div>
            ),
          )}

        </div>
      )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-700">
            Unable to load garments
          </p>

          <p className="mt-1 text-xs text-red-600">
            {error}
          </p>

        </div>
      )}

      {/* ==================================================
          EMPTY
      ================================================== */}

      {!loading &&
        !error &&
        filteredProducts.length === 0 && (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              <Sparkles className="h-4 w-4 text-neutral-400" />
            </div>

            <h4 className="mt-3 text-sm font-semibold">
              No garments found
            </h4>

            <p className="mt-1 max-w-xs text-xs leading-5 text-neutral-400">
              Try changing your category or style
              filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setSubcategory("All");
              }}
              className="mt-4 rounded-full bg-black px-4 py-2 text-xs font-medium text-white"
            >
              View All Garments
            </button>

          </div>
        )}

      {/* ==================================================
          PRODUCTS
      ================================================== */}

      {!loading &&
        !error &&
        filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-3">

            {filteredProducts.map(
              (product) => {

                const selected =
                  selectedProduct?._id ===
                  product._id;

                const outOfStock =
                  Number(product.stock || 0) <=
                  0;

                return (
                  <button
                    key={product._id}
                    type="button"
                    disabled={outOfStock}
                    onClick={() =>
                      onSelect(product)
                    }
                    className={`
                      group relative overflow-hidden
                      rounded-2xl border bg-white
                      text-left transition-all
                      ${
                        selected
                          ? "border-black ring-1 ring-black"
                          : "border-neutral-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md"
                      }
                      ${
                        outOfStock
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }
                    `}
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">

                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* Gradient */}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />

                      {/* Selected */}

                      {selected && (
                        <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black text-white shadow-lg">

                          <Check className="h-3.5 w-3.5" />

                        </div>
                      )}

                      {/* Stock */}

                      {outOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">

                          <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-600 shadow-sm">
                            Out of stock
                          </span>

                        </div>
                      )}

                      {/* Try On */}

                      {!selected &&
                        !outOfStock && (
                          <div className="absolute bottom-3 left-3 right-3 translate-y-2 rounded-full bg-white/95 py-2 text-center text-[10px] font-semibold opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            Try this look
                          </div>
                        )}

                    </div>

                    {/* INFO */}

                    <div className="p-3">

                      <p className="truncate text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
                        {product.brand ||
                          product.category ||
                          "Raritone"}
                      </p>

                      <h4 className="mt-1 truncate text-xs font-semibold text-neutral-900">
                        {product.name}
                      </h4>

                      <div className="mt-2 flex items-center justify-between">

                        <p className="text-xs font-medium text-neutral-600">
                          ₹
                          {Number(
                            product.price || 0,
                          ).toLocaleString(
                            "en-IN",
                          )}
                        </p>

                        {selected && (
                          <span className="text-[9px] font-semibold text-neutral-900">
                            Selected
                          </span>
                        )}

                      </div>

                    </div>

                  </button>
                );
              },
            )}

          </div>
        )}

      {/* ==================================================
          MOBILE SELECTED
      ================================================== */}

      {selectedProduct && (
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3 sm:hidden">

          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="h-14 w-11 rounded-xl object-cover"
          />

          <div className="min-w-0 flex-1">

            <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
              Selected garment
            </p>

            <p className="mt-0.5 truncate text-xs font-semibold">
              {selectedProduct.name}
            </p>

          </div>

          <Check className="h-4 w-4 text-black" />

        </div>
      )}

    </section>
  );
}

export default GarmentSelector;