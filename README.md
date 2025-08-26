# Kekoa Chat - Curriculum Designer

A conversational curriculum design tool that looks and feels like Claude Chat. Design curricula, lesson plans, and learning workflows through natural conversation.

## Features

- **Claude-like Interface**: Familiar chat interface for intuitive curriculum design
- **Conversational Design**: Build curricula through guided conversations instead of complex forms
- **Progressive Building**: Curriculum structure develops naturally through chat
- **Live Preview**: See your curriculum building in real-time
- **Export Options**: Multiple format support for sharing and implementation

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Click "New Curriculum" to start a conversation
2. Answer guided questions about your curriculum
3. Watch as your curriculum structure builds automatically
4. Review and refine using the sidebar preview
5. Export your completed curriculum

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── Sidebar.tsx     # Conversation history
│   ├── ChatArea.tsx    # Main chat interface
│   ├── MessageBubble.tsx
│   ├── MessageInput.tsx
│   └── CurriculumSummary.tsx
├── lib/                # Utilities and logic
│   └── conversationEngine.ts
└── types/              # TypeScript definitions
```

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS (Claude-inspired design)
- **Icons**: Heroicons
- **State**: React Hooks

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
