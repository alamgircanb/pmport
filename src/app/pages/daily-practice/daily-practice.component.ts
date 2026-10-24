import {Component,NgZone,OnDestroy,afterNextRender,inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import type {ExamProgram,ExamQuestion} from '../pmp-exam/exam-types';
import {TERMS,type GlossaryTerm} from '../glossary/glossary';
import {trackEvent} from '../../core/analytics';

type TrackId='all'|'pm'|'ba'|'it';
interface Track{id:TrackId;label:string;note:string}
interface DailyItem{q:ExamQuestion;cert:string;order:number[];simulator:string}
interface DayRecord{answers:(number|null)[];done:boolean;score:number}
interface Store{v:1;track:TrackId;days:Record<string,DayRecord>}

const STORE='pmport-daily-practice-v1';
const COUNT=5;
const TRACKS:Track[]=[
  {id:'all',label:'Mixed',note:'Project management, business analysis and IT service management'},
  {id:'pm',label:'Project management',note:'PMP and CAPM questions'},
  {id:'ba',label:'Business analysis',note:'ECBA and CBAP questions'},
  {id:'it',label:'IT service management',note:'ITIL 5 Foundation questions'},
];
/** Question sources. Each bank loads only when a track needs it. */
const SOURCES:Record<'pmp'|'capm'|'ecba'|'cbap'|'itil',{simulator:string;load:()=>Promise<ExamProgram>}>={
  pmp:{simulator:'/pm-faciliter/pmp-exam-simulator',load:()=>import('../pmp-exam/programs/pmp-program').then(m=>m.PMP_PROGRAM)},
  capm:{simulator:'/pm-faciliter/capm-exam-simulator',load:()=>import('../pmp-exam/programs/capm-program').then(m=>m.CAPM_PROGRAM)},
  ecba:{simulator:'/pm-faciliter/ecba-exam-simulator',load:()=>import('../pmp-exam/programs/ecba-program').then(m=>m.ECBA_PROGRAM)},
  cbap:{simulator:'/pm-faciliter/cbap-exam-simulator',load:()=>import('../pmp-exam/programs/cbap-program').then(m=>m.CBAP_PROGRAM)},
  itil:{simulator:'/pm-faciliter/itil-foundation-exam-simulator',load:()=>import('../pmp-exam/programs/itil-program').then(m=>m.ITIL_PROGRAM)},
};
type SourceId=keyof typeof SOURCES;
/** How many of the day's questions come from each group of banks. */
const PLAN:Record<TrackId,{from:SourceId[];n:number}[]>={
  all:[{from:['pmp','capm'],n:2},{from:['ecba','cbap'],n:2},{from:['itil'],n:1}],
  pm:[{from:['pmp','capm'],n:COUNT}],
  ba:[{from:['ecba','cbap'],n:COUNT}],
  it:[{from:['itil'],n:COUNT}],
};

/** The visitor's local date, so a new set appears at their midnight. */
function dayKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function hash(s:string){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed:number){return()=>{seed=(seed+0x6D2B79F5)>>>0;let t=seed;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function shuffle<T>(list:T[],r:()=>number){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
/** Stand-alone single-answer questions: no case study, exhibit or multi-part answer. */
function usable(q:ExamQuestion){return q.type==='single'&&!q.caseId&&!q.graphic&&!!q.options?.length&&q.answer?.length===1&&!/exhibit|shown below|following (chart|graph|diagram|table)/i.test(q.stem)}

/** Daily practice: five fresh exam-style questions and a term of the day, with a streak kept in this browser. */
@Component({standalone:true,selector:'app-daily-practice',imports:[RouterLink],template:`
<section class="page daily">
  <header class="page-header"><p class="eyebrow">Practice · 5 minutes a day</p><h1>Daily practice</h1>
    <p class="lead">Five new exam-style questions every day, with an explanation for each answer, plus one term to learn. Small daily practice builds exam confidence faster than cramming.</p></header>

  <div class="bar">
    <div class="tracks" role="radiogroup" aria-label="Choose your practice track">
      @for(t of tracks;track t.id){<button type="button" role="radio" [attr.aria-checked]="track===t.id" [class.on]="track===t.id" (click)="setTrack(t.id)" [title]="t.note">{{t.label}}</button>}
    </div>
    <div class="streak" aria-label="Your practice streak">
      <strong>{{streak}}</strong><span>day streak</span>
      <ol class="week" aria-label="Last seven days">@for(d of week;track d.key){<li [class.hit]="d.done" [class.today]="d.today" [title]="d.label+(d.done?': practised':'')"><span class="sr-only">{{d.label}} {{d.done?'practised':'not practised'}}</span></li>}</ol>
    </div>
  </div>

  @if(!ready){<p class="muted loading">Loading today's questions…</p>}
  @else if(error){<p class="status">Today's questions could not load. Please refresh the page.</p>}
  @else{
    @if(!finished){
      @let item=items[current];
      <article class="card question" aria-live="polite">
        <div class="q-head"><span class="tag">{{item.cert}}</span><span class="tag quiet">{{item.q.domain}}</span><span class="count">Question {{current+1}} of {{items.length}}</span></div>
        <div class="progress" aria-hidden="true"><span [style.width.%]="(current+(answered(current)?1:0))/items.length*100"></span></div>
        <h2 class="stem">{{item.q.stem}}</h2>
        <div class="options">
          @for(o of item.order;track o;let i=$index){
            <button type="button" class="option" [disabled]="answered(current)"
              [class.right]="answered(current)&&isCorrect(item,o)" [class.wrong]="answered(current)&&record.answers[current]===o&&!isCorrect(item,o)"
              (click)="choose(o)"><span class="letter">{{letters[i]}}</span><span>{{item.q.options![o]}}</span></button>}
        </div>
        @if(answered(current)){
          <div class="feedback" [class.good]="isCorrect(item,record.answers[current]!)">
            <strong>{{isCorrect(item,record.answers[current]!)?'Correct.':'Not quite.'}}</strong> {{item.q.explanation}}
            @if(item.q.ref){<p class="ref">{{item.q.ref}}</p>}
          </div>
          <button type="button" class="button primary" (click)="next()">{{isLast?'See my result':'Next question'}}</button>
        }
      </article>
    }@else{
      <article class="card result">
        <p class="eyebrow">Today's result</p>
        <h2>{{record.score}} out of {{items.length}}</h2>
        <p class="muted">{{message}}</p>
        <p>Your streak: <strong>{{streak}} {{streak===1?'day':'days'}}</strong>. A new set opens in <strong>{{countdown}}</strong>.</p>
        <div class="actions">
          <button type="button" class="button primary" (click)="share()">Share my result</button>
          <a class="button secondary" [routerLink]="items[0].simulator">Take a full mock exam</a>
          <button type="button" class="link" (click)="review=!review">{{review?'Hide answers':'Review answers'}}</button>
        </div>
        @if(shareNote){<p class="status">{{shareNote}}</p>}
        @if(review){<ol class="review">@for(it of items;track it.q.id;let i=$index){<li [class.good]="isCorrect(it,record.answers[i]!)"><p><strong>{{isCorrect(it,record.answers[i]!)?'✓':'✗'}}</strong> {{it.q.stem}}</p><p class="muted">Answer: {{it.q.options![it.q.answer![0]]}}. {{it.q.explanation}}</p></li>}</ol>}
      </article>
    }
  }

  @if(term){<aside class="card term" aria-labelledby="term-title">
    <p class="eyebrow">Term of the day · {{term.category}}</p>
    <h2 id="term-title">{{term.term}}</h2>
    <p>{{term.definition}}</p>
    <p class="muted"><strong>Example:</strong> {{term.example}}</p>
    <a [routerLink]="'/pm-glossary/'+term.slug">Read more about {{term.term}}</a>
  </aside>}

  <p class="note muted">Questions are original PMPORT practice items from the free <a routerLink="/pm-faciliter">exam simulators</a>, not real exam questions. Your streak is saved in this browser only. PMP®, CAPM® and PMI® are marks of Project Management Institute, Inc.; ECBA®, CBAP® and IIBA® of International Institute of Business Analysis; ITIL® of PeopleCert. PMPORT is independent and not affiliated with them.</p>
</section>`,styles:[`
.daily{max-width:980px}
.bar{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;margin:0 0 1.25rem}
.tracks{display:flex;flex-wrap:wrap;gap:.5rem}
.tracks button{min-height:40px;padding:0 1rem;border:1px solid #2a4a69;border-radius:999px;background:#0a1f38;color:#c5d4e5;font:inherit;font-size:.92rem;cursor:pointer}
.tracks button.on{background:var(--accent);border-color:var(--accent);color:#041223;font-weight:700}
.streak{display:flex;align-items:center;gap:.6rem;color:#9db1c7}.streak strong{font-size:1.6rem;color:#fff}
.week{display:flex;gap:.3rem;list-style:none;margin:0 0 0 .4rem;padding:0}
.week li{width:14px;height:14px;border-radius:50%;border:1px solid #3c5f80}.week li.hit{background:var(--accent);border-color:var(--accent)}.week li.today{outline:2px solid #fff3;outline-offset:2px}
.question,.result,.term{padding:clamp(1.25rem,3vw,2rem);margin-bottom:1.25rem}
.q-head{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}.q-head .count{margin-left:auto;color:#9db1c7;font-size:.9rem}
.tag.quiet{background:transparent;border:1px solid #2a4a69;color:#9db1c7}
.progress{height:6px;border-radius:6px;background:#12304d;margin:1rem 0 1.25rem;overflow:hidden}.progress span{display:block;height:100%;background:var(--accent);transition:width .3s}
.stem{font-size:clamp(1.1rem,2.2vw,1.35rem);line-height:1.5;letter-spacing:-.01em;font-weight:600;margin:0 0 1.25rem}
.options{display:grid;gap:.6rem;margin-bottom:1.25rem}
.option{display:flex;gap:.8rem;align-items:flex-start;text-align:left;padding:.85rem 1rem;border:1px solid #2a4a69;border-radius:12px;background:#0a1f38;color:#e6eef6;font:inherit;line-height:1.5;cursor:pointer}
.option:hover:not(:disabled){border-color:#4f7aa0}.option:disabled{cursor:default}
.letter{flex:none;width:28px;height:28px;display:grid;place-items:center;border:1px solid #4f7aa0;border-radius:50%;font-weight:700;font-size:.85rem}
.option.right{border-color:#3ecf8e;background:#0d3a2e}.option.right .letter{background:#3ecf8e;border-color:#3ecf8e;color:#04170f}
.option.wrong{border-color:#f07178;background:#3a1620}.option.wrong .letter{background:#f07178;border-color:#f07178;color:#22070b}
.feedback{padding:1rem 1.1rem;border-left:4px solid #f07178;background:#0b2340;border-radius:8px;line-height:1.6;margin-bottom:1.25rem}.feedback.good{border-left-color:#3ecf8e}
.ref{margin:.5rem 0 0;color:#9db1c7;font-size:.88rem}
.result h2{font-size:clamp(2rem,5vw,3rem);margin:.2rem 0 .4rem;letter-spacing:-.03em}
.actions{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;margin-top:1rem}
.link{background:none;border:0;color:#8fe8f5;font:inherit;cursor:pointer;text-decoration:underline;padding:.5rem 0}
.review{margin:1.25rem 0 0;padding-left:1.2rem;display:grid;gap:1rem}.review li{line-height:1.55}.review p{margin:.2rem 0}
.term h2{font-size:1.5rem;margin:.2rem 0 .6rem}.term a{color:#8fe8f5;font-weight:700}
.note{font-size:.85rem;line-height:1.6}.note a{color:#8fe8f5}
.loading{padding:2rem 0}
@media(max-width:650px){.bar{flex-direction:column;align-items:flex-start}.q-head .count{margin-left:0;width:100%}}
`]})
export class DailyPracticeComponent implements OnDestroy{
  readonly tracks=TRACKS;readonly letters=['A','B','C','D','E','F'];
  track:TrackId='all';items:DailyItem[]=[];current=0;ready=false;error=false;review=false;shareNote='';
  record:DayRecord={answers:[],done:false,score:0};
  term:GlossaryTerm|null=null;streak=0;week:{key:string;label:string;done:boolean;today:boolean}[]=[];countdown='';message='';
  private store:Store={v:1,track:'all',days:{}};private today=dayKey();private timer?:ReturnType<typeof setInterval>;private loadId=0;

  private zone=inject(NgZone);
  // Browser-only start-up. afterNextRender runs outside Angular's zone, so the work is moved back into it to keep the view updating.
  constructor(){afterNextRender(()=>this.zone.run(()=>{
    this.store=this.read();this.track=this.store.track;
    this.term=TERMS[hash('term|'+this.today)%TERMS.length]??null;
    this.refreshStreak();this.load();
    this.timer=setInterval(()=>{if(dayKey()!==this.today){this.today=dayKey();this.refreshStreak();this.load()}this.tick()},30000);this.tick();
  }))}
  ngOnDestroy(){clearInterval(this.timer)}

  get finished(){return this.record.done}
  get isLast(){return this.current>=this.items.length-1}
  answered(i:number){return this.record.answers[i]!=null}
  isCorrect(item:DailyItem,o:number){return item.q.answer![0]===o}

  setTrack(id:TrackId){if(id===this.track)return;this.track=id;this.store.track=id;this.save();this.load()}

  choose(o:number){
    if(this.answered(this.current))return;
    if(!this.record.answers.some(a=>a!=null))trackEvent('daily_practice_start',{track:this.track});
    this.record.answers[this.current]=o;this.persist();
  }
  next(){
    if(this.current<this.items.length-1){this.current++;return}
    this.record.score=this.items.filter((it,i)=>this.isCorrect(it,this.record.answers[i]!)).length;this.record.done=true;this.persist();this.refreshStreak();this.setMessage();
    trackEvent('daily_practice_complete',{track:this.track,score:this.record.score,streak:this.streak});
    window.scrollTo({top:0,behavior:'smooth'});
  }
  async share(){
    const text=`I scored ${this.record.score}/${this.items.length} on today's PMPORT daily practice (${this.streak}-day streak). Try today's 5 questions:`;const url='https://pmport.ca/daily-practice';
    try{if(navigator.share){await navigator.share({title:'PMPORT daily practice',text,url});return}await navigator.clipboard.writeText(`${text} ${url}`);this.shareNote='Copied. Paste it anywhere to share.'}catch{this.shareNote=''}
  }

  /** Builds today's set for the chosen track: the same five questions for everyone on the same day. */
  private async load(){
    const id=++this.loadId;this.ready=false;this.error=false;this.review=false;
    try{
      const plan=PLAN[this.track];const r=rng(hash(`${this.today}|${this.track}`));const items:DailyItem[]=[];
      for(const part of plan){
        const programs=await Promise.all(part.from.map(s=>SOURCES[s].load().then(p=>({s,p}))));
        const pool=programs.flatMap(({s,p})=>p.exams.flatMap(e=>e.questions).filter(usable).map(q=>({q,cert:p.code,simulator:SOURCES[s].simulator})));
        for(const pick of shuffle(pool,r).slice(0,part.n))items.push({...pick,order:shuffle(pick.q.options!.map((_,i)=>i),r)});
      }
      if(id!==this.loadId)return;
      this.items=items;
      const saved=this.store.days[this.key()];
      this.record=saved&&saved.answers.length===items.length?saved:{answers:items.map(()=>null),done:false,score:0};
      this.current=this.record.done?0:Math.max(0,this.record.answers.findIndex(a=>a==null));
      if(this.current<0)this.current=items.length-1;
      this.setMessage();this.ready=true;
    }catch{if(id===this.loadId){this.error=true;this.ready=true}}
  }
  private key(){return `${this.today}|${this.track}`}
  private persist(){this.store.days[this.key()]=this.record;this.save()}
  private refreshStreak(){
    const doneDays=new Set(Object.entries(this.store.days).filter(([,d])=>d.done).map(([k])=>k.split('|')[0]));
    const d=new Date();let streak=0;if(!doneDays.has(dayKey(d)))d.setDate(d.getDate()-1);
    while(doneDays.has(dayKey(d))){streak++;d.setDate(d.getDate()-1)}
    this.streak=streak;
    const days:typeof this.week=[];const w=new Date();w.setDate(w.getDate()-6);
    for(let i=0;i<7;i++){const k=dayKey(w);days.push({key:k,label:w.toLocaleDateString('en-CA',{weekday:'short',month:'short',day:'numeric'}),done:doneDays.has(k),today:k===this.today});w.setDate(w.getDate()+1)}
    this.week=days;
  }
  private setMessage(){
    const s=this.record.score,n=this.items.length||COUNT;
    this.message=s===n?'Perfect score. You are ready for harder questions: try a full mock exam.':s>=n-1?'Strong result. Read the explanation for the one you missed.':s>=Math.ceil(n/2)?'Good practice. Review the answers below, then come back tomorrow.':'Every miss is a lesson. Review the answers and try a practice set in the simulator.';
  }
  private tick(){const now=new Date(),mid=new Date(now);mid.setHours(24,0,0,0);const m=Math.floor((+mid-+now)/60000);this.countdown=`${Math.floor(m/60)} h ${m%60} min`}
  private read():Store{try{const s=JSON.parse(localStorage.getItem(STORE)||'null') as Store|null;if(s&&s.v===1&&s.days&&TRACKS.some(t=>t.id===s.track))return s}catch{}return {v:1,track:'all',days:{}}}
  private save(){
    // Keep about two months of history so the store stays small.
    const keys=Object.keys(this.store.days).sort();for(const k of keys.slice(0,Math.max(0,keys.length-240)))delete this.store.days[k];
    try{localStorage.setItem(STORE,JSON.stringify(this.store))}catch{}
  }
}
