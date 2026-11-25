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

  { name: 'Node.js', level: 75, category: 'Backend', icon: '🟢', color: 'text-green-400', hex: '#4ade80' },
  { name: 'Python', level: 60, category: 'Backend', icon: '🐍', color: 'text-blue-400', hex: '#60a5fa' },
  { name: 'Express.js', level: 70, category: 'Backend', icon: '🚀', color: 'text-gray-400', hex: '#9ca3af' },

  { name: 'MongoDB', level: 70, category: 'Database', icon: '🍃', color: 'text-green-500', hex: '#22c55e' },
  { name: 'MySQL', level: 60, category: 'Database', icon: '🗄️', color: 'text-blue-600', hex: '#2563eb' },

  { name: 'TensorFlow', level: 10, category: 'AI/ML', icon: '🧠', color: 'text-orange-400', hex: '#fb923c' },

  { name: 'Git', level: 80, category: 'Tools', icon: '📝', color: 'text-red-400', hex: '#f87171' },
  { name: 'VS Code', level: 85, category: 'Tools', icon: '🧰', color: 'text-blue-500', hex: '#3b82f6' },

  { name: 'Docker', level: 65, category: 'DevOps', icon: '🐳', color: 'text-blue-600', hex: '#2563eb' },
  { name: 'Jenkins', level: 50, category: 'DevOps', icon: '🧪', color: 'text-rose-400', hex: '#fb7185' },
  { name: 'Grafana', level: 45, category: 'DevOps', icon: '📊', color: 'text-amber-400', hex: '#fbbf24' },

  { name: 'AWS', level: 40, category: 'Cloud', icon: '☁️', color: 'text-orange-500', hex: '#f97316' },
];

export const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Database', 'AI/ML', 'Tools', 'DevOps', 'Cloud'];

export const CORE_STRENGTHS = [
  { name: 'Problem Solving', level: 80, hex: '#64FFDA' },
  { name: 'Team Leadership', level: 85, hex: '#FFD700' },
  { name: 'Communication', level: 80, hex: '#00BCD4' },
  { name: 'Adaptability', level: 92, hex: '#F9D342' },
];
