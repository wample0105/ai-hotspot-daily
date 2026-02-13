import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface HotspotItem {
  rank: number
  title: string
  description: string
  summary?: string
  url: string
  stars?: number
  score?: number
  comments?: number
  source: string
  relevanceScore: number
  suggestedTopic?: string
  tags: string[]
}

interface HotspotReport {
  date: string
  total: number
  items: HotspotItem[]
}

interface Props {
  params: { id: string }
}

function getReportByDate(date: string): HotspotReport | null {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'archive', date, 'full.json')
    
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}

function getEmoji(source: string): string {
  const emojis: Record<string, string> = {
    github: '🐙',
    hackernews: '🟠',
    reddit: '🔴',
    anthropic: '✳️',
    rss: '📰'
  }
  return emojis[source] || '📰'
}

// 生成静态路径
export function generateStaticParams() {
  try {
    const dataDir = path.join(process.cwd(), 'public', 'data', 'archive')
    
    if (!fs.existsSync(dataDir)) {
      return []
    }
    
    const dates = fs.readdirSync(dataDir)
      .filter(name => fs.statSync(path.join(dataDir, name)).isDirectory())
    
    return dates.map(date => ({ id: date }))
  } catch {
    return []
  }
}

export default function HistoryDetailPage({ params }: Props) {
  const report = getReportByDate(params.id)
  
  if (!report) {
    notFound()
  }
  
  const dateStr = new Date(params.id).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/history" className="text-blue-600 hover:underline">← 返回历史</Link>
          <Link href="/" className="text-blue-600 hover:underline">首页</Link>
        </div>
        <h1 className="text-3xl font-bold">📅 {dateStr}</h1>
        <p className="text-gray-600">共 {report.total} 条高质量内容</p>
      </div>
      
      <div className="space-y-6">
        {report.items.map((item) => (
          <div key={item.rank} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getEmoji(item.source)}</span>
                <div>
                  <span className="text-sm text-gray-500">#{item.rank}</span>
                  <h2 className="text-xl font-bold">{item.title}</h2>
                </div>
              </div>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                {item.relevanceScore}分
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">📋 摘要：</span>
                {item.summary || item.description}
              </p>
              
              {item.suggestedTopic && (
                <p className="text-gray-600">
                  <span className="font-semibold">📝 选题建议：</span>
                  {item.suggestedTopic}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {item.stars && <span>⭐ {item.stars.toLocaleString()} stars</span>}
                {item.score && <span>👍 {item.score}</span>}
                {item.comments !== undefined && <span>💬 {item.comments}</span>}
                <span className="text-gray-400">|</span>
                <span>来源: {item.source}</span>
              </div>
              
              <a 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                查看原文 →
              </a>
            </div>
            
            {item.tags.length > 0 && (
              <div className="mt-4 flex gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
