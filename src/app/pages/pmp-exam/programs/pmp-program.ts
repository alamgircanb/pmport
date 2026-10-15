import {DOMAIN_WEIGHT,ECO_TASKS,type ExamProgram} from '../exam-types';
import {EXAMS} from '../questions';

export const PMP_PROGRAM:ExamProgram={
  id:'pmp',code:'PMP',store:'pmport-pmp-exam-v2-',
  heroImage:'pmp-exam-simulator.webp',heroAlt:'Candidate taking a computer-based exam with project charts floating around the workstation',
  eyebrow:'Faciliter · PMP exam preparation',title:'PMP Exam Simulators',
  lead:'Five full-length mock exams modelled on the July 2026 PMP exam—case studies, timed sections, breaks and domain-level results—with 900 original questions reflecting the PMBOK® Guide, Eighth Edition.',
  minutes:240,breakMinutes:10,pretest:10,splits:2,questionsPerExam:180,
  domains:['People','Process','Business Environment'],weights:DOMAIN_WEIGHT,tasks:ECO_TASKS,taskLabel:'Task',domainLabel:'Domain',
  approaches:['Predictive','Agile','Hybrid'],
  exams:EXAMS,
  facts:[{big:'180',text:'questions (170 scored + 10 unscored pretest)'},{big:'240',text:'minutes, plus two optional 10-minute breaks'},{big:'900',text:'original questions across five full exams, each opening with three case studies'},{big:'~60%',text:'agile and hybrid scenarios, ~40% predictive'}],
  coverageEyebrow:'Exam content outline · July 2026',coverageTitle:'What the simulator covers',
  standardEyebrow:'PMBOK® Guide, Eighth Edition',standardTitle:'Built on the latest standard',
  standardBullets:[
    '<strong>Six principles:</strong> holistic view, value, quality, accountable leadership, sustainability and empowered culture',
    '<strong>Seven performance domains:</strong> governance, scope, schedule, finance, stakeholders, resources and risk',
    '<strong>Five focus areas:</strong> initiating, planning, executing, monitoring and controlling, and closing',
    '<strong>New emphasis:</strong> AI in project work, sustainability, value delivery and governance',
    '<strong>Item types:</strong> case sets, graphic-based items, multiple choice, multiple response, matching, pull-down lists and point-and-click hotspots'],
  rules:[
    'The exam has <strong>180 questions</strong> and a <strong>240-minute</strong> time limit. The timer runs only while you are answering questions; it pauses during breaks.',
    '<strong>Section 1</strong> contains three case studies with 10 questions each. Read the case on the left; it stays visible while you answer.',
    'After Section 1 and Section 2 you may take an optional <strong>10-minute break</strong>. <strong>Once you end a section, you cannot return to it.</strong>',
    'Use <strong>Flag for review</strong> to mark questions, and the <strong>section review</strong> screen to revisit unanswered or flagged items before ending a section.',
    'Right-click is not needed: use the <strong>✕</strong> button beside an option to strike it out, and the <strong>calculator</strong> in the top bar for project-math questions.',
    'Ten questions are <strong>unscored pretest items</strong>, as on the real exam. You will not know which ones until your results.',
    'Your progress is saved in this browser, so you can close the page and resume later.'],
  examMeta:'Full mock · 180 questions · 240 minutes',
  ratingNote:'PMI reports performance by domain using these four categories but does not publish the thresholds. These cut-offs are PMPORT estimates for practice.',
  resultsNote:'Many candidates aim to score consistently at or above about 75% on full-length mocks before booking the real exam. Use the domain and task results to target your study.',
  refPrefix:'PMBOK® Guide 8',
  disclaimer:'All questions are original PMPORT practice items written to the public PMP® Examination Content Outline (July 2026) and the PMBOK® Guide, Eighth Edition. They are not actual exam questions. Performance ratings are PMPORT estimates; PMI does not publish the passing score. PMP®, PMBOK® and PMI® are registered marks of Project Management Institute, Inc. PMPORT is not affiliated with or endorsed by PMI.',
  calculator:true,cuts:[80,65,50],
};
