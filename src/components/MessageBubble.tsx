'use client'

import { Message } from '@/types'
import { UserIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface MessageBubbleProps {
  message: Message
  isTyping?: boolean
}

export default function MessageBubble({ message, isTyping = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={clsx(
      'flex gap-4 p-4 rounded-lg',
      isUser ? 'claude-message-user' : 'claude-message-assistant'
    )}>
      {/* Avatar */}
      <div className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        isUser 
          ? 'bg-blue-500 text-white' 
          : 'bg-orange-500 text-white'
      )}>
        {isUser ? (
          <UserIcon className="w-5 h-5" />
        ) : (
          <AcademicCapIcon className="w-5 h-5" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {isUser ? 'You' : 'Kekoa'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          {isTyping ? (
            <div className="flex items-center gap-1">
              <div className="animate-pulse">Thinking</div>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
              {message.content}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
