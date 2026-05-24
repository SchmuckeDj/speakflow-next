"use client";

import { useState, useCallback } from "react";
import type { ChatMessage, Scenario } from "@/lib/types";
import { recordChatMessage } from "@/lib/hooks/useProgress";
import { apiFetch } from "@/lib/api";

export function useChat(scenario: Scenario) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id:        "init",
      role:      "assistant",
      content:   `Hi! I'm your AI coach for the **${scenario.title}** scenario. How can I help you practice today?`,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(), role: "user", content: text, timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    recordChatMessage();

    try {
      // Preparar historial (excluir mensaje init)
      const history = [...messages, userMsg]
        .filter((m) => m.id !== "init")
        .map((m) => ({ role: m.role, content: m.content }));

      const res  = await apiFetch("/api/chat/", {
        method: "POST",
        body:   JSON.stringify({ messages: history, scenario }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id:         crypto.randomUUID(),
        role:       "assistant",
        content:    data.reply ?? "Sorry, I couldn't process that.",
        correction: data.correction ?? undefined,
        timestamp:  new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);

    } catch {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(), role: "assistant",
        content: "Connection error. Check that the backend is running.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, scenario]);

  const reset = useCallback(() => {
    setMessages([{
      id:        "init",
      role:      "assistant",
      content:   `Hi! I'm your AI coach for the **${scenario.title}** scenario. How can I help you practice today?`,
      timestamp: new Date(),
    }]);
  }, [scenario]);

  return { messages, isTyping, sendMessage, reset };
}
