import { FormHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void
  isLoading?: boolean
}

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, onSubmit, isLoading, children, ...props }, ref) => {
    return (
      <form
        ref={ref}
        onSubmit={onSubmit}
        className={cn('space-y-6', className)}
        {...props}
      >
        {children}
      </form>
    )
  }
)

Form.displayName = 'Form'

export default Form 