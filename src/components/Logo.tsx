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

  console.log('Logo component rendered with size:', size);

  return (
    <div className={`${sizeClasses[size]} ${className} bg-red-500 border-2 border-blue-500`}>
      <Image
        src="/logo.png"
        alt="Learnovium"
        width={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
        height={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
        className="rounded-xl shadow-lg"
        priority
        onError={(e) => {
          console.error('Logo image failed to load:', e);
        }}
        onLoad={() => {
          console.log('Logo image loaded successfully');
        }}
      />
    </div>
  );
}
