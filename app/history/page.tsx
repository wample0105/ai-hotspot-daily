import fs from 'fs'
import path from 'path'
import Link from 'next/link'

interface ArchiveItem {
  date: string
  dateStr: string
  count: number
  weekday: number
}

function getArchives(): ArchiveItem[] {
  try {
    const dataDir = path.join(process.cwd(), 'public', 'data', 'archive')
    
    if (!fs.existsSync(dataDir)) {
      return []
    }
    
    const dates = fs.readdirSync(dataDir)
      .filter(name => fs.statSync(path.join(dataDir, name)).isDirectory())
      .sort()
      .reverse()
    
    return dates.map(date => {
      const filePath = path.join(dataDir, date, 'full.json')
      let count = 0
      const dateObj = new Date(date)
      
      try {
        const content = fs.readFileSync(filePath, 'utf8')
        const data = JSON.parse(content)
        count = data.total || 0
      } catch {
        // 忽略读取错误
      }
      
      return {
        date,
        dateStr: dateObj.toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric'
        }),
        count,
        weekday: dateObj.getDay()
      }
    })
  } catch (error) {
    console.error('读取归档失败:', error)
    return []
  }
}

// 获取月份名称
function getMonthName(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
}

// 生成日历网格
function generateCalendarGrid(archives: ArchiveItem[]) {
  if (archives.length === 0) return []
  
  const firstDate = new Date(archives[archives.length - 1].date)
  const year = firstDate.getFullYear()
  const month = firstDate.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  const startDay = firstDayOfMonth.getDay() // 0 = 周日
  const daysInMonth = lastDayOfMonth.getDate()
  
  const grid = []
  
  // 空白格（月初之前的）
  for (let i = 0; i < startDay; i++) {
    grid.push(null)
  }
  
  // 日期格
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const archive = archives.find(a => a.date === dateStr)
    grid.push({
      day,
      date: dateStr,
      hasData: !!archive,
      count: archive?.count || 0
    })
  }
  
  return grid
}

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

export default function HistoryPage() {
  const archives = getArchives()
  const calendarGrid = generateCalendarGrid(archives)
  const currentMonth = archives.length > 0 ? getMonthName(archives[0].date) : ''
  
  if (archives.length === 0) {
    return (
      <div className="text-center py-20">
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📚</div>
        <h1 className="text-2xl font-bold mb-4">暂无历史归档</h1>
        <p className="text-gray-600 mb-6">数据积累中，明天就会有第一条记录~ 🌱</p>
        
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', maxWidth: '400px', margin: '0 auto' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            💡 每天7:30自动更新，记得明天来看哦！
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/" style={{ color: '#4f46e5', textDecoration: 'none', display: 'inline-block', marginBottom: '12px', fontSize: '0.875rem' }}>← 返回首页</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>📚 历史归档</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>共 {archives.length} 天数据 · 永久保存 · 每日7:30更新</p>
      </div>
      
      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div className="card-soft p-4" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4f46e5' }}>{archives.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>累计天数</div>
        </div>
        <div className="card-soft p-4" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4f46e5' }}>{archives.reduce((sum, a) => sum + a.count, 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>总热点数</div>
        </div>
      </div>
      
      {/* 日历视图 */}
      <div className="card-soft p-4 mb-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{currentMonth}</h2>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>📅 日历视图</span>
        </div>
        
        {/* 星期标题 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
          {weekdays.map(day => (
            <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', padding: '8px 0' }}>
              {day}
            </div>
          ))}
        </div>
        
        {/* 日期网格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {calendarGrid.map((cell, index) => (
            <div key={index}>
              {cell === null ? (
                <div style={{ aspectRatio: '1', borderRadius: '8px' }} />
              ) : cell.hasData ? (
                <Link
                  href={`/history/${cell.date}`}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    position: 'relative'
                  }}
                >
                  <span>{cell.day}</span>
                  <span style={{ fontSize: '0.625rem', opacity: 0.9 }}>{cell.count}条</span>
                </Link>
              ) : (
                <div
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    background: '#f3f4f6',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  {cell.day}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* 列表视图 */}
      <div className="mb-4">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>📋 列表视图</h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {archives.map((archive) => (
          <Link
            key={archive.date}
            href={`/history/${archive.date}`}
            className="card-soft"
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                  color: '#4f46e5',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 700
                }}
              >
                <span>{archive.dateStr.split(' ')[0]}</span>
                <span style={{ fontSize: '0.625rem' }}>{archive.dateStr.split(' ')[1]}</span>
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>
                  {new Date(archive.date).toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {archive.count} 条热点
                </div>
              </div>
            </div>
            
            <span style={{ color: '#4f46e5', fontSize: '0.875rem' }}>查看 →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
