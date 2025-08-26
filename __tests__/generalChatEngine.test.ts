import { processGeneralChatMessage } from '@/lib/generalChatEngine'
import { GeneralChatStructure, Message } from '@/types'

describe('General Chat Engine', () => {
  const initialGeneralChat: GeneralChatStructure = {
    topic: '',
    context: [],
    preferences: [],
    conversationSummary: '',
    keyInsights: [],
    followUpQuestions: []
  }

  const initialMessage: Message = {
    id: '1',
    role: 'assistant',
    content: 'Initial message',
    timestamp: new Date()
  }

  test('should extract topic from initial message', async () => {
    const result = await processGeneralChatMessage(
      'I want to talk about artificial intelligence and machine learning',
      initialGeneralChat,
      [initialMessage]
    )

    expect(result.updatedGeneralChat?.topic).toBeTruthy()
    expect(result.response).toBeTruthy()
    expect(result.response).toContain('appreciate')
  })

  test('should handle questions appropriately', async () => {
    const result = await processGeneralChatMessage(
      'What do you think about the future of technology?',
      { ...initialGeneralChat, topic: 'Technology' },
      [initialMessage]
    )

    expect(result.response).toBeTruthy()
    expect(result.updatedGeneralChat?.followUpQuestions).toBeDefined()
    expect(result.updatedGeneralChat?.followUpQuestions.length).toBeGreaterThan(0)
  })

  test('should handle statements and provide engagement', async () => {
    const result = await processGeneralChatMessage(
      'I am working on a new project that involves machine learning',
      { ...initialGeneralChat, topic: 'Technology' },
      [initialMessage]
    )

    expect(result.response).toBeTruthy()
    expect(result.updatedGeneralChat?.context.length).toBeGreaterThan(0)
  })

  test('should generate insights based on message content', async () => {
    const result = await processGeneralChatMessage(
      'I need help solving a problem with my code',
      { ...initialGeneralChat, topic: 'Programming' },
      [initialMessage]
    )

    expect(result.updatedGeneralChat?.keyInsights.length).toBeGreaterThan(0)
    expect(result.updatedGeneralChat?.keyInsights[0]).toContain('Problem-solving mode')
  })

  test('should handle greetings', async () => {
    const result = await processGeneralChatMessage(
      'Hello there!',
      initialGeneralChat,
      [initialMessage]
    )

    expect(result.response).toContain('Hello!')
    expect(result.response).toContain('general chat assistant')
  })

  test('should handle goodbyes', async () => {
    const chatWithTopic = {
      ...initialGeneralChat,
      topic: 'Machine Learning'
    }

    const result = await processGeneralChatMessage(
      'Thank you for the help!',
      chatWithTopic,
      [initialMessage]
    )

    expect(result.response).toContain('Thank you')
    expect(result.response).toContain('Machine Learning')
  })

  test('should maintain conversation summary', async () => {
    const messages: Message[] = [
      initialMessage,
      { id: '2', role: 'user', content: 'Hello', timestamp: new Date() },
      { id: '3', role: 'assistant', content: 'Hi there!', timestamp: new Date() }
    ]

    const result = await processGeneralChatMessage(
      'Tell me about programming',
      { ...initialGeneralChat, topic: 'Programming' },
      messages
    )

    expect(result.updatedGeneralChat?.conversationSummary).toBeTruthy()
    expect(result.updatedGeneralChat?.conversationSummary).toContain('Conversation')
  })

  test('should handle empty messages gracefully', async () => {
    const result = await processGeneralChatMessage(
      '',
      initialGeneralChat,
      [initialMessage]
    )

    expect(result.response).toBeTruthy()
    expect(result.updatedGeneralChat).toBeDefined()
  })

  test('should detect learning mode', async () => {
    const result = await processGeneralChatMessage(
      'I want to learn about React development',
      { ...initialGeneralChat, topic: 'React' },
      [initialMessage]
    )

    expect(result.updatedGeneralChat?.keyInsights).toContain('Learning mode: User is seeking knowledge and understanding')
  })

  test('should detect creative mode', async () => {
    const result = await processGeneralChatMessage(
      'I want to create a new mobile app',
      { ...initialGeneralChat, topic: 'App Development' },
      [initialMessage]
    )

    expect(result.updatedGeneralChat?.keyInsights).toContain('Creative mode: User is in a building/creating phase')
  })
})
