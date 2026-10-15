import type {ExamProgram} from '../exam-types';
import {CBAP_EXAMS} from '../banks/cbap';
import {CBAP_D} from '../banks/cbap/domains';

export const CBAP_DOMAINS=Object.values(CBAP_D);
const [P,E,L,S,R,V]=CBAP_DOMAINS;

export const CBAP_PROGRAM:ExamProgram={
  id:'cbap',code:'CBAP',store:'pmport-cbap-exam-v1-',
  heroImage:'cbap-exam-simulator.webp',heroAlt:'A senior business analyst reviewing a case study with requirements models, a traceability matrix and a value analysis',
  eyebrow:'Faciliter · CBAP exam preparation',title:'CBAP Exam Simulators',
  lead:'Five full-length CBAP mock exams with 600 original scenario and case-study questions across the six BABOK® Guide knowledge areas, weighted like the real exam.',
  minutes:210,breakMinutes:0,pretest:0,splits:1,questionsPerExam:120,
  domains:CBAP_DOMAINS,
  weights:{[P]:14,[E]:12,[L]:15,[S]:15,[R]:30,[V]:14},
  tasks:{
    [P]:['Plan Business Analysis Approach','Plan Stakeholder Engagement','Plan Business Analysis Governance','Plan Business Analysis Information Management','Identify Business Analysis Performance Improvements'],
    [E]:['Prepare for Elicitation','Conduct Elicitation','Confirm Elicitation Results','Communicate Business Analysis Information','Manage Stakeholder Collaboration'],
    [L]:['Trace Requirements','Maintain Requirements','Prioritize Requirements','Assess Requirements Changes','Approve Requirements'],
    [S]:['Analyze Current State','Define Future State','Assess Risks','Define Change Strategy'],
    [R]:['Specify and Model Requirements','Verify Requirements','Validate Requirements','Define Requirements Architecture','Define Design Options','Analyze Potential Value and Recommend Solution'],
    [V]:['Measure Solution Performance','Analyze Performance Measures','Assess Solution Limitations','Assess Enterprise Limitations','Recommend Actions to Increase Solution Value']},
  taskLabel:'Task',domainLabel:'Knowledge area',approaches:[],
  exams:CBAP_EXAMS,
  facts:[{big:'120',text:'scenario and case-study questions per exam'},{big:'210',text:'minutes (3.5 hours), no scheduled break'},{big:'600',text:'original questions across five full exams'},{big:'30%',text:'on Requirements Analysis and Design Definition, the largest knowledge area'}],
  coverageEyebrow:'CBAP exam blueprint',coverageTitle:'What the simulator covers',
  standardEyebrow:'BABOK® Guide v3',standardTitle:'Built for the CBAP exam',
  standardBullets:[
    '<strong>Six knowledge areas</strong> and all 30 BABOK® tasks, weighted like the CBAP blueprint',
    '<strong>Case studies:</strong> each exam opens with three multi-paragraph cases and four questions on each',
    '<strong>Scenario questions:</strong> choose what a senior business analyst should do next, not just a definition',
    '<strong>Techniques in context:</strong> modelling, traceability, prioritization, risk analysis, business cases, metrics and KPIs',
    '<strong>Item type:</strong> multiple choice with one best answer'],
  rules:[
    'The exam has <strong>120 questions</strong> and a <strong>210-minute</strong> time limit, with no scheduled break.',
    '<strong>Section 1</strong> contains three case studies with four questions each. The case stays visible while you answer. <strong>Once you end Section 1, you cannot return to it.</strong>',
    'Each question has one best answer. Choose what a senior business analyst should do in the situation described.',
    'Use <strong>Flag for review</strong> and the <strong>section review</strong> screen to revisit unanswered or flagged items before ending a section.',
    'Use the <strong>✕</strong> button beside an option to strike it out.',
    'Your progress is saved in this browser, so you can close the page and resume later.'],
  examMeta:'Full mock · 120 questions · 210 minutes',
  ratingNote:'IIBA does not publish a passing score or rating bands. These cut-offs are PMPORT estimates to guide your practice.',
  resultsNote:'Aim to score consistently at or above about 75% on full-length mocks before booking the real exam. Use the knowledge-area and task results to target your study.',
  refPrefix:'BABOK® Guide v3',
  disclaimer:'All questions are original PMPORT practice items written to the public CBAP® exam blueprint and the BABOK® Guide v3. They are not actual exam questions. IIBA®, BABOK® and CBAP® are registered trademarks of the International Institute of Business Analysis. PMPORT is not affiliated with or endorsed by IIBA.',
  calculator:true,cuts:[80,70,55],
};
