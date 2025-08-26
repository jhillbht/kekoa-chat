import '@testing-library/jest-dom'

// Mock crypto.randomUUID for testing
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(2, 15)
  }
})
