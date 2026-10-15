import type {ExamProgram} from '../exam-types';
import {ITIL_EXAMS} from '../banks/itil';
import {ITIL_D} from '../banks/itil/domains';

export const ITIL_DOMAINS=Object.values(ITIL_D);
const [T,F,L,V,S,A,O]=ITIL_DOMAINS;

export const ITIL_PROGRAM:ExamProgram={
  id:'itil',overview:'/pm-faciliter/itil-foundation',code:'ITIL 5 Foundation',store:'pmport-itil5-exam-v1-',
  heroImage:'itil-exam-simulator.webp',heroAlt:'A service management team looking at a digital service lifecycle, value streams and an AI assistant on a service dashboard',
  eyebrow:'Faciliter · ITIL® (Version 5) Foundation preparation',title:'ITIL 5 Foundation Exam Simulators',
  lead:'Five full-length ITIL® Foundation (Version 5) mock exams with 200 original questions, weighted like the Version 5 syllabus: key terms, the four dimensions, the product and service lifecycle, the value system, value streams, AI and other frameworks.',
  minutes:60,breakMinutes:0,pretest:0,splits:1,questionsPerExam:40,
  domains:ITIL_DOMAINS,
  weights:{[T]:30,[F]:10,[L]:10,[V]:40,[S]:5,[A]:2.5,[O]:2.5},
  tasks:{
    [T]:['Products, services and offerings','Value, outcomes, costs and risks','Utility and warranty','Service relationships and roles'],
    [F]:['The four dimensions','External factors'],
    [L]:['Lifecycle activities','Working across the lifecycle'],
    [V]:['Guiding principles','Governance','Practices','Continual improvement','From opportunity and demand to value'],
    [S]:['Identifying and mapping value streams'],
    [A]:['AI in product and service management'],
    [O]:['ITIL with Agile, DevOps and PRINCE2']},
  taskLabel:'Topic',domainLabel:'Syllabus area',approaches:[],
  exams:ITIL_EXAMS,
  facts:[{big:'40',text:'multiple-choice questions per exam'},{big:'60',text:'minutes, closed book'},{big:'65%',text:'pass mark (26 of 40) on the real exam'},{big:'200',text:'original questions across five full exams'}],
  coverageEyebrow:'ITIL Foundation (Version 5) syllabus',coverageTitle:'What the simulator covers',
  standardEyebrow:'ITIL® (Version 5)',standardTitle:'Built for the Version 5 Foundation exam',
  standardBullets:[
    '<strong>Key terms:</strong> products, services, value, outcomes, costs, risks, utility and warranty',
    '<strong>Four dimensions:</strong> organizations and people, information and technology, partners and suppliers, value streams and processes',
    '<strong>Product and service lifecycle:</strong> discover, design, acquire, build, transition, operate, deliver and support',
    '<strong>ITIL value system:</strong> the seven guiding principles, governance, practices and continual improvement',
    '<strong>New in Version 5:</strong> AI in service management and how ITIL works with other frameworks'],
  rules:[
    'The exam has <strong>40 questions</strong> and a <strong>60-minute</strong> time limit, with no break.',
    'Each question has one correct answer. Some ask you to complete a sentence or choose a pair of statements from a list.',
    'The pass mark on the real exam is <strong>26 out of 40 (65%)</strong>.',
    'Use <strong>Flag for review</strong> and the <strong>review</strong> screen to revisit unanswered or flagged items before you finish.',
    'Your progress is saved in this browser, so you can close the page and resume later.'],
  examMeta:'Full mock · 40 questions · 60 minutes',
  ratingNote:'The real exam is pass or fail with a pass mark of 65%. "Target" here starts at that pass mark; the other bands are PMPORT guidance.',
  resultsNote:'The pass mark is 26 out of 40 (65%). Aim for 75% or more on several mocks before booking the real exam, so you have a safety margin.',
  refPrefix:'ITIL® (Version 5)',
  disclaimer:'All questions are original PMPORT practice items written to the public ITIL® Foundation (Version 5) syllabus. They are not actual exam questions. ITIL® is a registered trademark of PeopleCert group. PMPORT is not affiliated with or endorsed by PeopleCert or AXELOS.',
  calculator:false,cuts:[80,65,50],
};
