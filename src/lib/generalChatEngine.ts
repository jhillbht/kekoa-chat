import { GeneralChatStructure, Message } from '@/types'

interface GeneralChatResponse {
  response: string
  updatedGeneralChat?: GeneralChatStructure
}

export async function processGeneralChatMessage(
  userMessage: string,
  currentGeneralChat: GeneralChatStructure,
  messageHistory: Message[]
): Promise<GeneralChatResponse> {
  const updatedGeneralChat = { ...currentGeneralChat }
  
  // Extract topic if not set
  if (!updatedGeneralChat.topic && messageHistory.length <= 2) {
    updatedGeneralChat.topic = extractTopicFromMessage(userMessage)
  }
  
  // Add context from the conversation
  const context = extractContextFromMessage(userMessage)
  if (context) {
    updatedGeneralChat.context = [...(updatedGeneralChat.context || []), context].slice(-10) // Keep last 10 contexts
  }
  
  // Generate insights
  const insights = generateInsights(userMessage, updatedGeneralChat.context)
  if (insights.length > 0) {
    updatedGeneralChat.keyInsights = [...(updatedGeneralChat.keyInsights || []), ...insights].slice(-15) // Keep last 15 insights
  }
  
  // Generate follow-up questions
  updatedGeneralChat.followUpQuestions = generateFollowUpQuestions(userMessage, updatedGeneralChat.topic)
  
  // Update conversation summary
  updatedGeneralChat.conversationSummary = generateConversationSummary(messageHistory, userMessage)
  
  // Generate response
  const response = generateGeneralChatResponse(userMessage, updatedGeneralChat, messageHistory)

  return {
    response,
    updatedGeneralChat
  }
}

function extractTopicFromMessage(message: string): string {
  // Simple topic extraction - in a real app, use more sophisticated NLP
  const cleaned = message.toLowerCase().trim()
  
  // Look for explicit topic statements
  const topicPatterns = [
    /(?:about|regarding|concerning|on the topic of|discussing)\s+(.+?)(?:\.|$|\?|!)/i,
    /(?:i want to talk about|let's discuss|tell me about)\s+(.+?)(?:\.|$|\?|!)/i,
    /(?:what do you think about|thoughts on)\s+(.+?)(?:\.|$|\?|!)/i
  ]
  
  for (const pattern of topicPatterns) {
    const match = message.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  // Extract key nouns as potential topics
  const words = cleaned.split(' ')
  const importantWords = words.filter(word => 
    word.length > 4 && 
    !['hello', 'thanks', 'please', 'would', 'could', 'should', 'think', 'about'].includes(word)
  )
  
  if (importantWords.length > 0) {
    return importantWords.slice(0, 3).join(' ')
  }
  
  return 'General Conversation'
}

function extractContextFromMessage(message: string): string {
  // Extract meaningful context from the message
  if (message.length < 10) return ''
  
  // Look for specific types of context
  const contextPatterns = [
    /i am (working on|building|creating|studying|learning|interested in) (.+)/i,
    /my (goal|objective|plan|idea|project) is (.+)/i,
    /i need help with (.+)/i,
    /i'm trying to (.+)/i,
    /the problem is (.+)/i,
    /what i want to do is (.+)/i
  ]
  
  for (const pattern of contextPatterns) {
    const match = message.match(pattern)
    if (match && match[match.length - 1]) {
      return match[match.length - 1].trim()
    }
  }
  
  // If no specific pattern, return first sentence if it's meaningful
  const sentences = message.split(/[.!?]/).filter(s => s.trim().length > 20)
  return sentences.length > 0 ? sentences[0].trim() : ''
}

function generateInsights(message: string, context: string[]): string[] {
  const insights: string[] = []
  
  // Pattern-based insight generation
  if (message.toLowerCase().includes('problem') || message.toLowerCase().includes('issue')) {
    insights.push('Problem-solving mode: User is working through challenges')
  }
  
  if (message.toLowerCase().includes('learn') || message.toLowerCase().includes('understand')) {
    insights.push('Learning mode: User is seeking knowledge and understanding')
  }
  
  if (message.toLowerCase().includes('create') || message.toLowerCase().includes('build') || message.toLowerCase().includes('make')) {
    insights.push('Creative mode: User is in a building/creating phase')
  }
  
  if (message.toLowerCase().includes('decide') || message.toLowerCase().includes('choose') || message.toLowerCase().includes('option')) {
    insights.push('Decision-making mode: User needs help with choices')
  }
  
  // Context-based insights
  if (context.length > 3) {
    insights.push('Engaged conversation: Multiple contexts being explored')
  }
  
  return insights
}

function generateFollowUpQuestions(message: string, topic: string): string[] {
  const questions: string[] = []
  
  // Generic follow-up questions based on message type
  if (message.includes('?')) {
    questions.push('Would you like me to elaborate on any part of my response?')
    questions.push('Is there a specific aspect you\'d like to explore further?')
  } else {
    questions.push('What would you like to know more about?')
    questions.push('How can I help you with this further?')
  }
  
  // Topic-specific questions
  if (topic && topic !== 'General Conversation') {
    questions.push(`Are there other aspects of ${topic} you\'d like to discuss?`)
  }
  
  questions.push('Is there anything else I can help you with?')
  
  return questions.slice(0, 3) // Limit to 3 questions
}

function generateConversationSummary(messageHistory: Message[], currentMessage: string): string {
  const userMessages = messageHistory.filter(m => m.role === 'user').length
  const topics = extractMainTopics(messageHistory)
  
  let summary = `Conversation with ${userMessages} user messages`
  
  if (topics.length > 0) {
    summary += `. Main topics: ${topics.slice(0, 3).join(', ')}`
  }
  
  if (currentMessage.length > 50) {
    summary += `. Current focus: ${currentMessage.substring(0, 50)}...`
  }
  
  return summary
}

function extractMainTopics(messageHistory: Message[]): string[] {
  const topics = new Set<string>()
  
  messageHistory.filter(m => m.role === 'user').forEach(message => {
    const words = message.content.toLowerCase().split(/\s+/)
    
    // Look for important nouns and concepts
    words.forEach(word => {
      if (word.length > 6 && !commonWords.includes(word)) {
        topics.add(word)
      }
    })
  })
  
  return Array.from(topics).slice(0, 5)
}

const commonWords = ['hello', 'thanks', 'please', 'would', 'could', 'should', 'think', 'about', 'something', 'anything', 'everything', 'nothing', 'someone', 'everyone', 'anyone', 'nobody']

function generateGeneralChatResponse(
  userMessage: string, 
  generalChat: GeneralChatStructure, 
  messageHistory: Message[]
): string {
  // Determine response type based on message characteristics
  const isQuestion = userMessage.includes('?')
  const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening)/i.test(userMessage)
  const isGoodbye = /^(bye|goodbye|see you|farewell|thanks|thank you)/i.test(userMessage)
  
  if (isGreeting && messageHistory.length <= 2) {
    return `Hello! I'm your general chat assistant. I'm here to help with any questions, have conversations, brainstorm ideas, or assist with whatever you need. What's on your mind today?`
  }
  
  if (isGoodbye) {
    return `Thank you for the great conversation! I enjoyed discussing ${generalChat.topic || 'various topics'} with you. Feel free to come back anytime you want to chat or need assistance. Take care!`
  }
  
  if (isQuestion) {
    return generateQuestionResponse(userMessage, generalChat)
  }
  
  // For statements, provide thoughtful engagement
  return generateStatementResponse(userMessage, generalChat)
}

function generateQuestionResponse(userMessage: string, generalChat: GeneralChatStructure): string {
  const questionType = analyzeQuestionType(userMessage)
  
  const responses: Record<string, string> = {
    how: `Great question! Let me break this down for you step by step...`,
    what: `That's an interesting question about ${generalChat.topic || 'this topic'}. Here's what I think...`,
    why: `That's a thoughtful "why" question. Let me explore the reasoning behind this...`,
    where: `For location or context questions like this, here's what I'd suggest...`,
    when: `Regarding timing and scheduling, here's my perspective...`,
    who: `When it comes to people or roles involved, here's what I'd consider...`,
    general: `That's a great question! Let me think through this with you...`
  }
  
  let baseResponse = responses[questionType] || responses.general
  
  // Add context if available
  if (generalChat.context.length > 0) {
    baseResponse += `\n\nGiven what we've discussed about ${generalChat.context.slice(-2).join(' and ')}, `
  }
  
  baseResponse += `\n\nI'd be happy to elaborate on any part of this or explore related aspects. What specific area interests you most?`
  
  return baseResponse
}

function generateStatementResponse(userMessage: string, generalChat: GeneralChatStructure): string {
  const sentiment = analyzeSentiment(userMessage)
  
  let response = ''
  
  if (sentiment === 'positive') {
    response = `That sounds really interesting! I can sense your enthusiasm about this. `
  } else if (sentiment === 'negative') {
    response = `I understand that can be challenging. Let me see if I can help you work through this. `
  } else {
    response = `I appreciate you sharing that with me. It's a thoughtful perspective. `
  }
  
  // Add topic-specific engagement
  if (generalChat.topic && generalChat.topic !== 'General Conversation') {
    response += `Building on our discussion about ${generalChat.topic}, `
  }
  
  response += `what aspects of this would you like to explore further? I'm here to help however I can.`
  
  // Add follow-up based on context
  if (generalChat.keyInsights.length > 0) {
    response += `\n\nBased on our conversation, I notice you're in a ${generalChat.keyInsights.slice(-1)[0].toLowerCase()}. `
  }
  
  return response
}

function analyzeQuestionType(question: string): string {
  const q = question.toLowerCase()
  if (q.startsWith('how')) return 'how'
  if (q.startsWith('what')) return 'what'  
  if (q.startsWith('why')) return 'why'
  if (q.startsWith('where')) return 'where'
  if (q.startsWith('when')) return 'when'
  if (q.startsWith('who')) return 'who'
  return 'general'
}

function analyzeSentiment(message: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['great', 'awesome', 'love', 'excellent', 'amazing', 'wonderful', 'fantastic', 'good', 'happy', 'excited']
  const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'horrible', 'sad', 'angry', 'frustrated', 'difficult', 'problem', 'issue']
  
  const words = message.toLowerCase().split(/\s+/)
  const positiveCount = words.filter(word => positiveWords.includes(word)).length
  const negativeCount = words.filter(word => negativeWords.includes(word)).length
  
  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}
