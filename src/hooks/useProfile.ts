import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  user_id: string;
  display_name: string | null;
  phone: string | null;
};

async function ensureProfile(userId: string) {
  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return;

  const { error: insertError } = await supabase.from("profiles").insert({ user_id: userId });
  if (insertError) throw insertError;
}

export function useProfile(userId: string | null | undefined) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Profile | null> => {
      if (!userId) return null;
      await ensureProfile(userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name, phone")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (userId) qc.invalidateQueries({ queryKey: ["profile", userId] });
  }, [qc, userId]);

  return query;
}
