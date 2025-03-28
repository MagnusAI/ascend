import { TextProps } from '../../types/components'

export default function Text({ variant = 'default', size = 'base', className = '', children }: TextProps) {
  const variantClasses = {
    accent: 'text-primary-400',
    muted: 'text-gray-400',
    default: 'text-gray-300',
    heading: 'text-white font-semibold'
  }

  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <span className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  )
} 