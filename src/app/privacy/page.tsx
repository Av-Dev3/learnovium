export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="prose prose-gray max-w-none">
          <h2 className="font-heading text-2xl font-semibold">Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, 
            use our services, or contact us for support.
          </p>
          
          <h2 className="font-heading text-2xl font-semibold mt-8">How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, 
            process transactions, and communicate with you.
          </p>
          
          <h2 className="font-heading text-2xl font-semibold mt-8">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <h2 className="font-heading text-2xl font-semibold mt-8">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at 
            privacy@learnovai.com
          </p>
        </div>
      </div>
    </div>
  );
}