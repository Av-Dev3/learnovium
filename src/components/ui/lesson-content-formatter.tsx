"use client";

import React from 'react';

interface LessonContentFormatterProps {
  content: string;
  className?: string;
}

export function LessonContentFormatter({ content, className = "" }: LessonContentFormatterProps) {
  // Function to detect and format different content types
  const formatContent = (text: string) => {
    if (!text) return [];

    // Split by double newlines to get paragraphs
    const sections = text.split(/\n\s*\n/).filter(section => section.trim());
    
    return sections.map((section, sectionIndex) => {
      const trimmedSection = section.trim();
      
      // Check if it's a heading (starts with # or is all caps and short)
      if (trimmedSection.startsWith('#')) {
        const level = (trimmedSection.match(/^#+/) || [''])[0].length;
        const headingText = trimmedSection.replace(/^#+\s*/, '');
        const HeadingTag = `h${Math.min(level + 2, 6)}` as keyof React.JSX.IntrinsicElements;
        
        return (
          <HeadingTag 
            key={sectionIndex} 
            className="font-bold text-[var(--fg)] mb-4 mt-6 first:mt-0"
            style={{
              fontSize: level === 1 ? '1.5rem' : level === 2 ? '1.25rem' : '1.125rem'
            }}
          >
            {headingText}
          </HeadingTag>
        );
      }
      
      // Check if it's a list (starts with -, *, or numbers)
      if (/^[-*•]\s/.test(trimmedSection) || /^\d+\.\s/.test(trimmedSection)) {
        const listItems = trimmedSection.split('\n').filter(line => line.trim());
        const isOrdered = /^\d+\.\s/.test(listItems[0]);
        
        const ListTag = isOrdered ? 'ol' : 'ul';
        
        return (
          <ListTag 
            key={sectionIndex} 
            className={`space-y-2 mb-6 ${isOrdered ? 'list-decimal' : 'list-disc'} list-inside text-[var(--fg)] leading-relaxed`}
          >
            {listItems.map((item, itemIndex) => {
              const cleanItem = item.replace(/^[-*•]\s|^\d+\.\s/, '').trim();
              return (
                <li key={itemIndex} className="ml-2">
                  {cleanItem}
                </li>
              );
            })}
          </ListTag>
        );
      }
      
      // Check if it's a code block (contains code-like patterns)
      if (trimmedSection.includes('```') || trimmedSection.includes('`')) {
        return (
          <div key={sectionIndex} className="bg-[var(--bg)]/30 border border-[var(--border)]/30 rounded-xl p-4 mb-6 font-mono text-sm overflow-x-auto">
            <pre className="text-[var(--fg)] whitespace-pre-wrap">
              {trimmedSection.replace(/```/g, '')}
            </pre>
          </div>
        );
      }
      
      // Check if it's a quote (starts with > or is indented)
      if (trimmedSection.startsWith('>') || trimmedSection.startsWith('  ')) {
        const quoteText = trimmedSection.replace(/^>\s*/, '').replace(/^  /, '');
        return (
          <blockquote 
            key={sectionIndex} 
            className="border-l-4 border-brand/50 pl-4 py-2 mb-6 italic text-[var(--fg)]/80 bg-[var(--bg)]/20 rounded-r-lg"
          >
            {quoteText}
          </blockquote>
        );
      }
      
      // Check if it's a step or instruction (starts with Step, First, Then, etc.)
      if (/^(Step \d+|First|Then|Next|Finally|Lastly)/i.test(trimmedSection)) {
        return (
          <div key={sectionIndex} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-2xl p-4 mb-6">
            <p className="text-[var(--fg)] leading-relaxed font-medium">
              {trimmedSection}
            </p>
          </div>
        );
      }
      
      // Regular paragraph - split by single newlines for better formatting
      const paragraphLines = trimmedSection.split('\n').filter(line => line.trim());
      
      if (paragraphLines.length === 1) {
        // Single line paragraph
        return (
          <p key={sectionIndex} className="text-[var(--fg)] leading-relaxed mb-6 text-lg">
            {paragraphLines[0]}
          </p>
        );
      } else {
        // Multi-line paragraph - treat each line as a separate point
        return (
          <div key={sectionIndex} className="mb-6 space-y-3">
            {paragraphLines.map((line, lineIndex) => (
              <p key={lineIndex} className="text-[var(--fg)] leading-relaxed text-lg">
                {line.trim()}
              </p>
            ))}
          </div>
        );
      }
    });
  };

  const formattedContent = formatContent(content);

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <div className="space-y-4">
        {formattedContent}
      </div>
    </div>
  );
}
