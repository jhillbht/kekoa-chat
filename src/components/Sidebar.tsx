'use client'

import { CurriculumConversation } from '@/types'
import { PlusIcon, BookOpenIcon } from '@heroicons/react/24/outline'

interface SidebarProps {
  conversations: CurriculumConversation[]
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
  return (
    <div className="w-80 claude-sidebar flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="font-medium">New Curriculum</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {conversations.map((conversation) => (
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
                <BookOpenIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {conversation.curriculum.subject || conversation.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {conversation.curriculum.targetAudience && 
                      `For ${conversation.curriculum.targetAudience}`
                    }
                    {conversation.curriculum.duration && 
                      ` • ${conversation.curriculum.duration}`
                    }
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {conversation.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {conversations.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <BookOpenIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">
              Start your first curriculum conversation
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Kekoa Chat v1.0
        </div>
      </div>
    </div>
  )
}
