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

export interface CurriculumConversation {
  id: string
  title: string
  messages: Message[]
  curriculum: CurriculumStructure
  createdAt: Date
  updatedAt: Date
}

export interface ConversationFlow {
  currentStep: string
  completedSteps: string[]
  nextQuestions: string[]
  context: Record<string, any>
}
