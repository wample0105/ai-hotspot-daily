import fs from 'fs'
import path from 'path'

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

// 读取最新的热点报告
function getLatestReport(): HotspotReport | null {
  try {
    const dataDir = path.join(process.cwd(), 'public', 'data', 'archive')
    const dates = fs.readdirSync(dataDir).sort().reverse()
    
    if (dates.length === 0) return null
    
    const latestDate = dates[0]
    const filePath = path.join(dataDir, latestDate, 'full.json')
    
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error('读取报告失败:', error)
    return null
  }
}

// 获取emoji
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

export default function HomePage() {
  const report = getLatestReport()
  
  if (!report) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl mb-4">暂无数据</h1>
        <p className="text-gray-500">等待首次热点抓取...</p>
      </div>
    )
  }
  
  const top3 = report.items.slice(0, 3)
  const dateStr = new Date(report.date).toLocaleDateString('zh-CN')
  
  return (
    <div>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '12px', color: '#1f2937' }}>
          📊 {dateStr} 热点简报
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          共 {report.total} 条高质量内容 | 每日7:30更新
        </p>
      </div>
      
      {/* Cards Grid */}
      <div style={{ display: 'grid', gap: '24px', marginBottom: '48px' }}>
        {top3.map((item, index) => (
          <div key={item.rank} className="card-soft p-6">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="emoji-lg">{getEmoji(item.source)}</span>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>#{item.rank}</span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                    {item.title}
                  </h2>
                </div>
              </div>
              <span className="badge-score">{item.relevanceScore}分</span>
            </div>
            
            <p style={{ color: '#4b5563', marginBottom: '16px', lineHeight: 1.6 }}>
              {item.summary || item.description}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {item.stars && <span style={{ marginRight: '16px' }}>⭐ {item.stars.toLocaleString()}</span>}
              </div>
              
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-blue">
                查看原文 →
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* CTA Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <a href="/today" className="btn-primary">
          查看详细版 (TOP 10)
        </a>
        <a href="/history" className="btn-secondary">
          浏览历史归档
        </a>
      </div>
    </div>
  )
}
