import { processUnifiedMessage, getDefaultCurriculumStructure, getDefaultTikTokShopStructure, getDefaultGeneralChatStructure, getInitialMessage, getConversationTitle } from '@/lib/unifiedConversationEngine'
import { ConversationData, Message } from '@/types'

describe('Unified Conversation Engine', () => {
  const initialMessage: Message = {
    id: '1',
    role: 'assistant',
    content: 'Initial message',
    timestamp: new Date()
  }

  test('should process curriculum messages', async () => {
    const data: ConversationData = {
      curriculum: getDefaultCurriculumStructure()
    }

    const result = await processUnifiedMessage(
      'I want to teach JavaScript to beginners',
      'curriculum',
      data,
      [initialMessage]
    )

    expect(result.updatedData?.curriculum?.subject).toBe('Javascript to beginners')
    expect(result.response).toContain('Perfect!')
  })

  test('should process general chat messages', async () => {
    const data: ConversationData = {
      generalChat: getDefaultGeneralChatStructure()
    }

    const result = await processUnifiedMessage(
      'I want to talk about artificial intelligence',
      'general',
      data,
      [initialMessage]
    )

    expect(result.updatedData?.generalChat?.topic).toBeTruthy()
    expect(result.response).toBeTruthy()
  })

  test('should process TikTok Shop messages', async () => {
    const data: ConversationData = {
      tiktokShop: getDefaultTikTokShopStructure()
    }

    const result = await processUnifiedMessage(
      'My skincare brand called GlowUp Beauty',
      'ecom',
      data,
      [initialMessage]
    )

    expect(result.updatedData?.tiktokShop?.businessName).toBe('My skincare brand called glowup beauty')
    expect(result.response).toContain('TikTok Shop')
  })

  test('should return default structures', () => {
    const curriculum = getDefaultCurriculumStructure()
    expect(curriculum.subject).toBe('')
    expect(curriculum.objectives).toEqual([])

    const tiktokShop = getDefaultTikTokShopStructure()
    expect(tiktokShop.businessName).toBe('')
    expect(tiktokShop.products).toEqual([])

    const generalChat = getDefaultGeneralChatStructure()
    expect(generalChat.topic).toBe('')
    expect(generalChat.context).toEqual([])
    expect(generalChat.keyInsights).toEqual([])
  })

  test('should generate correct initial messages', () => {
    const curriculumMessage = getInitialMessage('curriculum')
    expect(curriculumMessage).toContain('curriculum')
    expect(curriculumMessage).toContain('subject')

    const ecomMessage = getInitialMessage('ecom')
    expect(ecomMessage).toContain('TikTok Shop')
    expect(ecomMessage).toContain('business')

    const generalMessage = getInitialMessage('general')
    expect(generalMessage).toContain('chat')
    expect(generalMessage).toContain('anything')
  })

  test('should generate appropriate conversation titles', () => {
    const curriculumData: ConversationData = {
      curriculum: {
        subject: 'JavaScript Fundamentals',
        targetAudience: 'Beginners',
        duration: '8 weeks',
        objectives: [],
        lessons: [],
        resources: [],
        assessments: []
      }
    }

    const curriculumTitle = getConversationTitle('curriculum', curriculumData)
    expect(curriculumTitle).toBe('JavaScript Fundamentals')

    const ecomData: ConversationData = {
      tiktokShop: {
        businessName: 'GlowUp Beauty',
        niche: 'Skincare',
        targetAudience: 'Women 25-35',
        products: [],
        contentStrategy: '',
        postingSchedule: '',
        marketingGoals: [],
        budget: '',
        competitorAnalysis: []
      }
    }

    const ecomTitle = getConversationTitle('ecom', ecomData)
    expect(ecomTitle).toBe('GlowUp Beauty')

    const generalData: ConversationData = {
      generalChat: {
        topic: 'Machine Learning',
        context: [],
        preferences: [],
        conversationSummary: '',
        keyInsights: [],
        followUpQuestions: []
      }
    }

    const generalTitle = getConversationTitle('general', generalData)
    expect(generalTitle).toBe('Machine Learning')
  })

  test('should handle invalid mode gracefully', async () => {
    const data: ConversationData = {}

    const result = await processUnifiedMessage(
      'Hello',
      'invalid' as any,
      data,
      [initialMessage]
    )

    expect(result.response).toContain('not sure')
    expect(result.updatedData).toBe(data)
  })
})
