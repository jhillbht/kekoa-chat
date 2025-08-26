'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatArea from '@/components/ChatArea'
import { Message, CurriculumConversation } from '@/types'

export default function Home() {
  const [conversations, setConversations] = useState<CurriculumConversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  
  const getCurrentConversation = () => {
    if (!activeConversation) return null
    return conversations.find(c => c.id === activeConversation) || null
  }

  const createNewConversation = () => {
    const newConversation: CurriculumConversation = {
      id: crypto.randomUUID(),
      title: 'New Curriculum',
      messages: [{
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'll help you design your curriculum. What subject or topic would you like to create learning content for?",
        timestamp: new Date()
      }],
      curriculum: {
        subject: '',
        targetAudience: '',
        duration: '',
        objectives: [],
        lessons: [],
        resources: [],
        assessments: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setConversations(prev => [newConversation, ...prev])
    setActiveConversation(newConversation.id)
  }

  const updateConversation = (conversationId: string, updates: Partial<CurriculumConversation>) => {
    setConversations(prev => 
      prev.map(c => 
        c.id === conversationId 
          ? { ...c, ...updates, updatedAt: new Date() }
          : c
      )
    )
  }

  const addMessage = (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }
    
    updateConversation(conversationId, {
      messages: [...(getCurrentConversation()?.messages || []), newMessage]
    })
  }

  return (
    <div className="flex h-screen claude-bg">
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onConversationSelect={setActiveConversation}
        onNewConversation={createNewConversation}
      />
      <ChatArea
        conversation={getCurrentConversation()}
        onAddMessage={addMessage}
        onUpdateConversation={updateConversation}
      />
    </div>
  )
}
