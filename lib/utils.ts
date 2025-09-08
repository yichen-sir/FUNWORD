import { Word } from '@/types'

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomWords(words: Word[], count: number, exclude: number[] = []): Word[] {
  const availableWords = words.filter(word => !exclude.includes(word.id))
  const shuffled = shuffleArray(availableWords)
  return shuffled.slice(0, count)
}

export function generateTestQuestions(words: Word[], allWords: Word[], count: number = 10) {
  const questions = []
  const shuffledWords = shuffleArray([...words]).slice(0, count)
  
  for (const correctWord of shuffledWords) {
    const wrongOptions = shuffleArray(allWords.filter(w => w.id !== correctWord.id))
      .slice(0, 3)
      .map(w => w.meaning)
    
    const options = shuffleArray([correctWord.meaning, ...wrongOptions])
    
    questions.push({
      word: correctWord.word,
      correctAnswer: correctWord.meaning,
      options,
      wordData: correctWord
    })
  }
  
  return questions
}

export function getTodayString(): string {
  return new Date().toDateString()
}