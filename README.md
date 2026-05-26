# VedaAI - Assessment Creator

A full-stack AI-powered application that helps teachers create professional question papers using artificial intelligence. Generate custom assignments with varied difficulty levels, question types, and automatically formatted outputs.

## 🎯 Features

### Core Features
- **Assignment Creation**: Intuitive form to define assignments with customizable parameters
- **AI Question Generation**: Claude-powered question generation with structured output
- **Professional Output**: Well-formatted question paper with proper hierarchy and styling
- **Real-time Updates**: WebSocket integration for live generation progress
- **PDF Export**: Download question papers as professionally formatted PDFs

### Technical Features
- **Full-Stack Monorepo**: Frontend (Next.js) and Backend (Express) in single repository
- **Type-Safe**: Complete TypeScript implementation across frontend and backend
- **Message Queuing**: BullMQ for reliable background job processing
- **Caching Layer**: Redis for performance optimization
- **WebSocket Support**: Real-time bidirectional communication
- **Responsive Design**: Mobile-first UI using Tailwind CSS

## 🏗️ Architecture

```
VedaAI/
├── apps/
│   ├── frontend/          # Next.js + TypeScript + Zustand
│   └── backend/           # Express + TypeScript + MongoDB
├── package.json           # Root workspace configuration
└── README.md
```

### Backend Architecture
- **Express Server**: RESTful API with WebSocket support
- **MongoDB**: Persistent data storage for assignments and papers
- **Redis**: Session management and caching
- **BullMQ**: Background job queue for AI generation
- **Anthropic Claude**: AI model for question generation

### Frontend Architecture
- **Next.js 14**: Modern React framework with App Router
- **Zustand**: Lightweight state management
- **Socket.io Client**: Real-time WebSocket communication
- **Tailwind CSS**: Utility-first styling
- **jsPDF/html2canvas**: PDF generation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Anthropic API key

### Setup Instructions

1. **Clone and Install Dependencies**
```bash
cd VedhaAI
npm install
```

2. **Configure Environment Variables**

Backend (`.env` in `apps/backend/`):
```bash
cp apps/backend/.env.example apps/backend/.env
# Edit .env and add:
# - MONGODB_URI
# - REDIS_URL
# - ANTHROPIC_API_KEY
# - FRONTEND_URL
```

Frontend (`.env.local` in `apps/frontend/`):
```bash
cp apps/frontend/.env.example apps/frontend/.env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. **Start Development Servers**
```bash
# Terminal 1: Backend
npm run backend:dev

# Terminal 2: Frontend  
npm run frontend:dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api

## 📖 API Endpoints

### Assignments
- `POST /api/assignments` - Create new assignment
- `GET /api/assignments` - List all assignments
- `GET /api/assignments/:id` - Get specific assignment
- `DELETE /api/assignments/:id` - Delete assignment

### Question Generation
- `POST /api/assignments/:assignmentId/generate` - Start AI generation

### Question Papers
- `GET /api/question-papers/:paperId` - Get generated paper

## 🤖 AI Integration

The system uses Anthropic's Claude model to generate questions. The prompt engineering follows these principles:

1. **Structured Prompts**: Detailed instructions for consistent output
2. **JSON Response Format**: Ensures reliable parsing
3. **Difficulty Distribution**: Automatic calculation based on parameters
4. **Section Organization**: Automatic grouping into logical sections
5. **Type Variation**: Support for multiple question types

Example request:
```json
{
  "topic": "Photosynthesis",
  "numberOfQuestions": 10,
  "questionTypes": ["multiple-choice", "short-answer"],
  "totalMarks": 50,
  "difficulty": "mixed",
  "additionalInstructions": "Focus on practical applications"
}
```

## 📊 Database Schema

### Assignments Collection
```typescript
{
  id: string;
  title: string;
  topic: string;
  dueDate: Date;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  questionsGenerated: boolean;
  questionPaperId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Question Papers Collection
```typescript
{
  id: string;
  assignmentId: string;
  sections: [{
    title: string;
    instruction: string;
    questions: [{
      id: string;
      text: string;
      difficulty: 'Easy' | 'Moderate' | 'Hard';
      marks: number;
      type: string;
    }];
  }];
  totalMarks: number;
  generatedAt: Date;
}
```

## 🔄 Generation Flow

```
1. User creates assignment
   ↓
2. Form validation & database storage
   ↓
3. Generation job added to BullMQ queue
   ↓
4. Worker picks up job from queue
   ↓
5. AI generates questions with prompt engineering
   ↓
6. Parse and structure response
   ↓
7. Save to MongoDB
   ↓
8. Emit WebSocket event to client
   ↓
9. Frontend displays formatted paper
   ↓
10. User can download as PDF
```

## 🎨 UI Components

- **CreateAssignmentForm**: Multi-step form with validation
- **QuestionPaperDisplay**: Professional paper formatting with proper hierarchy
- **LoadingSpinner**: Real-time generation progress indicator
- **Select**: Custom select component with multi-select support
- **Responsive Grid**: Mobile-first responsive layout

## 🧪 Development Best Practices

### Code Organization
- Separate concerns: controllers, services, models
- Type safety with TypeScript
- Reusable utilities and hooks
- Clean component structure

### Performance
- Redis caching for generated papers
- BullMQ job retry logic
- Pagination for assignments list
- Code splitting in Next.js

### Error Handling
- Comprehensive error messages
- Try-catch blocks in async operations
- User-friendly error UI
- Server-side logging

## 📦 Build & Deployment

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## 🔐 Security Features

- Environment variable protection
- CORS configuration
- Input validation with Zod
- Error sanitization (no sensitive data in responses)
- Secure session management with Redis

## 🚦 Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## 📝 Future Enhancements

- Multiple AI model support (GPT-4, Gemini)
- Custom branding for exported PDFs
- Question bank storage and reuse
- Bulk assignment creation
- Analytics and reporting
- Collaborative assignment creation
- Question import/export functionality
- Mobile app version

## 🤝 Contributing

Contributions are welcome! Please ensure:
- TypeScript strict mode compliance
- Comprehensive error handling
- Unit tests for critical functions
- Clear commit messages

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Built as a full-stack engineering assignment with focus on:
- Clean architecture
- Professional UI/UX
- AI integration
- Production-ready code
- Scalable infrastructure

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review error messages carefully
3. Check backend logs: `console.log()` and Winston logger
4. Verify environment variables are set correctly

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Socket.io Documentation](https://socket.io/docs/)
