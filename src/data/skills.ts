export interface Skill {
  name: string;
  level: number;
  category: string;
  icon: string;
  color: string;
  hex: string;
}

export const SKILLS: Skill[] = [
  { name: 'JavaScript', level: 80, category: 'Frontend', icon: '⚡', color: 'text-yellow-400', hex: '#facc15' },
  { name: 'React', level: 75, category: 'Frontend', icon: '⚛️', color: 'text-cyan-400', hex: '#22d3ee' },
  { name: 'Next.js', level: 75, category: 'Frontend', icon: '▲', color: 'text-white', hex: '#ffffff' },
  { name: 'TypeScript', level: 65, category: 'Frontend', icon: '📘', color: 'text-blue-500', hex: '#3b82f6' },
  { name: 'Tailwind CSS', level: 85, category: 'Frontend', icon: '🎨', color: 'text-sky-400', hex: '#38bdf8' },
  { name: 'shadcn/ui', level: 70, category: 'Frontend', icon: '🧩', color: 'text-violet-400', hex: '#a78bfa' },
  { name: 'HTML5 & CSS3', level: 85, category: 'Frontend', icon: '🧱', color: 'text-orange-400', hex: '#fb923c' },
  { name: 'Responsive Design', level: 85, category: 'Frontend', icon: '📱', color: 'text-teal-300', hex: '#5eead4' },

  { name: 'Salesforce LWC', level: 70, category: 'Salesforce', icon: '🌩️', color: 'text-sky-300', hex: '#00A1E0' },
  { name: 'Salesforce Custom Objects', level: 65, category: 'Salesforce', icon: '☁️', color: 'text-sky-300', hex: '#1798c1' },

  { name: 'Node.js', level: 75, category: 'Backend', icon: '🟢', color: 'text-green-400', hex: '#4ade80' },
  { name: 'Python', level: 60, category: 'Backend', icon: '🐍', color: 'text-blue-400', hex: '#60a5fa' },
  { name: 'Express.js', level: 70, category: 'Backend', icon: '🚀', color: 'text-gray-400', hex: '#9ca3af' },
  { name: 'REST APIs', level: 80, category: 'Backend', icon: '🔌', color: 'text-lime-300', hex: '#bef264' },
  { name: 'BullMQ', level: 60, category: 'Backend', icon: '📬', color: 'text-red-400', hex: '#f87171' },

  { name: 'MongoDB', level: 70, category: 'Database', icon: '🍃', color: 'text-green-500', hex: '#22c55e' },
  { name: 'MySQL', level: 60, category: 'Database', icon: '🗄️', color: 'text-blue-600', hex: '#2563eb' },
  { name: 'PostgreSQL', level: 65, category: 'Database', icon: '🐘', color: 'text-indigo-300', hex: '#7c9cff' },
  { name: 'Redis', level: 60, category: 'Database', icon: '🟥', color: 'text-red-500', hex: '#ef4444' },

  { name: 'Prompt Engineering', level: 80, category: 'AI & ML', icon: '💬', color: 'text-fuchsia-300', hex: '#f0abfc' },
  { name: 'GenAI Integration', level: 70, category: 'AI & ML', icon: '✨', color: 'text-purple-300', hex: '#d8b4fe' },
  { name: 'RAG Pipelines', level: 65, category: 'AI & ML', icon: '🔎', color: 'text-violet-300', hex: '#c4b5fd' },
  { name: 'ChromaDB', level: 60, category: 'AI & ML', icon: '🧬', color: 'text-pink-300', hex: '#f9a8d4' },
  { name: 'AI Agents', level: 60, category: 'AI & ML', icon: '🤖', color: 'text-cyan-300', hex: '#67e8f9' },
  { name: 'TensorFlow', level: 10, category: 'AI & ML', icon: '🧠', color: 'text-orange-400', hex: '#fb923c' },

  { name: 'Playwright', level: 80, category: 'Automation & QA', icon: '🎭', color: 'text-emerald-400', hex: '#34d399' },
  { name: 'Test Framework Architecture', level: 75, category: 'Automation & QA', icon: '🏗️', color: 'text-teal-400', hex: '#2dd4bf' },
  { name: 'CI/CD Pipelines', level: 65, category: 'Automation & QA', icon: '🔁', color: 'text-sky-400', hex: '#38bdf8' },
  { name: 'Jira & Confluence', level: 75, category: 'Automation & QA', icon: '📋', color: 'text-blue-400', hex: '#60a5fa' },
  { name: 'Agile / Scrum', level: 70, category: 'Automation & QA', icon: '🏃', color: 'text-amber-300', hex: '#fcd34d' },

  { name: 'Git', level: 80, category: 'Tools', icon: '📝', color: 'text-red-400', hex: '#f87171' },
  { name: 'GitHub', level: 85, category: 'Tools', icon: '🐙', color: 'text-gray-200', hex: '#e5e7eb' },
  { name: 'VS Code', level: 85, category: 'Tools', icon: '🧰', color: 'text-blue-500', hex: '#3b82f6' },
  { name: 'Postman', level: 75, category: 'Tools', icon: '📮', color: 'text-orange-500', hex: '#f97316' },

  { name: 'Docker', level: 65, category: 'DevOps', icon: '🐳', color: 'text-blue-600', hex: '#2563eb' },
  { name: 'Jenkins', level: 50, category: 'DevOps', icon: '🧪', color: 'text-rose-400', hex: '#fb7185' },
  { name: 'Grafana', level: 45, category: 'DevOps', icon: '📊', color: 'text-amber-400', hex: '#fbbf24' },

  { name: 'AWS EC2', level: 40, category: 'Cloud', icon: '☁️', color: 'text-orange-500', hex: '#f97316' },
  { name: 'Vercel', level: 75, category: 'Cloud', icon: '▲', color: 'text-white', hex: '#ffffff' },
];

export const SKILL_CATEGORIES = ['Frontend', 'Salesforce', 'Backend', 'Database', 'AI & ML', 'Automation & QA', 'Tools', 'DevOps', 'Cloud'];

export const CORE_STRENGTHS = [
  { name: 'Problem Solving', level: 80, hex: '#64FFDA' },
  { name: 'Team Leadership', level: 85, hex: '#FFD700' },
  { name: 'Communication', level: 80, hex: '#00BCD4' },
  { name: 'Adaptability', level: 92, hex: '#F9D342' },
];
