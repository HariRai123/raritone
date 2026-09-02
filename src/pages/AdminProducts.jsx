import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productService";

const categoryOptions = {
  Clothing: [
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
  Footwear: [
    "Sneakers",
    "Heels",
    "Flats",
    "Boots",
    "Sandals",
    "Formal Shoes",
    "Loafers",
    "Slides",
  ],
  Accessories: [
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
};

const emptyForm = {
  productId: "",
  name: "",
  gender: "",
  category: "",
  subcategory: "",
  price: "",
  description: "",
  brand: "",
  stock: "",
  discount: "",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isEditing = Boolean(editingId);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load products."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableSubcategories = useMemo(() => {
    if (!form.category) {
      return [];
    }

    return categoryOptions[form.category] || [];
  }, [form.category]);

  const change = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const next = {
        ...previous,
        [name]: value,
      };

      if (name === "category") {
        next.subcategory = "";
      }

      return next;
    });
  };

  const submit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!isEditing && !image) {
      setError("Product image is required.");
      return;
    }

    if (!form.gender) {
      setError("Please select a gender.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!form.subcategory) {
      setError("Please select a subcategory.");
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (image) {
        payload.append("image", image);
      }

      if (isEditing) {
        await updateProduct(editingId, payload);

        setMessage("Product updated successfully.");
      } else {
        await createProduct(payload);

        setMessage("Product created successfully.");
      }

      setForm(emptyForm);
      setImage(null);
      setEditingId(null);

      await loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const edit = (product) => {
    setEditingId(product._id);

    setForm({
      productId: product.productId || "",
      name: product.name || "",
      gender: product.gender || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      price: product.price ?? "",
      description: product.description || "",
      brand: product.brand || "",
      stock: product.stock ?? "",
      discount: product.discount ?? "",
    });

    setImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImage(null);
    setError("");
    setMessage("");
  };

  const remove = async (id) => {
    if (
      !window.confirm(
        "Delete this product? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteProduct(id);

      setProducts((previous) =>
        previous.filter(
          (product) => product._id !== id
        )
      );

      setMessage("Product deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
              ADMIN / CATALOG
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Product Management
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Create, update and manage the Raritone catalog.
            </p>
          </div>

          <Badge variant="secondary">
            {products.length} products
          </Badge>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isEditing ? <Pencil /> : <Plus />}

                {isEditing
                  ? "Edit Product"
                  : "Add Product"}
              </CardTitle>

              <CardDescription>
                {isEditing
                  ? "Update catalog information."
                  : "Add a new item to the store."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={submit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="productId">
                    Product ID
                  </Label>

                  <Input
                    id="productId"
                    name="productId"
                    value={form.productId}
                    onChange={change}
                    disabled={isEditing}
                    placeholder="RAR-WOM-DRE-001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name
                  </Label>

                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={change}
                    placeholder="Floral Summer Dress"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender
                  </Label>

                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={change}
                    required
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="">
                      Select gender
                    </option>

                    <option value="Women">
                      Women
                    </option>

                    <option value="Men">
                      Men
                    </option>

                    <option value="Kids">
                      Kids
                    </option>

                    <option value="Unisex">
                      Unisex
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category
                  </Label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={change}
                    required
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="">
                      Select category
                    </option>

                    {Object.keys(categoryOptions).map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">
                    Subcategory
                  </Label>

                  <select
                    id="subcategory"
                    name="subcategory"
                    value={form.subcategory}
                    onChange={change}
                    disabled={!form.category}
                    required
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="">
                      {form.category
                        ? "Select subcategory"
                        : "Select category first"}
                    </option>

                    {availableSubcategories.map(
                      (subcategory) => (
                        <option
                          key={subcategory}
                          value={subcategory}
                        >
                          {subcategory}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">
                    Brand
                  </Label>

                  <Input
                    id="brand"
                    name="brand"
                    value={form.brand}
                    onChange={change}
                    placeholder="Raritone"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price
                    </Label>

                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={change}
                      placeholder="4997"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">
                      Stock
                    </Label>

                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={change}
                      placeholder="10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">
                    Discount %
                  </Label>

                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={form.discount}
                    onChange={change}
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description
                  </Label>

                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={form.description}
                    onChange={change}
                    required
                    placeholder="Describe the product..."
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-3 focus:ring-ring/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">
                    Product Image
                  </Label>

                  <Input
                    id="image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) =>
                      setImage(
                        event.target.files?.[0] ||
                          null
                      )
                    }
                    required={!isEditing}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : isEditing
                        ? "Update Product"
                        : "Create Product"}
                  </Button>

                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                    >
                      <X />
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>
                Catalog
              </CardTitle>

              <CardDescription>
                Current products and stock levels.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="h-20 animate-pulse rounded-xl bg-neutral-100"
                      />
                    )
                  )}
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-sm text-neutral-500">
                  No products found.
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-20 w-16 rounded-lg object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="font-medium">
                          {product.name}
                        </p>

                        <p className="text-sm text-neutral-500">
                          {product.brand}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {product.gender && (
                            <Badge
                              variant="secondary"
                              className="rounded-full"
                            >
                              {product.gender}
                            </Badge>
                          )}

                          {product.category && (
                            <Badge
                              variant="outline"
                              className="rounded-full"
                            >
                              {product.category}
                            </Badge>
                          )}

                          {product.subcategory && (
                            <Badge
                              variant="outline"
                              className="rounded-full"
                            >
                              {product.subcategory}
                            </Badge>
                          )}
                        </div>

                        <p className="mt-2 text-sm">
                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString("en-IN")}{" "}
                          · Stock {product.stock}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            edit(product)
                          }
                        >
                          <Pencil />
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            remove(product._id)
                          }
                        >
                          <Trash2 />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default AdminProducts;