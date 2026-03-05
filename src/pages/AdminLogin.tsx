import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [otpSent, setOtpSent] = useState(false);

  const checkAdminAndNavigate = async () => {
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
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { toast.error(error.message); setLoading(false); return; }
      toast.success("Account created! Checking admin access...");
      await new Promise((r) => setTimeout(r, 1000));
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error && !isSignUp) { toast.error(error.message); setLoading(false); return; }

    await checkAdminAndNavigate();
    setLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) { toast.error("Enter your phone number"); return; }
    setLoading(true);

    const formattedPhone = phone.startsWith("+") ? phone : `+254${phone.replace(/^0/, "")}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
    if (error) { toast.error(error.message); setLoading(false); return; }

    toast.success("OTP sent to your phone!");
    setPhone(formattedPhone);
    setOtpSent(true);
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) { toast.error("Enter the OTP code"); return; }
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
    if (error) { toast.error(error.message); setLoading(false); return; }

    await checkAdminAndNavigate();
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <h1 className="font-display text-3xl font-black text-center">
          <span className="text-primary">Admin</span> {isSignUp ? "Sign Up" : "Login"}
        </h1>

        {/* Method toggle */}
        <div className="mt-6 flex rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => { setLoginMethod("email"); setOtpSent(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${loginMethod === "email" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Mail className="h-4 w-4" /> Email
          </button>
          <button
            onClick={() => { setLoginMethod("phone"); setOtpSent(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${loginMethod === "phone" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Phone className="h-4 w-4" /> Phone
          </button>
        </div>

        {loginMethod === "email" ? (
          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" required />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" required minLength={6} />
            </div>
            <button type="submit" disabled={loading}
              className="gradient-neon w-full rounded-full py-3 font-display font-bold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50">
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
              <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </form>
        ) : (
          <>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712345678 or +254712345678"
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" required />
                  <p className="mt-1 text-xs text-muted-foreground">We'll send an OTP code via SMS</p>
                </div>
                <button type="submit" disabled={loading}
                  className="gradient-neon w-full rounded-full py-3 font-display font-bold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50">
                  {loading ? "Sending..." : "Send OTP Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">OTP Code</label>
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code" maxLength={6}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-lg font-mono tracking-widest text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" required />
                  <p className="mt-1 text-xs text-muted-foreground">Sent to {phone}</p>
                </div>
                <button type="submit" disabled={loading}
                  className="gradient-neon w-full rounded-full py-3 font-display font-bold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50">
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
                <button type="button" onClick={() => setOtpSent(false)} className="w-full text-center text-sm text-muted-foreground hover:text-primary">
                  Change phone number
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
