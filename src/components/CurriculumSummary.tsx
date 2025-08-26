'use client'

import { CurriculumStructure } from '@/types'
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  ClockIcon,
  CheckBadgeIcon,
  DocumentTextIcon,
  LinkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface CurriculumSummaryProps {
  curriculum: CurriculumStructure
}

export default function CurriculumSummary({ curriculum }: CurriculumSummaryProps) {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5" />
          Curriculum Overview
        </h2>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <BookOpenIcon className="w-4 h-4 mt-1 text-gray-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Subject</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {curriculum.subject || 'Not specified'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <UserGroupIcon className="w-4 h-4 mt-1 text-gray-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Target Audience</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {curriculum.targetAudience || 'Not specified'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ClockIcon className="w-4 h-4 mt-1 text-gray-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Duration</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {curriculum.duration || 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          {curriculum.objectives.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckBadgeIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Learning Objectives
                </div>
              </div>
              <ul className="space-y-2">
                {curriculum.objectives.map((objective, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lessons */}
          {curriculum.lessons.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Lessons ({curriculum.lessons.length})
                </div>
              </div>
              <div className="space-y-2">
                {curriculum.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {index + 1}. {lesson.title}
                    </div>
                    {lesson.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {lesson.description}
                      </div>
                    )}
                    {lesson.duration && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Duration: {lesson.duration}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {curriculum.resources.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Resources ({curriculum.resources.length})
                </div>
              </div>
              <div className="space-y-2">
                {curriculum.resources.map((resource) => (
                  <div key={resource.id} className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {resource.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {resource.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessments */}
          {curriculum.assessments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ChartBarIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Assessments ({curriculum.assessments.length})
                </div>
              </div>
              <div className="space-y-2">
                {curriculum.assessments.map((assessment) => (
                  <div key={assessment.id} className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {assessment.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {assessment.type}
                      {assessment.points && ` • ${assessment.points} points`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!curriculum.subject && !curriculum.objectives.length && !curriculum.lessons.length && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <BookOpenIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Your curriculum will appear here as you chat
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
