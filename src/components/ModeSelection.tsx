'use client'

import { ConversationMode } from '@/types'
import { BookOpenIcon, ShoppingBagIcon, SparklesIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

interface ModeSelectionProps {
  onModeSelect: (mode: ConversationMode) => void
  onClose: () => void
}

export default function ModeSelection({ onModeSelect, onClose }: ModeSelectionProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="text-center mb-6">
          <SparklesIcon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Choose Your Assistant Mode
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            What would you like to create today?
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onModeSelect('curriculum')}
            className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
          >
            <div className="flex items-start gap-4">
              <BookOpenIcon className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Course & Curriculum Designer
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Create educational curricula, lesson plans, and learning experiences through guided conversation
                </p>
                <div className="mt-2">
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                    Education
                  </span>
                  <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full ml-2">
                    Course Selling
                  </span>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onModeSelect('general')}
            className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
          >
            <div className="flex items-start gap-4">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  General Chat Assistant
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Open-ended conversations, brainstorming, Q&A, and general assistance on any topic
                </p>
                <div className="mt-2">
                  <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                    General AI
                  </span>
                  <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded-full ml-2">
                    Any Topic
                  </span>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onModeSelect('ecom')}
            className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
          >
            <div className="flex items-start gap-4">
              <ShoppingBagIcon className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  TikTok Shop Strategist
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Build your TikTok Shop strategy, plan products, content, and marketing campaigns
                </p>
                <div className="mt-2">
                  <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
                    E-commerce
                  </span>
                  <span className="inline-block bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 text-xs px-2 py-1 rounded-full ml-2">
                    TikTok Marketing
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
