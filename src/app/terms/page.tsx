import { AppHeader } from "@/components/app-header";
import { FileText, Scale, User, Shield, AlertTriangle, Mail, Phone, MapPin, CheckCircle, XCircle } from "lucide-react";

export default function TermsPage() {
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
                <Scale className="w-5 h-5 text-brand" />
                <span className="text-brand font-medium">Legal Terms</span>
              </div>
              
              <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                <span className="bg-gradient-to-r from-[var(--fg)] via-brand to-purple-600 bg-clip-text text-transparent">
                  Terms of Service
                </span>
              </h1>
              
              <p className="text-xl text-[var(--fg)]/80 max-w-4xl mx-auto leading-relaxed">
                Please read these terms carefully before using our services. By using Learnovium, 
                you agree to these terms and our commitment to providing you with the best learning experience.
              </p>
              
              <p className="text-lg text-[var(--fg)]/60 max-w-2xl mx-auto">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </section>

          {/* Content Sections */}
          <div className="space-y-8">
            
            {/* Acceptance of Terms */}
            <section className="relative">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-[var(--fg)]">Acceptance of Terms</h2>
                  </div>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    By accessing and using Learnovium, you accept and agree to be bound by the terms 
                    and provisions of this agreement. If you do not agree to these terms, please do not use our services.
                  </p>
                  
                  <div className="bg-white/10 dark:bg-white/5 rounded-2xl p-6">
                    <p className="text-[var(--fg)]/70 leading-relaxed">
                      These terms apply to all users of the service, including without limitation users who are browsers, 
                      vendors, customers, merchants, and/or contributors of content.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Use License */}
            <section className="relative">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-500/25 to-green-500/25 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-400/25 to-cyan-500/25 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-[var(--fg)]">Use License</h2>
                  </div>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    Permission is granted to temporarily download one copy of Learnovium per device for 
                    personal, non-commercial transitory viewing only.
                  </p>
                  
                  <div className="space-y-4">
                    <p className="text-[var(--fg)]/70">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-[var(--fg)]/70">
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Modify or copy the materials
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Use the materials for any commercial purpose
                        </li>
                      </ul>
                      <ul className="space-y-2 text-[var(--fg)]/70">
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Attempt to reverse engineer any software
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Remove any copyright or proprietary notations
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* User Accounts */}
            <section className="relative">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500/25 to-indigo-500/25 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 to-pink-500/25 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-[var(--fg)]">User Accounts</h2>
                  </div>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    When you create an account with us, you must provide information that is accurate, 
                    complete, and current at all times.
                  </p>
                  
                  <div className="space-y-4">
                    <p className="text-[var(--fg)]/70">You are responsible for:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-[var(--fg)]/70">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          Maintaining the security of your account
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          All activities that occur under your account
                        </li>
                      </ul>
                      <ul className="space-y-2 text-[var(--fg)]/70">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          Notifying us immediately of any unauthorized use
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          Ensuring your account information remains accurate
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="relative">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-500/25 to-orange-500/25 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-red-400/25 to-pink-500/25 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <AlertTriangle className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-[var(--fg)]">Disclaimer</h2>
                  </div>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    The materials on Learnovium are provided on an &apos;as is&apos; basis. Learnovium makes no 
                    warranties, expressed or implied, and hereby disclaims and negates all other warranties.
                  </p>
                  
                  <div className="bg-yellow-500/10 dark:bg-yellow-500/5 rounded-2xl p-6 border border-yellow-500/20">
                    <p className="text-[var(--fg)]/70 leading-relaxed">
                      We do not warrant that the functions contained in the materials will be uninterrupted or error-free, 
                      that defects will be corrected, or that our site or the server that makes it available are free of 
                      viruses or other harmful components.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Limitations */}
            <section className="relative">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-red-500/25 to-pink-500/25 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-orange-400/25 to-red-500/25 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <XCircle className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-[var(--fg)]">Limitations</h2>
                  </div>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    In no event shall Learnovium or its suppliers be liable for any damages arising out of 
                    the use or inability to use the materials on Learnovium.
                  </p>
                  
                  <div className="bg-red-500/10 dark:bg-red-500/5 rounded-2xl p-6 border border-red-500/20">
                    <p className="text-[var(--fg)]/70 leading-relaxed">
                      This includes, but is not limited to, damages for loss of data or profit, or due to business 
                      interruption, arising out of the use or inability to use the service.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="relative">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-[var(--fg)]">Contact Information</h2>
                  </div>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3 p-4 bg-white/10 dark:bg-white/5 rounded-2xl">
                      <Mail className="w-5 h-5 text-brand" />
                      <div>
                        <p className="font-semibold text-[var(--fg)]">Email</p>
                        <p className="text-sm text-[var(--fg)]/70">legal@learnovium.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-white/10 dark:bg-white/5 rounded-2xl">
                      <Phone className="w-5 h-5 text-brand" />
                      <div>
                        <p className="font-semibold text-[var(--fg)]">Phone</p>
                        <p className="text-sm text-[var(--fg)]/70">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-white/10 dark:bg-white/5 rounded-2xl">
                      <MapPin className="w-5 h-5 text-brand" />
                      <div>
                        <p className="font-semibold text-[var(--fg)]">Address</p>
                        <p className="text-sm text-[var(--fg)]/70">123 Learning Street, Education City</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}