import { CurriculumStructure, Message, Lesson, Resource, Assessment } from '@/types'

interface ConversationResponse {
  response: string
  updatedCurriculum?: CurriculumStructure
}

// Conversation flow states
enum ConversationStep {
  INITIAL = 'initial',
  SUBJECT_DEFINED = 'subject_defined',
  AUDIENCE_DEFINED = 'audience_defined',
  DURATION_DEFINED = 'duration_defined',
  OBJECTIVES_DEFINED = 'objectives_defined',
  LESSON_PLANNING = 'lesson_planning',
  RESOURCE_GATHERING = 'resource_gathering',
  ASSESSMENT_PLANNING = 'assessment_planning',
  COMPLETE = 'complete'
}

export async function processUserMessage(
  userMessage: string,
  currentCurriculum: CurriculumStructure,
  messageHistory: Message[]
): Promise<ConversationResponse> {
  const currentStep = determineCurrentStep(currentCurriculum, messageHistory)
  const updatedCurriculum = { ...currentCurriculum }
  
  let response = ''

  switch (currentStep) {
    case ConversationStep.INITIAL:
      // Extract subject from the message
      updatedCurriculum.subject = extractSubjectFromMessage(userMessage)
      response = generateSubjectResponse(updatedCurriculum.subject)
      break

    case ConversationStep.SUBJECT_DEFINED:
      // Extract target audience
      updatedCurriculum.targetAudience = extractAudienceFromMessage(userMessage)
      response = generateAudienceResponse(updatedCurriculum.targetAudience)
      break

    case ConversationStep.AUDIENCE_DEFINED:
      // Extract duration
      updatedCurriculum.duration = extractDurationFromMessage(userMessage)
      response = generateDurationResponse(updatedCurriculum.duration)
      break

    case ConversationStep.DURATION_DEFINED:
      // Extract learning objectives
      const objectives = extractObjectivesFromMessage(userMessage)
      updatedCurriculum.objectives = [...updatedCurriculum.objectives, ...objectives]
      response = generateObjectivesResponse(updatedCurriculum.objectives, updatedCurriculum.subject)
      break

    case ConversationStep.OBJECTIVES_DEFINED:
      // Start lesson planning
      const lessons = extractLessonsFromMessage(userMessage, updatedCurriculum)
      updatedCurriculum.lessons = [...updatedCurriculum.lessons, ...lessons]
      response = generateLessonPlanningResponse(updatedCurriculum)
      break

    case ConversationStep.LESSON_PLANNING:
      // Continue building lessons or move to resources
      if (userMessage.toLowerCase().includes('resource') || userMessage.toLowerCase().includes('material')) {
        const resources = extractResourcesFromMessage(userMessage)
        updatedCurriculum.resources = [...updatedCurriculum.resources, ...resources]
        response = generateResourceResponse(updatedCurriculum)
      } else {
        const moreLessons = extractLessonsFromMessage(userMessage, updatedCurriculum)
        updatedCurriculum.lessons = [...updatedCurriculum.lessons, ...moreLessons]
        response = generateContinuedLessonResponse(updatedCurriculum)
      }
      break

    case ConversationStep.RESOURCE_GATHERING:
      // Build resources or move to assessments
      if (userMessage.toLowerCase().includes('assess') || userMessage.toLowerCase().includes('test') || userMessage.toLowerCase().includes('grade')) {
        const assessments = extractAssessmentsFromMessage(userMessage)
        updatedCurriculum.assessments = [...updatedCurriculum.assessments, ...assessments]
        response = generateAssessmentResponse(updatedCurriculum)
      } else {
        const moreResources = extractResourcesFromMessage(userMessage)
        updatedCurriculum.resources = [...updatedCurriculum.resources, ...moreResources]
        response = generateContinuedResourceResponse(updatedCurriculum)
      }
      break

    case ConversationStep.ASSESSMENT_PLANNING:
      const moreAssessments = extractAssessmentsFromMessage(userMessage)
      updatedCurriculum.assessments = [...updatedCurriculum.assessments, ...moreAssessments]
      response = generateFinalResponse(updatedCurriculum)
      break

    default:
      response = generateGenericResponse(userMessage, updatedCurriculum)
  }

  return {
    response,
    updatedCurriculum
  }
}

function determineCurrentStep(curriculum: CurriculumStructure, messages: Message[]): ConversationStep {
  if (!curriculum.subject) return ConversationStep.INITIAL
  if (!curriculum.targetAudience) return ConversationStep.SUBJECT_DEFINED
  if (!curriculum.duration) return ConversationStep.AUDIENCE_DEFINED
  if (curriculum.objectives.length === 0) return ConversationStep.DURATION_DEFINED
  if (curriculum.lessons.length === 0) return ConversationStep.OBJECTIVES_DEFINED
  if (curriculum.resources.length === 0) return ConversationStep.LESSON_PLANNING
  if (curriculum.assessments.length === 0) return ConversationStep.RESOURCE_GATHERING
  return ConversationStep.ASSESSMENT_PLANNING
}

function extractSubjectFromMessage(message: string): string {
  // Simple extraction - in a real app, you'd use NLP
  const cleaned = message.toLowerCase()
    .replace(/^(i want to teach|i'm teaching|teaching|i need a curriculum for|curriculum for)/i, '')
    .replace(/^(about|on|for)\s+/i, '')
    .trim()
  
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

function extractAudienceFromMessage(message: string): string {
  return message.trim()
}

function extractDurationFromMessage(message: string): string {
  return message.trim()
}

function extractObjectivesFromMessage(message: string): string[] {
  // Split by common delimiters and clean up
  const objectives = message
    .split(/[,;\n]|and(?!\w)|\d+\.|\-/)
    .map(obj => obj.trim())
    .filter(obj => obj.length > 0 && obj.length < 200)
    .map(obj => obj.replace(/^(they should|students will|learners will|objectives?:?)/i, '').trim())
    .filter(obj => obj.length > 10)
  
  return objectives
}

function extractLessonsFromMessage(message: string, curriculum: CurriculumStructure): Lesson[] {
  const lessons: Lesson[] = []
  
  // Simple lesson extraction - in a real app, use more sophisticated NLP
  const lessonParts = message.split(/lesson \d+|week \d+|day \d+|session \d+/i)
  
  lessonParts.forEach((part, index) => {
    if (part.trim().length > 20) {
      lessons.push({
        id: crypto.randomUUID(),
        title: `Lesson ${curriculum.lessons.length + index + 1}`,
        description: part.trim().substring(0, 200),
        duration: '1 hour', // Default
        objectives: [],
        content: [part.trim()],
        activities: [],
        assessments: []
      })
    }
  })
  
  return lessons
}

function extractResourcesFromMessage(message: string): Resource[] {
  const resources: Resource[] = []
  
  // Extract URLs
  const urlRegex = /https?:\/\/[^\s]+/g
  const urls = message.match(urlRegex) || []
  
  urls.forEach(url => {
    resources.push({
      id: crypto.randomUUID(),
      title: 'External Resource',
      type: 'link',
      url: url,
      description: 'Resource mentioned in conversation'
    })
  })
  
  // Extract book/video references
  const bookRegex = /"([^"]+)"|'([^']+)'/g
  let match
  while ((match = bookRegex.exec(message)) !== null) {
    const title = match[1] || match[2]
    if (title && title.length > 3) {
      resources.push({
        id: crypto.randomUUID(),
        title: title,
        type: message.toLowerCase().includes('video') ? 'video' : 'book',
        description: 'Recommended resource'
      })
    }
  }
  
  return resources
}

function extractAssessmentsFromMessage(message: string): Assessment[] {
  const assessments: Assessment[] = []
  
  // Simple assessment extraction
  const assessmentTypes = ['quiz', 'test', 'exam', 'assignment', 'project', 'presentation']
  
  assessmentTypes.forEach(type => {
    if (message.toLowerCase().includes(type)) {
      assessments.push({
        id: crypto.randomUUID(),
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Assessment`,
        type: type as any,
        description: `Assessment mentioned in conversation`,
        points: 100
      })
    }
  })
  
  return assessments
}

function generateSubjectResponse(subject: string): string {
  return `Perfect! I'll help you create a curriculum for ${subject}. 

To design the most effective learning experience, I need to understand your context better:

Who is your target audience? For example:
- Age group or grade level
- Prior knowledge or experience level
- Professional background
- Any specific learning needs`
}

function generateAudienceResponse(audience: string): string {
  return `Great! So we're designing this for ${audience}. 

Now, what's your timeframe? This helps me structure the curriculum appropriately:
- How many weeks or months do you have?
- How many hours per week?
- Are these daily sessions, weekly classes, or a different schedule?`
}

function generateDurationResponse(duration: string): string {
  return `Excellent! With ${duration}, we can create a well-structured curriculum.

What should your learners be able to do by the end of this curriculum? Please share your learning objectives or goals. For example:
- Specific skills they should master
- Knowledge they should gain
- Projects they should be able to complete
- Real-world applications they should understand`
}

function generateObjectivesResponse(objectives: string[], subject: string): string {
  return `Perfect! These learning objectives will guide our curriculum design:

${objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

Now let's break this down into lessons. Based on your objectives and timeframe, what key topics or modules should we cover? 

You can describe them however feels natural - I'll help organize them into a structured lesson plan.`
}

function generateLessonPlanningResponse(curriculum: CurriculumStructure): string {
  return `Great start! I can see the curriculum taking shape.

Current lessons:
${curriculum.lessons.map((lesson, i) => `${i + 1}. ${lesson.title}: ${lesson.description}`).join('\n')}

Would you like to:
- Add more lessons or topics
- Define specific activities for these lessons
- Move on to discuss resources and materials
- Plan assessments and evaluations

Just let me know what you'd like to focus on next!`
}

function generateResourceResponse(curriculum: CurriculumStructure): string {
  return `Excellent! Resources are crucial for effective learning.

Current resources:
${curriculum.resources.map((resource, i) => `${i + 1}. ${resource.title} (${resource.type})`).join('\n')}

What other learning materials do you need? Consider:
- Textbooks or reading materials
- Online courses or videos
- Software or tools
- Hands-on materials or equipment
- Reference guides`
}

function generateContinuedResourceResponse(curriculum: CurriculumStructure): string {
  return `Added to your resource list! 

Would you like to:
- Add more resources
- Move on to plan assessments and evaluations
- Review and refine what we've built so far
- Export your curriculum`
}

function generateAssessmentResponse(curriculum: CurriculumStructure): string {
  return `Perfect! Assessment planning is key to measuring learning success.

Current assessments:
${curriculum.assessments.map((assessment, i) => `${i + 1}. ${assessment.title} (${assessment.type})`).join('\n')}

Would you like to add more assessments or are you ready to review your complete curriculum?`
}

function generateFinalResponse(curriculum: CurriculumStructure): string {
  return `Excellent work! Your curriculum for "${curriculum.subject}" is really coming together.

**Summary:**
- **Subject:** ${curriculum.subject}
- **Audience:** ${curriculum.targetAudience}
- **Duration:** ${curriculum.duration}
- **Lessons:** ${curriculum.lessons.length} planned
- **Resources:** ${curriculum.resources.length} identified
- **Assessments:** ${curriculum.assessments.length} designed

Your curriculum is ready! You can:
- Review the complete curriculum in the sidebar
- Make any final adjustments
- Export to share with others
- Start a new curriculum conversation

Is there anything you'd like to refine or add?`
}

function generateContinuedLessonResponse(curriculum: CurriculumStructure): string {
  return `Added to your lesson plan!

Current lessons (${curriculum.lessons.length}):
${curriculum.lessons.slice(-3).map((lesson, i) => `${curriculum.lessons.length - 2 + i}. ${lesson.title}`).join('\n')}

Continue adding lessons or let me know when you're ready to discuss resources and materials.`
}

function generateGenericResponse(message: string, curriculum: CurriculumStructure): string {
  return `I understand. Let me help you with that aspect of your ${curriculum.subject} curriculum.

Based on what you've shared, I can help you:
- Refine your existing content
- Add new elements to the curriculum
- Reorganize the structure
- Plan implementation details

What specific aspect would you like to work on?`
}
