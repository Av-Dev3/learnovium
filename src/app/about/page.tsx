export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            About LearnOV AI
          </h1>
          <p className="text-lg text-muted-foreground">
            Revolutionizing education with artificial intelligence
          </p>
        </div>
        <div className="prose prose-gray max-w-none">
          <p>
            LearnOV AI is a cutting-edge educational platform that leverages artificial intelligence 
            to create personalized learning experiences. Our mission is to make quality education 
            accessible to everyone, everywhere.
          </p>
          <h2 className="font-heading text-2xl font-semibold mt-8">Our Vision</h2>
          <p>
            We envision a world where learning is personalized, engaging, and effective for every 
            individual, regardless of their background or learning style.
          </p>
          <h2 className="font-heading text-2xl font-semibold mt-8">Key Features</h2>
          <ul>
            <li>AI-powered personalized learning paths</li>
            <li>Adaptive content recommendations</li>
            <li>Real-time progress tracking</li>
            <li>Interactive learning experiences</li>
          </ul>
        </div>
      </div>
    </div>
  );
}