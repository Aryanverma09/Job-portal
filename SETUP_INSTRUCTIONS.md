# Job Portal Setup Instructions

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGO_URL=mongodb://localhost:27017/jobportal
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

## Frontend Setup

1. Navigate to the root directory (if not already there):
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Features Implemented

### Profile Page with Resume Upload
- **Route**: `/profile`
- **File Upload**: Supports PDF and Word documents (DOC, DOCX)
- **File Size Limit**: 5MB maximum
- **AI Processing**: Uses OpenAI GPT-3.5-turbo to parse resume content
- **Job Matching**: Automatically finds matching jobs based on resume skills

### Backend API Endpoints
- `POST /api/users/upload-resume` - Upload and parse resume
- `POST /api/users/get-matched-jobs` - Get job recommendations

### AI Resume Parsing
- Extracts skills, experience, education, and summary
- Uses OpenAI API for intelligent text analysis
- Fallback parsing if AI service is unavailable

### Job Matching Algorithm
- Compares user skills with job requirements
- Calculates match percentage
- Sorts jobs by relevance
- Shows matched skills for each job

## Prerequisites
- Node.js and npm installed
- MongoDB running locally
- OpenAI API key (for AI resume parsing)

## Usage
1. Register/Login to the application
2. Navigate to Profile page
3. Upload your resume (PDF or Word document)
4. View AI-parsed resume data and job recommendations
5. Download your uploaded resume if needed
