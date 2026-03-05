import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkedUserId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async (u: User | null) => {
      if (!u) {
        if (!cancelled) { setUser(null); setIsAdmin(false); setLoading(false); }
        checkedUserId.current = null;
        return;
      }
      // Skip if we already checked this user
      if (checkedUserId.current === u.id) {
        if (!cancelled) { setUser(u); setLoading(false); }
        return;
      }
      if (!cancelled) setUser(u);
      const { data } = await supabase.rpc("has_role", { _user_id: u.id, _role: "admin" });
      if (!cancelled) {
        checkedUserId.current = u.id;
        setIsAdmin(!!data);
        setLoading(false);
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdmin(session?.user ?? null);
    });

    // Listen for changes (sign in/out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAdmin(session?.user ?? null);
    });

    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  return { user, isAdmin, loading };
};
