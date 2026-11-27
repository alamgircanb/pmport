import type {CaseStudy,ExamQuestion} from '../../exam-types';
import type {Q,M} from '../authoring';

/**
 * Compact authoring format for the PL-300 (Power BI Data Analyst) bank. Besides the shared Q (single or
 * multiple response) and M (matching) tuples it supports:
 * - Y: Yes/No series      ['Y', task, stem, [[statement, true|false]...], explanation, ref]
 * - O: ordering           ['O', task, stem, actions, steps, explanation, ref]  (the first `steps` actions, in order, are the answer; the rest are distractors)
 * - B: drop-down blanks   ['B', task, stem, code, [[label, options, answer]...], explanation, ref]
 * - H: hotspot exhibit    ['H', task, stem, graphicId, regionLabels, answer, explanation, ref]
 * - X: Q with an exhibit ['X', graphicId, ...Q]
 * - M: matching with a tag ['M', ...M] (same as an untagged M)
 * In a Q stem, everything after the first line break is shown as code (DAX or Power Query M).
 * Options, actions and statements are shuffled where it makes sense, so write the correct option first.
 */
export type Y=['Y',task:number,stem:string,statements:[string,boolean][],explanation:string,ref:string];
export type O=['O',task:number,stem:string,actions:string[],steps:number,explanation:string,ref:string];
export type B=['B',task:number,stem:string,code:string,blanks:[label:string,options:string[],answer:number][],explanation:string,ref:string];
export type H=['H',task:number,stem:string,graphic:string,labels:string[],answer:number,explanation:string,ref:string];
export type X=['X',graphic:string,...rest:Q];
/** Matching written with an explicit tag: ['M', ...M] */
export type MT=['M',...rest:M];
export type PlItem=Q|M|MT|Y|O|B|H|X;

function splitStem(text:string){const i=text.indexOf('\n');return i<0?{stem:text}:{stem:text.slice(0,i),code:text.slice(i+1)}}

export function plQuestion(id:string,domain:string,it:PlItem,caseId?:string):ExamQuestion{
  const base={id,domain,caseId};
  switch(it[0]){
    case 'Y':{const [,task,stem,st,explanation,ref]=it;return {...base,task,type:'yesno',stem,pairs:st.map(([left,yes])=>({left,right:yes?0:1})),choices:['Yes','No'],explanation,ref}}
    case 'O':{const [,task,stem,items,steps,explanation,ref]=it;return {...base,task,type:'order',stem,items,answer:items.slice(0,steps).map((_,i)=>i),explanation,ref}}
    case 'B':{const [,task,stem,code,blanks,explanation,ref]=it;return {...base,task,type:'blanks',stem,code:code||undefined,blanks:blanks.map(([label,options,answer])=>({label,options,answer})),explanation,ref}}
    case 'H':{const [,task,stem,graphic,options,answer,explanation,ref]=it;return {...base,task,type:'hotspot',stem,graphic,options,answer:[answer],explanation,ref}}
    case 'X':{const [,graphic,...rest]=it;return {...plQuestion(id,domain,rest as Q,caseId),graphic}}
    case 'M':{const [,...rest]=it;return plQuestion(id,domain,rest as M,caseId)}
  }
  if(Array.isArray(it[2])&&Array.isArray(it[2][0])){
    const [task,text,pairs,choices,explanation,ref]=it as M;
    return {...base,task,type:'matching',...splitStem(text),pairs:pairs.map(([left,right])=>({left,right})),choices,explanation,ref};
  }
  const [task,text,options,answer,explanation,ref]=it as Q;
  const multi=Array.isArray(answer);
  return {...base,task,type:multi?'multi':'single',...splitStem(text),options,answer:multi?answer:[answer],explanation,ref};
}

/** Independent questions of one skill area; ids are prefix + three-digit position (stable: add new items at the end). */
export function plQs(prefix:string,domain:string,items:PlItem[]):ExamQuestion[]{
  return items.map((it,i)=>plQuestion(`${prefix}${String(i+1).padStart(3,'0')}`,domain,it));
}

export interface PlCase{study:CaseStudy;items:[domain:string,item:PlItem][]}
/** Case-study questions span the skill areas: ids are the case id plus a two-digit index. */
export function plCase(study:CaseStudy,items:[string,PlItem][]):PlCase{return {study,items}}
export function caseQuestions(c:PlCase):ExamQuestion[]{return c.items.map(([domain,it],i)=>plQuestion(`${c.study.id}-${String(i+1).padStart(2,'0')}`,domain,it,c.study.id))}
