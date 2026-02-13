'use client'

import { useState } from 'react'
import Link from 'next/link'
import { translateText, smartSummary } from '@/lib/translate'

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

// 骨架屏
function SkeletonAllCard() {
  return (
    <div className="card-soft p-5">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '60px', height: '16px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '80%', height: '20px' }} />
          </div>
        </div>
        <div className="skeleton" style={{ width: '60px', height: '28px', borderRadius: '20px' }} />
      </div>
      <div className="skeleton" style={{ width: '100%', height: '50px' }} />
    </div>
  )
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

function getSourceName(source: string): string {
  const names: Record<string, string> = {
    github: 'GitHub',
    hackernews: 'HackerNews',
    reddit: 'Reddit',
    anthropic: 'Anthropic',
    rss: 'RSS订阅'
  }
  return names[source] || source
}

// 单个卡片（带翻译+展开收起）
function AllItemCard({ item, index }: { item: HotspotItem; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const displayText = item.summary || item.description || ''
  const translatedText = translateText(displayText)
  const isLongText = translatedText.length > 100
  const showText = isExpanded ? translatedText : smartSummary(displayText, 100)
  
  return (
    <div className="card-soft p-5">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{getEmoji(item.source)}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>#{index + 1}</span>
              {index < 10 && <span className="badge-hot">TOP{index + 1}</span>}
              {index >= 10 && index < 20 && <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.625rem', fontWeight: 600 }}>精华</span>}
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', margin: 0, lineHeight: 1.4, wordBreak: 'break-word' }}>
              {item.title}
            </h2>
          </div>
        </div>
        <span className="badge-score">{item.relevanceScore}分</span>
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.875rem', margin: 0 }}>
          {showText}
        </p>
        
        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: '#4f46e5',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '4px 0',
              marginTop: '8px'
            }}
          >
            {isExpanded ? '收起 ↑' : '展开全文 ↓'}
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6b7280', fontSize: '0.875rem' }}>
          {item.stars && <span>⭐ {item.stars.toLocaleString()}</span>}
          <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{getSourceName(item.source)}</span>
        </div>
        
        <a 
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#4f46e5', fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none' }}
        >
          查看原文 →
        </a>
      </div>
    </div>
  )
}

export default function AllPage() {
  const [loading] = useState(false)
  const [report, setReport] = useState<HotspotReport | null>(null)
  
  // 从客户端获取数据
  useState(() => {
    fetch('/data/archive/2026-02-13/full.json')
      .then(res => res.json())
      .then(data => setReport(data))
  })
  
  if (loading || !report) {
    return (
      <div>
        <div className="mb-6">
          <Link href="/today" style={{ color: '#4f46e5', textDecoration: 'none', display: 'inline-block', marginBottom: '12px', fontSize: '0.875rem' }}>← 返回详细版</Link>
          <div className="skeleton" style={{ width: '200px', height: '32px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '150px', height: '16px' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <SkeletonAllCard key={i} />
          ))}
        </div>
      </div>
    )
  }
  
  const allItems = report.items
  const dateStr = new Date(report.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // 按来源分组统计
  const sourceStats = allItems.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/today" style={{ color: '#4f46e5', textDecoration: 'none', display: 'inline-block', marginBottom: '12px', fontSize: '0.875rem' }}>← 返回详细版</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>📋 {dateStr} 全部热点</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>共 {report.total} 条内容 | 按热度排序</p>
      </div>
      
      {/* 来源筛选标签 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '8px' }}>
        <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
          全部 {report.total}
        </span>
        {Object.entries(sourceStats).map(([source, count]) => (
          <span key={source} style={{ background: '#f3f4f6', color: '#4b5563', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
            {getEmoji(source)} {getSourceName(source)} {count}
          </span>
        ))}
      </div>
      
      {/* 全部列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {allItems.map((item, index) => (
          <AllItemCard key={item.rank} item={item} index={index} />
        ))}
      </div>
      
      {/* 底部提示 */}
      <div style={{ marginTop: '32px', textAlign: 'center', padding: '24px', background: '#f9fafb', borderRadius: '12px' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>已显示全部 {report.total} 条热点 🎉</p>
        <Link href="/today" style={{ color: '#4f46e5', fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none' }}>← 返回 TOP 10</Link>
      </div>
    </div>
  )
}
