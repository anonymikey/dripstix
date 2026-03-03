import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: hasRole } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (hasRole) {
        navigate("/admin");
      } else {
        toast.error("You do not have admin access.");
        await supabase.auth.signOut();
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <h1 className="font-display text-3xl font-black text-center">
          <span className="text-primary">Admin</span> Login
        </h1>
        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="gradient-neon w-full rounded-full py-3 font-display font-bold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
