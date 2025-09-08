import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FunWord - 高考趣味背单词',
  description: '以有趣的方式帮助高中生背单词，提升高考英语成绩',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </body>
    </html>
  )
}