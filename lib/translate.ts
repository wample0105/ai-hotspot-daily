// 简单的中英对照翻译库（用于常见AI/技术词汇）
// 实际项目中应该调用翻译API

export const techTerms: Record<string, string> = {
  // GitHub/项目相关
  'The Ultimate Collection': '终极合集',
  'Agentic Skills': '智能体技能',
  'for': '适用于',
  'Battle-tested': '经过实战检验',
  'high-performance': '高性能',
  'official skills': '官方技能',
  'open-source': '开源',
  'builder': '构建器',
  'platform': '平台',
  'framework': '框架',
  'collection': '合集',
  'curated': '精选',
  'repository': '仓库',
  
  // AI相关
  'AI agent': 'AI智能体',
  'agent': '智能体',
  'prompt': '提示词',
  'LLM': '大语言模型',
  'language model': '语言模型',
  'chatbot': '聊天机器人',
  'copilot': '编程助手',
  'assistant': '助手',
  'automation': '自动化',
  'workflow': '工作流',
  'skill': '技能',
  'plugin': '插件',
  'extension': '扩展',
  
  // 开发相关
  'code': '代码',
  'coding': '编程',
  'developer': '开发者',
  'development': '开发',
  'programming': '编程',
  'software': '软件',
  'tool': '工具',
  'library': '库',
  'API': '接口',
  'SDK': '开发套件',
  'CLI': '命令行工具',
  'GUI': '图形界面',
  
  // 技术术语
  'neural network': '神经网络',
  'machine learning': '机器学习',
  'deep learning': '深度学习',
  'natural language processing': '自然语言处理',
  'NLP': 'NLP',
  'computer vision': '计算机视觉',
  'data science': '数据科学',
  'cloud': '云',
  'serverless': '无服务器',
  'container': '容器',
  'Docker': 'Docker',
  'Kubernetes': 'Kubernetes',
  
  // 描述词
  'powerful': '强大的',
  'simple': '简单的',
  'easy': '易用的',
  'fast': '快速的',
  'modern': '现代的',
  'lightweight': '轻量级的',
  'flexible': '灵活的',
  'scalable': '可扩展的',
  'free': '免费的',
  'free and open-source': '免费开源',
  
  // 动词
  'build': '构建',
  'create': '创建',
  'generate': '生成',
  'automate': '自动化',
  'integrate': '集成',
  'deploy': '部署',
  'manage': '管理',
  'monitor': '监控',
  'track': '追踪',
  'analyze': '分析',
  'optimize': '优化',
  
  // 常用短语
  'self-hosted': '自托管',
  'privacy-focused': '注重隐私',
  'community-driven': '社区驱动',
  'production-ready': '生产就绪',
  'enterprise-grade': '企业级',
}

// 简单翻译函数
export function translateText(text: string): string {
  if (!text) return ''
  
  let translated = text
  
  // 替换已知术语
  for (const [en, zh] of Object.entries(techTerms)) {
    const regex = new RegExp(`\\b${en}\\b`, 'gi')
    translated = translated.replace(regex, zh)
  }
  
  return translated
}

// 判断是否为英文内容
export function isEnglish(text: string): boolean {
  if (!text) return false
  const englishChars = text.match(/[a-zA-Z]/g)?.length || 0
  const totalChars = text.replace(/\s/g, '').length
  return englishChars / totalChars > 0.5
}

// 智能摘要（限制长度）
export function smartSummary(text: string, maxLength: number = 60): string {
  if (!text) return ''
  
  const translated = translateText(text)
  
  if (translated.length <= maxLength) {
    return translated
  }
  
  return translated.slice(0, maxLength) + '...'
}
