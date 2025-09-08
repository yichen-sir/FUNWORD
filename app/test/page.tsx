'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Word, StudyProgress, TestResult } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { generateTestQuestions, getTodayString } from '@/lib/utils'
import { QuestionCard } from '@/components/test/QuestionCard'

export default function TestPage() {
  const router = useRouter()
  const [words, setWords] = useState<Word[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [showResult, setShowResult] = useState(false)
  const [progress] = useLocalStorage<StudyProgress>('study_progress', {
    studiedWords: [],
    masteredWords: [],
    dailyTarget: 30,
    todayStudied: 0,
    lastStudyDate: getTodayString()
  })
  const [testResults, setTestResults] = useLocalStorage<TestResult[]>('test_results', [])

  useEffect(() => {
    fetch('/data/gaokao_core.json')
      .then(res => res.json())
      .then(data => {
        setWords(data)
        const studiedWords = data.filter((word: Word) => progress.studiedWords.includes(word.id))
        if (studiedWords.length === 0) {
          router.push('/')
          return
        }
        const testQuestions = generateTestQuestions(studiedWords, data, Math.min(10, studiedWords.length))
        setQuestions(testQuestions)
      })
  }, [progress.studiedWords, router])

  const handleAnswer = (selectedAnswer: string, isCorrect: boolean) => {
    const newAnswer = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      isCorrect,
      correctAnswer: questions[currentQuestionIndex].correctAnswer,
      word: questions[currentQuestionIndex].wordData
    }

    setAnswers(prev => [...prev, newAnswer])

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        const correctAnswers = [...answers, newAnswer].filter(a => a.isCorrect).length
        const wrongWords = [...answers, newAnswer].filter(a => !a.isCorrect).map(a => a.word)
        
        const result: TestResult = {
          score: Math.round((correctAnswers / questions.length) * 100),
          totalQuestions: questions.length,
          correctAnswers,
          wrongWords,
          date: new Date().toISOString()
        }

        setTestResults(prev => [...prev, result])
        setShowResult(true)
      }
    }, 1500)
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">准备测试中...</div>
        </div>
      </div>
    )
  }

  if (showResult) {
    const correctCount = answers.filter(a => a.isCorrect).length
    const score = Math.round((correctCount / questions.length) * 100)
    const wrongWords = answers.filter(a => !a.isCorrect).map(a => a.word)

    return (
      <div className="min-h-screen p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">
              {score >= 80 ? '🎉' : score >= 60 ? '😊' : '😔'}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              测试完成！
            </h1>
            
            <div className="mb-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {score}分
              </div>
              <div className="text-gray-600">
                答对 {correctCount}/{questions.length} 题
              </div>
            </div>

            {wrongWords.length > 0 && (
              <div className="mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-3">错词本：</h3>
                <div className="space-y-2">
                  {wrongWords.map((word: Word, index: number) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="font-medium text-red-700">{word.word}</div>
                      <div className="text-sm text-red-600">{word.meaning}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setCurrentQuestionIndex(0)
                  setAnswers([])
                  setShowResult(false)
                }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
              >
                重新测试
              </button>
              <Link href="/" className="w-full">
                <button className="w-full bg-gray-100 text-gray-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200">
                  返回首页
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← 返回首页
          </Link>
          <div className="text-sm text-gray-600">
            测试模式
          </div>
        </div>

        <QuestionCard
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <div className="mt-6 text-center text-sm text-gray-500">
          选择正确答案，系统将自动跳转到下一题
        </div>
      </div>
    </div>
  )
}