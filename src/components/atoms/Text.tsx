import { cn } from '../../lib/utils'

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'muted' | 'heading' | 'accent' | 'error'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export default function Text({ 
  variant = 'default', 
  size = 'md',
  className,
  ...props 
}: TextProps) {
  const baseStyles = 'font-medium'
  
  const variants = {
    default: 'text-primary-100',
    muted: 'text-primary-400',
    heading: 'text-primary-200 font-bold tracking-tight',
    accent: 'text-primary-400',
    error: 'text-red-400'
  }

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <p 
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
} 