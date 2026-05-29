"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";

export interface FeatureLimit {
  used:      number;
  limit:     number;
  remaining: number;
  exhausted: boolean;
}

export interface LimitsData {
  chat:       FeatureLimit;
  challenge:  FeatureLimit;
  vocab:      FeatureLimit;
  tts:        FeatureLimit;
  is_premium: boolean;
}

const DEFAULT_LIMITS: LimitsData = {
  chat:       { used: 0, limit: 5,  remaining: 5,  exhausted: false },
  challenge:  { used: 0, limit: 1,  remaining: 1,  exhausted: false },
  vocab:      { used: 0, limit: 1,  remaining: 1,  exhausted: false },
  tts:        { used: 0, limit: 10, remaining: 10, exhausted: false },
  is_premium: false,
};

export function useLimits() {
  const [limits, setLimits]   = useState<LimitsData>(DEFAULT_LIMITS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch("/api/progress/limits/");
      if (res.ok) {
        const data = await res.json();
        setLimits(data);
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { limits, loading, refresh };
}
