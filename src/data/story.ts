export interface NavSection {
  id: string;
  label: string;
  progressLabel: string;
  icon: string;
}

/** Single source of truth for the side dots, mobile menu and the top progress label. */
export const NAV_SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Start', progressLabel: 'The Beginning', icon: '🌅' },
  { id: 'chapter-1', label: 'Village Roots', progressLabel: 'Ch 01 · Village Roots', icon: '🌾' },
  { id: 'chapter-2', label: 'English Struggle', progressLabel: 'Ch 02 · English Struggle', icon: '📚' },
  { id: 'chapter-3', label: 'Computer Spark', progressLabel: 'Ch 03 · Computer Spark', icon: '💻' },
  { id: 'chapter-4', label: 'Phone Coding', progressLabel: 'Ch 04 · Phone Coding', icon: '📱' },
  { id: 'chapter-6', label: 'Recovery', progressLabel: 'Ch 05 · Recovery', icon: '💪' },
  { id: 'chapter-7', label: 'Academic Excellence', progressLabel: 'Ch 06 · Academic Excellence', icon: '🏆' },
  { id: 'chapter-8', label: 'NCC Aviation', progressLabel: 'Ch 07 · NCC Aviation', icon: '✈️' },
  { id: 'flight-path', label: 'From Soil to Sky', progressLabel: '08 · From Soil to Sky', icon: '🛫' },
  { id: 'skills', label: 'Skills', progressLabel: '09 · Skills & Technologies', icon: '🛠️' },
  { id: 'contact', label: 'Contact', progressLabel: '10 · The Next Chapter', icon: '📞' },
];

export interface Milestone {
  chapter: string;
  title: string;
  line: string;
  icon: string;
  color: string;
  target: string;
}

/** The recap shown in the "From Soil to Sky" flight. Every line comes from the chapters above. */
export const MILESTONES: Milestone[] = [
  {
    chapter: 'Chapter 01',
    title: 'Rooted in Discipline',
    line: 'Up before sunrise, helping on the farm and preparing for school. Not out of necessity, but out of choice.',
    icon: '🌾',
    color: '#F9D342',
    target: 'chapter-1',
  },
  {
    chapter: 'Chapter 02',
    title: 'Lost in Translation',
    line: 'Punjabi medium till class 10, English medium in class 11. Learned to survive, step by step.',
    icon: '📚',
    color: '#FFB347',
    target: 'chapter-2',
  },
  {
    chapter: 'Chapter 03',
    title: 'The Computer Spark',
    line: 'Class 8: typing student records into a big old desktop. 30 words per minute, typing competitions won.',
    icon: '💻',
    color: '#64FFDA',
    target: 'chapter-3',
  },
  {
    chapter: 'Chapter 04',
    title: 'Code on a Phone',
    line: 'No laptop, no computer. Python on a 5-inch screen, typed with thumbs.',
    icon: '📱',
    color: '#42A5F5',
    target: 'chapter-4',
  },
  {
    chapter: 'Chapter 05',
    title: 'Pain, Persistence & a Phone',
    line: 'A disc bulge in BCA Year 2. 6 months unable to sit. 0 days quit.',
    icon: '💪',
    color: '#FF6B6B',
    target: 'chapter-6',
  },
  {
    chapter: 'Chapter 06',
    title: 'From Village to Toppers List',
    line: '2nd of 3500+ in BCA. 3rd overall and 1st among boys at Thapar MCA, 9.84 CGPA.',
    icon: '🏆',
    color: '#FFD700',
    target: 'chapter-7',
  },
  {
    chapter: 'Chapter 07',
    title: 'Airborne with NCC',
    line: 'A, B & C certificates. Cadet Warrant Officer. 7 sorties in the SW-80 co-pilot seat.',
    icon: '✈️',
    color: '#90CAF9',
    target: 'chapter-8',
  },
  {
    chapter: 'Next',
    title: 'From Soil to Server',
    line: 'A developer who started from soil and reached the server. The next chapter is still being written.',
    icon: '🌅',
    color: '#FFFFFF',
    target: 'contact',
  },
];
