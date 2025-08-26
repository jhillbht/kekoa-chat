'use client'

import { TikTokShopStructure } from '@/types'
import { 
  ShoppingBagIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  SparklesIcon,
  CalendarIcon,
  ChartBarIcon,
  EyeIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface TikTokShopSummaryProps {
  tiktokShop: TikTokShopStructure
}

export default function TikTokShopSummary({ tiktokShop }: TikTokShopSummaryProps) {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <ShoppingBagIcon className="w-5 h-5" />
          TikTok Shop Strategy
        </h2>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <ShoppingBagIcon className="w-4 h-4 mt-1 text-gray-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Business Name</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {tiktokShop.businessName || 'Not specified'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <TagIcon className="w-4 h-4 mt-1 text-gray-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Niche</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {tiktokShop.niche || 'Not specified'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <UserGroupIcon className="w-4 h-4 mt-1 text-gray-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Target Audience</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {tiktokShop.targetAudience || 'Not specified'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CurrencyDollarIcon className="w-4 h-4 mt-1 text-gray-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Budget</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {tiktokShop.budget || 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          {tiktokShop.products.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBagIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Products ({tiktokShop.products.length})
                </div>
              </div>
              <div className="space-y-2">
                {tiktokShop.products.map((product, index) => (
                  <div key={product.id} className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {index + 1}. {product.name}
                    </div>
                    {product.price > 0 && (
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                        ${product.price}
                      </div>
                    )}
                    {product.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {product.description.substring(0, 80)}...
                      </div>
                    )}
                    {product.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.keywords.slice(0, 3).map((keyword, i) => (
                          <span key={i} className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Strategy */}
          {tiktokShop.contentStrategy && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <SparklesIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Content Strategy
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {tiktokShop.contentStrategy}
                </div>
              </div>
            </div>
          )}

          {/* Posting Schedule */}
          {tiktokShop.postingSchedule && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Posting Schedule
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {tiktokShop.postingSchedule}
                </div>
              </div>
            </div>
          )}

          {/* Marketing Goals */}
          {tiktokShop.marketingGoals.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ChartBarIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Marketing Goals ({tiktokShop.marketingGoals.length})
                </div>
              </div>
              <ul className="space-y-2">
                {tiktokShop.marketingGoals.map((goal, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Competitor Analysis */}
          {tiktokShop.competitorAnalysis.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <EyeIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Competitors ({tiktokShop.competitorAnalysis.length})
                </div>
              </div>
              <div className="space-y-2">
                {tiktokShop.competitorAnalysis.map((competitor, index) => (
                  <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-2">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {competitor}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!tiktokShop.businessName && !tiktokShop.niche && !tiktokShop.products.length && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <ShoppingBagIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Your TikTok Shop strategy will appear here as you chat
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
