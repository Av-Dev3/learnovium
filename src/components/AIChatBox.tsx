"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const SITE_KNOWLEDGE = {
  features: [
    "AI-Powered Learning: Personalized daily lessons tailored to your learning style and pace",
    "Goal-Oriented Learning: Set clear learning objectives and track progress with detailed analytics",
    "Daily Consistency: Build lasting habits with daily reminders and streak tracking",
    "Progress Tracking: Visualize your learning journey with comprehensive analytics",
    "Flashcards: Interactive flashcards for better retention and review",
    "Secure & Private: Enterprise-grade security and privacy controls",
    "Lightning Fast: Optimized performance across all devices"
  ],
  pricing: {
    free: {
      price: "$0",
      features: [
        "1 active learning goal/plan at a time",
        "Access to 7-day and 30-day lesson plans only",
        "Basic progress tracking",
        "Community support",
        "Contains ads"
      ]
    },
    pro: {
      price: "$4.99/month",
      features: [
        "Up to 5 active learning goals/plans at a time",
        "Access to all lesson lengths (7, 30, 60, 90 days)",
        "Flashcards included",
        "Ad-free experience",
        "Advanced progress analytics",
        "Priority support"
      ]
    },
    elite: {
      price: "$10.99/month",
      features: [
        "Unlimited active learning goals/plans",
        "Everything in Pro",
        "Access to advanced AI models",
        "Faster, more accurate lessons",
        "Custom learning paths",
        "Offline mode for mobile app",
        "VIP support & onboarding"
      ]
    }
  },
  navigation: [
    "Home: Main landing page with features and pricing overview",
    "Auth: Sign in/sign up page with authentication options",
    "Dashboard: Main learning interface (requires authentication)",
    "Pricing: Detailed pricing plans and feature comparison",
    "About: Information about Learnovium's mission and values",
    "Settings: User preferences and account management"
  ],
  howToUse: [
    "1. Sign up for a free account at /auth",
    "2. Create your first learning goal in the dashboard",
    "3. Choose a lesson plan length (7, 30, 60, or 90 days)",
    "4. Complete daily lessons and track your progress",
    "5. Use flashcards to reinforce learning",
    "6. Monitor your analytics and adjust your goals as needed"
  ]
};

export function AIChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your AI assistant for Learnovium. I can help you with questions about our features, pricing, how to navigate the site, or how to use the platform. What would you like to know?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const lowerMessage = userMessage.toLowerCase();

    // Pricing questions
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("plan")) {
      return `Here are our pricing plans:

**Free Plan - $0**
• 1 active learning goal at a time
• 7-day and 30-day lesson plans
• Basic progress tracking
• Community support
• Contains ads

**Pro Plan - $4.99/month**
• Up to 5 active learning goals
• All lesson lengths (7, 30, 60, 90 days)
• Flashcards included
• Ad-free experience
• Advanced analytics
• Priority support

**Elite Plan - $10.99/month**
• Unlimited learning goals
• Everything in Pro
• Advanced AI models
• Custom learning paths
• Offline mobile app
• VIP support

All paid plans include a 7-day free trial with no credit card required!`;
    }

    // Features questions
    if (lowerMessage.includes("feature") || lowerMessage.includes("what can") || lowerMessage.includes("capability")) {
      return `Here are Learnovium's key features:

🤖 **AI-Powered Learning**: Personalized daily lessons tailored to your learning style and pace
🎯 **Goal-Oriented Learning**: Set clear objectives and track progress with detailed analytics
📅 **Daily Consistency**: Build habits with reminders and streak tracking
📊 **Progress Tracking**: Comprehensive analytics and performance metrics
🃏 **Flashcards**: Interactive flashcards for better retention
🔒 **Secure & Private**: Enterprise-grade security and privacy controls
⚡ **Lightning Fast**: Optimized performance across all devices

We also offer mobile apps (coming soon) with offline learning capabilities!`;
    }

    // Navigation questions
    if (lowerMessage.includes("navigate") || lowerMessage.includes("where") || lowerMessage.includes("how to find")) {
      return `Here's how to navigate Learnovium:

🏠 **Home** (/): Main landing page with features and pricing overview
🔐 **Auth** (/auth): Sign in/sign up page
📊 **Dashboard** (/app): Main learning interface (requires login)
💰 **Pricing** (/pricing): Detailed pricing plans and comparisons
ℹ️ **About** (/about): Learn about our mission and values
⚙️ **Settings**: User preferences and account management

To get started, visit /auth to create an account, then head to /app to begin your learning journey!`;
    }

    // How to use questions
    if (lowerMessage.includes("how to use") || lowerMessage.includes("get started") || lowerMessage.includes("begin")) {
      return `Here's how to get started with Learnovium:

1️⃣ **Sign Up**: Visit /auth to create your free account
2️⃣ **Create Goals**: Set up your first learning goal in the dashboard
3️⃣ **Choose Plan**: Select lesson length (7, 30, 60, or 90 days)
4️⃣ **Daily Lessons**: Complete personalized daily lessons
5️⃣ **Track Progress**: Monitor your analytics and achievements
6️⃣ **Use Flashcards**: Reinforce learning with interactive flashcards

The platform adapts to your pace and learning style automatically. Start with the free plan and upgrade as you grow!`;
    }

    // General help
    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return `I'm here to help! I can answer questions about:

💰 **Pricing & Plans**: Free, Pro ($4.99/month), and Elite ($10.99/month) options
🚀 **Features**: AI-powered learning, progress tracking, flashcards, and more
🧭 **Navigation**: How to find different parts of the platform
📚 **How to Use**: Step-by-step guide to get started
❓ **General Questions**: Anything else about Learnovium

What specific topic would you like to know more about?`;
    }

    // Default response
    return `I'd be happy to help! I can assist you with:

• **Pricing information** - Learn about our Free, Pro, and Elite plans
• **Platform features** - Discover what Learnovium can do for you
• **Navigation help** - Find your way around the site
• **Getting started** - Step-by-step guide to begin learning
• **General questions** - Anything else about our platform

Could you be more specific about what you'd like to know?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await generateResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-0"
          size="lg"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-slate-700/50 bg-gradient-to-r from-purple-600/10 to-indigo-600/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">AI Assistant</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Learnovium Support</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100 border border-white/20 dark:border-slate-600/50"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.role === "user" ? "text-purple-100" : "text-slate-500 dark:text-slate-400"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/80 dark:bg-slate-700/80 rounded-2xl px-4 py-3 border border-white/20 dark:border-slate-600/50">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/20 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Learnovium..."
                className="flex-1 px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-white/20 dark:border-slate-600/50 rounded-2xl text-sm placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
