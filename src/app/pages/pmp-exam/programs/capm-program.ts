import type {ExamProgram} from '../exam-types';
import {CAPM_EXAMS} from '../banks/capm';
import {CAPM_D} from '../banks/capm/domains';

export const CAPM_DOMAINS=Object.values(CAPM_D);
const [D1,D2,D3,D4]=CAPM_DOMAINS;

export const CAPM_PROGRAM:ExamProgram={
  id:'capm',overview:'/pm-faciliter/capm',code:'CAPM',store:'pmport-capm-exam-v1-',
  heroImage:'capm-exam-simulator.webp',heroAlt:'A new project team member studying a project life cycle, a Kanban board and a requirements map on a large screen',
  eyebrow:'Exam Faciliter · CAPM exam preparation',title:'CAPM Exam Simulators',
  lead:'Five full-length CAPM mock exams with 750 original questions on the current CAPM Examination Content Outline: project fundamentals, predictive planning, agile frameworks and business analysis. Timed, with a break after question 75 and results by domain.',
  minutes:180,breakMinutes:10,pretest:15,splits:2,questionsPerExam:150,
  domains:CAPM_DOMAINS,
  weights:{[D1]:36,[D2]:17,[D3]:20,[D4]:27},
  tasks:{
    [D1]:['Project life cycles and processes','Project management planning','Project roles and responsibilities','Follow and execute planned strategies or frameworks','Common problem-solving tools and techniques'],
    [D2]:['When a predictive, plan-based approach fits','The project management plan schedule','Documenting controls for predictive projects'],
    [D3]:['When an adaptive approach fits','Planning project iterations','Documenting controls for adaptive projects','Components of an adaptive plan','Preparing and executing task management steps'],
    [D4]:['Business analysis roles and responsibilities','Stakeholder communication','Gathering requirements','Product roadmaps','How project methodologies influence business analysis','Validating requirements through product delivery']},
  taskLabel:'Task',domainLabel:'Domain',approaches:['Predictive','Agile','Hybrid'],
  exams:CAPM_EXAMS,
  facts:[{big:'150',text:'questions (135 scored + 15 unscored pretest)'},{big:'180',text:'minutes, with an optional 10-minute break after question 75'},{big:'750',text:'original questions across five full exams'},{big:'4',text:'domains: fundamentals 36%, predictive 17%, agile 20%, business analysis 27%'}],
  coverageEyebrow:'CAPM Examination Content Outline',coverageTitle:'What the simulator covers',
  standardEyebrow:'Entry-level project management',standardTitle:'Built for the CAPM exam',
  standardBullets:[
    '<strong>Fundamentals:</strong> life cycles, planning, roles, risk and communication strategies, and problem-solving tools',
    '<strong>Predictive:</strong> when to use a plan-based approach, schedules, baselines and project controls',
    '<strong>Agile:</strong> Scrum, Kanban, XP, iterations, backlogs, adaptive controls and task boards',
    '<strong>Business analysis:</strong> BA roles, stakeholder communication, elicitation, roadmaps, traceability and acceptance',
    '<strong>Item types:</strong> multiple choice, multiple response and matching (drag-and-drop style)'],
  rules:[
    'The exam has <strong>150 questions</strong> and a <strong>180-minute</strong> time limit. The timer pauses during the break.',
    'Questions are split into two sections of 75. After Section 1 you may take an optional <strong>10-minute break</strong>. <strong>Once you end Section 1, you cannot return to it.</strong>',
    'Use <strong>Flag for review</strong> and the <strong>section review</strong> screen to revisit unanswered or flagged items before ending a section.',
    'Use the <strong>✕</strong> button beside an option to strike it out, and the <strong>calculator</strong> for schedule and cost questions.',
    'Fifteen questions are <strong>unscored pretest items</strong>, as on the real exam. You will not know which ones until your results.',
    'Your progress is saved in this browser, so you can close the page and resume later.'],
  examMeta:'Full mock · 150 questions · 180 minutes',
  ratingNote:'PMI reports CAPM performance by domain using these four categories but does not publish the thresholds. These cut-offs are PMPORT estimates for practice.',
  resultsNote:'Aim to score consistently at or above about 75% on full-length mocks before booking the real exam. Use the domain and task results to target your study.',
  refPrefix:'Reference',
  disclaimer:'All questions are original PMPORT practice items written to the public CAPM® Examination Content Outline. They are not actual exam questions. Performance ratings are PMPORT estimates; PMI does not publish the passing score. CAPM®, PMBOK® and PMI® are registered marks of Project Management Institute, Inc. PMPORT is not affiliated with or endorsed by PMI.',
  calculator:true,cuts:[80,65,50],
};
