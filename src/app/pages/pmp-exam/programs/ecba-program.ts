import type {ExamProgram} from '../exam-types';
import {ECBA_EXAMS} from '../banks/ecba';
import {ECBA_D} from '../banks/ecba/domains';

export const ECBA_DOMAINS=Object.values(ECBA_D);
const [U,M,I,C,N,S,K,V,X]=ECBA_DOMAINS;

export const ECBA_PROGRAM:ExamProgram={
  id:'ecba',code:'ECBA',store:'pmport-ecba-exam-v1-',
  heroImage:'ecba-exam-simulator.webp',heroAlt:'A new business analyst mapping a need, stakeholders and a solution around the six core concepts of business analysis',
  eyebrow:'Faciliter · ECBA exam preparation',title:'ECBA Exam Simulators',
  lead:'Five full-length ECBA mock exams with 250 original questions on the current ECBA blueprint: business analysis foundations, the BA mindset and the six core concepts of change, need, solution, stakeholder, value and context.',
  minutes:75,breakMinutes:0,pretest:0,splits:1,questionsPerExam:50,
  domains:ECBA_DOMAINS,
  weights:{[U]:20,[M]:14,[I]:6,[C]:10,[N]:10,[S]:10,[K]:10,[V]:10,[X]:10},
  tasks:{
    [U]:['What business analysis is','The business analyst role','Key terms and requirement types','The Business Analysis Core Concept Model','Business analysis across approaches'],
    [M]:['Curiosity and asking questions','Systems thinking','Adaptability and learning','Ethics, integrity and trust','Communication and collaboration'],
    [I]:['Planning business analysis work','Tailoring and governance'],
    [C]:['Understanding and planning change','Transition and readiness'],
    [N]:['Problems and opportunities','Analyzing root causes and objectives'],
    [S]:['Solution options and designs','Evaluating solution performance'],
    [K]:['Identifying and analyzing stakeholders','Eliciting and collaborating'],
    [V]:['Value and benefits','Prioritizing by value'],
    [X]:['Organizational context','Assumptions, constraints and the wider environment']},
  taskLabel:'Topic',domainLabel:'Knowledge area',approaches:[],
  exams:ECBA_EXAMS,
  facts:[{big:'50',text:'questions per exam, as on the real ECBA exam'},{big:'75',text:'minutes, no break'},{big:'250',text:'original questions across five full exams'},{big:'9',text:'knowledge areas, including the six core concepts of business analysis'}],
  coverageEyebrow:'ECBA exam blueprint',coverageTitle:'What the simulator covers',
  standardEyebrow:'IIBA® entry certificate',standardTitle:'Built for the ECBA exam',
  standardBullets:[
    '<strong>Foundations:</strong> what business analysis is, the BA role, key terms and requirement types',
    '<strong>Mindset:</strong> curiosity, systems thinking, adaptability, ethics and collaboration',
    '<strong>Core concepts:</strong> change, need, solution, stakeholder, value and context, applied to everyday situations',
    '<strong>Techniques in context:</strong> interviews, workshops, observation, document analysis, process models, prototypes, root cause analysis and prioritization',
    '<strong>Item types:</strong> situation-based and standard multiple choice'],
  rules:[
    'The exam has <strong>50 questions</strong> and a <strong>75-minute</strong> time limit, with no break.',
    'Each question has one best answer. Read situation-based questions carefully: the best answer fits the situation, not just the definition.',
    'Use <strong>Flag for review</strong> and the <strong>review</strong> screen to revisit unanswered or flagged items before you finish.',
    'Use the <strong>✕</strong> button beside an option to strike it out.',
    'Your progress is saved in this browser, so you can close the page and resume later.'],
  examMeta:'Full mock · 50 questions · 75 minutes',
  ratingNote:'IIBA does not publish a passing score or rating bands. These cut-offs are PMPORT estimates to guide your practice.',
  resultsNote:'Aim to score consistently at or above about 75% on full-length mocks before booking the real exam. Use the knowledge-area results to target your study.',
  refPrefix:'Reference',
  disclaimer:'All questions are original PMPORT practice items written to the public ECBA™ exam blueprint, The Business Analysis Standard and the BABOK® Guide. They are not actual exam questions. IIBA®, BABOK® and ECBA™ are trademarks of the International Institute of Business Analysis. PMPORT is not affiliated with or endorsed by IIBA.',
  calculator:false,cuts:[80,70,55],
};
