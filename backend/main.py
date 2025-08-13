from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from models import QuizRequest, QuizResponse, QuizSubmission, QuizEvaluation
from quiz_manager import QuizManager
import os

app = FastAPI(title="Asklet Quiz API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://askletquiz.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize quiz manager
quiz_manager = QuizManager()

@app.get("/")
async def root():
    return {"message": "Asklet Quiz API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Asklet Quiz API"}

@app.post("/api/quiz/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    try:
        result = quiz_manager.generate_quiz(
            topic=request.topic,
            level=request.level,
            difficulty=request.difficulty,
            question_type=request.question_type,
            num_questions=request.num_questions,
            api_key=request.api_key
        )
        return QuizResponse(
            quiz_id=result['quiz_id'],
            questions=result['questions']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quiz/submit", response_model=QuizEvaluation)
async def submit_quiz(submission: QuizSubmission):
    try:
        evaluation = quiz_manager.evaluate_quiz(
            quiz_id=submission.quiz_id,
            answers=[answer.dict() for answer in submission.answers]
        )
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/quiz/{quiz_id}/download")
async def download_quiz_results(quiz_id: str):
    try:
        # Get the quiz results first
        if quiz_id not in quiz_manager.active_quizzes:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        # For now, return a simple response
        # In a real implementation, you'd store the evaluation results
        raise HTTPException(status_code=501, detail="Download feature requires quiz submission first")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quiz/{quiz_id}/pdf")
async def generate_pdf_report(quiz_id: str, evaluation: QuizEvaluation):
    try:
        pdf_path = quiz_manager.generate_pdf_report(evaluation)
        return FileResponse(
            pdf_path,
            media_type='application/pdf',
            filename=os.path.basename(pdf_path),
            headers={"Content-Disposition": f"attachment; filename={os.path.basename(pdf_path)}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)