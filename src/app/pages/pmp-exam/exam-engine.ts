import {CaseStudy,Domain,ExamProgram,ExamQuestion,ExamSet} from './exam-types';

/** A user's response: option indexes (single/multi/dropdown/hotspot) or one choice index per pair (matching; -1 = unanswered). */
export type Response=number[];

export interface ExamSection{title:string;ids:string[]}
export interface ExamForm{examId:number;seed:number;sections:ExamSection[];pretest:string[];optionOrder:Record<string,number[]>}

/** Small deterministic PRNG so an attempt can be restored exactly after a page refresh. */
export function rng(seed:number){let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
export function shuffle<T>(items:T[],rand:()=>number):T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

/** Options are shuffled for single and multiple-response items, as on the real exams. Numeric pull-down lists and hotspot labels keep their order. */
function optionOrders(questions:ExamQuestion[],rand:()=>number){
  const order:Record<string,number[]>={};
  for(const q of questions){if(q.options){const idx=q.options.map((_,i)=>i);order[q.id]=(q.type==='single'||q.type==='multi')?shuffle(idx,rand):idx}}
  return order;
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
export interface ScoreLine{label:string;correct:number;total:number;pct:number;rating:Rating}
export interface ExamResult{overall:ScoreLine;domains:ScoreLine[];approaches:ScoreLine[];tasks:(ScoreLine&{domain:Domain;task:number})[];answered:number;scoredCount:number}

/** exam: 0 = all exams. */
export interface PracticeFilter{exam:number;domain:Domain|'All';task:number;approach:string;count:number}

/** All questions and scoring rules for one certification. */
export class ExamBank{
  readonly exams:ExamSet[];
  readonly cases:CaseStudy[];
  readonly all:ExamQuestion[];
  readonly byId:Map<string,ExamQuestion>;
  /** Which exam (1–5) each question belongs to. */
  readonly examOf:Map<string,number>;
  constructor(readonly program:ExamProgram){
    this.exams=program.exams;
    this.cases=this.exams.flatMap(e=>e.cases);
    this.all=this.exams.flatMap(e=>[...e.caseQuestions,...e.questions]);
    this.byId=new Map(this.all.map(q=>[q.id,q]));
    this.examOf=new Map(this.exams.flatMap(e=>[...e.caseQuestions,...e.questions].map(q=>[q.id,e.id] as [string,number])));
  }
  examById(id:number):ExamSet{return this.exams.find(e=>e.id===id)??this.exams[0]}
  caseFor(q:ExamQuestion){return q.caseId?this.cases.find(c=>c.id===q.caseId):undefined}

  /** Full mock: case studies first (in order, own section), then the independent items shuffled and split into sections. Some items are unscored pretest items. */
  buildFullExam(examId=1,seed=Date.now()):ExamForm{
    const rand=rng(seed);const p=this.program;
    const exam=this.examById(examId);
    const caseIds=exam.caseQuestions.map(q=>q.id);
    const independent=shuffle(exam.questions.map(q=>q.id),rand);
    const pretest=shuffle(independent,rand).slice(0,p.pretest);
    const parts=Math.max(1,p.splits);const size=Math.ceil(independent.length/parts);
    const sections:ExamSection[]=[];
    if(caseIds.length)sections.push({title:`Section 1 · Case studies`,ids:caseIds});
    for(let i=0;i<parts;i++){const ids=independent.slice(i*size,(i+1)*size);if(ids.length)sections.push({title:'',ids});}
    sections.forEach((s,i)=>{if(!s.title)s.title=sections.length===1?'Exam questions':`Section ${i+1} · ${caseIds.length?'Independent questions':'Questions '+(sections.slice(0,i).reduce((n,x)=>n+x.ids.length,0)+1)+'–'+sections.slice(0,i+1).reduce((n,x)=>n+x.ids.length,0)}`});
    return {examId:exam.id,seed,pretest,optionOrder:optionOrders([...exam.caseQuestions,...exam.questions],rand),sections};
  }

  practicePool(f:PracticeFilter){return this.all.filter(q=>(!f.exam||this.examOf.get(q.id)===f.exam)&&(f.domain==='All'||q.domain===f.domain)&&(!f.task||q.task===f.task)&&(f.approach==='All'||q.approach===f.approach))}
  buildPractice(f:PracticeFilter,seed=Date.now()):ExamForm{
    const rand=rng(seed);
    const ids=shuffle(this.practicePool(f).map(q=>q.id),rand).slice(0,f.count||undefined);
    const chosen=ids.map(id=>this.byId.get(id)!);
    return {examId:0,seed,pretest:[],optionOrder:optionOrders(chosen,rand),sections:[{title:'Practice set',ids}]};
  }

  /** PMPORT estimate only. The exam bodies do not publish rating thresholds. */
  rating(pct:number):Rating{const [a,t,b]=this.program.cuts;return pct>=a?'Above Target':pct>=t?'Target':pct>=b?'Below Target':'Needs Improvement'}
  private line(label:string,correct:number,total:number):ScoreLine{const pct=total?Math.round(correct/total*100):0;return {label,correct,total,pct,rating:this.rating(pct)}}

  score(form:ExamForm,responses:Record<string,Response>):ExamResult{
    const ids=form.sections.flatMap(s=>s.ids);
    const pre=new Set(form.pretest);
    const scored=ids.filter(id=>!pre.has(id)).map(id=>this.byId.get(id)!).filter(Boolean);
    const ok=(q:ExamQuestion)=>isCorrect(q,responses[q.id]);
    const by=(key:(q:ExamQuestion)=>string|undefined)=>{const m=new Map<string,{c:number;t:number}>();for(const q of scored){const k=key(q);if(k===undefined)continue;const v=m.get(k)??{c:0,t:0};v.t++;if(ok(q))v.c++;m.set(k,v)}return m};
    const order=this.program.domains;
    const dm=by(q=>q.domain);const am=by(q=>q.approach);const tm=by(q=>`${q.domain}|${q.task}`);
    return {
      overall:this.line('Overall',scored.filter(ok).length,scored.length),
      domains:order.filter(d=>dm.has(d)).map(d=>this.line(d,dm.get(d)!.c,dm.get(d)!.t)),
      approaches:this.program.approaches.filter(a=>am.has(a)).map(a=>this.line(a,am.get(a)!.c,am.get(a)!.t)),
      tasks:[...tm.entries()].map(([k,v])=>{const i=k.lastIndexOf('|');const d=k.slice(0,i),t=k.slice(i+1);return {...this.line(k,v.c,v.t),domain:d,task:Number(t)}}).sort((a,b)=>order.indexOf(a.domain)-order.indexOf(b.domain)||a.task-b.task),
      answered:ids.filter(id=>{const q=this.byId.get(id);return !!q&&isAnswered(q,responses[id])}).length,
      scoredCount:scored.length
    };
  }
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
