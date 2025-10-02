import { AppHeader } from "@/components/app-header";
import { Shield, Lock, UserCheck, Mail, Phone, MapPin, CheckCircle, Database, Users } from "lucide-react";

export default function PrivacyPage() {
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
                <Shield className="w-5 h-5 text-brand" />
                <span className="text-brand font-medium">Your Privacy Matters</span>
              </div>
              
              <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                <span className="bg-gradient-to-r from-[var(--fg)] via-brand to-purple-600 bg-clip-text text-transparent">
                  Privacy Policy
                </span>
              </h1>
              
              <p className="text-xl text-[var(--fg)]/80 max-w-4xl mx-auto leading-relaxed">
                Your privacy is important to us. This policy explains how we collect, use, and protect your information 
                while providing you with the best learning experience possible.
              </p>
              
              <p className="text-lg text-[var(--fg)]/60 max-w-2xl mx-auto">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </section>

          {/* Content Sections */}
          <div className="space-y-8">
            
            {/* Information We Collect */}
            <section className="relative">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Database className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-[var(--fg)]">Information We Collect</h2>
                  </div>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, 
                    use our services, or contact us for support.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-[var(--fg)]">Account Information</h3>
                      <ul className="space-y-2 text-[var(--fg)]/70">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          Name and email address
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          Password (encrypted)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          Profile preferences
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-[var(--fg)]">Learning Data</h3>
                      <ul className="space-y-2 text-[var(--fg)]/70">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          Learning preferences and progress
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          Communication records
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          Usage analytics (anonymized)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="relative">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-500/25 to-green-500/25 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-400/25 to-cyan-500/25 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-[var(--fg)]">How We Use Your Information</h2>
                  </div>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services, 
                    process transactions, and communicate with you.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-[var(--fg)]">Service Improvement</h3>
                      <ul className="space-y-2 text-[var(--fg)]/70">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          Personalize your learning experience
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          Improve our AI algorithms
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          Enhance content quality
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-[var(--fg)]">Communication</h3>
                      <ul className="space-y-2 text-[var(--fg)]/70">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          Send important updates
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          Provide customer support
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          Share learning insights
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="relative">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-red-500/25 to-orange-500/25 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-yellow-400/25 to-amber-500/25 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-[var(--fg)]">Data Security</h2>
                  </div>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your 
                    personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-[var(--fg)]">Technical Measures</h3>
                      <ul className="space-y-2 text-[var(--fg)]/70">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          End-to-end encryption for sensitive data
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Regular security audits and updates
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Secure data centers with 24/7 monitoring
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-[var(--fg)]">Organizational Measures</h3>
                      <ul className="space-y-2 text-[var(--fg)]/70">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Employee training on data protection
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Strict access controls and permissions
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Incident response procedures
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="relative">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500/25 to-indigo-500/25 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 to-pink-500/25 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <UserCheck className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-[var(--fg)]">Your Rights</h2>
                  </div>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    You have the right to access, correct, or delete your personal information at any time.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-[var(--fg)]">Data Access</h3>
                      <ul className="space-y-2 text-[var(--fg)]/70">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          Access and download your data
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          Request data portability
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          View data processing activities
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-[var(--fg)]">Data Control</h3>
                      <ul className="space-y-2 text-[var(--fg)]/70">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          Request corrections to inaccurate information
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          Delete your account and associated data
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          Opt-out of marketing communications
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Us */}
            <section className="relative">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-[var(--fg)]">Contact Us</h2>
                  </div>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, 
                    please contact us:
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3 p-4 bg-white/10 dark:bg-white/5 rounded-2xl">
                      <Mail className="w-5 h-5 text-brand" />
                      <div>
                        <p className="font-semibold text-[var(--fg)]">Email</p>
                        <p className="text-sm text-[var(--fg)]/70">privacy@learnovium.com</p>
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