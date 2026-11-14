import type {ExamProgram} from '../exam-types';
import {CCMP_EXAMS} from '../banks/ccmp';
import {CCMP_D} from '../banks/ccmp/domains';

export const CCMP_DOMAINS=Object.values(CCMP_D);
const [F,E,S,P,X,C]=CCMP_DOMAINS;

export const CCMP_PROGRAM:ExamProgram={
  id:'ccmp',overview:'/pm-faciliter/ccmp',code:'CCMP',store:'pmport-ccmp-exam-v1-',
  heroImage:'ccmp-exam-simulator.webp',heroAlt:'A change adoption curve rising across the five process groups, from evaluate to complete, with an active sponsor badge',
  eyebrow:'Exam Faciliter · CCMP® change management preparation',title:'CCMP Change Management Exam Simulators',
  lead:'Two full-length CCMP® mock exams with 300 original change management questions, built around the process groups of the ACMP Standard for Change Management®: evaluate impact and readiness, formulate the strategy, develop the plan, execute it and complete the effort.',
  minutes:180,breakMinutes:0,pretest:0,splits:1,questionsPerExam:150,
  domains:CCMP_DOMAINS,
  weights:{[F]:10,[E]:20,[S]:20,[P]:15,[X]:25,[C]:10},
  tasks:{
    [F]:['Change models and theory','Roles in a change','Individual and organizational change','Professional ethics'],
    [E]:['Define the change and its business drivers','Identify stakeholders and impacted groups','Assess change impact','Assess organizational readiness and culture','Identify change risks and likely resistance'],
    [S]:['Sponsorship and governance strategy','Stakeholder engagement and communication strategy','Learning and capability strategy','Resistance and risk mitigation strategy','Measurement and sustainment strategy'],
    [P]:['Integrate with the project plan','Sponsor and leader roadmaps','Communication plan','Training plan','Coaching, resistance and reinforcement plans','Measurement plan and success criteria'],
    [X]:['Engage sponsors and leaders','Deliver communication and gather feedback','Equip managers and change agents','Deliver training and support','Manage resistance','Monitor adoption and adjust the plan'],
    [C]:['Evaluate adoption and outcomes','Transfer ownership and sustain the change','Capture and share lessons learned','Close the change effort']},
  taskLabel:'Topic',domainLabel:'Process group',approaches:[],
  exams:CCMP_EXAMS,
  facts:[{big:'150',text:'multiple-choice questions per exam'},{big:'3',text:'hours, like the real CCMP exam'},{big:'6',text:'areas: foundations and the five process groups'},{big:'300',text:'original questions across two full exams'}],
  coverageEyebrow:'ACMP Standard for Change Management®',coverageTitle:'What the simulator covers',
  standardEyebrow:'CCMP® by ACMP',standardTitle:'Built on the change management process groups',
  standardBullets:[
    '<strong>Evaluate:</strong> define the change, find the impacted groups, assess impact, readiness, culture and risk',
    '<strong>Formulate:</strong> sponsorship, engagement, communication, learning, resistance and sustainment strategies',
    '<strong>Develop:</strong> integrated plans for sponsors, communication, training, coaching, reinforcement and measurement',
    '<strong>Execute:</strong> engage sponsors, equip managers, deliver communication and training, manage resistance, track adoption',
    '<strong>Complete:</strong> evaluate outcomes, hand over ownership, sustain the change and share lessons learned'],
  rules:[
    'Each exam has <strong>150 multiple-choice questions</strong> and a <strong>3-hour</strong> time limit, with no break.',
    'Each question has four options and one correct answer. Most questions are short workplace scenarios.',
    'ACMP does not publish a fixed pass percentage. Treat <strong>70%</strong> as the PMPORT target for being ready.',
    'Use <strong>Flag for review</strong> and the <strong>review</strong> screen to revisit unanswered or flagged items before you finish.',
    'Your progress is saved in this browser, so you can close the page and resume later.'],
  examMeta:'Full mock · 150 questions · 3 hours',
  ratingNote:'ACMP does not publish a fixed pass percentage. The rating bands here are PMPORT guidance: "Target" starts at 70%.',
  resultsNote:'Aim for 75% or more on both mocks, and review every explanation, before booking the real exam.',
  refPrefix:'ACMP Standard for Change Management®',
  disclaimer:'All questions are original PMPORT practice items written to the public process groups of the ACMP Standard for Change Management®. They are not actual exam questions. CCMP® and the Standard for Change Management® are marks of the Association of Change Management Professionals (ACMP). ADKAR® is a registered trademark of Prosci, Inc.; questions that mention it describe the model in PMPORT\'s own words. PMPORT is not affiliated with or endorsed by ACMP or Prosci.',
  calculator:false,cuts:[80,70,60],
};
