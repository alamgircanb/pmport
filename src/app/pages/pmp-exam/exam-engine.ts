import {Approach,CaseStudy,Domain,ExamQuestion,ExamSet} from './exam-types';
import {EXAMS} from './questions';

export {EXAMS};
export const CASE_STUDIES:CaseStudy[]=EXAMS.flatMap(e=>e.cases);
export const ALL_QUESTIONS:ExamQuestion[]=EXAMS.flatMap(e=>[...e.caseQuestions,...e.questions]);
export const QUESTION_BY_ID=new Map(ALL_QUESTIONS.map(q=>[q.id,q]));
/** Which exam (1, 2 or 3) each question belongs to. */
export const EXAM_OF=new Map<string,number>(EXAMS.flatMap(e=>[...e.caseQuestions,...e.questions].map(q=>[q.id,e.id] as [string,number])));
export function examById(id:number):ExamSet{return EXAMS.find(e=>e.id===id)??EXAMS[0]}

export const EXAM_MINUTES=240;
export const BREAK_MINUTES=10;
export const PRETEST_COUNT=10;

/** A user's response: option indexes (single/multi/dropdown/hotspot) or one choice index per pair (matching; -1 = unanswered). */
export type Response=number[];

export interface ExamSection{title:string;ids:string[]}
export interface ExamForm{examId:number;seed:number;sections:ExamSection[];pretest:string[];optionOrder:Record<string,number[]>}

/** Small deterministic PRNG so an attempt can be restored exactly after a page refresh. */
export function rng(seed:number){let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
export function shuffle<T>(items:T[],rand:()=>number):T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

/** Options are shuffled for single and multiple-response items, as on the real exam. Numeric pull-down lists and hotspot labels keep their order. */
function optionOrders(questions:ExamQuestion[],rand:()=>number){
  const order:Record<string,number[]>={};
  for(const q of questions){if(q.options){const idx=q.options.map((_,i)=>i);order[q.id]=(q.type==='single'||q.type==='multi')?shuffle(idx,rand):idx}}
  return order;
}

/** Full mock: Section 1 = the three case studies (in order); Sections 2–3 = the 150 independent items shuffled and split. Ten independent items are unscored pretest items. */
export function buildFullExam(examId=1,seed=Date.now()):ExamForm{
  const rand=rng(seed);
  const exam=examById(examId);
  const caseIds=exam.caseQuestions.map(q=>q.id);
  const independent=shuffle(exam.questions.map(q=>q.id),rand);
  const half=Math.ceil(independent.length/2);
  const pretest=shuffle(independent,rand).slice(0,PRETEST_COUNT);
  return {examId:exam.id,seed,pretest,optionOrder:optionOrders([...exam.caseQuestions,...exam.questions],rand),sections:[
    {title:'Section 1 · Case studies',ids:caseIds},
    {title:'Section 2 · Independent questions',ids:independent.slice(0,half)},
    {title:'Section 3 · Independent questions',ids:independent.slice(half)}]};
}

/** exam: 0 = all exams. */
export interface PracticeFilter{exam:number;domain:Domain|'All';task:number;approach:Approach|'All';count:number}
export function practicePool(filter:PracticeFilter){return ALL_QUESTIONS.filter(q=>(!filter.exam||EXAM_OF.get(q.id)===filter.exam)&&(filter.domain==='All'||q.domain===filter.domain)&&(!filter.task||q.task===filter.task)&&(filter.approach==='All'||q.approach===filter.approach))}
export function buildPractice(filter:PracticeFilter,seed=Date.now()):ExamForm{
  const rand=rng(seed);
  const pool=practicePool(filter);
  const ids=shuffle(pool.map(q=>q.id),rand).slice(0,filter.count||pool.length);
  const chosen=ids.map(id=>QUESTION_BY_ID.get(id)!);
  return {examId:0,seed,pretest:[],optionOrder:optionOrders(chosen,rand),sections:[{title:'Practice set',ids}]};
}

export function isAnswered(q:ExamQuestion,r:Response|undefined):boolean{
  if(!r||!r.length)return false;
  if(q.type==='matching')return r.length===q.pairs!.length&&r.every(v=>v>=0);
  if(q.type==='multi')return r.length===q.answer!.length;
  return r.length===1&&r[0]>=0;
}

export function isCorrect(q:ExamQuestion,r:Response|undefined):boolean{
  if(!isAnswered(q,r))return false;
  if(q.type==='matching')return q.pairs!.every((p,i)=>r![i]===p.right);
  const want=[...q.answer!].sort((a,b)=>a-b).join(',');
  return [...r!].sort((a,b)=>a-b).join(',')===want;
}

export type Rating='Above Target'|'Target'|'Below Target'|'Needs Improvement';
/** PMPORT estimate only. PMI does not publish the passing score or exact rating thresholds. */
export function rating(pct:number):Rating{return pct>=80?'Above Target':pct>=65?'Target':pct>=50?'Below Target':'Needs Improvement'}

export interface ScoreLine{label:string;correct:number;total:number;pct:number;rating:Rating}
export interface ExamResult{overall:ScoreLine;domains:ScoreLine[];approaches:ScoreLine[];tasks:(ScoreLine&{domain:Domain;task:number})[];answered:number;scoredCount:number}

function line(label:string,correct:number,total:number):ScoreLine{const pct=total?Math.round(correct/total*100):0;return {label,correct,total,pct,rating:rating(pct)}}

export function score(form:ExamForm,responses:Record<string,Response>):ExamResult{
  const ids=form.sections.flatMap(s=>s.ids);
  const pre=new Set(form.pretest);
  const scored=ids.filter(id=>!pre.has(id)).map(id=>QUESTION_BY_ID.get(id)!);
  const ok=(q:ExamQuestion)=>isCorrect(q,responses[q.id]);
  const by=<K extends string>(key:(q:ExamQuestion)=>K)=>{const m=new Map<K,{c:number;t:number}>();for(const q of scored){const k=key(q);const v=m.get(k)??{c:0,t:0};v.t++;if(ok(q))v.c++;m.set(k,v)}return m};
  const domainOrder:Domain[]=['People','Process','Business Environment'];
  const dm=by(q=>q.domain);const am=by(q=>q.approach);const tm=by(q=>`${q.domain}|${q.task}`);
  return {
    overall:line('Overall',scored.filter(ok).length,scored.length),
    domains:domainOrder.filter(d=>dm.has(d)).map(d=>line(d,dm.get(d)!.c,dm.get(d)!.t)),
    approaches:(['Predictive','Agile','Hybrid'] as Approach[]).filter(a=>am.has(a)).map(a=>line(a,am.get(a)!.c,am.get(a)!.t)),
    tasks:[...tm.entries()].map(([k,v])=>{const [d,t]=k.split('|');return {...line(k,v.c,v.t),domain:d as Domain,task:Number(t)}}).sort((a,b)=>domainOrder.indexOf(a.domain)-domainOrder.indexOf(b.domain)||a.task-b.task),
    answered:ids.filter(id=>isAnswered(QUESTION_BY_ID.get(id)!,responses[id])).length,
    scoredCount:scored.length
  };
}

/** Basic on-screen calculator: + - * / and parentheses, no eval. Returns null for invalid input. */
export function calculate(expr:string):number|null{
  const tokens=expr.replace(/\s+/g,'').match(/\d*\.?\d+|[()+\-*/]/g);
  if(!tokens||tokens.join('')!==expr.replace(/\s+/g,''))return null;
  let i=0;
  const peek=()=>tokens[i];
  const factor=():number=>{const t=tokens[i++];if(t==='-')return -factor();if(t==='('){const v=sum();if(tokens[i++]!==')')throw 0;return v}const n=Number(t);if(Number.isNaN(n))throw 0;return n};
  const product=():number=>{let v=factor();while(peek()==='*'||peek()==='/'){const op=tokens[i++];const r=factor();v=op==='*'?v*r:v/r}return v};
  const sum=():number=>{let v=product();while(peek()==='+'||peek()==='-'){const op=tokens[i++];const r=product();v=op==='+'?v+r:v-r}return v};
  try{const v=sum();return i===tokens.length&&Number.isFinite(v)?Math.round(v*1e10)/1e10:null}catch{return null}
}
