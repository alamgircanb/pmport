/**
 * Search and social-sharing details for each public page.
 * Keys are the page path without a leading slash ('' is the home page).
 * When you add a page: add it here AND to public/sitemap.xml.
 */
export interface SeoPage{title:string;description:string;image?:string;type?:'website'|'article';published?:string;noindex?:boolean}

export const SITE_URL='https://pmport.ca';
export const SITE_NAME='PMPORT';
export const DEFAULT_IMAGE='og/default.jpg';

export const SEO_PAGES:Record<string,SeoPage>={
  '':{title:'PMPORT | Project Management, Business Analysis & Data Learning',description:'Free project management, business analysis and data analytics learning: PMP exam simulators, PM tools, articles, videos and curated learning links by Md Alamgir Hossain, PMP.'},
  'about-pmport':{title:'About PMPORT | Project Management Learning Platform',description:'PMPORT brings project management, business analysis, technology and data together in one place to learn, explore and practise.'},
  'resources':{title:'PM Knowledge Lake | Project Management Articles & Guides | PMPORT',description:'Original articles and guides on project management, business analysis, PMP mindsets, AI in project delivery and why projects fail.'},
  'resources/future-project-management-canada':{title:'The Future of Project Management in Canada | PMPORT',description:'How project delivery, business needs and data are converging in Canada, with Canadian evidence and PMI research.',image:'og/canada.jpg',type:'article',published:'2026-09-30'},
  'resources/111-essential-pmp-mindsets':{title:'111 Essential PMP Mindsets | PMPORT',description:'111 PMP exam mindsets that show how PMI expects a project manager to think, with practical explanations for situational questions.',image:'og/mindsets.jpg',type:'article',published:'2026-10-03'},
  'resources/claude-for-project-management-business-analysis':{title:'Using Claude in Project Management and Business Analysis | PMPORT',description:'A practical field manual: set up Claude, apply it across the project lifecycle and business analysis work, and use it responsibly.',image:'og/claude-guide.jpg',type:'article',published:'2026-10-09'},
  'resources/ai-super-coworker-project-manager-business-analyst':{title:'AI: Not Only a Tool but a Super Coworker for the Next-Gen PM and BA | PMPORT',description:'How AI evolved from calculator to colleague, what the 2026 data says, and a ten-year forecast for project managers and business analysts.',image:'og/ai-coworker.jpg',type:'article',published:'2026-10-13'},
  'resources/21-causes-of-project-failure':{title:'Top 21 Causes of Project Failure | PMPORT',description:'Why projects fail: 21 root causes in seven themes, the early warning signals to watch for and the practical actions that keep delivery on course.',image:'og/failure.jpg',type:'article',published:'2026-10-09'},
  'pm-tools':{title:'PM Tools | Free Project Management Templates & Tools | PMPORT',description:'Free browser-based project management tools and templates: charters, registers, earned value, diagrams and PERT/CPM scheduling.'},
  'pm-tools/diagram-studio':{title:'Diagram Studio | Free Process & Data Flow Diagram Tool | PMPORT',description:'Draw process maps, swimlanes, data flow and context diagrams in your browser and download them, free.'},
  'pm-tools/pert-cpm':{title:'PERT / CPM Calculator | Critical Path Tool | PMPORT',description:'Calculate PERT estimates, the critical path, float and project duration with a free interactive network-diagram tool.'},
  'pm-handaid':{title:'PM HandAid | Project Management Quick Help | PMPORT',description:'Quick, practical help for everyday project management tasks, terms and techniques.'},
  'pm-jobs-prep':{title:'PM JOBS Prep | Project Manager & BA Interview Preparation | PMPORT',description:'Prepare for project manager, PMO and business analyst job interviews with practical guidance and practice questions.',image:'og/jobs.jpg'},
  'pm-faciliter':{title:'PM Faciliter | Project Management Training Modules | PMPORT',description:'Learn by doing: training modules with YouTube lessons, quizzes, sequencing, diagrams, project-math practice and a practice question bank.'},
  'pm-faciliter/pmp-exam-simulator':{title:'Free PMP Exam Simulator | 5 Full Mock Exams, 900 Questions | PMPORT',description:'Five full-length PMP mock exams modelled on the July 2026 exam: 900 original questions, case studies, timed sections, breaks and domain-level results.',image:'og/exam.jpg'},
  'media':{title:'PMPortLive | Project Management Videos | PMPORT',description:'Short videos that explain one project management or business analysis concept at a time, from scope creep to verification vs validation.'},
  'events':{title:'PM Events & Gallery | PMPORT',description:'Community events, PMI South Saskatchewan activities, professional connections and posts from LinkedIn and Facebook.'},
  'pm-learninglink':{title:'PM LearningLink | 200 Best Learning Links for PM, BA, Data & Coding | PMPORT',description:'200 popular YouTube channels and websites for learning project management, business analysis, data analytics and coding, in one place.',image:'og/learninglink.jpg'},
  'about':{title:'Md Alamgir Hossain, PMP | Project & Program Manager, Regina | PMPORT',description:'Project and program management professional in Regina, Saskatchewan: PMP, CSM and ITIL certified, working where project leadership, systems analysis and data meet.',image:'og/profile.jpg'},
  'portfolio':{title:'Portfolio | Md Alamgir Hossain | PMPORT',description:'Selected projects spanning business analysis, technology, project leadership and applied learning.'},
  'portfolio/course-work':{title:'Course Work | Md Alamgir Hossain | PMPORT',description:'Academic projects in data analysis, systems development and business information systems.'},
  'portfolio/professional-work':{title:'Professional Work | Md Alamgir Hossain | PMPORT',description:'Professional project, program and change-leadership work.'},
  'education':{title:'Education | Md Alamgir Hossain | PMPORT',description:'BBA and MBA in MIS and a Business Information Systems diploma: degrees, courses and key coursework.'},
  'credentials':{title:'Credentials | PMP, CSM, ITIL | Md Alamgir Hossain | PMPORT',description:'Professional credentials with links to their public verification records.'},
  'login':{title:'Member login | PMPORT',description:'Sign in to PMPORT member features.',noindex:true},
  'pm-faciliter/member':{title:'Member area | PMPORT',description:'PMPORT member area.',noindex:true}
};
