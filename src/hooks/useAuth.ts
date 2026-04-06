"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@/types";

// Stub — replace with real auth (NextAuth / Supabase / custom JWT)
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
            email: session.user.email || "",
            phone: session.user.phone || "",
          });
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
          email: session.user.email || "",
          phone: session.user.phone || "",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
  }

  return { user, loading, logout };
}
