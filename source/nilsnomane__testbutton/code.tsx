'use client'
import React from 'react'

interface TestButtonProps {
  label?: string
  onClick?: () => void
}

export default function TestButton({ label = 'Click me', onClick }: TestButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {label}
    </button>
  )
}
