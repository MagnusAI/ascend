declare module '../atoms/Text' {
  interface TextProps {
    variant?: 'accent' | 'muted' | 'default'
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
    className?: string
    children: React.ReactNode
  }
  const Text: React.FC<TextProps>
  export default Text
} 