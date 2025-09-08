'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Word, StudyProgress } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { getRandomWords, getTodayString } from '@/lib/utils'
import { WordCard } from '@/components/study/WordCard'

export default function StudyPage() {
  const router = useRouter()
  const [words, setWords] = useState<Word[]>([])
  const [dailyWords, setDailyWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useLocalStorage<StudyProgress>('study_progress', {
    studiedWords: [],
    masteredWords: [],
    dailyTarget: 30,
    todayStudied: 0,
    lastStudyDate: getTodayString()
  })

  useEffect(() => {
    fetch('/data/gaokao_core.json')
      .then(res => res.json())
      .then(data => {
        setWords(data)
        const todayWords = getRandomWords(data, 30, progress.studiedWords)
        setDailyWords(todayWords)
      })
  }, [])

  const handleWordMark = (wordId: number, mastered: boolean) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        studiedWords: [...prev.studiedWords, wordId],
        masteredWords: mastered 
          ? [...prev.masteredWords, wordId]
          : prev.masteredWords.filter(id => id !== wordId),
        todayStudied: prev.todayStudied + 1,
        lastStudyDate: getTodayString()
      }
      return newProgress
    })

    setTimeout(() => {
      if (currentIndex < dailyWords.length - 1) {
        setCurrentIndex(prev => prev + 1)
      }
    }, 1000)
  }

  const progressPercentage = Math.min(((currentIndex + 1) / dailyWords.length) * 100, 100)
  
  if (dailyWords.length === 0) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">加载中...</div>
        </div>
      </div>
    )
  }

  if (currentIndex >= dailyWords.length) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              今日学习完成！
            </h1>
            <p className="text-gray-600 mb-6">
              恭喜你完成了今天的学习任务，共学习了 {dailyWords.length} 个单词
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/test" className="w-full">
                <button className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200">
                  开始测试
                </button>
              </Link>
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
            {currentIndex + 1} / {dailyWords.length}
          </div>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <WordCard 
          word={dailyWords[currentIndex]}
          onMark={handleWordMark}
        />

        <div className="mt-6 text-center text-sm text-gray-500">
          翻转卡片查看释义，然后选择是否已掌握
        </div>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}