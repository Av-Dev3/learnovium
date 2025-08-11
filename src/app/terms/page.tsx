export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="prose prose-gray max-w-none">
          <h2 className="font-heading text-2xl font-semibold">Acceptance of Terms</h2>
          <p>
            By accessing and using LearnOV AI, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>
          
          <h2 className="font-heading text-2xl font-semibold mt-8">Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of LearnOV AI per device for 
            personal, non-commercial transitory viewing only.
          </p>
          
          <h2 className="font-heading text-2xl font-semibold mt-8">Disclaimer</h2>
          <p>
            The materials on LearnOV AI are provided on an &apos;as is&apos; basis. LearnOV AI makes no 
            warranties, expressed or implied, and hereby disclaims and negates all other warranties.
          </p>
          
          <h2 className="font-heading text-2xl font-semibold mt-8">Limitations</h2>
          <p>
            In no event shall LearnOV AI or its suppliers be liable for any damages arising out of 
            the use or inability to use the materials on LearnOV AI.
          </p>
          
          <h2 className="font-heading text-2xl font-semibold mt-8">Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at 
            legal@learnovai.com
          </p>
        </div>
      </div>
    </div>
  );
}