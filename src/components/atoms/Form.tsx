import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const formVariants = cva('space-y-6', {
  variants: {
    variant: {
      default: '',
      compact: 'space-y-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface FormProps
  extends React.FormHTMLAttributes<HTMLFormElement>,
    VariantProps<typeof formVariants> {}

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, variant, ...props }, ref) => (
    <form
      ref={ref}
      className={cn(formVariants({ variant, className }))}
      {...props}
    />
  )
)
Form.displayName = 'Form'

const FormGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('space-y-2', className)}
    {...props}
  />
))
FormGroup.displayName = 'FormGroup'

const FormLabel = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('block text-sm font-medium text-primary-400', className)}
    {...props}
  />
))
FormLabel.displayName = 'FormLabel'

const FormInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500',
      className
    )}
    {...props}
  />
))
FormInput.displayName = 'FormInput'

const FormTextarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500',
      className
    )}
    {...props}
  />
))
FormTextarea.displayName = 'FormTextarea'

const FormError = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-red-500', className)}
    {...props}
  />
))
FormError.displayName = 'FormError'

const FormActions = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-end space-x-3', className)}
    {...props}
  />
))
FormActions.displayName = 'FormActions'

export {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormError,
  FormActions,
} 