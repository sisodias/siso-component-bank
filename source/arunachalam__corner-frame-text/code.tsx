'use client'

import type { FC, HTMLAttributes } from 'react'

type CornerFrameTextProps = {
  text?: string
  as?: keyof JSX.IntrinsicElements
  className?: string
} & HTMLAttributes<HTMLElement>

const CornerFrameText: FC<CornerFrameTextProps> = ({
  text = 'Framed Text',
  as: Component = 'span',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative inline-block px-6 py-3 ${className}`} {...props}>
      <div className="absolute inset-0 pointer-events-none corner-frame-border" />

      <Component className="relative z-10">{text}</Component>
    </div>
  )
}

export default CornerFrameText
