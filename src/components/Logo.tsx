import Image from 'next/image';

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
      <Image
        src="/icon.png"
        alt="Learnovium"
        width={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
        height={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
        className="rounded-xl shadow-lg"
        priority
      />
    </div>
  );
}
