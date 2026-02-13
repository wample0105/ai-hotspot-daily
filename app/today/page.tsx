import fs from 'fs'
import path from 'path'
import Link from 'next/link'

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

export default function TodayPage() {
  const report = getLatestReport()
  
  if (!report) {
    return <div>暂无数据</div>
  }
  
  const top10 = report.items.slice(0, 10)
  const dateStr = new Date(report.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <div>
      <div className="mb-8">
        <Link href="/" style={{ color: '#4f46e5', textDecoration: 'none', display: 'inline-block', marginBottom: '12px' }}>← 返回首页</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>🔥 {dateStr} 详细报告</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>共 {report.total} 条高质量内容 | TOP 10</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {top10.map((item) => (
          <div key={item.rank} className="card-soft p-6">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span className="emoji-lg">{getEmoji(item.source)}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>#{item.rank}</span>
                    {item.rank <= 3 && <span className="badge-hot">HOT</span>}
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>{item.title}</h2>
                </div>
              </div>
              <span className="badge-score">{item.relevanceScore}分</span>
            </div>
            
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
              <p style={{ color: '#374151', marginBottom: '8px', lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600 }}>📋 摘要：</span>
                {item.summary || item.description}
              </p>
              
              {item.suggestedTopic && (
                <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600 }}>📝 选题建议：</span>
                  {item.suggestedTopic}
                </p>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#6b7280', fontSize: '0.875rem' }}>
                {item.stars && <span>⭐ {item.stars.toLocaleString()}</span>}
                {item.score && <span>👍 {item.score}</span>}
                {item.comments !== undefined && <span>💬 {item.comments}</span>}
              </div>
              
              <a 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: '0.875rem', padding: '10px 20px' }}
              >
                查看原文 →
              </a>
            </div>
            
            {item.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                {item.tags.map(tag => (
                  <span key={tag} style={{ background: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>显示前10条，共 {report.total} 条</p>
      </div>
    </div>
  )
}
