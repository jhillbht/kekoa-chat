import { ConversationMode, ConversationData, Message, CurriculumStructure, TikTokShopStructure } from '@/types'
import { processUserMessage as processCurriculumMessage } from './conversationEngine'
import { processTikTokShopMessage } from './tiktokShopEngine'

interface UnifiedConversationResponse {
  response: string
  updatedData?: ConversationData
}

export async function processUnifiedMessage(
  userMessage: string,
  mode: ConversationMode,
  currentData: ConversationData,
  messageHistory: Message[]
): Promise<UnifiedConversationResponse> {
  
  if (mode === 'curriculum') {
    const curriculum = currentData.curriculum || getDefaultCurriculumStructure()
    const result = await processCurriculumMessage(userMessage, curriculum, messageHistory)
    
    return {
      response: result.response,
      updatedData: {
        ...currentData,
        curriculum: result.updatedCurriculum || curriculum
      }
    }
  } 
  
  if (mode === 'ecom') {
    const tiktokShop = currentData.tiktokShop || getDefaultTikTokShopStructure()
    const result = await processTikTokShopMessage(userMessage, tiktokShop, messageHistory)
    
    return {
      response: result.response,
      updatedData: {
        ...currentData,
        tiktokShop: result.updatedTikTokShop || tiktokShop
      }
    }
  }

  // Fallback
  return {
    response: "I'm not sure how to help with that. Please try again or select a different mode.",
    updatedData: currentData
  }
}

export function getDefaultCurriculumStructure(): CurriculumStructure {
  return {
    subject: '',
    targetAudience: '',
    duration: '',
    objectives: [],
    lessons: [],
    resources: [],
    assessments: []
  }
}

export function getDefaultTikTokShopStructure(): TikTokShopStructure {
  return {
    businessName: '',
    niche: '',
    targetAudience: '',
    products: [],
    contentStrategy: '',
    postingSchedule: '',
    marketingGoals: [],
    budget: '',
    competitorAnalysis: []
  }
}

export function getInitialMessage(mode: ConversationMode): string {
  if (mode === 'curriculum') {
    return "I'll help you design your curriculum. What subject or topic would you like to create learning content for?"
  }
  
  if (mode === 'ecom') {
    return "I'll help you build your TikTok Shop strategy! What's your business name or what products are you planning to sell?"
  }

  return "Hello! How can I help you today?"
}

export function getConversationTitle(mode: ConversationMode, data: ConversationData): string {
  if (mode === 'curriculum') {
    return data.curriculum?.subject || 'New Curriculum'
  }
  
  if (mode === 'ecom') {
    return data.tiktokShop?.businessName || 'New TikTok Shop'
  }

  return 'New Conversation'
}
