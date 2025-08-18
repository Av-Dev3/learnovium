"use client";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img
        src="/icon.png"
        alt="Learnovium"
        className="w-full h-full rounded-xl shadow-lg object-cover"
        onError={(e) => {
          console.error('Icon image failed to load, trying logo.png fallback:', e);
          // Try fallback to logo.png
          const target = e.target as HTMLImageElement;
          target.src = '/logo.png';
        }}
        onLoad={() => {
          console.log('Logo image loaded successfully');
        }}
      />
    </div>
  );
}
