"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Twitter,
  Github,
  Linkedin,
  Users,
  Zap,
  Heart
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    priority: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log("Form submitted:", formData);
      
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
        priority: "medium"
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@learnovium.com",
      color: "from-blue-500 to-cyan-500",
      href: "mailto:support@learnovium.com"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 9 AM - 6 PM EST",
      color: "from-purple-500 to-pink-500",
      href: "#"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+1 (555) 123-4567",
      color: "from-green-500 to-emerald-500",
      href: "tel:+15551234567"
    }
  ];

  const categories = [
    "General Inquiry",
    "Technical Support",
    "Account Issues",
    "Billing Questions",
    "Feature Request",
    "Bug Report",
    "Partnership",
    "Other"
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Navigation Header */}
      <AppHeader isLoggedIn={false} />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 py-8 lg:py-12">
          
          {/* Hero Section */}
          <section className="relative text-center space-y-8">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-brand/10 to-purple-600/10 rounded-full border border-brand/20 mb-8">
                <MessageSquare className="w-5 h-5 text-brand" />
                <span className="text-brand font-medium">Contact Us</span>
              </div>
              
              <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                <span className="bg-gradient-to-r from-[var(--fg)] via-brand to-purple-600 bg-clip-text text-transparent">
                  Contact Us
                </span>
              </h1>
              
              <p className="text-xl text-[var(--fg)]/80 max-w-4xl mx-auto leading-relaxed">
                We&apos;re here to help! Reach out to our support team for any questions, issues, or feedback about your learning experience.
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Methods */}
            <div className="lg:col-span-1 space-y-6">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-xl border border-white/20 dark:border-white/10 hover:shadow-2xl transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                <div className="relative z-10 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-[var(--fg)]">Get in Touch</h3>
                    <p className="text-[var(--fg)]/70">
                      Choose your preferred way to contact us
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {contactMethods.map((method, index) => (
                      <a
                        key={index}
                        href={method.href}
                        className="block p-4 rounded-2xl border border-white/20 dark:border-slate-700/50 hover:border-brand/30 dark:hover:border-brand/50 hover:bg-white/10 dark:hover:bg-slate-700/30 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} text-white group-hover:scale-110 transition-transform`}>
                            {method.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-heading text-lg font-semibold text-[var(--fg)] group-hover:text-brand transition-colors">
                              {method.title}
                            </h4>
                            <p className="text-sm text-[var(--fg)]/70 mb-1">
                              {method.description}
                            </p>
                            <p className="text-sm font-medium text-brand">
                              {method.contact}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Response Times */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 p-6 backdrop-blur-xl shadow-xl border border-green-500/20 dark:border-green-700/50 hover:shadow-2xl transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-green-500/25 to-emerald-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-heading text-xl font-bold text-green-900 dark:text-green-100">Response Times</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-300">Email Support:</span>
                      <span className="font-medium text-green-800 dark:text-green-200">Within 24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-300">Live Chat:</span>
                      <span className="font-medium text-green-800 dark:text-green-200">Immediate</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-300">Phone Support:</span>
                      <span className="font-medium text-green-800 dark:text-green-200">9 AM - 6 PM EST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-6 backdrop-blur-xl shadow-xl border border-white/20 dark:border-white/10 hover:shadow-2xl transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-5 h-5 text-brand" />
                    <h3 className="font-heading text-xl font-bold text-[var(--fg)]">Follow Us</h3>
                  </div>
                  <div className="flex space-x-4">
                    <a
                      href="https://twitter.com/learnovium"
                      className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors group"
                      aria-label="Follow us on Twitter"
                    >
                      <Twitter className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href="https://github.com/learnovium"
                      className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                      aria-label="View our GitHub"
                    >
                      <Github className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href="https://linkedin.com/company/learnovium"
                      className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors group"
                      aria-label="Connect on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-xl border border-white/20 dark:border-white/10 hover:shadow-2xl transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                <div className="relative z-10 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                      <Send className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-[var(--fg)]">Send us a Message</h3>
                    <p className="text-[var(--fg)]/70">
                      Fill out the form below and we&apos;ll get back to you as soon as possible
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-[var(--fg)]">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-[var(--fg)]">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    {/* Subject and Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-semibold text-[var(--fg)]">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Brief description of your inquiry"
                          className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-semibold text-[var(--fg)]">
                          Category *
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-50">
                            {categories.map((category) => (
                              <SelectItem key={category} value={category} className="text-lg py-3">
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-[var(--fg)]">
                        Priority Level
                      </Label>
                      <div className="flex flex-wrap gap-3">
                        {priorities.map((priority) => (
                          <label key={priority.value} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="priority"
                              value={priority.value}
                              checked={formData.priority === priority.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                formData.priority === priority.value
                                  ? priority.color
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                              }`}
                            >
                              {priority.label}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-semibold text-[var(--fg)]">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please provide as much detail as possible about your inquiry..."
                        className="text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm resize-none"
                      />
                    </div>

                    {/* Submit Status */}
                    {submitStatus === "success" && (
                      <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-green-800 dark:text-green-200 font-medium">
                          Message sent successfully! We&apos;ll get back to you soon.
                        </span>
                      </div>
                    )}

                    {submitStatus === "error" && (
                      <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <span className="text-red-800 dark:text-red-200 font-medium">
                          There was an error sending your message. Please try again.
                        </span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <section className="relative">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl" />
              
              <div className="relative z-10 text-center space-y-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Heart className="w-6 h-6 text-red-500" />
                  <h3 className="font-heading text-3xl font-bold text-[var(--fg)]">
                    Thank you for choosing Learnovium!
                  </h3>
                </div>
                <p className="text-xl text-[var(--fg)]/80 max-w-2xl mx-auto">
                  Your feedback and questions help us improve the learning experience for everyone. 
                  We&apos;re committed to making your learning journey as smooth and effective as possible.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}