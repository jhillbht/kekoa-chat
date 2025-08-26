'use client'

import { Conversation } from '@/types'
import { PlusIcon, BookOpenIcon, ShoppingBagIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

interface SidebarProps {
  conversations: Conversation[]
  activeConversation: string | null
  onConversationSelect: (id: string) => void
  onNewConversation: () => void
}

export default function Sidebar({
  conversations,
  activeConversation,
  onConversationSelect,
  onNewConversation
}: SidebarProps) {
  const getConversationIcon = (mode: string) => {
    if (mode === 'curriculum') return BookOpenIcon
    if (mode === 'ecom') return ShoppingBagIcon
    return ChatBubbleLeftRightIcon
  }

  const getConversationColor = (mode: string) => {
    if (mode === 'curriculum') return 'text-blue-500'
    if (mode === 'ecom') return 'text-purple-500'
    return 'text-green-500'
  }

  const getModeLabel = (mode: string) => {
    if (mode === 'curriculum') return 'Curriculum'
    if (mode === 'ecom') return 'TikTok Shop'
    return 'General Chat'
  }

  const getConversationSubtitle = (conversation: Conversation) => {
    if (conversation.mode === 'curriculum') {
      const curriculum = conversation.data.curriculum
      if (curriculum?.targetAudience && curriculum?.duration) {
        return `For ${curriculum.targetAudience} • ${curriculum.duration}`
      }
      if (curriculum?.targetAudience) {
        return `For ${curriculum.targetAudience}`
      }
      if (curriculum?.duration) {
        return curriculum.duration
      }
    } else if (conversation.mode === 'ecom') {
      const shop = conversation.data.tiktokShop
      if (shop?.niche && shop?.targetAudience) {
        return `${shop.niche} • ${shop.targetAudience}`
      }
      if (shop?.niche) {
        return shop.niche
      }
      if (shop?.targetAudience) {
        return shop.targetAudience
      }
    } else if (conversation.mode === 'general') {
      const generalChat = conversation.data.generalChat
      if (generalChat?.conversationSummary) {
        return generalChat.conversationSummary.substring(0, 50) + (generalChat.conversationSummary.length > 50 ? '...' : '')
      }
      if (generalChat?.topic && generalChat.topic !== 'General Conversation') {
        return generalChat.topic
      }
    }
    return getModeLabel(conversation.mode)
  }

  return (
    <div className="w-80 claude-sidebar flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="font-medium">New Conversation</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {conversations.map((conversation) => {
            const IconComponent = getConversationIcon(conversation.mode)
            const iconColor = getConversationColor(conversation.mode)
            
            return (
              <button
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeConversation === conversation.id
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {conversation.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {getConversationSubtitle(conversation)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {conversation.updatedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        
        {conversations.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpenIcon className="w-8 h-8 opacity-50" />
              <ChatBubbleLeftRightIcon className="w-8 h-8 opacity-50" />
              <ShoppingBagIcon className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-sm">
              Choose a mode to start your first conversation
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Kekoa Chat v3.0 • Triple-Mode Assistant
        </div>
      </div>
    </div>
  )
}
