import os
from typing import List
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, field_validator

# load env
load_dotenv()

# data model for mcq
class MCQs(BaseModel):
    question: str = Field(description="question text")
    options: List[str] = Field(description="4 options")
    correct_ans: str = Field(description="correct answer")
    
    #cleaning question text
    @field_validator('question', mode="before")
    def clean_question(cls,v):
        if isinstance(v, dict):
            return v.get('description', str(v))
        return str(v)
    
# data model for blanks
class FillBlanks(BaseModel):
    question: str = Field(description="question text with '_____' for the blank")
    answer: str = Field(description="correct word/phrase")

    #cleaning question text
    @field_validator('question', mode="before")
    def clean_question(cls,v):
        if isinstance(v, dict):
            return v.get('description', str(v))
        return str(v)
    
# question generator
class QuestionGenerator:
    def __init__(self, api_key_name=None):
        # Map display names to environment variable names
        api_key_mapping = {
            "GROQ1": "GROQ_API_KEY_1",
            "GROQ2": "GROQ_API_KEY_2",
            "GROQ3": "GROQ_API_KEY_3", 
            "GROQ4": "GROQ_API_KEY_4"
        }

        api_key_value = None
        
        # Get the actual environment variable name
        if api_key_name and api_key_name in api_key_mapping:
            env_var_name = api_key_mapping[api_key_name]
            api_key_value = os.getenv(env_var_name)

        if not api_key_value:
            raise ValueError(f"API key not found for {api_key_name}. Please check your environment variables.")

        self.llm = ChatGroq(
            api_key = api_key_value,
            model = "llama-3.1-8b-instant",
            temperature = 0.9
        )

    # for mcqs
    def generate_mcq(self, topic: str, level: str, difficulty: str = "medium") -> MCQs:
        # validation parser 
        mcq_parser = PydanticOutputParser(pydantic_object=MCQs)

        # prompt template
        prompt = PromptTemplate(
            template = (
            "Generate a {difficulty} multiple-choice question about {topic} and make sure it is suitable for the student of {level}.\n\n"
            "Return ONLY a JSON object with these exact fields:\n"
            "- 'question': A clear, specific question\n"
            "- 'options': An array of exactly 4 possible answers\n"
            "- 'correct_ans': One of the options that is the correct answer\n\n"
            "Example format:\n"
            '{{\n'
            '    "question": "What is the capital of France?",\n'
            '    "options": ["London", "Berlin", "Paris", "Madrid"],\n'
            '    "correct_ans": "Paris"\n'
            '}}\n\n'
            "Your response:"
            ),
            input_variables=["topic", "difficulty", "level"]
        )

        # retry logic
        max_attempt = 3
        for attempt in range(max_attempt):
            try:
                # generate reponse using llm
                response = self.llm.invoke(prompt.format(topic=topic, difficulty=difficulty, level=level))
                parsed_res = mcq_parser.parse(response.content)

                #validate generated question
                if not parsed_res.question or len(parsed_res.options) != 4 or not parsed_res.correct_ans:
                    raise ValueError(f"Invalid question format")
                if parsed_res.correct_ans not in parsed_res.options:
                    raise ValueError(f"Correct answer is not in options")
                
                return parsed_res
            except Exception as e:
                if attempt == max_attempt - 1:
                    raise RuntimeError(f"Failed to generate valid MCQ after {max_attempt} attempts: {str(e)}")
                continue

    # for fill_ups
    def generate_fillups(self, topic: str,level: str, difficulty: str = "medium") -> FillBlanks:
        # validation parser 
        fillup_parser = PydanticOutputParser(pydantic_object=FillBlanks)

        # prompt template
        prompt = PromptTemplate(
            template = (
            "Generate a {difficulty} fill-in-the-blank question about {topic} and make sure it is suitable for the student of {level}.\n\n"
            "Return ONLY a JSON object with these exact fields:\n"
            "- 'question': A sentence with '_____' marking where the blank should be\n"
            "- 'answer': The correct word or phrase that belongs in the blank\n\n"
            "Example format:\n"
            '{{\n'
            '    "question": "The capital of France is _____.",\n'
            '    "answer": "Paris"\n'
            '}}\n\n'
            "Your response:"
            ),
            input_variables=["topic", "difficulty", "level"]
        )

        # retry logic
        max_attempt = 3
        for attempt in range(max_attempt):
            try:
                # generate reponse using llm
                response = self.llm.invoke(prompt.format(topic=topic, difficulty=difficulty, level=level))
                parsed_res = fillup_parser.parse(response.content)

                #validate generated question
                if not parsed_res.question or not parsed_res.answer:
                    raise ValueError(f"Invalid question format")
                if "_____" not in parsed_res.question:
                    parsed_res.question = parsed_res.question.replace("___", "_____")
                    if "_____" not in parsed_res.question:
                        raise ValueError(f"Question missing blank marker '_____'")
                
                return parsed_res
            except Exception as e:
                if attempt == max_attempt - 1:
                    raise RuntimeError(f"Failed to generate valid fill up after {max_attempt} attempts: {str(e)}")
                continue