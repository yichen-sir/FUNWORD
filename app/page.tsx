'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Word, StudyProgress } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { getRandomWords, getTodayString } from '@/lib/utils'

export default function HomePage() {
  const [words, setWords] = useState<Word[]>([])
  const [progress, setProgress] = useLocalStorage<StudyProgress>('study_progress', {
    studiedWords: [],
    masteredWords: [],
    dailyTarget: 30,
    todayStudied: 0,
    lastStudyDate: getTodayString()
  })
  const [dailyWords, setDailyWords] = useState<Word[]>([])

  useEffect(() => {
    fetch('/data/gaokao_core.json')
      .then(res => res.json())
      .then(data => {
        setWords(data)
        
        const today = getTodayString()
        if (progress.lastStudyDate !== today) {
          setProgress(prev => ({
            ...prev,
            todayStudied: 0,
            lastStudyDate: today
          }))
        }
        
        const todayWords = getRandomWords(data, 30, progress.studiedWords)
        setDailyWords(todayWords)
      })
  }, [])

  const progressPercentage = Math.min((progress.todayStudied / progress.dailyTarget) * 100, 100)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">FunWord</h1>
          <p className="text-gray-600">高考趣味背单词</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">今日任务</h2>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>学习进度</span>
              <span>{progress.todayStudied}/{progress.dailyTarget}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{progress.todayStudied}</div>
              <div className="text-sm text-gray-600">已学习</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{progress.masteredWords.length}</div>
              <div className="text-sm text-gray-600">已掌握</div>
            </div>
          </div>

          {dailyWords.length > 0 ? (
            <Link href="/study" className="w-full">
              <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
                {progress.todayStudied === 0 ? '开始学习' : '继续学习'}
              </button>
            </Link>
          ) : (
            <button className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-6 rounded-lg cursor-not-allowed">
              加载中...
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {progress.todayStudied > 0 && (
            <Link href="/test" className="w-full">
              <button className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg">
                开始测试
              </button>
            </Link>
          )}
          <Link href="/results" className="w-full">
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg">
              学习成果
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}