# AI Interview Preparation Assistant - Setup Guide

## ✅ Implementation Complete

A fully dynamic AI Interview Preparation Assistant component has been implemented with the following features:

### Features Implemented

1. **Dynamic Question Generation**
   - Input field for job title or job description
   - Calls Gemini or OpenAI API to generate questions
   - Returns 10 technical, 10 behavioral, and 10 domain-specific questions

2. **Personalized Content**
   - Questions tailored to user's skills and experience from their profile
   - Ideal sample answers based on user's resume data
   - Personalized improvement tips for each question

3. **Chat-like UI**
   - Beautiful card-based layout with Framer Motion animations
   - Category filtering (All, Technical, Behavioral, Domain)
   - Smooth transitions and loading states

4. **Voice Mode (Optional)**
   - Text-to-Speech (TTS) to read questions aloud
   - Speech-to-Text (STT) to capture user answers
   - AI analysis of user's spoken answers with feedback

5. **Answer Analysis**
   - AI analyzes user's voice answers
   - Provides score, feedback, suggestions, strengths, and improvements

6. **Error Handling**
   - Comprehensive error handling with user-friendly messages
   - Fallback responses if AI fails
   - Loading states and user feedback

## 📁 Files Created/Modified

### Frontend
- `src/components/AIInterviewAssistant.jsx` - Main component
- `src/pages/InterviewPreparation.jsx` - Page wrapper
- Updated `src/App.jsx` - Added route for `/interview-prep`

### Backend
- `backend/routes/ai.routes.js` - Interview and answer analysis endpoints
- `backend/utils/ai-helper.js` - Gemini and OpenAI API helpers
- Updated `backend/package.json` - Added `@google/generative-ai` dependency

## 🔧 Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install @google/generative-ai
```

### 2. Configure Environment Variables

Add to `backend/.env`:

```env
# For Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# OR for OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Specify model
GEMINI_MODEL=gemini-pro
OPENAI_MODEL=gpt-3.5-turbo
```

### 3. Get API Keys

**Gemini (Recommended - Free tier available):**
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add to `.env` as `NEXT_PUBLIC_GEMINI_API_KEY`

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env` as `OPENAI_API_KEY`

### 4. Start the Application

```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
npm run dev
```

### 5. Access the Feature

Navigate to: `http://localhost:5173/interview-prep`

## 🎯 Usage

1. **Enter Job Information**
   - Type a job title (e.g., "Senior React Developer")
   - OR paste the full job description

2. **Enable Voice Mode (Optional)**
   - Check "Enable Voice Mode" for TTS/STT features

3. **Generate Questions**
   - Click "Generate Questions"
   - Wait for AI to generate personalized questions

4. **Review Questions**
   - Filter by category (All, Technical, Behavioral, Domain)
   - Click "Read" to hear question aloud (voice mode)
   - Review ideal answers and improvement tips

5. **Practice with Voice (Voice Mode)**
   - Click "Record Answer" to speak your answer
   - AI will analyze and provide feedback

## 🎨 UI Features

- **Smooth Animations**: Framer Motion for all transitions
- **Loading States**: Visual feedback during AI processing
- **Category Filtering**: Easy navigation between question types
- **Voice Controls**: Intuitive buttons for TTS and STT
- **Answer Analysis**: Visual feedback on answer quality
- **Statistics**: Summary cards showing progress

## 🔍 API Endpoints

### POST `/api/ai/interview`
Generates interview questions based on job title/description.

**Request:**
```json
{
  "jobTitle": "Senior React Developer",
  "jobDescription": "Optional full job description..."
}
```

**Response:**
```json
{
  "technical": [
    {
      "q": "Question text",
      "a": "Ideal answer",
      "tips": ["Tip 1", "Tip 2", "Tip 3"]
    }
  ],
  "behavioral": [...],
  "domain": [...]
}
```

### POST `/api/ai/analyze-answer`
Analyzes user's spoken/written answer.

**Request:**
```json
{
  "question": "Question text",
  "idealAnswer": "Ideal answer text",
  "userAnswer": "User's answer",
  "tips": ["Tip 1", "Tip 2"]
}
```

**Response:**
```json
{
  "score": 85,
  "feedback": "Your answer shows good understanding...",
  "suggestions": ["Add examples", "Be more specific"],
  "strengths": ["Clear communication"],
  "improvements": ["More structure needed"]
}
```

## 🛠️ Technical Details

- **Frontend**: React + TypeScript + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + MongoDB
- **AI**: Gemini API (preferred) or OpenAI API
- **Voice**: Web Speech API (browser native)
- **State Management**: React hooks
- **Error Handling**: Try-catch with fallbacks
- **Authentication**: JWT-based (required)

## 🚨 Troubleshooting

### API Key Issues
- Ensure API key is correctly set in `.env`
- Check if API key has proper permissions
- Verify API quota/limits

### Voice Mode Not Working
- Check browser compatibility (Chrome/Edge recommended)
- Ensure microphone permissions are granted
- Verify HTTPS connection (required for some browsers)

### Questions Not Generating
- Check network connection
- Verify backend is running
- Check browser console for errors
- Ensure user is authenticated

### JSON Parsing Errors
- AI sometimes returns markdown-wrapped JSON
- Component includes fallback parsing
- Check backend logs for raw responses

## 📝 Notes

- Component requires user authentication (JWT token)
- Voice features require modern browser support
- AI responses are cached on backend for better performance
- All user interactions are logged for analytics (optional)

## 🎉 Next Steps

- Add interview session saving/history
- Export questions as PDF
- Share interview sessions with others
- Add more question categories
- Integrate with job applications

