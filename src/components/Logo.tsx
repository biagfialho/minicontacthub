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
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" className="fill-primary-foreground stroke-primary-foreground" />
          <path d="M12 2v4" className="stroke-primary-foreground" />
          <path d="M12 18v4" className="stroke-primary-foreground" />
          <path d="M4.93 4.93l2.83 2.83" className="stroke-primary-foreground" />
          <path d="M16.24 16.24l2.83 2.83" className="stroke-primary-foreground" />
          <path d="M2 12h4" className="stroke-primary-foreground" />
          <path d="M18 12h4" className="stroke-primary-foreground" />
          <path d="M4.93 19.07l2.83-2.83" className="stroke-primary-foreground" />
          <path d="M16.24 7.76l2.83-2.83" className="stroke-primary-foreground" />
        </svg>
      </div>
      <span className={cn(
        'font-semibold text-foreground tracking-tight',
        size === 'sm' && 'text-lg',
        size === 'md' && 'text-xl',
        size === 'lg' && 'text-2xl'
      )}>
        Contatos
      </span>
    </div>
  );
};

export default Logo;
