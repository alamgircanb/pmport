import type {ExamProgram} from '../exam-types';
import {RMP_EXAMS} from '../banks/rmp';
import {RMP_D} from '../banks/rmp/domains';

export const RMP_DOMAINS=Object.values(RMP_D);
const [S,I,A,R,M]=RMP_DOMAINS;

export const RMP_PROGRAM:ExamProgram={
  id:'rmp',overview:'/pm-faciliter/rmp',code:'PMI-RMP',store:'pmport-rmp-exam-v1-',
  heroImage:'rmp-exam-simulator.webp',heroAlt:'A probability and impact heat map with risk markers, a risk trend line and an S-curve on a project risk dashboard',
  eyebrow:'Exam Faciliter · Risk management (PMI-RMP®) preparation',title:'Risk Management (PMI-RMP) Exam Simulators',
  lead:'Five full-length risk management mock exams with 575 original questions, weighted like the five PMI-RMP® domains: risk strategy and planning, identification, analysis, response, and monitoring and closing risks. Timed, with EMV, PERT and decision tree math and results by domain.',
  minutes:150,breakMinutes:0,pretest:15,splits:1,questionsPerExam:115,
  domains:RMP_DOMAINS,
  weights:{[S]:22,[I]:23,[A]:23,[R]:13,[M]:19},
  tasks:{
    [S]:['Perform a preliminary document analysis','Assess the project environment for threats and opportunities','Confirm risk thresholds based on risk appetite','Establish the risk management strategy','Document the risk management plan','Plan and lead risk management activities with stakeholders'],
    [I]:['Conduct risk identification exercises','Examine assumption and constraint analyses','Document risk triggers and thresholds','Develop the risk register'],
    [A]:['Perform qualitative analysis','Perform quantitative analysis','Identify threats and opportunities'],
    [R]:['Plan risk responses','Implement risk responses'],
    [M]:['Gather and analyze performance data','Monitor residual and secondary risks','Update project documents with risk information','Monitor project risk levels']},
  taskLabel:'Task',domainLabel:'Domain',approaches:[],
  exams:RMP_EXAMS,
  facts:[{big:'115',text:'questions (100 scored + 15 unscored pretest)'},{big:'150',text:'minutes for the whole exam'},{big:'5',text:'domains: planning 22%, identification 23%, analysis 23%, response 13%, monitoring 19%'},{big:'575',text:'original questions across five full exams'}],
  coverageEyebrow:'PMI-RMP® domains',coverageTitle:'What the simulator covers',
  standardEyebrow:'Project risk management',standardTitle:'Built for the risk management professional exam',
  standardBullets:[
    '<strong>Strategy and planning:</strong> document analysis, the risk environment, appetite and thresholds, tailoring and the risk management plan',
    '<strong>Identification:</strong> workshops, prompt lists, assumption and constraint analysis, triggers, risk statements and the register',
    '<strong>Analysis:</strong> probability and impact, risk parameters, EMV, PERT, decision trees, Monte Carlo, S-curves and tornado charts',
    '<strong>Response:</strong> threat and opportunity strategies, contingency and fallback plans, secondary risks and reserves',
    '<strong>Monitoring and closing:</strong> performance data, reserve analysis, residual risk, audits, trends, reports and lessons learned'],
  rules:[
    'The exam has <strong>115 questions</strong> and a <strong>150-minute</strong> time limit.',
    'Most questions have one correct answer. Some ask you to <strong>choose two</strong> or to <strong>match</strong> items.',
    'Use the <strong>✕</strong> button beside an option to strike it out, and the <strong>calculator</strong> for EMV, PERT and decision tree questions.',
    'Fifteen questions are <strong>unscored pretest items</strong>, as on the real exam. You will not know which ones until your results.',
    'Use <strong>Flag for review</strong> and the <strong>review</strong> screen to revisit unanswered or flagged items before you finish.',
    'Your progress is saved in this browser, so you can close the page and resume later.'],
  examMeta:'Full mock · 115 questions · 150 minutes',
  ratingNote:'PMI reports results by domain but does not publish the passing score or the rating thresholds. These cut-offs are PMPORT estimates for practice.',
  resultsNote:'Aim to score consistently at or above about 75% on full-length mocks before booking the real exam. Use the domain and task results to target your study.',
  refPrefix:'Topic',
  disclaimer:'All questions and explanations are original PMPORT practice items written to the public topics of the PMI-RMP® exam. They are not actual exam questions and are not taken from PMI publications. Performance ratings are PMPORT estimates; PMI does not publish the passing score. PMI-RMP®, PMBOK® and PMI® are registered marks of Project Management Institute, Inc. PMPORT is not affiliated with or endorsed by PMI.',
  calculator:true,cuts:[80,65,50],
};
