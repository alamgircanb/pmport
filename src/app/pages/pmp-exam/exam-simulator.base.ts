import {Directive,HostListener,OnDestroy,OnInit} from '@angular/core';
import type {Domain,ExamProgram,ExamQuestion,ExamSet} from './exam-types';
import {ExamBank,calculate,isAnswered,isCorrect,type ExamForm,type ExamResult,type PracticeFilter,type Response} from './exam-engine';

type View='home'|'intro'|'exam'|'review'|'break'|'results'|'answers';
type Mode='full'|'practice';
interface Saved{v:1;mode:Mode;form:ExamForm;view:View;section:number;index:number;responses:Record<string,Response>;flags:string[];strikes:Record<string,number[]>;checked:string[];timeLeft:number;breakLeft:number;finished:boolean;savedAt:number}
/** Only PMP had a saved attempt before the store moved to per-exam slots. */
const LEGACY_STORE='pmport-pmp-exam-v1';
type SlotKey='exam1'|'exam2'|'exam3'|'exam4'|'exam5'|'practice';

/**
 * One exam simulator for every certification (PMP, CAPM, ECBA, CBAP, ITIL). Each certification is a small
 * component that passes its ExamProgram to this base class and shares the same template and styles.
 */
@Directive()
export abstract class ExamSimulatorBase implements OnInit,OnDestroy{
  readonly bank:ExamBank;
  readonly domains:Domain[];
  readonly tasks:Record<string,string[]>;
  readonly weights:Record<string,number>;
  readonly totalQuestions:number;
  readonly exams:ExamSet[];
  readonly slots:SlotKey[]=['exam1','exam2','exam3','exam4','exam5','practice'];
  readonly examMinutes:number;
  readonly breakMinutes:number;
  readonly letters='ABCDEFGH';
  readonly maxWeight:number;
  constructor(readonly program:ExamProgram){
    this.bank=new ExamBank(program);this.domains=program.domains;this.tasks=program.tasks;this.weights=program.weights;
    this.totalQuestions=this.bank.all.length;this.exams=this.bank.exams;this.examMinutes=program.minutes;this.breakMinutes=program.breakMinutes;
    this.maxWeight=Math.max(...program.domains.map(d=>program.weights[d]??0));
    this.timeLeft=program.minutes*60;this.breakLeft=program.breakMinutes*60;
  }

  view:View='home';
  mode:Mode='full';
  form:ExamForm|null=null;
  section=0;
  index=0;
  responses:Record<string,Response>={};
  flags=new Set<string>();
  strikes:Record<string,number[]>={};
  checked=new Set<string>();
  timeLeft:number;
  breakLeft:number;
  finished=false;
  result:ExamResult|null=null;
  saves:Partial<Record<SlotKey,Saved>>={};
  pendingExam=1;

  filter:PracticeFilter={exam:0,domain:'All',task:0,approach:'All',count:20};
  answerFilter:'all'|'incorrect'|'flagged'|'unanswered'='incorrect';
  showNavigator=false;
  showCase=true;
  showCalc=false;
  calcExpr='';
  calcOut='';
  confirmEnd=false;
  private timer?:ReturnType<typeof setInterval>;
  private ticks=0;

  ngOnInit(){this.loadAll();this.timer=setInterval(()=>this.tick(),1000)}
  ngOnDestroy(){clearInterval(this.timer);this.persist()}

  // ---------- Starting ----------
  startIntro(examId=this.pendingExam){this.pendingExam=examId;this.mode='full';this.view='intro';window.scrollTo({top:0})}
  startFull(){this.reset('full',this.bank.buildFullExam(this.pendingExam));this.view='exam';this.persist();window.scrollTo({top:0})}
  startPractice(){const form=this.bank.buildPractice(this.filter);if(!form.sections[0].ids.length)return;this.reset('practice',form);this.view='exam';this.persist();window.scrollTo({top:0})}
  practiceCount(){return this.bank.practicePool(this.filter).length}
  private reset(mode:Mode,form:ExamForm){this.mode=mode;this.form=form;this.section=0;this.index=0;this.responses={};this.flags=new Set();this.strikes={};this.checked=new Set();this.timeLeft=this.program.minutes*60;this.breakLeft=this.program.breakMinutes*60;this.finished=false;this.result=null;this.confirmEnd=false;this.showNavigator=false}
  resume(key:SlotKey){const s=this.saves[key];if(!s)return;if(s.mode==='full')this.pendingExam=s.form.examId;this.mode=s.mode;this.form=s.form;this.view=s.view;this.section=s.section;this.index=s.index;this.responses=s.responses;this.flags=new Set(s.flags);this.strikes=s.strikes;this.checked=new Set(s.checked);this.timeLeft=s.timeLeft;this.breakLeft=s.breakLeft;this.finished=s.finished;if(this.finished)this.result=this.bank.score(this.form,this.responses);window.scrollTo({top:0})}
  discard(key:SlotKey){delete this.saves[key];try{localStorage.removeItem(this.program.store+key);if(key==='exam1'&&this.program.id==='pmp')localStorage.removeItem(LEGACY_STORE)}catch{}}
  /** In-page scrolling. Plain href="#id" links resolve against <base href="/"> and would navigate to the home page. */
  scrollToSection(id:string){document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}
  home(){this.persist();this.view='home';this.loadAll();window.scrollTo({top:0})}

  // ---------- Current question ----------
  get ids(){return this.form?.sections[this.section].ids??[]}
  get q():ExamQuestion{return this.bank.byId.get(this.ids[this.index])!}
  get caseStudy(){return this.caseFor(this.q)}
  caseFor(q:ExamQuestion){return this.bank.caseFor(q)}
  get isPractice(){return this.mode==='practice'}
  get examTitle(){return this.isPractice?'Practice set':this.bank.examById(this.form?.examId||this.pendingExam).title}
  get lockedQuestion(){return this.isPractice&&this.checked.has(this.q.id)}
  options(q:ExamQuestion){const order=this.form?.optionOrder[q.id]??q.options!.map((_,i)=>i);return order.map(o=>({o,text:q.options![o]}))}
  selected(q:ExamQuestion,o:number){return (this.responses[q.id]??[]).includes(o)}
  struck(q:ExamQuestion,o:number){return (this.strikes[q.id]??[]).includes(o)}
  need(q:ExamQuestion){return q.answer?.length??1}

  choose(o:number){
    const q=this.q;if(this.lockedQuestion)return;
    if(q.type==='multi'){const cur=this.responses[q.id]??[];if(cur.includes(o))this.responses[q.id]=cur.filter(x=>x!==o);else if(cur.length<this.need(q))this.responses[q.id]=[...cur,o];}
    else this.responses[q.id]=[o];
    this.touch();
  }
  chooseSelect(value:string){const v=Number(value);if(this.lockedQuestion)return;if(v>=0)this.responses[this.q.id]=[v];else delete this.responses[this.q.id];this.touch()}
  match(i:number,value:string){if(this.lockedQuestion)return;const q=this.q;const cur=this.responses[q.id]??q.pairs!.map(()=>-1);const next=[...cur];next[i]=Number(value);this.responses[q.id]=next;this.touch()}
  matchValue(q:ExamQuestion,i:number){return (this.responses[q.id]??[])[i]??-1}
  hotspot(i:number){if(this.lockedQuestion)return;this.responses[this.q.id]=[i];this.touch()}
  hotspotSelected(q:ExamQuestion){const r=this.responses[q.id];return r&&r.length?r[0]:null}
  strike(o:number,e:Event){e.stopPropagation();const cur=this.strikes[this.q.id]??[];this.strikes[this.q.id]=cur.includes(o)?cur.filter(x=>x!==o):[...cur,o];this.touch()}
  toggleFlag(){const id=this.q.id;this.flags.has(id)?this.flags.delete(id):this.flags.add(id);this.touch()}

  answered(id:string){return isAnswered(this.bank.byId.get(id)!,this.responses[id])}
  correct(id:string){return isCorrect(this.bank.byId.get(id)!,this.responses[id])}
  sectionAnswered(){return this.ids.filter(id=>this.answered(id)).length}
  sectionFlagged(){return this.ids.filter(id=>this.flags.has(id)).length}

  // ---------- Navigation ----------
  go(i:number){if(i>=0&&i<this.ids.length){this.index=i;this.view='exam';this.showNavigator=false;this.touch();this.scrollQuestion()}}
  next(){if(this.index<this.ids.length-1)this.go(this.index+1);else this.openReview()}
  prev(){this.go(this.index-1)}
  openReview(){this.view='review';this.confirmEnd=false;this.showNavigator=false;this.touch();window.scrollTo({top:0})}
  endSection(){
    if(!this.form)return;
    if(this.isPractice||this.section>=this.form.sections.length-1){this.finish();return}
    this.section++;this.index=0;this.breakLeft=this.program.breakMinutes*60;this.view=this.program.breakMinutes>0?'break':'exam';this.confirmEnd=false;this.touch();window.scrollTo({top:0})
  }
  endBreak(){this.view='exam';this.touch();window.scrollTo({top:0})}
  check(){this.checked.add(this.q.id);this.touch()}
  finish(){if(!this.form)return;this.finished=true;this.result=this.bank.score(this.form,this.responses);this.view='results';this.touch();window.scrollTo({top:0})}
  retake(){this.mode==='full'?this.startIntro(this.form?.examId||1):this.home()}

  private scrollQuestion(){setTimeout(()=>document.getElementById('exam-question')?.scrollIntoView({block:'start',behavior:'smooth'}),0)}

  // ---------- Results / answers ----------
  get reviewItems(){
    if(!this.form)return [];
    const pre=new Set(this.form.pretest);let n=0;
    return this.form.sections.flatMap(s=>s.ids).map(id=>({q:this.bank.byId.get(id)!,n:++n,pretest:pre.has(id)})).filter(x=>!!x.q)
      .filter(x=>this.answerFilter==='all'||(this.answerFilter==='incorrect'&&!this.correct(x.q.id))||(this.answerFilter==='flagged'&&this.flags.has(x.q.id))||(this.answerFilter==='unanswered'&&!this.answered(x.q.id)));
  }
  showAnswers(f:'all'|'incorrect'|'flagged'|'unanswered'){this.answerFilter=f;this.view='answers';window.scrollTo({top:0})}
  responseText(q:ExamQuestion){
    const r=this.responses[q.id];if(!isAnswered(q,r))return 'Not answered';
    if(q.type==='matching')return q.pairs!.map((p,i)=>`${p.left} → ${q.choices![r![i]]}`).join(' · ');
    return r!.map(o=>q.options![o]).join(' · ');
  }
  correctText(q:ExamQuestion){return q.type==='matching'?q.pairs!.map(p=>`${p.left} → ${q.choices![p.right]}`).join(' · '):q.answer!.map(o=>q.options![o]).join(' · ')}
  taskName(d:Domain,t:number){return this.tasks[d]?.[t-1]??''}
  ratingClass(r:string){return r.toLowerCase().replace(/\s+/g,'-')}

  // ---------- Timer & calculator ----------
  private tick(){
    if(this.view==='break'){this.breakLeft--;if(this.breakLeft<=0)this.endBreak()}
    else if(this.mode==='full'&&!this.finished&&(this.view==='exam'||this.view==='review')){this.timeLeft--;if(this.timeLeft<=0){this.timeLeft=0;this.finish()}}
    if(++this.ticks%10===0)this.persist();
  }
  clock(sec:number){const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
  calcKey(k:string){if(k==='C'){this.calcExpr='';this.calcOut='';return}if(k==='⌫'){this.calcExpr=this.calcExpr.slice(0,-1);return}if(k==='='){const v=calculate(this.calcExpr);this.calcOut=v===null?'Error':String(v);if(v!==null)this.calcExpr=String(v);return}this.calcExpr+=k}
  readonly calcKeys=['7','8','9','/','4','5','6','*','1','2','3','-','0','.','(',')','C','⌫','+','='];

  @HostListener('document:keydown',['$event']) keys(e:KeyboardEvent){
    if(this.view!=='exam'||(e.target as HTMLElement)?.tagName==='SELECT'||(e.target as HTMLElement)?.tagName==='INPUT')return;
    if(e.key==='ArrowRight')this.next();else if(e.key==='ArrowLeft')this.prev();
  }

  // ---------- Persistence (per-browser convenience only) ----------
  private touch(){this.persist()}
  private slot():SlotKey{return this.mode==='practice'?'practice':(`exam${this.form?.examId||1}` as SlotKey)}
  private persist(){
    if(!this.form||this.view==='home')return;
    const s:Saved={v:1,mode:this.mode,form:this.form,view:this.view==='intro'?'exam':this.view,section:this.section,index:this.index,responses:this.responses,flags:[...this.flags],strikes:this.strikes,checked:[...this.checked],timeLeft:this.timeLeft,breakLeft:this.breakLeft,finished:this.finished,savedAt:Date.now()};
    try{localStorage.setItem(this.program.store+this.slot(),JSON.stringify(s))}catch{}
  }
  private read(key:string):Saved|null{try{const raw=localStorage.getItem(key);if(!raw)return null;const s=JSON.parse(raw) as Saved;if(!s||s.v!==1||!s.form)return null;if(!s.form.examId&&s.mode==='full')s.form.examId=1;return s}catch{return null}}
  private loadAll(){
    this.saves={};
    for(const k of this.slots){const s=this.read(this.program.store+k);if(s&&this.valid(s))this.saves[k]=s}
    if(this.program.id==='pmp'&&!this.saves.exam1){const legacy=this.read(LEGACY_STORE);if(legacy){if(legacy.mode==='full')this.saves.exam1=legacy;else if(!this.saves.practice)this.saves.practice=legacy}}
  }
  savedFor(key:SlotKey){return this.saves[key]??null}
  slotKey(examId:number){return `exam${examId}` as SlotKey}
  savedLabel(s:Saved){const total=s.form.sections.reduce((n,x)=>n+x.ids.length,0);const done=Object.keys(s.responses).length;return s.finished?`Completed · ${this.bank.score(s.form,s.responses).overall.pct}%`:`In progress · ${done} of ${total} answered`}
  get approachList(){return ['All',...this.program.approaches]}
  /** A saved attempt is ignored if its questions no longer exist (for example after a question bank update). */
  private valid(s:Saved){return s.form.sections.every(x=>x.ids.every(id=>this.bank.byId.has(id)))}
  setExam(v:string){this.filter={...this.filter,exam:Number(v)}}
  setDomain(v:string){this.filter={...this.filter,domain:v as Domain|'All',task:0}}
  setTask(v:string){this.filter={...this.filter,task:Number(v)}}
  setApproach(v:string){this.filter={...this.filter,approach:v}}
  setCount(v:string){this.filter={...this.filter,count:Number(v)}}
}
