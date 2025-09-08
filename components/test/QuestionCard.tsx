'use client'

interface QuestionCardProps {
  question: {
    word: string
    correctAnswer: string
    options: string[]
    wordData: any
  }
  onAnswer: (selectedAnswer: string, isCorrect: boolean) => void
  questionNumber: number
  totalQuestions: number
}

export function QuestionCard({ question, onAnswer, questionNumber, totalQuestions }: QuestionCardProps) {
  const handleAnswer = (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === question.correctAnswer
    onAnswer(selectedAnswer, isCorrect)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">第 {questionNumber} 题</span>
          <span className="text-sm text-gray-500">{questionNumber}/{totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-3xl font-bold text-indigo-600 mb-4">
          {question.word}
        </div>
        <div className="text-gray-600">
          选择正确的中文释义
        </div>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="w-full p-4 text-left bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-lg transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                {String.fromCharCode(65 + index)}
              </div>
              <div className="text-gray-800">{option}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}