import { InputHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const inputVariants = cva(
  'block w-full rounded-lg border bg-dark-800 text-dark-100 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'border-dark-700 focus:border-primary-500 focus:ring-primary-500',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
      },
      inputSize: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-dark-300 mb-1"
          >
            {label}
          </label>
        )}
        <input
          className={cn(
            inputVariants({ variant: error ? 'error' : variant, inputSize, className })
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error || helperText ? `${props.id}-description` : undefined}
          {...props}
        />
        {(error || helperText) && (
          <p
            id={`${props.id}-description`}
            className={cn(
              'mt-1 text-sm',
              error ? 'text-red-400' : 'text-dark-400'
            )}
            role={error ? 'alert' : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input 