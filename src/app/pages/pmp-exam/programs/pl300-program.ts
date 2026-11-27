import type {ExamProgram} from '../exam-types';
import {PL300_EXAMS} from '../banks/pl300';
import {PL_D} from '../banks/pl300/domains';

export const PL300_DOMAINS=Object.values(PL_D);
const [P,M,V,S]=PL300_DOMAINS;

export const PL300_PROGRAM:ExamProgram={
  id:'pl300',overview:'/pm-faciliter/pl300',code:'PL-300',store:'pmport-pl300-exam-v1-',
  heroImage:'pl300-exam-simulator.webp',heroAlt:'A star schema data model beside a report with KPI cards and a combined bar and line chart',
  eyebrow:'Exam Faciliter · Power BI Data Analyst (PL-300) preparation',title:'Power BI Data Analyst (PL-300) Exam Simulators',
  lead:'1,000 original Power BI questions: 250 for each PL-300 skill area (prepare, model, visualize and analyze, manage and secure). Twenty timed mock exams with a case study each, every question type you will meet (multiple choice, multiple answer, drag-and-drop ordering, drop-down DAX and M completion, Yes/No series, hotspot exhibits and matching) and an explanation for every answer whenever you ask for it.',
  minutes:100,breakMinutes:0,pretest:0,splits:1,questionsPerExam:50,
  domains:PL300_DOMAINS,
  weights:{[P]:25,[M]:25,[V]:25,[S]:25},
  tasks:{
    [P]:['Connect to data sources and shared semantic models','Storage modes, credentials, privacy levels and parameters','Profile data and resolve data quality issues','Resolve import errors and choose data types','Create and transform columns; group and aggregate rows','Pivot, unpivot, transpose and semi-structured data','Merge, append, reference and duplicate queries','Fact and dimension tables, keys and query load settings'],
    [M]:['Table and column properties','Relationships, cardinality and cross-filter direction','Role-playing dimensions and date tables','Row-level security roles','Measures, aggregations and CALCULATE','Time intelligence, statistical and semi-additive measures','Calculated columns, calculated tables, quick measures and calculation groups','Optimize model performance'],
    [V]:['Select, format and configure visuals','Themes, conditional formatting and page settings','Filters, slicers and paginated reports','Bookmarks, tooltips, interactions and navigation','Drillthrough, drill down, sorting, sync slicers and the selection pane','Mobile layout, accessibility, export, personalization and page refresh','Visual calculations, grouping, binning and clustering','Analytics pane, AI visuals, anomalies and Copilot'],
    [S]:['Create and configure workspaces','Publish, update and distribute content with apps','Dashboards, subscriptions and data alerts','Gateways and scheduled refresh','Workspace roles and item-level access','Row-level security membership and semantic model access','Endorsement, sensitivity labels and governance']},
  taskLabel:'Skill',domainLabel:'Skill area',approaches:[],
  exams:PL300_EXAMS,
  facts:[{big:'1,000',text:'original questions: 250 in each of the four skill areas'},{big:'20',text:'timed mock exams, 50 questions and 100 minutes each'},{big:'7',text:'question types, including case studies, DAX drop-downs and ordering'},{big:'700',text:'out of 1,000: the scaled passing score Microsoft uses'}],
  coverageEyebrow:'PL-300 skill areas',coverageTitle:'What the simulator covers',
  standardEyebrow:'Microsoft Power BI',standardTitle:'Built for the Power BI Data Analyst exam',
  standardBullets:[
    '<strong>Prepare the data:</strong> connectors, storage modes, privacy levels, parameters, profiling, data types, Power Query transforms, merge and append, and load settings',
    '<strong>Model the data:</strong> star schemas, relationships and cross-filtering, date tables, role-playing dimensions, row-level security, DAX with CALCULATE, time intelligence and performance tuning',
    '<strong>Visualize and analyze:</strong> choosing visuals, themes, conditional formatting, slicers, bookmarks, drillthrough, tooltips, mobile layout, accessibility, visual calculations and AI visuals',
    '<strong>Manage and secure:</strong> workspaces and roles, apps, dashboards, subscriptions and alerts, gateways and refresh, RLS membership, Build permission, endorsement and sensitivity labels',
    '<strong>Every question type:</strong> single and multiple answer, ordering, drop-down completion, Yes/No series, hotspot exhibits, matching and case studies'],
  rules:[
    'Each mock has <strong>50 questions</strong> and a <strong>100-minute</strong> time limit: a case study first, then 45 independent questions.',
    'Read each question\'s instructions. Some ask you to <strong>select two or three</strong> answers, <strong>arrange actions in order</strong>, <strong>complete DAX or Power Query code</strong> from drop-down lists, answer a <strong>Yes/No series</strong> or <strong>click an area</strong> of an exhibit.',
    'In the case study, use <strong>Show case</strong> to reread the scenario at any time.',
    'Use the <strong>✕</strong> button beside an option to strike it out, and <strong>Flag for review</strong> to come back to a question.',
    'Explanations appear in the answer review after you finish. In <strong>practice mode</strong>, press <strong>Show answer</strong> whenever you want the solution and explanation.',
    'Your progress is saved in this browser, so you can close the page and resume later.'],
  examMeta:'Full mock · 50 questions · 100 minutes',
  ratingNote:'Microsoft reports a scaled score from 1 to 1,000 and a pass at 700, but the scaled score is not a simple percentage. These cut-offs are PMPORT estimates for practice.',
  resultsNote:'Aim to score 80% or more on several different mocks before booking the real exam, and use the skill results to choose what to study next.',
  refPrefix:'Topic',
  disclaimer:'All questions and explanations are original PMPORT practice items written to the public skills measured for Exam PL-300. They are not actual exam questions and are not taken from Microsoft exams or from exam dump sites. Performance ratings are PMPORT estimates. Microsoft, Power BI and Excel are trademarks of the Microsoft group of companies. PMPORT is not affiliated with or endorsed by Microsoft.',
  calculator:false,cuts:[85,75,60],
};
