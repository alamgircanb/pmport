/**
 * PMPORT PMP Exam Simulator — data model.
 * Aligned to the PMP® Examination Content Outline (July 2026):
 * People 33% (8 tasks), Process 41% (10 tasks), Business Environment 26% (8 tasks).
 */
export type Domain='People'|'Process'|'Business Environment';
export type Approach='Predictive'|'Agile'|'Hybrid';
export type ItemType='single'|'multi'|'matching'|'dropdown'|'hotspot';
/** Id of an exhibit in exam-graphics-data.ts. */
export type GraphicId=string;

export interface ExamQuestion{
  id:string;
  domain:Domain;
  /** ECO task number within the domain (1-based). */
  task:number;
  approach:Approach;
  type:ItemType;
  /** Case-study id for questions in the case section. */
  caseId?:string;
  graphic?:GraphicId;
  stem:string;
  /** Options for single, multi, dropdown and hotspot (hotspot options are region labels). */
  options?:string[];
  /** Correct option indexes. single/dropdown/hotspot: one index; multi: several. */
  answer?:number[];
  /** Matching: left-hand prompts and the correct right-hand option index for each. */
  pairs?:{left:string;right:number}[];
  /** Matching: right-hand choices. */
  choices?:string[];
  explanation:string;
  /** PMBOK® Guide 8th Edition anchor: principle, performance domain and/or focus area. */
  ref:string;
}

export interface CaseStudy{id:string;title:string;context:string[];graphic?:GraphicId}

export const ECO_TASKS:Record<Domain,string[]>={
  'People':['Develop a common vision','Manage conflicts','Lead the project team','Engage stakeholders','Align stakeholder expectations','Manage stakeholder expectations','Help ensure knowledge transfer','Plan and manage communication'],
  'Process':['Develop an integrated project management plan and plan delivery','Develop and manage project scope','Help ensure value-based delivery','Plan and manage resources','Plan and manage procurement','Plan and manage finance','Plan and optimize quality of products/deliverables','Plan and manage schedule','Evaluate project status','Manage project closure'],
  'Business Environment':['Define and establish project governance','Plan and manage project compliance','Manage and control changes','Remove impediments and manage issues','Plan and manage risk','Continuous improvement','Support organizational change','Evaluate external business environment changes']
};

export const DOMAIN_WEIGHT:Record<Domain,number>={'People':33,'Process':41,'Business Environment':26};

/** One complete mock exam: three case studies (10 questions each) and 150 independent questions. */
export interface ExamSet{id:number;title:string;subtitle:string;cases:CaseStudy[];caseQuestions:ExamQuestion[];questions:ExamQuestion[]}
