'use client'

import { useState } from 'react'
import { Conversation, Message } from '@/types'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import CurriculumSummary from './CurriculumSummary'
import TikTokShopSummary from './TikTokShopSummary'
import GeneralChatSummary from './GeneralChatSummary'
import { processUnifiedMessage } from '@/lib/unifiedConversationEngine'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

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
    if (mode === 'curriculum') return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
    if (mode === 'ecom') return 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
    return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
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
        return curriculum.targetAudience + " • " + curriculum.duration
      }
    } else if (conversation.mode === 'ecom') {
      const shop = conversation.data.tiktokShop
      if (shop?.niche && shop?.targetAudience) {
        return shop.niche + " for " + shop.targetAudience
      }
    } else if (conversation.mode === 'general') {
      const chat = conversation.data.generalChat
      if (chat?.conversationSummary) {
        return chat.conversationSummary.substring(0, 60) + '...'
      }
    }
    return null
  }

  const handleSendMessage = async (content: string) => {
    if (!conversation || !content.trim()) return

    const userMessage: Omit<Message, 'id' | 'timestamp'> = {
      role: 'user',
      content: content.trim()
    }

    onAddMessage(conversation.id, userMessage)
    setIsTyping(true)

    try {
      const response = await processUnifiedMessage(
        conversation.mode,
        content,
        conversation.messages,
        conversation.data
      )

      const assistantMessage: Omit<Message, 'id' | 'timestamp'> = {
        role: 'assistant',
        content: response.message
      }

      onAddMessage(conversation.id, assistantMessage)

      if (response.updatedData) {
        onUpdateConversation(conversation.id, {
          data: response.updatedData
        })
      }
    } catch (error) {
      console.error('Error processing message:', error)
      const errorMessage: Omit<Message, 'id' | 'timestamp'> = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.'
      }
      onAddMessage(conversation.id, errorMessage)
    }
    
    setIsTyping(false)
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
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 p-6">
        <div className="text-center max-w-sm w-full">
          {/* Mobile-optimized welcome icons */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-xl md:text-2xl">📚</span>
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-xl md:text-2xl">💬</span>
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-xl md:text-2xl">🛍️</span>
            </div>
          </div>
          
          {/* Mobile-optimized welcome text */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
            Welcome to Kekoa Chat
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-4">
            Choose your AI assistant mode
          </p>
          
          {/* Mobile-friendly mode descriptions */}
          <div className="text-sm text-gray-500 dark:text-gray-500 space-y-2">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-blue-500">📚</span>
              <span>Curriculum Designer</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-green-500">💬</span>
              <span>General Chat</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-purple-500">🛍️</span>
              <span>TikTok Shop Strategist</span>
            </div>
          </div>
          
          {/* Mobile instruction */}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 md:hidden">
            Tap the menu button (☰) to get started
          </p>
          <p className="hidden md:block text-sm text-gray-400 dark:text-gray-500 mt-6">
            Click "New Conversation" to begin
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 h-full overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden md:block border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                {getTitle(conversation)}
              </h1>
              <span className={"px-3 py-1 text-sm font-medium rounded-full border " + getModeColor(conversation.mode)}>
                {getModeLabel(conversation.mode)}
              </span>
            </div>
            {getSubtitle(conversation) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
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

      {/* Mobile Summary Toggle */}
      <div className="md:hidden border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowSummary(!showSummary)}
          className="w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className={"px-2 py-1 text-xs font-medium rounded-full " + getModeColor(conversation.mode)}>
              {getModeLabel(conversation.mode)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {showSummary ? 'Hide Details' : 'Show Details'}
            </span>
          </div>
          {showSummary ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Chat Area */}
        <div className={"flex-1 flex flex-col min-h-0 " + (showSummary ? "md:flex-1" : "flex-1")}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
            {conversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 max-w-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
          </div>
        </div>

        {/* Summary Panel */}
        {showSummary && (
          <div className="md:w-80 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
            <div className="p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {getModeLabel(conversation.mode)} Details
              </h3>
              {renderSummary(conversation)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
