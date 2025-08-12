import uuid
import os
from typing import Dict, List
from datetime import datetime
from models import QuizResult, QuizEvaluation
from util import QuestionGenerator
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

class QuizManager:
    def __init__(self):
        self.active_quizzes: Dict[str, dict] = {}
        
    def generate_quiz(self, topic: str, level: str, difficulty: str, question_type: str, num_questions: int, api_key: str):
        quiz_id = str(uuid.uuid4())
        questions = []
        
        try:
            generator = QuestionGenerator(api_key)
            
            for _ in range(num_questions):
                if question_type == "Multiple choice":
                    question = generator.generate_mcq(topic, level, difficulty.lower())
                    questions.append({
                        'type': 'MCQ',
                        'question': question.question,
                        'options': question.options,
                        'correct_ans': question.correct_ans
                    })
                else:
                    question = generator.generate_fillups(topic, level, difficulty.lower())
                    questions.append({
                        'type': 'Fill in the blank',
                        'question': question.question,
                        'correct_ans': question.answer
                    })
            
            # Store quiz in memory
            self.active_quizzes[quiz_id] = {
                'questions': questions,
                'created_at': datetime.now()
            }
            
            return {
                'quiz_id': quiz_id,
                'questions': questions
            }
            
        except Exception as e:
            raise Exception(f"Error generating quiz: {str(e)}")
    
    def evaluate_quiz(self, quiz_id: str, answers: List[dict]) -> QuizEvaluation:
        if quiz_id not in self.active_quizzes:
            raise Exception("Quiz not found")
        
        quiz = self.active_quizzes[quiz_id]
        questions = quiz['questions']
        results = []
        correct_count = 0
        
        for i, question in enumerate(questions):
            user_answer = ""
            
            # Find user's answer for this question
            for answer in answers:
                if answer['question_index'] == i:
                    user_answer = answer['user_answer']
                    break
            
            # Evaluate answer
            is_correct = False
            if question['type'] == 'MCQ':
                is_correct = user_answer == question['correct_ans']
            else:
                is_correct = user_answer.strip().lower() == question['correct_ans'].strip().lower()
            
            if is_correct:
                correct_count += 1
            
            result = QuizResult(
                question_no=i + 1,
                question=question['question'],
                question_type=question['type'],
                user_answer=user_answer,
                correct_answer=question['correct_ans'],
                is_correct=is_correct,
                options=question.get('options', [])
            )
            results.append(result)
        
        total_questions = len(questions)
        percentage = (correct_count / total_questions) * 100
        
        return QuizEvaluation(
            results=results,
            score=correct_count,
            total_questions=total_questions,
            percentage=percentage
        )
    
    def generate_pdf_report(self, evaluation: QuizEvaluation) -> str:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"quiz_result_{timestamp}.pdf"
        os.makedirs('results', exist_ok=True)
        full_path = os.path.join('results', filename)
        
        c = canvas.Canvas(full_path, pagesize=letter)
        width, height = letter
        y = height - 40
        c.setFont("Helvetica-Bold", 16)
        c.drawString(40, y, "Quiz Results Report")
        y -= 30
        
        c.setFont("Helvetica", 12)
        c.drawString(40, y, f"Score: {evaluation.score}/{evaluation.total_questions} ({evaluation.percentage:.1f}%)")
        y -= 30
        
        for result in evaluation.results:
            lines = [
                f"Question {result.question_no}: {result.question}",
                f"Options: {', '.join(result.options)}" if result.options else "",
                f"Your Answer: {result.user_answer}",
                f"Correct Answer: {result.correct_answer}",
                f"Result: {'Correct' if result.is_correct else 'Incorrect'}",
                "-" * 80
            ]
            
            for line in lines:
                if line:
                    c.drawString(40, y, line[:100])  # Truncate long lines
                    y -= 15
                if y < 60:
                    c.showPage()
                    c.setFont("Helvetica", 12)
                    y = height - 40
        
        c.save()
        return full_path