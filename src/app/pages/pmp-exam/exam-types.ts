/**
 * PMPORT PMP Exam Simulator — data model.
 * Aligned to the PMP® Examination Content Outline (July 2026):
 * People 33% (8 tasks), Process 41% (10 tasks), Business Environment 26% (8 tasks).
 */
/** Exam domain (PMP/CAPM), knowledge area (ECBA/CBAP) or syllabus category (ITIL). */
export type Domain=string;
/** Delivery approach tag (PMP and CAPM only). */
export type Approach=string;
export type ItemType='single'|'multi'|'matching'|'dropdown'|'hotspot';
/** Id of an exhibit in exam-graphics-data.ts. */
export type GraphicId=string;

export interface ExamQuestion{
  id:string;
  domain:Domain;
  /** ECO task number within the domain (1-based). */
  task:number;
  approach?:Approach;
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

export const ECO_TASKS:Record<string,string[]>={
  'People':['Develop a common vision','Manage conflicts','Lead the project team','Engage stakeholders','Align stakeholder expectations','Manage stakeholder expectations','Help ensure knowledge transfer','Plan and manage communication'],
  'Process':['Develop an integrated project management plan and plan delivery','Develop and manage project scope','Help ensure value-based delivery','Plan and manage resources','Plan and manage procurement','Plan and manage finance','Plan and optimize quality of products/deliverables','Plan and manage schedule','Evaluate project status','Manage project closure'],
  'Business Environment':['Define and establish project governance','Plan and manage project compliance','Manage and control changes','Remove impediments and manage issues','Plan and manage risk','Continuous improvement','Support organizational change','Evaluate external business environment changes']
};

export const DOMAIN_WEIGHT:Record<string,number>={'People':33,'Process':41,'Business Environment':26};

/** One complete mock exam: optional case studies plus independent questions. */
export interface ExamSet{id:number;title:string;subtitle:string;cases:CaseStudy[];caseQuestions:ExamQuestion[];questions:ExamQuestion[]}

/** Everything that differs between certifications: timing, structure, outline and page text. */
export interface ExamProgram{
  id:string;
  /** Short name, e.g. PMP, CAPM, ECBA, CBAP, ITIL 5 Foundation. */
  code:string;
  /** localStorage key prefix for saved attempts (per browser). */
  store:string;
  heroImage:string;heroAlt:string;eyebrow:string;title:string;lead:string;
  minutes:number;
  /** Optional break between sections (0 = no breaks; sections follow each other directly). */
  breakMinutes:number;
  /** Unscored pretest items in each full exam. */
  pretest:number;
  /** How many sections the independent questions are split into (case studies always come first, in their own section). */
  splits:number;
  questionsPerExam:number;
  domains:Domain[];weights:Record<string,number>;tasks:Record<string,string[]>;
  /** 'Task' (PMI outlines), 'Task' for BABOK tasks, or 'Topic'. */
  taskLabel:string;
  domainLabel:string;
  approaches:Approach[];
  exams:ExamSet[];
  facts:{big:string;text:string}[];
  coverageEyebrow:string;coverageTitle:string;
  standardEyebrow:string;standardTitle:string;
  /** HTML allowed (<strong>). */
  standardBullets:string[];
  /** Instruction list before a full exam. HTML allowed. */
  rules:string[];
  examMeta:string;
  ratingNote:string;
  resultsNote:string;
  refPrefix:string;
  disclaimer:string;
  calculator:boolean;
  /** Rating cut-offs used for practice feedback: [above target, target, below target]. */
  cuts:[number,number,number];
}
