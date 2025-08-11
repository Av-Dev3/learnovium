export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-lg text-[var(--muted)]">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-[var(--muted)] max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-6 p-8 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="font-heading text-2xl font-semibold text-[var(--brand)]">Information We Collect</h2>
            <div className="space-y-4 text-[var(--muted)]">
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (name, email, password)</li>
                <li>Learning preferences and progress data</li>
                <li>Communication records and support tickets</li>
                <li>Usage analytics and performance metrics</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 p-8 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="font-heading text-2xl font-semibold text-[var(--brand)]">How We Use Your Information</h2>
            <div className="space-y-4 text-[var(--muted)]">
              <p>
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, and communicate with you.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personalize your learning experience</li>
                <li>Send important updates and notifications</li>
                <li>Improve our AI algorithms and content</li>
                <li>Provide customer support and assistance</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 p-8 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="font-heading text-2xl font-semibold text-[var(--brand)]">Data Security</h2>
            <div className="space-y-4 text-[var(--muted)]">
              <p>
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>End-to-end encryption for sensitive data</li>
                <li>Regular security audits and updates</li>
                <li>Secure data centers with 24/7 monitoring</li>
                <li>Employee training on data protection</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 p-8 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="font-heading text-2xl font-semibold text-[var(--brand)]">Your Rights</h2>
            <div className="space-y-4 text-[var(--muted)]">
              <p>
                You have the right to access, correct, or delete your personal information at any time.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and download your data</li>
                <li>Request corrections to inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 p-8 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="font-heading text-2xl font-semibold text-[var(--brand)]">Contact Us</h2>
            <div className="space-y-4 text-[var(--muted)]">
              <p>
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> privacy@learnovai.com</p>
                <p><strong>Address:</strong> 123 Learning Street, Education City, EC 12345</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}