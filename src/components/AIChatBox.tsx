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
    "Quizzes: Generate quizzes from your lessons to test knowledge",
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
    "Home (/): Main landing page with features and pricing overview",
    "Auth (/auth): Sign in/sign up page with email/password or magic link authentication",
    "Dashboard (/app): Main learning interface - requires authentication",
    "Create Goal (/app/create): Create new learning goals with AI",
    "Flashcards (/app/flashcards): Study with interactive flashcards",
    "Quiz (/app/quiz): Generate and take quizzes from your lessons",
    "Plans (/app/plans/[id]): View detailed learning plans",
    "Pricing (/pricing): Detailed pricing plans and feature comparison",
    "About (/about): Information about Learnovium's mission and values"
  ],
  howToUse: {
    gettingStarted: [
      "1. Visit /auth to sign up for a free account (email/password or magic link)",
      "2. After signup, you'll be redirected to /app (the main dashboard)",
      "3. Click 'New Goal' to create your first learning goal",
      "4. Fill out the goal creation form with your topic, focus area, and preferences",
      "5. Choose your skill level (beginner, intermediate, advanced)",
      "6. Select lesson plan length (7, 30, 60, or 90 days)",
      "7. Choose learning channels (video, reading, exercises, quizzes)",
      "8. AI will generate a personalized learning plan for you"
    ],
    dailyUsage: [
      "1. Go to /app to see your active learning goals",
      "2. Click on a goal to view your learning plan",
      "3. Access today's lesson by clicking 'Start Today's Lesson'",
      "4. Complete the lesson (reading, walkthrough, quiz, exercise)",
      "5. Mark the lesson as complete to unlock the next day",
      "6. Use /app/flashcards to review key concepts",
      "7. Generate quizzes at /app/quiz to test your knowledge",
      "8. Track your progress in the dashboard analytics"
    ],
    goalCreation: [
      "1. Go to /app/create to start creating a new goal",
      "2. Enter your learning topic (e.g., 'Python Programming')",
      "3. Specify your focus area (e.g., 'Web Development')",
      "4. Choose your current skill level",
      "5. Set how many minutes per day you want to study (15-120 minutes)",
      "6. Select lesson plan duration (7, 30, 60, or 90 days)",
      "7. Choose preferred learning channels",
      "8. Review and confirm your goal settings",
      "9. AI will generate a personalized learning plan (takes 2-3 minutes)"
    ],
    lessonStructure: [
      "Each lesson contains:",
      "• Reading: Comprehensive content teaching the concept",
      "• Walkthrough: Key points and definitions summary",
      "• Quiz: 2 questions testing your understanding",
      "• Exercise: Practical task to reinforce learning",
      "• Citations: 1-3 reputable sources for further reading",
      "• Time estimate: 5-20 minutes per lesson"
    ],
    flashcards: [
      "1. Go to /app/flashcards to access your flashcard collection",
      "2. Flashcards are automatically generated from completed lessons",
      "3. Study in 'Review' mode to see all cards or 'Practice' mode for spaced repetition",
      "4. Filter by goal, day, or category",
      "5. Mark cards as easy, medium, or hard to adjust difficulty",
      "6. Create custom flashcards manually if needed",
      "7. Use categories to organize cards by topic"
    ],
    quizzes: [
      "1. Go to /app/quiz to generate quizzes from your lessons",
      "2. Select a learning goal to create a quiz for",
      "3. Choose which lesson days to include in the quiz",
      "4. Set number of questions (2-10)",
      "5. AI generates questions based on your completed lessons",
      "6. Take the quiz and see your score",
      "7. Review correct answers and explanations"
    ]
  },
  authentication: {
    signup: [
      "1. Go to /auth",
      "2. Choose 'Sign Up' mode",
      "3. Enter your email and password",
      "4. Click 'Create Account'",
      "5. Check your email for confirmation (if required)",
      "6. You'll be redirected to /app after successful signup"
    ],
    signin: [
      "1. Go to /auth",
      "2. Choose 'Sign In' mode",
      "3. Enter your email and password",
      "4. Click 'Sign In'",
      "5. You'll be redirected to /app"
    ],
    magicLink: [
      "1. Go to /auth",
      "2. Choose 'Magic Link' mode",
      "3. Enter your email",
      "4. Click 'Send Magic Link'",
      "5. Check your email and click the link",
      "6. You'll be automatically signed in and redirected to /app"
    ]
  },
  troubleshooting: [
    "If you can't access /app: Make sure you're signed in at /auth",
    "If goal creation fails: Check your internet connection and try again",
    "If lessons don't load: Refresh the page or try again in a few minutes",
    "If flashcards aren't showing: Complete a lesson first to generate them",
    "If you're stuck: Contact support through the chat or email"
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
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const lowerMessage = userMessage.toLowerCase();

    // Authentication questions
    if (lowerMessage.includes("sign up") || lowerMessage.includes("signup") || lowerMessage.includes("create account") || lowerMessage.includes("register")) {
      return `Here's how to sign up for Learnovium:

**Step-by-Step Signup:**
1. Go to /auth
2. Choose 'Sign Up' mode
3. Enter your email and password
4. Click 'Create Account'
5. Check your email for confirmation (if required)
6. You'll be redirected to /app after successful signup

**Alternative: Magic Link**
1. Go to /auth
2. Choose 'Magic Link' mode
3. Enter your email
4. Click 'Send Magic Link'
5. Check your email and click the link
6. You'll be automatically signed in and redirected to /app

After signup, you can immediately start creating your first learning goal!`;
    }

    if (lowerMessage.includes("sign in") || lowerMessage.includes("signin") || lowerMessage.includes("login") || lowerMessage.includes("log in")) {
      return `Here's how to sign in to Learnovium:

**Email & Password:**
1. Go to /auth
2. Choose 'Sign In' mode
3. Enter your email and password
4. Click 'Sign In'
5. You'll be redirected to /app

**Magic Link (Passwordless):**
1. Go to /auth
2. Choose 'Magic Link' mode
3. Enter your email
4. Click 'Send Magic Link'
5. Check your email and click the link
6. You'll be automatically signed in and redirected to /app

If you can't access /app, make sure you're properly signed in!`;
    }

    // Getting started questions
    if (lowerMessage.includes("get started") || lowerMessage.includes("begin") || lowerMessage.includes("first time") || lowerMessage.includes("new user")) {
      return `Welcome to Learnovium! Here's your complete getting started guide:

**🚀 Getting Started:**
1. Visit /auth to sign up for a free account
2. After signup, you'll be redirected to /app (the main dashboard)
3. Click 'New Goal' to create your first learning goal
4. Fill out the goal creation form with your topic and focus area
5. Choose your skill level (beginner, intermediate, advanced)
6. Select lesson plan length (7, 30, 60, or 90 days)
7. Choose learning channels (video, reading, exercises, quizzes)
8. AI will generate a personalized learning plan for you (takes 2-3 minutes)

**📚 Daily Usage:**
1. Go to /app to see your active learning goals
2. Click on a goal to view your learning plan
3. Access today's lesson by clicking 'Start Today's Lesson'
4. Complete the lesson (reading, walkthrough, quiz, exercise)
5. Mark the lesson as complete to unlock the next day
6. Use /app/flashcards to review key concepts
7. Generate quizzes at /app/quiz to test your knowledge

Start with the free plan and upgrade as you grow!`;
    }

    // Goal creation questions
    if (lowerMessage.includes("create goal") || lowerMessage.includes("new goal") || lowerMessage.includes("goal creation") || lowerMessage.includes("learning goal")) {
      return `Here's how to create a learning goal in Learnovium:

**🎯 Goal Creation Process:**
1. Go to /app/create to start creating a new goal
2. Enter your learning topic (e.g., 'Python Programming', 'Spanish Language')
3. Specify your focus area (e.g., 'Web Development', 'Conversational Spanish')
4. Choose your current skill level (beginner, intermediate, advanced)
5. Set how many minutes per day you want to study (15-120 minutes)
6. Select lesson plan duration (7, 30, 60, or 90 days)
7. Choose preferred learning channels:
   - Video Lessons
   - Reading Materials
   - Practice Exercises
   - Knowledge Quizzes
8. Review and confirm your goal settings
9. AI will generate a personalized learning plan (takes 2-3 minutes)

**💡 Tips:**
- Be specific with your topic and focus area for better AI-generated content
- Start with shorter plans (7-30 days) if you're new to the platform
- You can create multiple goals with Pro/Elite plans
- Goals are automatically saved and can be accessed from your dashboard`;
    }

    // Lesson structure questions
    if (lowerMessage.includes("lesson") || lowerMessage.includes("daily lesson") || lowerMessage.includes("lesson structure") || lowerMessage.includes("what's in a lesson")) {
      return `Here's what each lesson contains in Learnovium:

**📖 Lesson Structure:**
Each lesson includes:
• **Reading**: Comprehensive content teaching the concept (800-4000 characters)
• **Walkthrough**: Key points and definitions summary (400-800 characters)
• **Quiz**: 2 questions testing your understanding with 4 multiple choice options
• **Exercise**: Practical task to reinforce learning (100-300 characters)
• **Citations**: 1-3 reputable sources for further reading
• **Time estimate**: 5-20 minutes per lesson

**🎯 How to Access Lessons:**
1. Go to /app to see your active learning goals
2. Click on a goal to view your learning plan
3. Click 'Start Today's Lesson' to access the current lesson
4. Complete all sections: reading, walkthrough, quiz, and exercise
5. Mark the lesson as complete to unlock the next day
6. Your progress is automatically saved

**💡 Pro Tips:**
- Take your time with the reading section - it's the core content
- Use the walkthrough as a quick reference
- Don't worry if you get quiz questions wrong - you can retake them
- The exercise helps reinforce what you've learned`;
    }

    // Flashcards questions
    if (lowerMessage.includes("flashcard") || lowerMessage.includes("flash card") || lowerMessage.includes("study cards") || lowerMessage.includes("review")) {
      return `Here's how to use flashcards in Learnovium:

**🃏 Flashcard System:**
1. Go to /app/flashcards to access your flashcard collection
2. Flashcards are automatically generated from completed lessons
3. Study in 'Review' mode to see all cards or 'Practice' mode for spaced repetition
4. Filter by goal, day, or category to focus your study
5. Mark cards as easy, medium, or hard to adjust difficulty
6. Create custom flashcards manually if needed
7. Use categories to organize cards by topic

**📚 Study Modes:**
- **Review Mode**: See all flashcards in order
- **Practice Mode**: Spaced repetition based on difficulty
- **Due Today**: Focus on cards that need review

**🎯 Pro Tips:**
- Complete lessons first to generate flashcards
- Use the difficulty ratings to focus on challenging cards
- Create categories to organize related concepts
- Regular review helps with long-term retention

Flashcards are included in Pro and Elite plans!`;
    }

    // Quiz questions
    if (lowerMessage.includes("quiz") || lowerMessage.includes("test") || lowerMessage.includes("questions") || lowerMessage.includes("assessment")) {
      return `Here's how to use quizzes in Learnovium:

**🧠 Quiz System:**
1. Go to /app/quiz to generate quizzes from your lessons
2. Select a learning goal to create a quiz for
3. Choose which lesson days to include in the quiz
4. Set number of questions (2-10)
5. AI generates questions based on your completed lessons
6. Take the quiz and see your score
7. Review correct answers and explanations

**📊 Quiz Features:**
- Questions are generated from your actual lesson content
- Multiple choice format with 4 options each
- Immediate feedback on answers
- Score tracking and progress monitoring
- Can retake quizzes as many times as needed

**💡 Pro Tips:**
- Complete several lessons before generating a quiz
- Include multiple lesson days for comprehensive testing
- Use quizzes to identify knowledge gaps
- Review explanations for incorrect answers

Quizzes are a great way to test your understanding and reinforce learning!`;
    }

    // Pricing questions
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("plan") || lowerMessage.includes("subscription") || lowerMessage.includes("free trial")) {
      return `Here are Learnovium's pricing plans:

**🆓 Free Plan - $0**
• 1 active learning goal at a time
• 7-day and 30-day lesson plans only
• Basic progress tracking
• Community support
• Contains ads

**⭐ Pro Plan - $4.99/month**
• Up to 5 active learning goals
• All lesson lengths (7, 30, 60, 90 days)
• Flashcards included
• Ad-free experience
• Advanced progress analytics
• Priority support

**👑 Elite Plan - $10.99/month**
• Unlimited learning goals
• Everything in Pro
• Access to advanced AI models
• Faster, more accurate lessons
• Custom learning paths
• Offline mode for mobile app
• VIP support & onboarding

**🎁 Free Trial:**
All paid plans include a 7-day free trial with no credit card required!

**💡 Recommendation:**
Start with the free plan to explore the platform, then upgrade to Pro for more goals and features!`;
    }

    // Navigation questions
    if (lowerMessage.includes("navigate") || lowerMessage.includes("where") || lowerMessage.includes("how to find") || lowerMessage.includes("menu") || lowerMessage.includes("pages")) {
      return `Here's how to navigate Learnovium:

**🧭 Main Pages:**
• **Home** (/): Landing page with features and pricing overview
• **Auth** (/auth): Sign in/sign up page with email/password or magic link
• **Dashboard** (/app): Main learning interface - requires authentication
• **Create Goal** (/app/create): Create new learning goals with AI
• **Flashcards** (/app/flashcards): Study with interactive flashcards
• **Quiz** (/app/quiz): Generate and take quizzes from your lessons
• **Plans** (/app/plans/[id]): View detailed learning plans
• **Pricing** (/pricing): Detailed pricing plans and feature comparison
• **About** (/about): Information about Learnovium's mission and values

**🔐 Authentication Required:**
All /app/* pages require you to be signed in. If you try to access them without being signed in, you'll be redirected to /auth.

**💡 Quick Start:**
1. Visit /auth to sign up
2. Go to /app to access your dashboard
3. Click 'New Goal' to create your first learning goal
4. Use the navigation to access different features`;
    }

    // Features questions
    if (lowerMessage.includes("feature") || lowerMessage.includes("what can") || lowerMessage.includes("capability") || lowerMessage.includes("what does") || lowerMessage.includes("functionality")) {
      return `Here are Learnovium's key features:

**🤖 AI-Powered Learning**
• Personalized daily lessons tailored to your learning style and pace
• Intelligent content generation based on your goals and preferences
• Adaptive difficulty that adjusts to your progress

**🎯 Goal-Oriented Learning**
• Set clear learning objectives and track progress with detailed analytics
• Create multiple learning goals for different skills
• Visual progress tracking and achievement milestones

**📅 Daily Consistency**
• Build lasting habits with daily reminders and streak tracking
• Structured learning paths that keep you motivated
• Progress persistence across all your devices

**📊 Progress Tracking**
• Comprehensive analytics and performance metrics
• Visual dashboards showing your learning journey
• Detailed insights into your study patterns

**🃏 Interactive Learning Tools**
• Flashcards for better retention and review
• Quizzes generated from your lessons
• Practice exercises to reinforce concepts

**🔒 Security & Privacy**
• Enterprise-grade security and privacy controls
• Your data is protected and never shared
• Secure authentication with multiple options

**⚡ Performance**
• Lightning-fast loading and smooth experience
• Optimized for all devices and screen sizes
• Offline capabilities (coming soon in mobile apps)

**📱 Mobile Ready**
• Responsive design works on all devices
• Mobile apps coming soon with offline sync
• Push notifications for learning reminders`;
    }

    // Troubleshooting questions
    if (lowerMessage.includes("problem") || lowerMessage.includes("issue") || lowerMessage.includes("error") || lowerMessage.includes("not working") || lowerMessage.includes("help") || lowerMessage.includes("stuck")) {
      return `Here are solutions to common issues:

**🔐 Authentication Issues:**
• Can't access /app: Make sure you're signed in at /auth
• Sign-in not working: Try the magic link option instead
• Forgot password: Use the magic link option to sign in

**🎯 Goal Creation Issues:**
• Goal creation fails: Check your internet connection and try again
• AI generation taking too long: This is normal - it takes 2-3 minutes
• Form not submitting: Make sure all required fields are filled

**📚 Lesson Issues:**
• Lessons don't load: Refresh the page or try again in a few minutes
• Can't mark lesson complete: Make sure you've completed all sections
• Progress not saving: Check your internet connection

**🃏 Flashcard Issues:**
• No flashcards showing: Complete a lesson first to generate them
• Cards not loading: Try refreshing the page
• Can't create custom cards: Make sure you're on Pro or Elite plan

**🧠 Quiz Issues:**
• Can't generate quiz: Complete some lessons first
• Quiz not loading: Check your internet connection
• Questions seem wrong: AI generates based on your lesson content

**💡 General Tips:**
• Always check your internet connection
• Try refreshing the page if something seems stuck
• Contact support if issues persist
• Use the magic link option if password sign-in fails`;
    }

    // General help
    if (lowerMessage.includes("help") || lowerMessage.includes("support") || lowerMessage.includes("assistance")) {
      return `I'm here to help! I can answer questions about:

**💰 Pricing & Plans**
• Free, Pro ($4.99/month), and Elite ($10.99/month) options
• Feature comparisons and free trial information
• Upgrade/downgrade processes

**🚀 Features & Functionality**
• AI-powered learning and personalized lessons
• Progress tracking and analytics
• Flashcards and quiz systems
• Goal creation and management

**🧭 Navigation & Usage**
• How to find different parts of the platform
• Step-by-step guides for all features
• Authentication and account management

**📚 Learning Process**
• Getting started as a new user
• Daily lesson workflow
• Goal creation and management
• Study techniques and tips

**🔧 Troubleshooting**
• Common issues and solutions
• Technical problems and fixes
• Account and authentication help

**❓ General Questions**
• Anything else about Learnovium
• Platform capabilities and limitations
• Best practices and recommendations

What specific topic would you like to know more about?`;
    }

    // Default response
    return `I'd be happy to help! I can assist you with:

**🎯 Getting Started**
• How to sign up and create your first learning goal
• Step-by-step onboarding process
• Understanding the platform basics

**📚 Learning Features**
• How lessons work and what they contain
• Using flashcards and quizzes effectively
• Progress tracking and analytics

**💰 Pricing & Plans**
• Free, Pro, and Elite plan details
• Feature comparisons and free trials
• Upgrade recommendations

**🧭 Navigation**
• Finding different parts of the platform
• Authentication and account management
• Using the dashboard and tools

**🔧 Troubleshooting**
• Common issues and solutions
• Technical problems and fixes
• Getting help when stuck

Could you be more specific about what you'd like to know? For example, you could ask:
• "How do I create my first learning goal?"
• "What's included in each pricing plan?"
• "How do I use flashcards?"
• "I'm having trouble signing in"`;
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
