import type {ExamQuestion,ExamSet} from '../../exam-types';
import {examSet} from '../authoring';
import {plQs,caseQuestions} from './authoring';
import {PL_D as D} from './domains';
import {P1} from './prepare1';import {P2} from './prepare2';import {P3} from './prepare3';import {P4} from './prepare4';import {P5} from './prepare5';
import {M1} from './model1';import {M2} from './model2';import {M3} from './model3';import {M4} from './model4';import {M5} from './model5';
import {V1} from './visualize1';import {V2} from './visualize2';import {V3} from './visualize3';import {V4} from './visualize4';import {V5} from './visualize5';
import {S1} from './manage1';import {S2} from './manage2';import {S3} from './manage3';import {S4} from './manage4';import {S5} from './manage5';
import {CASES1} from './cases1';import {CASES2} from './cases2';import {CASES3} from './cases3';import {CASES4} from './cases4';

/** 225 independent questions per skill area (900) plus 20 case studies × 5 questions (100) = 1,000. */
export const PL_AREAS:ExamQuestion[][]=[
  plQs('PLP',D.P,[...P1,...P2,...P3,...P4,...P5]),
  plQs('PLM',D.M,[...M1,...M2,...M3,...M4,...M5]),
  plQs('PLV',D.V,[...V1,...V2,...V3,...V4,...V5]),
  plQs('PLS',D.S,[...S1,...S2,...S3,...S4,...S5]),
];
const CASES=[...CASES1,...CASES2,...CASES3,...CASES4];
export const PL_EXAM_COUNT=CASES.length;

/**
 * Each mock gets one case study and 45 independent questions. Question i of skill area d goes to mock
 * (i + 5d) mod 20, so every mock has 12 questions from one area and 11 from each of the others,
 * and the four areas are spread evenly across the twenty mocks.
 */
export const PL300_EXAMS:ExamSet[]=CASES.map((c,e)=>{
  const questions=PL_AREAS.flatMap((area,d)=>area.filter((_,i)=>(i+5*d)%CASES.length===e));
  return examSet(e+1,`Case study: ${c.study.title}. Plus 45 questions across all four skill areas.`,questions,[c.study],caseQuestions(c));
});
