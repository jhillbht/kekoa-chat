export type ConversationMode = 'curriculum' | 'ecom' | 'general'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  objectives: string[]
  content: string[]
  activities: string[]
  assessments: string[]
}

export interface Resource {
  id: string
  title: string
  type: 'link' | 'file' | 'book' | 'video' | 'article'
  url?: string
  description?: string
}

export interface Assessment {
  id: string
  title: string
  type: 'quiz' | 'assignment' | 'project' | 'exam' | 'presentation'
  description: string
  points?: number
  duration?: string
}

export interface CurriculumStructure {
  subject: string
  targetAudience: string
  duration: string
  objectives: string[]
  lessons: Lesson[]
  resources: Resource[]
  assessments: Assessment[]
}

export interface TikTokProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  targetAudience: string
  keywords: string[]
  contentIdeas: string[]
  hooks: string[]
  callToActions: string[]
}

export interface TikTokShopStructure {
  businessName: string
  niche: string
  targetAudience: string
  products: TikTokProduct[]
  contentStrategy: string
  postingSchedule: string
  marketingGoals: string[]
  budget: string
  competitorAnalysis: string[]
}

export interface GeneralChatStructure {
  topic: string
  context: string[]
  preferences: string[]
  conversationSummary: string
  keyInsights: string[]
  followUpQuestions: string[]
}

export interface ConversationData {
  curriculum?: CurriculumStructure
  tiktokShop?: TikTokShopStructure
  generalChat?: GeneralChatStructure
}

export interface Conversation {
  id: string
  title: string
  mode: ConversationMode
  messages: Message[]
  data: ConversationData
  createdAt: Date
  updatedAt: Date
}

// Legacy type for backward compatibility
export interface CurriculumConversation extends Conversation {
  curriculum: CurriculumStructure
}

export interface ConversationFlow {
  currentStep: string
  completedSteps: string[]
  nextQuestions: string[]
  context: Record<string, any>
}
