'use client'

import { useState } from 'react'
import { Conversation, Message } from '@/types'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import CurriculumSummary from './CurriculumSummary'
import TikTokShopSummary from './TikTokShopSummary'
import GeneralChatSummary from './GeneralChatSummary'
import { processUnifiedMessage } from '@/lib/unifiedConversationEngine'

interface ChatAreaProps {
  conversation: Conversation | null
  onAddMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  onUpdateConversation: (conversationId: string, updates: Partial<Conversation>) => void
}

export default function ChatArea({
  conversation,
  onAddMessage,
  onUpdateConversation
}: ChatAreaProps) {
  const [isTyping, setIsTyping] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  const getModeLabel = (mode: string) => {
    if (mode === 'curriculum') return 'Curriculum'
    if (mode === 'ecom') return 'TikTok Shop'
    return 'General Chat'
  }

  const getModeColor = (mode: string) => {
    if (mode === 'curriculum') return 'text-blue-600 bg-blue-50 border-blue-200'
    if (mode === 'ecom') return 'text-purple-600 bg-purple-50 border-purple-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  const getTitle = (conversation: Conversation) => {
    if (conversation.mode === 'curriculum') {
      return conversation.data.curriculum?.subject || 'New Curriculum'
    } else if (conversation.mode === 'ecom') {
      return conversation.data.tiktokShop?.businessName || 'New TikTok Shop'
    } else if (conversation.mode === 'general') {
      return conversation.data.generalChat?.topic || 'General Chat'
    }
    return conversation.title
  }

  const getSubtitle = (conversation: Conversation) => {
    if (conversation.mode === 'curriculum') {
      const curriculum = conversation.data.curriculum
      if (curriculum?.targetAudience && curriculum?.duration) {
        return `For ${curriculum.targetAudience} • ${curriculum.duration}`
      }
    } else if (conversation.mode === 'ecom') {
      const shop = conversation.data.tiktokShop
      if (shop?.niche && shop?.targetAudience) {
        return `${shop.niche} • ${shop.targetAudience}`
      }
    } else if (conversation.mode === 'general') {
      const generalChat = conversation.data.generalChat
      if (generalChat?.conversationSummary) {
        return generalChat.conversationSummary.substring(0, 60) + (generalChat.conversationSummary.length > 60 ? '...' : '')
      }
    }
    return null
  }

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
      const result = await processUnifiedMessage(
        content,
        conversation.mode,
        conversation.data,
        conversation.messages
      )

      // Update conversation with new data
      if (result.updatedData) {
        onUpdateConversation(conversation.id, {
          data: result.updatedData
        })
      }

      // Add assistant response
      setTimeout(() => {
        onAddMessage(conversation.id, {
          role: 'assistant',
          content: result.response
        })
        setIsTyping(false)
      }, 1000)
    } catch (error) {
      console.error('Error processing message:', error)
      onAddMessage(conversation.id, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.'
      })
      setIsTyping(false)
    }
  }

  const renderSummary = (conversation: Conversation) => {
    if (conversation.mode === 'curriculum' && conversation.data.curriculum) {
      return <CurriculumSummary curriculum={conversation.data.curriculum} />
    } else if (conversation.mode === 'ecom' && conversation.data.tiktokShop) {
      return <TikTokShopSummary tiktokShop={conversation.data.tiktokShop} />
    } else if (conversation.mode === 'general' && conversation.data.generalChat) {
      return <GeneralChatSummary generalChat={conversation.data.generalChat} />
    }
    return null
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">📚</span>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
          <span className="text-green-600 dark:text-green-400 font-semibold">💬</span>
          </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-semibold">🛍️</span>
              </div>
            </div>
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Welcome to Kekoa Chat v3.0
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Choose your assistant mode: Curriculum, General Chat, or TikTok Shop
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
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {getTitle(conversation)}
              </h1>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getModeColor(conversation.mode)}`}>
                {getModeLabel(conversation.mode)}
              </span>
            </div>
            {getSubtitle(conversation) && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getSubtitle(conversation)}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {showSummary ? 'Hide' : 'Show'} {getModeLabel(conversation.mode)}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className={`${showSummary ? 'w-2/3' : 'w-full'} flex flex-col`}>
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

        {/* Summary Sidebar */}
        {showSummary && (
          <div className="w-1/3 border-l border-gray-200 dark:border-gray-700">
            {renderSummary(conversation)}
          </div>
        )}
      </div>
    </div>
  )
}
