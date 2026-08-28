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

const emptyForm = {
  productId: "",
  name: "",
  category: "",
  price: "",
  description: "",
  brand: "",
  stock: "",
};
function AdminProducts() {
  const [products, setProducts] = useState([]),
    [form, setForm] = useState(emptyForm),
    [image, setImage] = useState(null),
    [editingId, setEditingId] = useState(null),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const isEditing = Boolean(editingId);
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      setProducts(await getProducts());
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        const products = await getProducts();

        if (!cancelled) {
          setProducts(products);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Unable to load products.");
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
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products],
  );
  const change = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!isEditing && !image) return setError("Product image is required.");
    try {
      setSaving(true);
      const payload = new FormData();
      Object.entries(form).forEach(([k, v]) => payload.append(k, v));
      if (image) payload.append("image", image);
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
      setError(err.response?.data?.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };
  const edit = (p) => {
    setEditingId(p._id);
    setForm({
      productId: p.productId || "",
      name: p.name || "",
      category: p.category || "",
      price: p.price ?? "",
      description: p.description || "",
      brand: p.brand || "",
      stock: p.stock ?? "",
    });
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteProduct(id);
      setProducts((p) => p.filter((x) => x._id !== id));
      setMessage("Product deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete product.");
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
          <Badge variant="secondary">{products.length} products</Badge>
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
                {isEditing ? "Edit Product" : "Add Product"}
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update catalog information."
                  : "Add a new item to the store."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                {[
                  "productId",
                  "name",
                  "category",
                  "brand",
                  "price",
                  "stock",
                ].map((field) => (
                  <div className="space-y-2" key={field}>
                    <Label htmlFor={field}>
                      {field === "productId"
                        ? "Product ID"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      type={
                        field === "price" || field === "stock"
                          ? "number"
                          : "text"
                      }
                      list={field === "category" ? "categories" : undefined}
                      value={form[field]}
                      onChange={change}
                      disabled={field === "productId" && isEditing}
                      required={field !== "brand"}
                    />
                  </div>
                ))}
                <datalist id="categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={form.description}
                    onChange={change}
                    required
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-3 focus:ring-ring/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    required={!isEditing}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={saving}>
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
                      onClick={() => {
                        setEditingId(null);
                        setForm(emptyForm);
                        setImage(null);
                      }}
                    >
                      <X /> Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Catalog</CardTitle>
              <CardDescription>
                Current products and stock levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-20 animate-pulse rounded-xl bg-neutral-100"
                    />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-sm text-neutral-500">
                  No products found.
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((p) => (
                    <div
                      key={p._id}
                      className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-20 w-16 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm text-neutral-500">
                          {p.brand} · {p.category}
                        </p>
                        <p className="mt-1 text-sm">
                          ₹{Number(p.price).toLocaleString("en-IN")} · Stock{" "}
                          {p.stock}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => edit(p)}
                        >
                          <Pencil /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => remove(p._id)}
                        >
                          <Trash2 /> Delete
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
