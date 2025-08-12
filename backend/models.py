from pydantic import BaseModel
from typing import List, Optional

class QuizRequest(BaseModel):
    topic: str
    level: str
    difficulty: str
    question_type: str
    num_questions: int
    api_key: str

class QuestionResponse(BaseModel):
    type: str
    question: str
    options: Optional[List[str]] = None
    correct_ans: str

class QuizResponse(BaseModel):
    questions: List[QuestionResponse]
    quiz_id: str

class Answer(BaseModel):
    question_index: int
    user_answer: str

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: List[Answer]

class QuizResult(BaseModel):
    question_no: int
    question: str
    question_type: str
    user_answer: str
    correct_answer: str
    is_correct: bool
    options: Optional[List[str]] = None

class QuizEvaluation(BaseModel):
    results: List[QuizResult]
    score: int
    total_questions: int
    percentage: float