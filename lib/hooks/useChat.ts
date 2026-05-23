"use client";

import { useState, useCallback } from "react";
import type { ChatMessage, Scenario } from "@/lib/types";
import { recordChatMessage } from "@/lib/hooks/useProgress";

const MOCK_RESPONSES: Record<string, string[]> = {
  "job-interview": [
    "Tell me about yourself and your background in tech.",
    "That's interesting! Can you give me an example of a challenging project you worked on?",
    "Good. How do you handle disagreements with teammates?",
    "What's your biggest technical weakness and how are you working on it?",
  ],
  "remote-work": [
    "Good morning! What did you work on yesterday?",
    "Are you blocked on anything?",
    "What's your plan for today?",
    "Can you give an update in the next all-hands?",
  ],
  "travel": [
    "Passport and boarding pass, please.",
    "What's the purpose of your visit?",
    "Do you have anything to declare?",
    "Welcome! Do you have a reservation with us?",
  ],
  default: [
    "That's great! Tell me more.",
    "Interesting. How did that make you feel?",
    "I see. What happened next?",
    "Can you elaborate on that?",
  ],
};

export function useChat(scenario: Scenario) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "assistant",
      content: `Hi! I'm your AI coach for the **${scenario.title}** scenario. ${MOCK_RESPONSES[scenario.id]?.[0] ?? MOCK_RESPONSES.default[0]}`,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // ── Registrar en progreso ──
    recordChatMessage();

    // TODO: reemplazar por fetch("/api/chat", { body: JSON.stringify({ messages, scenario }) })
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));

    const pool = MOCK_RESPONSES[scenario.id] ?? MOCK_RESPONSES.default;
    const reply = pool[Math.floor(Math.random() * pool.length)];
    const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: reply, timestamp: new Date() };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  }, [scenario]);

  const reset = useCallback(() => {
    setMessages([{
      id: "init",
      role: "assistant",
      content: `Hi! I'm your AI coach for the **${scenario.title}** scenario. ${MOCK_RESPONSES[scenario.id]?.[0] ?? MOCK_RESPONSES.default[0]}`,
      timestamp: new Date(),
    }]);
  }, [scenario]);

  return { messages, isTyping, sendMessage, reset };
}
