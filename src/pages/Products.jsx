import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
} from "lucide-react";

import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../services/productService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function Products() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= CATEGORIES ================= */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return ["all", ...uniqueCategories];
  }, [products]);

  /* ================= FILTER + SORT ================= */

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const productName = String(product.name || "").toLowerCase();
      const productBrand = String(product.brand || "").toLowerCase();
      const searchValue = search.toLowerCase();

      const matchesSearch =
        productName.includes(searchValue) ||
        productBrand.includes(searchValue);

      const matchesCategory =
        category === "all" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });

    /* SORT */

    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) - Number(b.price || 0)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) - Number(a.price || 0)
      );
    }

    if (sort === "name") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [products, search, category, sort]);

  /* ================= CLEAR FILTERS ================= */

  const hasFilters =
    search.trim() !== "" ||
    category !== "all" ||
    sort !== "default";

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("default");
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="mb-10 space-y-4">
            <div className="h-3 w-28 animate-pulse rounded bg-neutral-200" />

            <div className="h-10 w-56 animate-pulse rounded bg-neutral-200" />

            <div className="h-4 w-72 animate-pulse rounded bg-neutral-100" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-neutral-100"
              >
                <div className="aspect-[4/5] animate-pulse bg-neutral-200" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />

                  <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />

                  <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-white px-4">
        <div className="max-w-md text-center">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <X className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-semibold text-neutral-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            {error}
          </p>

          <Button
            type="button"
            className="mt-6 rounded-full"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>

        </div>
      </section>
    );
  }

  /* ================= PAGE ================= */

  return (
    <section className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 sm:text-xs">
              OUR COLLECTION
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              All Products
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
              Discover the latest styles from Raritone.
              Find something that fits your style and
              explore it with Virtual Try-On.
            </p>
          </div>

          {/* PRODUCT COUNT */}

          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="font-medium text-neutral-900">
              {filteredProducts.length}
            </span>

            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </div>
        </div>

        {/* ================= FILTER BAR ================= */}

        <div className="sticky top-16 z-30 -mx-4 border-b border-neutral-100 bg-white/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:px-0 sm:py-6">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

            {/* SEARCH */}

            <div className="relative flex-1 lg:max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

              <Input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products or brands..."
                className="h-11 rounded-full border-neutral-200 bg-neutral-50 pl-10 pr-10 text-sm focus-visible:ring-1 focus-visible:ring-black"
              />

              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* FILTER */}

            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">

              {categories.map((item) => {
                const active = category === item;

                return (
                  <Button
                    key={item}
                    type="button"
                    variant={active ? "default" : "outline"}
                    onClick={() => setCategory(item)}
                    className={`h-10 shrink-0 rounded-full px-4 text-xs capitalize sm:text-sm ${
                      active
                        ? "bg-black text-white hover:bg-neutral-800"
                        : "border-neutral-200 bg-white"
                    }`}
                  >
                    {item === "all"
                      ? "All"
                      : item}
                  </Button>
                );
              })}

            </div>

            {/* SORT */}

            <div className="relative shrink-0">
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
                className="h-10 w-full appearance-none rounded-full border border-neutral-200 bg-white pl-9 pr-8 text-xs font-medium outline-none transition focus:border-black sm:w-48 sm:text-sm"
              >
                <option value="default">
                  Sort: Recommended
                </option>

                <option value="newest">
                  Newest
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="name">
                  Name: A-Z
                </option>
              </select>
            </div>
          </div>

          {/* ACTIVE FILTERS */}

          {hasFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">

              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters:
              </span>

              {search && (
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1"
                >
                  Search: {search}
                </Badge>
              )}

              {category !== "all" && (
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1 capitalize"
                >
                  {category}
                </Badge>
              )}

              {sort !== "default" && (
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1"
                >
                  Sorted
                </Badge>
              )}

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-neutral-600 underline underline-offset-4 hover:text-black"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ================= RESULTS ================= */}

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Showing{" "}
            <span className="font-medium text-neutral-900">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1
              ? "result"
              : "results"}
          </p>
        </div>

        <ProductGrid products={filteredProducts} />

      </div>
    </section>
  );
}

export default Products;