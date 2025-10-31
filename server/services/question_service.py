from typing import Literal

from models.schemas import AnswerSubmission, Question


def calculate_question_difficulty(
    question: Question, answer: AnswerSubmission
) -> Question:
    """
    Calculate and update the question's average score based on the user's answer."""

    def return_difficulty(average_score: float) -> Literal["easy", "medium", "hard"]:
        if average_score >= 0.8:
            return "easy"
        elif average_score >= 0.5:
            return "medium"
        else:
            return "hard"

    question.number_of_times_asked += 1
    if answer.is_correct:
        question.nummber_of_times_answered_correctly += 1
    question.average_score = (
        question.nummber_of_times_answered_correctly / question.number_of_times_asked
    )
    if question.number_of_times_asked > 10:
        question.difficulty = return_difficulty(question.average_score)
    return question
