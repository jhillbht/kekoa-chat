'use client'

import { GeneralChatStructure } from '@/types'
import { 
  ChatBubbleLeftRightIcon, 
  LightBulbIcon, 
  BookmarkIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface GeneralChatSummaryProps {
  generalChat: GeneralChatStructure
}

export default function GeneralChatSummary({ generalChat }: GeneralChatSummaryProps) {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          Conversation Summary
        </h2>

        <div className="space-y-6">
          {/* Topic */}
          {generalChat.topic && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookmarkIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Current Topic
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {generalChat.topic}
                </div>
              </div>
            </div>
          )}

          {/* Conversation Summary */}
          {generalChat.conversationSummary && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Summary
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {generalChat.conversationSummary}
                </div>
              </div>
            </div>
          )}

          {/* Context */}
          {generalChat.context.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <SparklesIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Context ({generalChat.context.length})
                </div>
              </div>
              <div className="space-y-2">
                {generalChat.context.slice(-5).map((context, index) => (
                  <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {context}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Insights */}
          {generalChat.keyInsights.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LightBulbIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Key Insights ({generalChat.keyInsights.length})
                </div>
              </div>
              <ul className="space-y-2">
                {generalChat.keyInsights.slice(-5).map((insight, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up Questions */}
          {generalChat.followUpQuestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Follow-up Questions
                </div>
              </div>
              <div className="space-y-2">
                {generalChat.followUpQuestions.map((question, index) => (
                  <div key={index} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="text-sm text-green-700 dark:text-green-300">
                      {question}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences */}
          {generalChat.preferences.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookmarkIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Preferences ({generalChat.preferences.length})
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {generalChat.preferences.map((preference, index) => (
                  <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                    {preference}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!generalChat.topic && !generalChat.context.length && !generalChat.keyInsights.length && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <ChatBubbleLeftRightIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Your conversation insights will appear here as you chat
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
