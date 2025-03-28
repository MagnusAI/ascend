import { cn } from '../../lib/utils'

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'muted' | 'heading' | 'accent'
  size?: 'sm' | 'base' | 'lg' | 'xl'
}

export default function Text({ 
  variant = 'default', 
  size = 'base',
  className,
  ...props 
}: TextProps) {
  const baseStyles = 'font-medium'
  
  const variants = {
    default: 'text-dark-100',
    muted: 'text-dark-400',
    heading: 'text-white font-bold tracking-tight',
    accent: 'text-primary-400 font-semibold'
  }

  const sizes = {
    sm: 'text-sm',
    base: 'text-base',
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