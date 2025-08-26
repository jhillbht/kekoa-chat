'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatArea from '@/components/ChatArea'
import ModeSelection from '@/components/ModeSelection'
import { Message, Conversation, ConversationMode, ConversationData } from '@/types'
import { getDefaultCurriculumStructure, getDefaultTikTokShopStructure, getInitialMessage, getConversationTitle } from '@/lib/unifiedConversationEngine'

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [showModeSelection, setShowModeSelection] = useState(false)
  
  const getCurrentConversation = () => {
    if (!activeConversation) return null
    return conversations.find(c => c.id === activeConversation) || null
  }

  const createNewConversation = (mode: ConversationMode) => {
    const data: ConversationData = {}
    
    if (mode === 'curriculum') {
      data.curriculum = getDefaultCurriculumStructure()
    } else if (mode === 'ecom') {
      data.tiktokShop = getDefaultTikTokShopStructure()
    }

    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: mode === 'curriculum' ? 'New Curriculum' : 'New TikTok Shop',
      mode: mode,
      messages: [{
        id: crypto.randomUUID(),
        role: 'assistant',
        content: getInitialMessage(mode),
        timestamp: new Date()
      }],
      data: data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setConversations(prev => [newConversation, ...prev])
    setActiveConversation(newConversation.id)
    setShowModeSelection(false)
  }

  const updateConversation = (conversationId: string, updates: Partial<Conversation>) => {
    setConversations(prev => 
      prev.map(c => {
        if (c.id === conversationId) {
          const updated = { ...c, ...updates, updatedAt: new Date() }
          // Update title based on data
          if (updates.data) {
            updated.title = getConversationTitle(c.mode, updates.data)
          }
          return updated
        }
        return c
      })
    )
  }

  const addMessage = (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }
    
    const conversation = getCurrentConversation()
    if (conversation) {
      updateConversation(conversationId, {
        messages: [...conversation.messages, newMessage]
      })
    }
  }

  const showNewConversationModal = () => {
    setShowModeSelection(true)
  }

  return (
    <div className="flex h-screen claude-bg">
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onConversationSelect={setActiveConversation}
        onNewConversation={showNewConversationModal}
      />
      <ChatArea
        conversation={getCurrentConversation()}
        onAddMessage={addMessage}
        onUpdateConversation={updateConversation}
      />
      
      {showModeSelection && (
        <ModeSelection
          onModeSelect={createNewConversation}
          onClose={() => setShowModeSelection(false)}
        />
      )}
    </div>
  )
}
