import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ChevronRight,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

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

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

const displayName = (value) => {
  if (!value) return "";

  return String(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

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
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        console.log("FRONTEND PRODUCTS:", data);
        console.log("FRONTEND PRODUCT COUNT:", data.length);

        const womenProducts = data.filter(
          (product) =>
            String(product.gender || "")
              .trim()
              .toLowerCase() === "women"
        );

        console.log(
          "FRONTEND WOMEN PRODUCTS:",
          womenProducts
        );

        console.log(
          "FRONTEND WOMEN COUNT:",
          womenProducts.length
        );

        setProducts(data);
      } catch (err) {
        console.error("LOAD PRODUCTS ERROR:", err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
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
    const searchValue = search.trim().toLowerCase();

    let result = products.filter((product) => {
      const productName = String(
        product?.name || ""
      ).toLowerCase();

      const productBrand = String(
        product?.brand || ""
      ).toLowerCase();

      const productGender = normalize(product?.gender);
      const productCategory = normalize(product?.category);
      const productSubcategory = normalize(
        product?.subcategory
      );

      const matchesSearch =
        !searchValue ||
        productName.includes(searchValue) ||
        productBrand.includes(searchValue);

      const matchesGender =
        gender === "all" ||
        productGender === gender;

      const matchesCategory =
        category === "all" ||
        productCategory === category;

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
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
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
    const params = new URLSearchParams();

    const normalizedGender = normalize(newGender);
    const normalizedCategory = normalize(newCategory);
    const normalizedSubcategory =
      normalize(newSubcategory);

    if (
      normalizedGender &&
      normalizedGender !== "all"
    ) {
      params.set("gender", normalizedGender);
    }

    if (
      normalizedCategory &&
      normalizedCategory !== "all"
    ) {
      params.set("category", normalizedCategory);
    }

    if (
      normalizedSubcategory &&
      normalizedSubcategory !== "all"
    ) {
      params.set(
        "subcategory",
        normalizedSubcategory
      );
    }

    setSearchParams(params);
  };

  const updateGender = (value) => {
    updateFilters({
      newGender: value,
      newCategory: "all",
      newSubcategory: "all",
    });
  };

  const updateCategory = (value) => {
    updateFilters({
      newGender: gender,
      newCategory: value,
      newSubcategory: "all",
    });
  };

  const updateSubcategory = (value) => {
    updateFilters({
      newGender: gender,
      newCategory: category,
      newSubcategory: value,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSort("default");
    setSearchParams({});
  };

  const hasFilters =
    search.trim() ||
    gender !== "all" ||
    category !== "all" ||
    subcategory !== "all" ||
    sort !== "default";

  const collectionTitle =
    subcategory !== "all"
      ? displayName(subcategory)
      : category !== "all"
      ? displayName(category)
      : gender !== "all"
      ? displayName(gender)
      : "All Products";

  if (loading) {
    return (
      <section className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-10 space-y-4">
            <div className="h-3 w-28 animate-pulse rounded bg-neutral-200" />
            <div className="h-10 w-56 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-72 animate-pulse rounded bg-neutral-100" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map(
              (_, index) => (
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
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <X className="mx-auto mb-4 h-8 w-8 text-red-500" />

          <h2 className="text-xl font-semibold">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            {error}
          </p>

          <Button
            className="mt-5 rounded-full"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
              OUR COLLECTION
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
              {collectionTitle}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
              Discover the latest styles from
              Raritone. Find something that fits your
              style and explore it with Virtual Try-On.
            </p>
          </div>

          <div className="text-sm text-neutral-500">
            <span className="font-semibold text-black">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </div>
        </div>

        <div className="py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search products or brands..."
                  className="h-11 rounded-full pl-10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-neutral-400" />
                  </button>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto">
                <Button
                  type="button"
                  onClick={() => updateGender("all")}
                  variant={
                    gender === "all"
                      ? "default"
                      : "outline"
                  }
                  className="shrink-0 rounded-full"
                >
                  All
                </Button>

                {Object.entries(hierarchy).map(
                  ([key, item]) => (
                    <Button
                      key={key}
                      type="button"
                      onClick={() =>
                        updateGender(key)
                      }
                      variant={
                        gender === key
                          ? "default"
                          : "outline"
                      }
                      className="shrink-0 rounded-full"
                    >
                      {item.label}
                    </Button>
                  )
                )}
              </div>

              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value)
                  }
                  className="h-10 rounded-full border border-neutral-200 bg-white pl-9 pr-5"
                >
                  <option value="default">
                    Recommended
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

            {gender !== "all" && (
              <div className="flex items-center gap-2 overflow-x-auto border-t pt-4">
                <span className="shrink-0 text-xs uppercase tracking-wider text-neutral-400">
                  Categories
                </span>

                {availableCategories.map((item) => (
                  <Button
                    key={item}
                    type="button"
                    variant={
                      category === item
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      updateCategory(item)
                    }
                    className="shrink-0 rounded-full"
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
                <div className="flex items-center gap-2 overflow-x-auto border-t pt-4">
                  <span className="shrink-0 text-xs uppercase tracking-wider text-neutral-400">
                    {displayName(category)}
                  </span>

                  <ChevronRight className="h-4 w-4 text-neutral-300" />

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
                    className="shrink-0 rounded-full"
                  >
                    All
                  </Button>

                  {availableSubcategories.map(
                    (item) => {
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
                          className="shrink-0 rounded-full"
                        >
                          {item}
                        </Button>
                      );
                    }
                  )}
                </div>
              )}

            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-neutral-500">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters:
                </span>

                {gender !== "all" && (
                  <Badge className="rounded-full">
                    {displayName(gender)}
                  </Badge>
                )}

                {category !== "all" && (
                  <Badge className="rounded-full">
                    {displayName(category)}
                  </Badge>
                )}

                {subcategory !== "all" && (
                  <Badge className="rounded-full">
                    {displayName(subcategory)}
                  </Badge>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-5 text-sm text-neutral-500">
          Showing{" "}
          <span className="font-semibold text-black">
            {filteredProducts.length}
          </span>{" "}
          results
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
            <Search className="mx-auto h-6 w-6 text-neutral-400" />

            <h2 className="mt-5 text-lg font-semibold">
              No products found
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              No products match the current filters.
            </p>

            <Button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-full"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-[4/5] w-full object-cover"
                />

                <div className="p-4">
                  <p className="text-xs text-neutral-500">
                    {product.brand}
                  </p>

                  <h3 className="mt-1 font-semibold text-neutral-900">
                    {product.name}
                  </h3>

                  <p className="mt-2 font-medium">
                    ₹{product.price}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {displayName(product.gender)} ·{" "}
                    {displayName(product.category)} ·{" "}
                    {displayName(product.subcategory)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;