import { render, screen, fireEvent } from '@testing-library/react'
import MessageBubble from '@/components/MessageBubble'
import MessageInput from '@/components/MessageInput'
import { Message } from '@/types'

describe('MessageBubble Component', () => {
  const userMessage: Message = {
    id: '1',
    role: 'user',
    content: 'Hello, I want to create a curriculum',
    timestamp: new Date()
  }

  const assistantMessage: Message = {
    id: '2',
    role: 'assistant',
    content: 'I can help you with that!',
    timestamp: new Date()
  }

  test('renders user message correctly', () => {
    render(<MessageBubble message={userMessage} />)
    
    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.getByText('Hello, I want to create a curriculum')).toBeInTheDocument()
  })

  test('renders assistant message correctly', () => {
    render(<MessageBubble message={assistantMessage} />)
    
    expect(screen.getByText('Kekoa')).toBeInTheDocument()
    expect(screen.getByText('I can help you with that!')).toBeInTheDocument()
  })

  test('shows typing indicator', () => {
    render(<MessageBubble message={assistantMessage} isTyping={true} />)
    
    expect(screen.getByText('Thinking')).toBeInTheDocument()
  })
})

describe('MessageInput Component', () => {
  test('renders input field', () => {
    const mockSend = jest.fn()
    render(<MessageInput onSend={mockSend} />)
    
    expect(screen.getByPlaceholderText('Type your response here...')).toBeInTheDocument()
  })

  test('calls onSend when form is submitted', () => {
    const mockSend = jest.fn()
    render(<MessageInput onSend={mockSend} />)
    
    const input = screen.getByPlaceholderText('Type your response here...')
    const submitButton = screen.getByRole('button')
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(submitButton)
    
    expect(mockSend).toHaveBeenCalledWith('Test message')
  })

  test('prevents submission when disabled', () => {
    const mockSend = jest.fn()
    render(<MessageInput onSend={mockSend} disabled={true} />)
    
    const input = screen.getByPlaceholderText('Type your response here...')
    const submitButton = screen.getByRole('button')
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(submitButton)
    
    expect(mockSend).not.toHaveBeenCalled()
  })

  test('submits on Enter key press', () => {
    const mockSend = jest.fn()
    render(<MessageInput onSend={mockSend} />)
    
    const input = screen.getByPlaceholderText('Type your response here...')
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false })
    
    expect(mockSend).toHaveBeenCalledWith('Test message')
  })

  test('does not submit on Shift+Enter', () => {
    const mockSend = jest.fn()
    render(<MessageInput onSend={mockSend} />)
    
    const input = screen.getByPlaceholderText('Type your response here...')
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })
    
    expect(mockSend).not.toHaveBeenCalled()
  })
})
