'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatArea from '@/components/ChatArea'
import ModeSelection from '@/components/ModeSelection'
import MobileHeader from '@/components/MobileHeader'
import { Message, Conversation, ConversationMode, ConversationData } from '@/types'
import { getDefaultCurriculumStructure, getDefaultTikTokShopStructure, getDefaultGeneralChatStructure, getInitialMessage, getConversationTitle } from '@/lib/unifiedConversationEngine'

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [showModeSelection, setShowModeSelection] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
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
    } else if (mode === 'general') {
      data.generalChat = getDefaultGeneralChatStructure()
    }

    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: mode === 'curriculum' ? 'New Curriculum' : mode === 'ecom' ? 'New TikTok Shop' : 'General Chat',
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
    setSidebarOpen(false)
  }

  const updateConversation = (conversationId: string, updates: Partial<Conversation>) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          const updated = { ...c, ...updates, updatedAt: new Date() }
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
    setSidebarOpen(false)
  }

  const handleConversationSelect = (id: string) => {
    setActiveConversation(id)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Mobile Header - ALWAYS show on mobile */}
      <div className="block md:hidden fixed top-0 left-0 right-0 z-50">
        <MobileHeader 
          conversation={getCurrentConversation()}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewConversation={showNewConversationModal}
        />
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile unless open */}
      <div className={"fixed md:relative z-50 md:z-0 h-full w-80 transform transition-transform duration-300 ease-in-out md:transform-none " + (sidebarOpen ? "translate-x-0" : "-translate-x-full") + " md:translate-x-0"}>
        <Sidebar
          conversations={conversations}
          activeConversation={activeConversation}
          onConversationSelect={handleConversationSelect}
          onNewConversation={showNewConversationModal}
        />
      </div>

      {/* Main Chat Area - Full width on mobile, sidebar space on desktop */}
      <div className={"flex-1 flex flex-col min-w-0 " + (sidebarOpen ? "" : "pt-16") + " md:pt-0"}>
        <ChatArea
          conversation={getCurrentConversation()}
          onAddMessage={addMessage}
          onUpdateConversation={updateConversation}
        />
      </div>
      
      {/* Mode Selection Modal */}
      {showModeSelection && (
        <ModeSelection
          onModeSelect={createNewConversation}
          onClose={() => setShowModeSelection(false)}
        />
      )}
    </div>
  )
}
