import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn(
        'rounded-xl bg-primary flex items-center justify-center shadow-md',
        sizes[size]
      )}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-1/2 h-1/2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" className="stroke-primary-foreground" />
          <circle cx="9" cy="7" r="4" className="stroke-primary-foreground" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" className="stroke-primary-foreground" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" className="stroke-primary-foreground" />
        </svg>
      </div>
      <span className={cn(
        'font-semibold text-foreground tracking-tight',
        size === 'sm' && 'text-lg',
        size === 'md' && 'text-xl',
        size === 'lg' && 'text-2xl'
      )}>
        Recruiter Signal
      </span>
    </div>
  );
};

export default Logo;
