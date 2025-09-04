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

    // First, try to split by double newlines for natural paragraphs
    let sections = text.split(/\n\s*\n/).filter(section => section.trim());
    
    // If we only get one big section, try to break it up more aggressively
    if (sections.length === 1) {
      // Split by single newlines and group sentences
      const lines = text.split('\n').filter(line => line.trim());
      sections = [];
      let currentSection = '';
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        // If line looks like a heading or starts a new concept
        if (trimmedLine.match(/^(Step \d+|First|Then|Next|Finally|Lastly|Introduction|Conclusion|Overview|Summary|Key Points?|Important|Note|Remember|Tip)/i) ||
            trimmedLine.length < 100 && trimmedLine.endsWith(':')) {
          if (currentSection) {
            sections.push(currentSection.trim());
            currentSection = '';
          }
          sections.push(trimmedLine);
        } else if (trimmedLine.match(/^\d+\./) || trimmedLine.match(/^[-*•]/)) {
          // List items - group consecutive ones
          if (currentSection && !currentSection.match(/^\d+\.|^[-*•]/)) {
            sections.push(currentSection.trim());
            currentSection = trimmedLine;
          } else {
            currentSection += (currentSection ? '\n' : '') + trimmedLine;
          }
        } else {
          // Regular content - group into reasonable chunks
          if (currentSection.length > 300) {
            sections.push(currentSection.trim());
            currentSection = trimmedLine;
          } else {
            currentSection += (currentSection ? '\n' : '') + trimmedLine;
          }
        }
      }
      
      if (currentSection) {
        sections.push(currentSection.trim());
      }
    }
    
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
      if (/^(Step \d+|First|Then|Next|Finally|Lastly|To begin|To start|Begin by|Start by|Now|After that|Once you)/i.test(trimmedSection) ||
          (trimmedSection.length < 150 && /^(How to|When to|Why|What|Where)/i.test(trimmedSection))) {
        
        // Break long instructions into smaller parts
        const sentences = trimmedSection.split(/(?<=[.!?])\s+/).filter(s => s.trim());
        
        return (
          <div key={sectionIndex} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
            {sentences.length > 3 ? (
              <div className="space-y-2">
                {sentences.map((sentence, sentIndex) => (
                  <p key={sentIndex} className="text-[var(--fg)] leading-relaxed font-medium text-sm sm:text-base">
                    {sentence.trim()}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-[var(--fg)] leading-relaxed font-medium text-sm sm:text-base">
                {trimmedSection}
              </p>
            )}
          </div>
        );
      }
      
      // Regular paragraph - break into sentences for better readability
      const sentences = trimmedSection.split(/(?<=[.!?])\s+/).filter(s => s.trim());
      
      if (sentences.length <= 2) {
        // Short content - keep as single paragraph
        return (
          <p key={sectionIndex} className="text-[var(--fg)] leading-relaxed mb-4 sm:mb-6 text-base sm:text-lg">
            {trimmedSection}
          </p>
        );
      } else if (sentences.length <= 4) {
        // Medium content - split into two paragraphs
        const midPoint = Math.ceil(sentences.length / 2);
        const firstPart = sentences.slice(0, midPoint).join(' ');
        const secondPart = sentences.slice(midPoint).join(' ');
        
        return (
          <div key={sectionIndex} className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
            <p className="text-[var(--fg)] leading-relaxed text-base sm:text-lg">
              {firstPart}
            </p>
            <p className="text-[var(--fg)] leading-relaxed text-base sm:text-lg">
              {secondPart}
            </p>
          </div>
        );
      } else {
        // Long content - break into multiple paragraphs
        const chunks = [];
        for (let i = 0; i < sentences.length; i += 3) {
          chunks.push(sentences.slice(i, i + 3).join(' '));
        }
        
        return (
          <div key={sectionIndex} className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
            {chunks.map((chunk, chunkIndex) => (
              <p key={chunkIndex} className="text-[var(--fg)] leading-relaxed text-base sm:text-lg">
                {chunk}
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
