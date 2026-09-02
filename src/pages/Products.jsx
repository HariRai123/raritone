import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ChevronRight,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../services/productService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const hierarchy = {
  women: {
    label: "Women",
    categories: {
      clothing: [
        "Dresses",
        "Tops",
        "Shirts",
        "T-Shirts",
        "Jeans",
        "Trousers",
        "Skirts",
        "Jackets",
        "Hoodies",
        "Sweaters",
        "Shorts",
        "Ethnic Wear",
      ],
      footwear: [
        "Heels",
        "Flats",
        "Sneakers",
        "Boots",
        "Sandals",
        "Formal Shoes",
        "Loafers",
        "Slides",
      ],
      accessories: [
        "Bags",
        "Glasses",
        "Sunglasses",
        "Watches",
        "Jewellery",
        "Belts",
        "Wallets",
        "Hats",
        "Caps",
        "Scarves",
      ],
    },
  },

  men: {
    label: "Men",
    categories: {
      clothing: [
        "Shirts",
        "T-Shirts",
        "Jeans",
        "Trousers",
        "Shorts",
        "Jackets",
        "Hoodies",
        "Sweaters",
        "Ethnic Wear",
      ],
      footwear: [
        "Sneakers",
        "Boots",
        "Sandals",
        "Formal Shoes",
        "Loafers",
        "Slides",
      ],
      accessories: [
        "Bags",
        "Glasses",
        "Sunglasses",
        "Watches",
        "Belts",
        "Wallets",
        "Caps",
        "Hats",
        "Scarves",
      ],
    },
  },

  kids: {
    label: "Kids",
    categories: {
      clothing: [
        "Dresses",
        "Tops",
        "Shirts",
        "T-Shirts",
        "Jeans",
        "Trousers",
        "Shorts",
        "Jackets",
        "Hoodies",
        "Sweaters",
        "Ethnic Wear",
      ],
      footwear: [
        "Sneakers",
        "Boots",
        "Sandals",
        "Flats",
        "Formal Shoes",
        "Slides",
      ],
      accessories: [
        "Bags",
        "Glasses",
        "Watches",
        "Caps",
        "Hats",
      ],
    },
  },
};

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function displayName(value) {
  if (!value) return "";

  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const gender = normalize(searchParams.get("gender")) || "all";
  const category = normalize(searchParams.get("category")) || "all";
  const subcategory =
    normalize(searchParams.get("subcategory")) || "all";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const availableCategories = useMemo(() => {
    if (gender === "all") {
      return ["all", "clothing", "footwear", "accessories"];
    }

    return [
      "all",
      ...Object.keys(hierarchy[gender]?.categories || {}),
    ];
  }, [gender]);

  const availableSubcategories = useMemo(() => {
    if (gender === "all" || category === "all") {
      return [];
    }

    return hierarchy[gender]?.categories?.[category] || [];
  }, [gender, category]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const productName = String(product?.name || "").toLowerCase();
      const productBrand = String(product?.brand || "").toLowerCase();

      const productGender = normalize(product?.gender);
      const productCategory = normalize(product?.category);
      const productSubcategory = normalize(product?.subcategory);

      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        productName.includes(searchValue) ||
        productBrand.includes(searchValue);

      const matchesGender =
        gender === "all" || productGender === gender;

      const matchesCategory =
        category === "all" || productCategory === category;

      const matchesSubcategory =
        subcategory === "all" ||
        productSubcategory === subcategory;

      return (
        matchesSearch &&
        matchesGender &&
        matchesCategory &&
        matchesSubcategory
      );
    });

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
  }, [
    products,
    search,
    gender,
    category,
    subcategory,
    sort,
  ]);

  const updateFilters = ({
    newGender = gender,
    newCategory = category,
    newSubcategory = subcategory,
  }) => {
    const params = new URLSearchParams(searchParams);

    const normalizedGender = normalize(newGender);
    const normalizedCategory = normalize(newCategory);
    const normalizedSubcategory = normalize(newSubcategory);

    if (!normalizedGender || normalizedGender === "all") {
      params.delete("gender");
    } else {
      params.set("gender", normalizedGender);
    }

    if (
      !normalizedCategory ||
      normalizedCategory === "all"
    ) {
      params.delete("category");
    } else {
      params.set("category", normalizedCategory);
    }

    if (
      !normalizedSubcategory ||
      normalizedSubcategory === "all"
    ) {
      params.delete("subcategory");
    } else {
      params.set("subcategory", normalizedSubcategory);
    }

    setSearchParams(params);
  };

  const updateGender = (newGender) => {
    updateFilters({
      newGender,
      newCategory: "all",
      newSubcategory: "all",
    });
  };

  const updateCategory = (newCategory) => {
    updateFilters({
      newGender: gender,
      newCategory,
      newSubcategory: "all",
    });
  };

  const updateSubcategory = (newSubcategory) => {
    updateFilters({
      newGender: gender,
      newCategory: category,
      newSubcategory,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSort("default");
    setSearchParams({});
  };

  const hasFilters =
    search.trim() !== "" ||
    gender !== "all" ||
    category !== "all" ||
    subcategory !== "all" ||
    sort !== "default";

  const collectionTitle = useMemo(() => {
    if (subcategory !== "all") {
      return displayName(subcategory);
    }

    if (category !== "all") {
      return displayName(category);
    }

    if (gender !== "all") {
      return displayName(gender);
    }

    return "All Products";
  }, [gender, category, subcategory]);

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

  return (
    <section className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 sm:text-xs">
              OUR COLLECTION
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              {collectionTitle}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
              Discover the latest styles from Raritone.
              Find something that fits your style and explore
              it with Virtual Try-On.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="font-medium text-neutral-900">
              {filteredProducts.length}
            </span>

            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </div>
        </div>

        <div className="sticky top-16 z-30 -mx-4 border-b border-neutral-100 bg-white/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:px-0 sm:py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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

              <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
                <Button
                  type="button"
                  variant={gender === "all" ? "default" : "outline"}
                  onClick={() => updateGender("all")}
                  className={`h-10 shrink-0 rounded-full px-4 text-xs sm:text-sm ${
                    gender === "all"
                      ? "bg-black text-white hover:bg-neutral-800"
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  All
                </Button>

                {Object.entries(hierarchy).map(
                  ([key, item]) => (
                    <Button
                      key={key}
                      type="button"
                      variant={
                        gender === key ? "default" : "outline"
                      }
                      onClick={() => updateGender(key)}
                      className={`h-10 shrink-0 rounded-full px-4 text-xs sm:text-sm ${
                        gender === key
                          ? "bg-black text-white hover:bg-neutral-800"
                          : "border-neutral-200 bg-white"
                      }`}
                    >
                      {item.label}
                    </Button>
                  )
                )}
              </div>

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

                  <option value="newest">Newest</option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="name">Name: A-Z</option>
                </select>
              </div>
            </div>

            {gender !== "all" && (
              <div className="flex items-center gap-2 overflow-x-auto border-t border-neutral-100 pt-4">
                <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  Categories
                </span>

                {availableCategories.map((item) => (
                  <Button
                    key={item}
                    type="button"
                    variant={
                      category === item ? "default" : "outline"
                    }
                    onClick={() => updateCategory(item)}
                    className={`h-9 shrink-0 rounded-full px-4 text-xs ${
                      category === item
                        ? "bg-black text-white hover:bg-neutral-800"
                        : "border-neutral-200 bg-white"
                    }`}
                  >
                    {item === "all"
                      ? `All ${displayName(gender)}`
                      : displayName(item)}
                  </Button>
                ))}
              </div>
            )}

            {gender !== "all" &&
              category !== "all" &&
              availableSubcategories.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto border-t border-neutral-100 pt-4">
                  <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-neutral-400">
                    {displayName(category)}
                  </span>

                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />

                  <Button
                    type="button"
                    variant={
                      subcategory === "all"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      updateSubcategory("all")
                    }
                    className={`h-9 shrink-0 rounded-full px-4 text-xs ${
                      subcategory === "all"
                        ? "bg-black text-white hover:bg-neutral-800"
                        : "border-neutral-200 bg-white"
                    }`}
                  >
                    All
                  </Button>

                  {availableSubcategories.map((item) => {
                    const value = normalize(item);

                    return (
                      <Button
                        key={item}
                        type="button"
                        variant={
                          subcategory === value
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          updateSubcategory(value)
                        }
                        className={`h-9 shrink-0 rounded-full px-4 text-xs ${
                          subcategory === value
                            ? "bg-black text-white hover:bg-neutral-800"
                            : "border-neutral-200 bg-white"
                        }`}
                      >
                        {item}
                      </Button>
                    );
                  })}
                </div>
              )}

            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
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

                {gender !== "all" && (
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 capitalize"
                  >
                    {displayName(gender)}
                  </Badge>
                )}

                {category !== "all" && (
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 capitalize"
                  >
                    {displayName(category)}
                  </Badge>
                )}

                {subcategory !== "all" && (
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 capitalize"
                  >
                    {displayName(subcategory)}
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
        </div>

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

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-neutral-900">
                No products found
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                We couldn't find any products matching
                your current filters.
              </p>

              <Button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </section>
  );
}

export default Products;