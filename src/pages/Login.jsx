import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!formData.email || !formData.password) return setError("Email and password are required.");
    try {
      setLoading(true);
      await login(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login. Please check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-neutral-50 via-white to-neutral-100 px-4 py-10 sm:py-16">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl shadow-neutral-200/50 lg:grid-cols-2">
        <div className="hidden bg-neutral-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="text-xl font-bold tracking-[0.28em]">RARITONE</Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">YOUR STYLE, YOUR WAY</p>
            <h2 className="mt-4 text-5xl font-semibold leading-tight">Fashion that feels personal.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-neutral-400">Discover curated collections and preview your favourite pieces with Raritone Virtual Try-On.</p>
          </div>
        </div>
        <Card className="rounded-none border-0 shadow-none">
          <CardHeader className="px-6 pt-8 sm:px-10 sm:pt-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">WELCOME BACK</span>
            <CardTitle className="mt-2 text-3xl font-semibold tracking-tight">Sign in to Raritone</CardTitle>
            <CardDescription>Access your orders, wishlist and AI Try-On history.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-8 sm:px-10 sm:pb-12">
            {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><Input className="h-11 pl-10" id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} autoComplete="email" required /></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative"><LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><Input className="h-11 pl-10 pr-11" id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))} autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-neutral-400 hover:bg-neutral-100" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
              </div>
              <Button className="h-11 w-full" size="lg" type="submit" disabled={loading}>{loading ? "Signing in..." : <>Sign In <ArrowRight /></>}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-neutral-500">Don't have an account? <Link className="font-semibold text-neutral-950 underline underline-offset-4" to="/register">Create one</Link></p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
export default Login;
