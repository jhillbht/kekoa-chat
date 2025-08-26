'use client'

import { Conversation } from '@/types'
import { 
  Bars3Icon, 
  PlusIcon, 
  BookOpenIcon, 
  ShoppingBagIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline'

interface MobileHeaderProps {
  conversation: Conversation | null
  onToggleSidebar: () => void
  onNewConversation: () => void
}

export default function MobileHeader({ 
  conversation, 
  onToggleSidebar, 
  onNewConversation 
}: MobileHeaderProps) {
  const getConversationIcon = (mode: string) => {
    if (mode === 'curriculum') return BookOpenIcon
    if (mode === 'ecom') return ShoppingBagIcon
    return ChatBubbleLeftRightIcon
  }

  const getConversationColor = (mode: string) => {
    if (mode === 'curriculum') return 'text-blue-600'
    if (mode === 'ecom') return 'text-purple-600'
    return 'text-green-600'
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

  const getMobileTitle = (title: string) => {
    return title.length > 25 ? title.substring(0, 25) + '...' : title
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
        >
          <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        {conversation ? (
          <div className="flex items-center gap-2 flex-1 px-3">
            {(() => {
              const IconComponent = getConversationIcon(conversation.mode)
              const iconColor = getConversationColor(conversation.mode)
              return (
                <div className="flex items-center gap-2 min-w-0">
                  <IconComponent className={iconColor + " w-5 h-5 flex-shrink-0"} />
                  <div className="min-w-0">
                    <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {getMobileTitle(getTitle(conversation))}
                    </h1>
                  </div>
                </div>
              )
            })()}
          </div>
        ) : (
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Kekoa Chat
            </h1>
          </div>
        )}

        <button
          onClick={onNewConversation}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
        >
          <PlusIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}
