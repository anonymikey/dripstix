import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Phone, DollarSign, TrendingUp, CheckCircle, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import LoadingSpinner from "@/components/LoadingSpinner";

type AffiliateData = {
  code: string;
  discount_percent: number;
  usage_count: number;
  total_earnings: number;
  created_at: string;
};

type Payout = {
  id: string;
  amount: number;
  notes: string;
  paid_at: string;
};

const AffiliateEarnings = () => {
  const [phone, setPhone] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  const { data: affiliate, isLoading, isError } = useQuery({
    queryKey: ["affiliate-earnings", searchPhone],
    queryFn: async () => {
      if (!searchPhone) return null;
      const { data, error } = await supabase
        .from("affiliate_codes")
        .select("code, discount_percent, usage_count, total_earnings, created_at")
        .eq("phone_number", searchPhone)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data as AffiliateData | null;
    },
    enabled: !!searchPhone,
  });

  const { data: payouts = [] } = useQuery({
    queryKey: ["affiliate-payouts", searchPhone],
    queryFn: async () => {
      if (!searchPhone || !affiliate) return [];
      const { data: codeData } = await supabase
        .from("affiliate_codes")
        .select("id")
        .eq("phone_number", searchPhone)
        .eq("is_active", true)
        .maybeSingle();
      if (!codeData) return [];
      const { data, error } = await supabase
        .from("affiliate_payouts")
        .select("id, amount, notes, paid_at")
        .eq("affiliate_code_id", codeData.id)
        .order("paid_at", { ascending: false });
      if (error) throw error;
      return data as Payout[];
    },
    enabled: !!searchPhone && !!affiliate,
  });

  const totalPaid = payouts.reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingBalance = affiliate ? Number(affiliate.total_earnings) - totalPaid : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.trim().replace(/\s/g, "");
    if (cleaned) setSearchPhone(cleaned);
  };

  return (
    <div className="min-h-screen page-bg">
      <PageBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="container max-w-2xl pt-24 pb-20">
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            My <span className="text-gradient">Earnings</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            Enter your phone number to check your affiliate earnings and payout history.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex gap-2">
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="tel"
                placeholder="0712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="gradient-neon flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              <Search className="h-4 w-4" /> Check
            </button>
          </form>

          {isLoading && <LoadingSpinner text="Looking up your earnings..." />}

          {searchPhone && !isLoading && !affiliate && (
            <div className="mt-8 rounded-2xl border border-border bg-card/60 p-6 text-center backdrop-blur-sm">
              <p className="text-muted-foreground">No active affiliate code found for this phone number.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Make sure you're using the same number linked to your affiliate code.
              </p>
            </div>
          )}

          {affiliate && (
            <div className="mt-8 space-y-6">
              {/* Stats Cards */}
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Code</p>
                  <p className="mt-1 font-display font-black text-primary text-lg">{affiliate.code}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Sales</p>
                  <p className="mt-1 font-display font-black text-foreground text-lg">{affiliate.usage_count}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm text-center">
                  <TrendingUp className="mx-auto h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Earned</p>
                  <p className="mt-1 font-display font-black text-foreground text-lg">
                    KES {Number(affiliate.total_earnings).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm text-center">
                  <DollarSign className="mx-auto h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Pending</p>
                  <p className="mt-1 font-display font-black text-primary text-lg">
                    KES {Math.max(pendingBalance, 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payout History */}
              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
                <h2 className="font-display text-xl font-bold text-foreground">Payout History</h2>
                {payouts.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">No payouts yet. Keep sharing to earn more!</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {payouts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-background/50 p-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                          <div>
                            <p className="font-semibold text-foreground text-sm">KES {Number(p.amount).toLocaleString()}</p>
                            {p.notes && <p className="text-xs text-muted-foreground">{p.notes}</p>}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(p.paid_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AffiliateEarnings;
