import type {CaseStudy,ExamQuestion,ExamSet} from '../exam-types';

/**
 * Compact authoring format for the CAPM, ECBA, CBAP and ITIL question banks:
 * [task, stem, options, answer, explanation, reference, approach?]
 * - answer: one option index (single choice) or an array of indexes (multiple response).
 * The option order is shuffled in the simulator, so the correct option can be written in any position.
 */
export type Q=[task:number,stem:string,options:string[],answer:number|number[],explanation:string,ref:string,approach?:string];

/** Matching (drag-and-drop style) item: [task, stem, pairs [left, choice index], choices, explanation, reference, approach?] */
export type M=[task:number,stem:string,pairs:[string,number][],choices:string[],explanation:string,ref:string,approach?:string];

export function qs(prefix:string,domain:string,items:(Q|M)[],caseId?:string):ExamQuestion[]{
  return items.map((it,i)=>{
    const id=`${prefix}${String(i+1).padStart(2,'0')}`;
    if(Array.isArray(it[2])&&Array.isArray(it[2][0])){
      const [task,stem,pairs,choices,explanation,ref,approach]=it as M;
      return {id,domain,task,approach,type:'matching',stem,pairs:pairs.map(([left,right])=>({left,right})),choices,explanation,ref,caseId};
    }
    const [task,stem,options,answer,explanation,ref,approach]=it as Q;
    const multi=Array.isArray(answer);
    return {id,domain,task,approach,type:multi?'multi':'single',stem,options,answer:multi?answer:[answer],explanation,ref,caseId};
  });
}

export function examSet(id:number,subtitle:string,questions:ExamQuestion[],cases:CaseStudy[]=[],caseQuestions:ExamQuestion[]=[]):ExamSet{
  return {id,title:`Exam Simulator ${id}`,subtitle,cases,caseQuestions,questions};
}
