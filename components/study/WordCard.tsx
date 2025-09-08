'use client'

import { useState } from 'react'
import { Word } from '@/types'

interface WordCardProps {
  word: Word
  onMark: (wordId: number, mastered: boolean) => void
}

export function WordCard({ word, onMark }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isMarked, setIsMarked] = useState(false)

  const handleMark = (mastered: boolean) => {
    setIsMarked(true)
    onMark(word.id, mastered)
  }

  return (
    <div className="relative w-full h-96 perspective-1000">
      <div 
        className={`relative w-full h-full duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={() => !isMarked && setIsFlipped(!isFlipped)}
      >
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col justify-center items-center p-8">
            <div className="text-4xl font-bold text-indigo-600 mb-4 text-center">
              {word.word}
            </div>
            <div className="text-gray-500 text-sm">
              点击翻转查看释义
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col justify-between p-6">
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {word.word}
              </div>
              <div className="text-xl text-green-600 font-semibold mb-4 text-center">
                {word.meaning}
              </div>
              <div className="text-gray-600 text-center italic">
                {word.example_sentence}
              </div>
            </div>
            
            {!isMarked ? (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMark(false)
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  未掌握
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMark(true)
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  已掌握
                </button>
              </div>
            ) : (
              <div className="mt-6 text-center">
                <div className="bg-gray-100 text-gray-600 py-3 rounded-lg font-semibold">
                  已标记
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}