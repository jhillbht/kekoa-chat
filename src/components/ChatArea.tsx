'use client'

import { useState } from 'react'
import { CurriculumConversation, Message } from '@/types'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import CurriculumSummary from './CurriculumSummary'
import { processUserMessage } from '@/lib/conversationEngine'

interface ChatAreaProps {
  conversation: CurriculumConversation | null
  onAddMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  onUpdateConversation: (conversationId: string, updates: Partial<CurriculumConversation>) => void
}

export default function ChatArea({
  conversation,
  onAddMessage,
  onUpdateConversation
}: ChatAreaProps) {
  const [isTyping, setIsTyping] = useState(false)
  const [showCurriculum, setShowCurriculum] = useState(false)

  const handleSendMessage = async (content: string) => {
    if (!conversation) return

    // Add user message
    onAddMessage(conversation.id, {
      role: 'user',
      content
    })

    setIsTyping(true)

    // Process the message and get response
    try {
      const { response, updatedCurriculum } = await processUserMessage(
        content,
        conversation.curriculum,
        conversation.messages
      )

      // Update conversation with new curriculum data
      if (updatedCurriculum) {
        onUpdateConversation(conversation.id, {
          curriculum: updatedCurriculum
        })
      }

      // Add assistant response
      setTimeout(() => {
        onAddMessage(conversation.id, {
          role: 'assistant',
          content: response
        })
        setIsTyping(false)
      }, 1000)
    } catch (error) {
      console.error('Error processing message:', error)
      setIsTyping(false)
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Welcome to Kekoa Chat
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Select a conversation or start a new curriculum to begin
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {conversation.curriculum.subject || 'New Curriculum'}
            </h1>
            {conversation.curriculum.targetAudience && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                For {conversation.curriculum.targetAudience}
                {conversation.curriculum.duration && ` • ${conversation.curriculum.duration}`}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowCurriculum(!showCurriculum)}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {showCurriculum ? 'Hide' : 'Show'} Curriculum
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className={`${showCurriculum ? 'w-2/3' : 'w-full'} flex flex-col`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <MessageBubble
                message={{
                  id: 'typing',
                  role: 'assistant',
                  content: 'Thinking...',
                  timestamp: new Date()
                }}
                isTyping={true}
              />
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <MessageInput onSend={handleSendMessage} disabled={isTyping} />
          </div>
        </div>

        {/* Curriculum Summary */}
        {showCurriculum && (
          <div className="w-1/3 border-l border-gray-200 dark:border-gray-700">
            <CurriculumSummary curriculum={conversation.curriculum} />
          </div>
        )}
      </div>
    </div>
  )
}
