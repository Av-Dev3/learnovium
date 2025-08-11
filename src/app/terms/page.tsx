export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="text-lg text-[var(--muted)]">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-[var(--muted)] max-w-2xl mx-auto">
            Please read these terms carefully before using our services. By using LearnOV AI, you agree to these terms.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-6 p-8 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="font-heading text-2xl font-semibold text-[var(--brand)]">Acceptance of Terms</h2>
            <div className="space-y-4 text-[var(--muted)]">
              <p>
                By accessing and using LearnOV AI, you accept and agree to be bound by the terms 
                and provisions of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
              <p>
                These terms apply to all users of the service, including without limitation users who are browsers, 
                vendors, customers, merchants, and/or contributors of content.
              </p>
            </div>
          </div>

          <div className="space-y-6 p-8 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="font-heading text-2xl font-semibold text-[var(--brand)]">Use License</h2>
            <div className="space-y-4 text-[var(--muted)]">
              <p>
                Permission is granted to temporarily download one copy of LearnOV AI per device for 
                personal, non-commercial transitory viewing only.
              </p>
              <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software contained on LearnOV AI</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 p-8 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="font-heading text-2xl font-semibold text-[var(--brand)]">User Accounts</h2>
            <div className="space-y-4 text-[var(--muted)]">
              <p>
                When you create an account with us, you must provide information that is accurate, 
                complete, and current at all times.
              </p>
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintaining the security of your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your account information remains accurate</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 p-8 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="font-heading text-2xl font-semibold text-[var(--brand)]">Disclaimer</h2>
            <div className="space-y-4 text-[var(--muted)]">
              <p>
                The materials on LearnOV AI are provided on an &apos;as is&apos; basis. LearnOV AI makes no 
                warranties, expressed or implied, and hereby disclaims and negates all other warranties.
              </p>
              <p>
                We do not warrant that the functions contained in the materials will be uninterrupted or error-free, 
                that defects will be corrected, or that our site or the server that makes it available are free of 
                viruses or other harmful components.
              </p>
            </div>
          </div>

          <div className="space-y-6 p-8 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="font-heading text-2xl font-semibold text-[var(--brand)]">Limitations</h2>
            <div className="space-y-4 text-[var(--muted)]">
              <p>
                In no event shall LearnOV AI or its suppliers be liable for any damages arising out of 
                the use or inability to use the materials on LearnOV AI.
              </p>
              <p>
                This includes, but is not limited to, damages for loss of data or profit, or due to business 
                interruption, arising out of the use or inability to use the service.
              </p>
            </div>
          </div>

          <div className="space-y-6 p-8 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="font-heading text-2xl font-semibold text-[var(--brand)]">Contact Information</h2>
            <div className="space-y-4 text-[var(--muted)]">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> legal@learnovai.com</p>
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