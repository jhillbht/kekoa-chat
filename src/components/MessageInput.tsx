'use client'

import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [rows, setRows] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const lineHeight = 24 // Approximate line height in px
      const maxRows = 6
      const newRows = Math.min(Math.max(Math.ceil(scrollHeight / lineHeight), 1), maxRows)
      
      setRows(newRows)
      textarea.style.height = Math.min(scrollHeight, maxRows * lineHeight) + "px"
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      setRows(1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Detect if we're on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    
    if (e.key === 'Enter' && !e.shiftKey) {
      if (!isMobile) {
        e.preventDefault()
        handleSubmit(e)
      }
    } else if (e.key === 'Enter' && e.shiftKey && isMobile) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-3 p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none text-base leading-6 min-h-[24px] max-h-[144px] py-0"
            style={{
              height: (rows * 24) + "px",
              fontSize: '16px' // Prevent zoom on iOS
            }}
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={"flex-shrink-0 w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 touch-manipulation " + (
              message.trim() && !disabled
                ? "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-sm"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            )}
          >
            <PaperAirplaneIcon className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        
        {/* Mobile send instruction */}
        <div className="md:hidden mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Tap send or Shift+Enter to send • Enter for new line
        </div>
        
        {/* Desktop send instruction */}
        <div className="hidden md:block mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Press Enter to send • Shift+Enter for new line
        </div>
      </form>
    </div>
  )
}
