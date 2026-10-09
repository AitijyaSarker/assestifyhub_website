import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import logoData from "@/assets/assetify-logo.svg.asset.json";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Panel CMS | Assetify Hub" },
      { name: "description", content: "Secure Content Management System for Assetify Hub website administration." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAuthenticated, isLoadingSession, login } = useAuth();
  const [email, setEmail] = useState("admin@assetify.com");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.error || "Authentication failed");
    }
  };

  if (isAuthenticated) {
    return <AdminDashboard />;
  }
  if (isLoadingSession) {
    return <div className="min-h-screen bg-background" aria-label="Checking admin session" />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mx-auto shadow-lg shadow-primary/25">
            <Sparkles className="size-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Assetify Hub Admin CMS</h1>
          <p className="text-xs text-muted-foreground">Sign in to manage services, leads, portfolio, blog, and layout.</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <label className="field-label">
            Admin Email Address
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-field"
            />
          </label>

          <label className="field-label">
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-field"
            />
          </label>

          <Button type="submit" variant="brand" className="w-full">
            Login to Admin Panel <ArrowRight className="size-4 ml-1" />
          </Button>
        </form>

        <p className="text-center text-[11px] text-muted-foreground">
          Use the administrator credentials configured on the Assetify API server.
        </p>
      </div>
    </div>
  );
}
