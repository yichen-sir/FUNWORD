export interface Word {
  id: number
  word: string
  meaning: string
  example_sentence: string
}

export interface StudyProgress {
  studiedWords: number[]
  masteredWords: number[]
  dailyTarget: number
  todayStudied: number
  lastStudyDate: string
}

export interface TestResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongWords: Word[]
  date: string
}