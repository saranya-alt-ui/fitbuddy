import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Zap,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { apiService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { ChatMessage } from "../../types";

export const AICoachPage: React.FC = () => {
  const { user, isDemoAiMode } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "What workout should I do today?",
    "I missed yesterday's workout.",
    "What can I eat instead of eggs?",
    "How can I improve my consistency?",
    "What should I do on my rest day?",
  ];

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const res = await apiService.getChatHistory();
      if (res.data?.history?.length > 0) {
        setMessages(res.data.history);
      } else {
        setMessages([
          {
            id: "initial-welcome",
            role: "assistant",
            message: `Hey ${user?.name?.split(" ")[0] || "there"}! I'm your dedicated FitBuddy AI Coach powered by Google Gemini.\n\nAsk me anything: exercise form modifications, what to eat on rest days, alternatives to ingredients, or how to break through plateaus. What's on your mind today?`,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (e) {
      setMessages([
        {
          id: "fallback-welcome",
          role: "assistant",
          message:
            "Hello! I am your FitBuddy AI Coach. Feel free to ask questions about your workout routine, recovery, or diet.",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      message: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.message,
      }));

      const res = await apiService.chat(text, historyPayload);
      if (res.data?.reply) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          message: res.data.reply,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        message: "FitBuddy AI is taking a quick breath. Please ask again in a moment!",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col glass-card rounded-2xl border border-white/10 overflow-hidden animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-background/60 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-glow-primary">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-['JetBrains_Mono']">
                FitBuddy AI Coach
              </h2>
              <span className="text-[10px] font-mono text-secondary px-2 py-0.5 rounded bg-secondary/10 border border-secondary/20 font-bold">
                ● ONLINE
              </span>
              {isDemoAiMode && (
                <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Demo AI Mode
                </span>
              )}
            </div>
            <p className="text-xs text-muted">24/7 Context-Aware Fitness & Nutrition Consultation</p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2.5 bg-surface-100 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] text-muted uppercase font-bold shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-accent" /> Suggested:
        </span>
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-xs bg-surface hover:bg-primary/20 hover:text-primary-light border border-white/5 text-muted px-3 py-1 rounded-full shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? "ml-auto justify-end" : "mr-auto justify-start"}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-primary-light" />
                </div>
              )}

              <div
                className={`rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? "bg-primary text-white rounded-br-none shadow-glow-primary/20"
                    : "bg-surface-100 border border-white/5 text-gray-200 rounded-bl-none shadow-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.message}</div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-muted" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Animation */}
        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary-light animate-spin" />
            </div>
            <div className="bg-surface-100 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-light animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-primary-light animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-primary-light animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 sm:p-4 bg-background/80 border-t border-white/5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your fitness question (e.g. 'What can I eat instead of eggs?')..."
            disabled={isLoading}
            className="flex-1 bg-surface-100 border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-white font-bold transition-all shadow-glow-primary/40 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
