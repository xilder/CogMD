import ReactMarkdown from 'react-markdown';

interface QuizFeedbackProps {
  isCorrect: boolean;
  explanation: string;
  userAnswer: string;
  correctAnswer: string;
}

export default function QuizFeedback({
  isCorrect,
  explanation,
  userAnswer,
  correctAnswer,
}: QuizFeedbackProps) {
  return (
    <div
      className={`border-l-4 p-4 mb-6 rounded-lg ${
        isCorrect
          ? 'border-green-500 bg-green-50 dark:bg-green-950'
          : 'border-red-500 bg-red-50 dark:bg-red-950'
      }`}
    >
      <p
        className={`font-semibold mb-3 ${
          isCorrect
            ? 'text-green-700 dark:text-green-300'
            : 'text-red-700 dark:text-red-300'
        }`}
      >
        {isCorrect ? 'Correct!' : 'Incorrect'}
      </p>

      {!isCorrect && (
        <div className='mb-3 text-sm text-foreground space-y-1'>
          <p>
            <span className='font-medium'>Your answer:</span> {userAnswer}
          </p>
          <p>
            <span className='font-medium'>Correct answer:</span> {correctAnswer}
          </p>
        </div>
      )}

      <div className='text-sm text-foreground prose prose-sm dark:prose-invert prose-p:my-1 prose-strong:font-semibold prose-ul:my-1 prose-li:my-0'>
        <ReactMarkdown>{explanation}</ReactMarkdown>
      </div>
    </div>
  );
}
