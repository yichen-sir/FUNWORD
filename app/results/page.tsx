'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StudyProgress, TestResult } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { getTodayString } from '@/lib/utils'

export default function ResultsPage() {
  const [progress] = useLocalStorage<StudyProgress>('study_progress', {
    studiedWords: [],
    masteredWords: [],
    dailyTarget: 30,
    todayStudied: 0,
    lastStudyDate: getTodayString()
  })
  const [testResults] = useLocalStorage<TestResult[]>('test_results', [])
  const [recentResults, setRecentResults] = useState<TestResult[]>([])

  useEffect(() => {
    const recent = testResults
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
    setRecentResults(recent)
  }, [testResults])

  const averageScore = testResults.length > 0 
    ? Math.round(testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length)
    : 0

  const totalWordsStudied = progress.studiedWords.length
  const totalWordsMastered = progress.masteredWords.length
  const masteryRate = totalWordsStudied > 0 ? Math.round((totalWordsMastered / totalWordsStudied) * 100) : 0

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← 返回首页
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">学习成果</h1>
          <div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">学习统计</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">总学习单词</span>
                <span className="text-2xl font-bold text-blue-600">{totalWordsStudied}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">已掌握单词</span>
                <span className="text-2xl font-bold text-green-600">{totalWordsMastered}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">掌握率</span>
                <span className="text-2xl font-bold text-purple-600">{masteryRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">测试统计</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">测试次数</span>
                <span className="text-2xl font-bold text-orange-600">{testResults.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">平均分</span>
                <span className="text-2xl font-bold text-red-600">{averageScore}分</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">今日学习</span>
                <span className="text-2xl font-bold text-indigo-600">{progress.todayStudied}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">最近测试记录</h2>
          {recentResults.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              还没有测试记录
              <br />
              <Link href="/test" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
                开始第一次测试 →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentResults.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl font-bold ${
                        result.score >= 80 ? 'text-green-600' : 
                        result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {result.score}分
                      </div>
                      <div className="text-gray-600">
                        {result.correctAnswers}/{result.totalQuestions} 正确
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(result.date).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  
                  {result.wrongWords.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 mb-2">错误单词:</div>
                      <div className="flex flex-wrap gap-2">
                        {result.wrongWords.slice(0, 5).map((word, wordIndex) => (
                          <span 
                            key={wordIndex}
                            className="px-2 py-1 bg-red-50 text-red-600 rounded text-sm"
                          >
                            {word.word}
                          </span>
                        ))}
                        {result.wrongWords.length > 5 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-sm">
                            +{result.wrongWords.length - 5} 更多
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link href="/study" className="w-full">
            <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
              继续学习
            </button>
          </Link>
          {progress.todayStudied > 0 && (
            <Link href="/test" className="w-full">
              <button className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200">
                开始测试
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}