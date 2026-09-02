import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../services/productService";

import homeImage from "../assets/home.jpg";

const categories = ["All", "Women", "Men", "Kids"];

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
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
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error loading products:", err);

        if (mounted) {
          setError(
            "Unable to load the collection right now."
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
    if (selectedCategory === "All") {
      return products.slice(0, 8);
    }

    const selectedGender =
      selectedCategory.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const productGender = String(
        product?.gender || ""
      )
        .trim()
        .toLowerCase();

      return productGender === selectedGender;
    });

    return filtered.slice(0, 8);
  }, [products, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === "All") {
      return;
    }

    navigate(
      `/products?gender=${category.toLowerCase()}`
    );
  };

  const handleShopProducts = () => {
    navigate("/products");
  };

  const handleTryOn = () => {
    navigate("/try-on");
  };

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[540px] overflow-hidden rounded-[2rem] bg-neutral-900 sm:min-h-[650px]">
          <img
            src={homeImage}
            alt="Raritone collection"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />

          <div className="relative flex min-h-[540px] max-w-2xl flex-col justify-end p-7 text-white sm:min-h-[650px] sm:p-12 lg:p-16">
            <Badge
              variant="outline"
              className="w-fit border-white/30 bg-white/10 text-white backdrop-blur"
            >
              <Star />
              SUMMER 2026
            </Badge>

            <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">
              Golden Hour
              <br />
              Collection
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
              A refined edit of everyday essentials,
              statement pieces and effortless silhouettes.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                className="h-11 rounded-full px-6"
                onClick={handleShopProducts}
              >
                Shop the edit
                <ArrowRight />
              </Button>

              <Button
                variant="outline"
                className="h-11 rounded-full border-white/30 bg-white/10 px-6 text-white hover:bg-white/20"
                onClick={handleTryOn}
              >
                <Sparkles />
                Virtual Try-On
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="rounded-2xl border-neutral-200 bg-neutral-950 text-white">
          <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                LIMITED TIME
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Seasonal edit — up to 30% off
              </h2>
            </div>

            <Button
              variant="outline"
              className="w-fit rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20"
              onClick={handleShopProducts}
            >
              Shop sale
              <ArrowRight />
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
              CURATED FOR YOU
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Trending Now
            </h2>
          </div>

          <Link
            to="/products"
            className="text-sm font-medium underline underline-offset-4"
          >
            See all
          </Link>
        </div>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const isActive =
              selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  handleCategoryChange(category)
                }
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                  isActive
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-black"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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

                    <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
                  </div>
                </div>
              )
            )}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
            <p className="text-sm font-medium text-neutral-800">
              No{" "}
              {selectedCategory === "All"
                ? ""
                : selectedCategory.toLowerCase()}{" "}
              products available.
            </p>

            <p className="mt-2 text-xs text-neutral-500">
              Try another category or browse the complete
              collection.
            </p>

            <Button
              type="button"
              onClick={() =>
                setSelectedCategory("All")
              }
              className="mt-5 rounded-full"
            >
              View All Products
            </Button>
          </div>
        ) : (
          <div className="mt-8">
            <ProductGrid products={filteredProducts} />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-neutral-100 p-8 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            STYLE, VISUALISED
          </p>

          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                See how it looks before you buy.
              </h2>

              <p className="mt-3 text-sm leading-7 text-neutral-500">
                Upload a clear full-body photo and use
                Raritone's Try-On Studio to preview selected
                garments.
              </p>
            </div>

            <Button
              className="w-fit rounded-full px-6"
              onClick={handleTryOn}
            >
              <Sparkles />
              Open Try-On Studio
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;