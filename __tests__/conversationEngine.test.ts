import { processUserMessage } from '@/lib/conversationEngine'
import { CurriculumStructure, Message } from '@/types'

describe('Conversation Engine', () => {
  const initialCurriculum: CurriculumStructure = {
    subject: '',
    targetAudience: '',
    duration: '',
    objectives: [],
    lessons: [],
    resources: [],
    assessments: []
  }

  const initialMessage: Message = {
    id: '1',
    role: 'assistant',
    content: 'Initial message',
    timestamp: new Date()
  }

  test('should extract subject from initial message', async () => {
    const result = await processUserMessage(
      'I want to teach JavaScript to beginners',
      initialCurriculum,
      [initialMessage]
    )

    expect(result.updatedCurriculum?.subject).toBe('Javascript to beginners')
    expect(result.response).toContain('Perfect!')
    expect(result.response).toContain('target audience')
  })

  test('should extract target audience', async () => {
    const curriculumWithSubject = {
      ...initialCurriculum,
      subject: 'JavaScript'
    }

    const result = await processUserMessage(
      'Complete beginners with no programming experience',
      curriculumWithSubject,
      [initialMessage]
    )

    expect(result.updatedCurriculum?.targetAudience).toBe('Complete beginners with no programming experience')
    expect(result.response).toContain('timeframe')
  })

  test('should extract duration', async () => {
    const curriculumWithSubjectAndAudience = {
      ...initialCurriculum,
      subject: 'JavaScript',
      targetAudience: 'Beginners'
    }

    const result = await processUserMessage(
      '8 weeks, 2 hours per week',
      curriculumWithSubjectAndAudience,
      [initialMessage]
    )

    expect(result.updatedCurriculum?.duration).toBe('8 weeks, 2 hours per week')
    expect(result.response).toContain('learning objectives')
  })

  test('should extract learning objectives', async () => {
    const curriculumWithBasics = {
      ...initialCurriculum,
      subject: 'JavaScript',
      targetAudience: 'Beginners',
      duration: '8 weeks'
    }

    const result = await processUserMessage(
      'Students should understand variables and functions, learn DOM manipulation, build a simple web app',
      curriculumWithBasics,
      [initialMessage]
    )

    expect(result.updatedCurriculum?.objectives.length).toBeGreaterThan(0)
    expect(result.response).toContain('lessons')
  })

  test('should handle empty messages gracefully', async () => {
    const result = await processUserMessage(
      '',
      initialCurriculum,
      [initialMessage]
    )

    expect(result.response).toBeTruthy()
    expect(result.updatedCurriculum).toBeDefined()
  })

  test('should handle very long messages', async () => {
    const longMessage = 'a'.repeat(1000)
    
    const result = await processUserMessage(
      longMessage,
      initialCurriculum,
      [initialMessage]
    )

    expect(result.response).toBeTruthy()
    expect(result.updatedCurriculum).toBeDefined()
  })
})
