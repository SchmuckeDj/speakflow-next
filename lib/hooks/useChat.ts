"use client";

import { useState, useCallback, useEffect } from "react";
import type { ChatMessage, Scenario } from "@/lib/types";
import { recordChatMessage } from "@/lib/hooks/useProgress";
import { apiFetch } from "@/lib/api";

const STORAGE_KEY = (scenarioId: string) => `sf_chat_${scenarioId}`;

function initMessage(scenario: Scenario): ChatMessage {
  return {
    id:        "init",
    role:      "assistant",
    content:   `Hi! I'm your AI coach for the **${scenario.title}** scenario. How can I help you practice today?`,
    timestamp: new Date(),
  };
}

function loadMessages(scenario: Scenario): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(scenario.id));
    if (!raw) return [initMessage(scenario)];
    const parsed = JSON.parse(raw);
    return parsed.map((m: ChatMessage) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [initMessage(scenario)];
  }
}

function saveMessages(scenarioId: string, messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY(scenarioId), JSON.stringify(messages.slice(-50)));
  } catch {}
}

export function useChat(scenario: Scenario) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages(scenario));
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMessages(loadMessages(scenario));
  }, [scenario.id]);

  useEffect(() => {
    if (messages.length > 0) saveMessages(scenario.id, messages);
  }, [messages, scenario.id]);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(), role: "user", content: text, timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    recordChatMessage();

    try {
      const history = [...messages, userMsg]
        .filter((m) => m.id !== "init")
        .slice(-20) // Máximo 20 mensajes
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await apiFetch("/api/chat/", {
        method: "POST",
        body:   JSON.stringify({
          messages:    history,
          scenario_id: scenario.id, // Solo el ID — el backend busca el prompt
        }),
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
      return aiMsg;

    } catch {
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(), role: "assistant",
        content: "Connection error. Check that the backend is running.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
      return errMsg;
    } finally {
      setIsTyping(false);
    }
  }, [messages, scenario]);

  const reset = useCallback(() => {
    const fresh = [initMessage(scenario)];
    setMessages(fresh);
    try { localStorage.removeItem(STORAGE_KEY(scenario.id)); } catch {}
  }, [scenario]);

  return { messages, isTyping, sendMessage, reset };
}
