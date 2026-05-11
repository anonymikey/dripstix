import { useState } from "react";
import { Sparkles, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AISearchBar = ({ onResults, onClear }: { onResults: (ids: string[]) => void; onClear: () => void }) => {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const search = async () => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-search", { body: { query: q } });
      if (error) throw error;
      onResults(data?.ids ?? []);
      setActive(true);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const clear = () => { setQ(""); setActive(false); onClear(); };

  return (
    <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 backdrop-blur focus-within:border-primary">
      <Sparkles className="h-4 w-4 shrink-0 text-primary" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") search(); }}
        placeholder="Try: 'cool anime stickers under 200'"
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      {active && (
        <button onClick={clear} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
      )}
      <button onClick={search} disabled={loading || !q.trim()}
        className="rounded-full gradient-brand px-3 py-1 text-xs font-semibold text-white disabled:opacity-40">
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "AI Search"}
      </button>
    </div>
  );
};

export default AISearchBar;