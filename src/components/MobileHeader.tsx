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
    return title.length > 20 ? title.substring(0, 20) + '...' : title
  }

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 safe-area-inset-top">
      <div className="flex items-center justify-between px-4 py-3 h-14">
        {/* Left: Hamburger Menu */}
        <button
          onClick={onToggleSidebar}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
          aria-label="Toggle menu"
        >
          <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Center: Current Conversation or App Title */}
        <div className="flex-1 flex items-center justify-center px-4 min-w-0">
          {conversation ? (
            <div className="flex items-center gap-2 min-w-0">
              {(() => {
                const IconComponent = getConversationIcon(conversation.mode)
                const iconColor = getConversationColor(conversation.mode)
                return (
                  <>
                    <IconComponent className={"w-5 h-5 flex-shrink-0 " + iconColor} />
                    <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {getMobileTitle(getTitle(conversation))}
                    </h1>
                  </>
                )
              })()}
            </div>
          ) : (
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Kekoa Chat
            </h1>
          )}
        </div>

        {/* Right: New Conversation Button */}
        <button
          onClick={onNewConversation}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
          aria-label="New conversation"
        >
          <PlusIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </header>
  )
}
