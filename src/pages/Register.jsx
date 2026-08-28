import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Camera, Eye, EyeOff, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please select a valid image file.");
    if (file.size > 5 * 1024 * 1024) return setError("Profile image must be 5MB or smaller.");
    setError(""); setProfileImage(file); setPreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); setError("");
    const name = formData.name.trim(); const email = formData.email.trim().toLowerCase();
    if (!name) return setError("Full name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters.");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");
    try {
      setLoading(true); const payload = new FormData();
      payload.append("name", name); payload.append("email", email); payload.append("password", formData.password);
      if (profileImage) payload.append("profileImage", profileImage);
      const data = await registerUser(payload);
      if (data?.token && data?.user) { await login({ email, password: formData.password }); navigate("/"); }
      else navigate("/login");
    } catch (err) { setError(err.response?.data?.message || "Unable to create your account."); }
    finally { setLoading(false); }
  };
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-neutral-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <Card className="rounded-3xl border-neutral-200 shadow-xl shadow-neutral-200/40">
          <CardHeader className="px-6 pt-8 text-center sm:px-10 sm:pt-10">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">JOIN RARITONE</span>
            <CardTitle className="mt-2 text-3xl font-semibold tracking-tight">Create your account</CardTitle>
            <CardDescription>Save your style, orders, wishlist and Try-On history in one place.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-8 sm:px-10 sm:pb-10">
            {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-dashed border-neutral-300 bg-neutral-100">{preview ? <img src={preview} alt="Profile preview" className="h-full w-full object-cover" /> : <Camera className="h-7 w-7 text-neutral-400" />}</div>
                <label htmlFor="register-image" className="cursor-pointer text-sm font-medium underline underline-offset-4">Choose profile photo</label>
                <input id="register-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} hidden />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="register-name">Full Name</Label><div className="relative"><UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><Input className="h-11 pl-10" id="register-name" name="name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required /></div></div>
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="register-email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><Input className="h-11 pl-10" id="register-email" name="email" type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} required /></div></div>
                <div className="space-y-2"><Label htmlFor="register-password">Password</Label><div className="relative"><Input className="h-11 pr-11" id="register-password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))} required /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
                <div className="space-y-2"><Label htmlFor="register-confirm">Confirm Password</Label><Input className="h-11" id="register-confirm" type="password" value={formData.confirmPassword} onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))} required /></div>
              </div>
              <Button className="h-11 w-full" size="lg" type="submit" disabled={loading}>{loading ? "Creating account..." : <>Create Account <ArrowRight /></>}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-neutral-500">Already registered? <Link to="/login" className="font-semibold text-neutral-950 underline underline-offset-4">Sign in</Link></p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
export default Register;
