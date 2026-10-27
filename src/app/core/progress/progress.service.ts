import {Injectable,NgZone,inject,signal} from '@angular/core';
import {NavigationEnd,Router} from '@angular/router';
import {onTrack} from '../analytics';
import JOURNEY_DATA from '../../pages/journeys/journeys-data.json';

/**
 * Points, levels, streak, streak freezes, badges and learning-journey progress.
 * Everything is kept in this browser (localStorage), so it works without accounts and costs nothing to run.
 * Points come from the same events Google Analytics receives (see core/analytics.ts), plus page visits for journey steps.
 */

export type AreaId='pm'|'ba'|'data'|'it';
export type StepKind='learn'|'try'|'prove'|'use';
export interface JourneyStep{id:string;kind:StepKind;title:string;text:string;path:string;xp:number;query?:Record<string,string>;done:{event:string;match?:string}}
export interface Journey{id:string;area:AreaId;level:string;icon:string;title:string;summary:string;steps:JourneyStep[]}
export const JOURNEYS=JOURNEY_DATA as Journey[];
export const AREAS:{id:AreaId;label:string}[]=[{id:'pm',label:'Project management'},{id:'ba',label:'Business analysis'},{id:'data',label:'Data'},{id:'it',label:'IT service management'}];

export const LEVELS:{min:number;name:string}[]=[
  {min:0,name:'Learner'},{min:100,name:'Contributor'},{min:300,name:'Practitioner'},{min:700,name:'Specialist'},{min:1200,name:'Team Lead'},
  {min:2000,name:'Manager'},{min:3500,name:'Senior Manager'},{min:5500,name:'Director'},{min:8000,name:'Strategist'},{min:12000,name:'Master'}];

export interface Badge{id:string;icon:string;name:string;how:string}
export const BADGES:Badge[]=[
  {id:'first-step',icon:'🚀',name:'First step',how:'Earn your first points'},
  {id:'streak-3',icon:'🔥',name:'On a roll',how:'Practise 3 days in a row'},
  {id:'streak-7',icon:'🗓️',name:'Week warrior',how:'Practise 7 days in a row'},
  {id:'streak-30',icon:'🏆',name:'Month of practice',how:'Practise 30 days in a row'},
  {id:'daily-perfect',icon:'🎯',name:'Perfect five',how:'Score 5 out of 5 in daily practice'},
  {id:'daily-10',icon:'📅',name:'Daily habit',how:'Finish 10 daily practice sets'},
  {id:'first-mock',icon:'📝',name:'First mock exam',how:'Finish a full mock exam'},
  {id:'mocks-5',icon:'🎓',name:'Exam ready',how:'Finish 5 full mock exams'},
  {id:'reader-5',icon:'📚',name:'Bookworm',how:'Read 5 articles to the end'},
  {id:'tools-10',icon:'🛠️',name:'Toolbox',how:'Use 10 different tools, labs or calculators'},
  {id:'downloads-5',icon:'📄',name:'Template pro',how:'Save 5 templates or exports'},
  {id:'journey-1',icon:'🧭',name:'Pathfinder',how:'Finish a learning journey'},
  {id:'all-areas',icon:'🌐',name:'All-rounder',how:'Complete a step in all four areas: PM, BA, data and IT'},
  {id:'xp-1000',icon:'⭐',name:'1,000 points',how:'Earn 1,000 points'},
];

export interface Activity{at:number;text:string;xp:number}
export interface Toast{id:number;icon:string;text:string;sub?:string}
interface Store{
  v:1;xp:number;
  /** Local dates (YYYY-MM-DD) with any points, and dates saved by a streak freeze. */
  active:string[];frozen:string[];freezes:number;
  /** One-off keys already rewarded, so the same thing never pays twice. */
  keys:string[];
  steps:Record<string,string[]>;badges:Record<string,number>;
  counts:{daily:number;perfect:number;mocks:number;downloads:number};
  articles:string[];tools:string[];
  log:Activity[];
}
const STORE='pmport-progress-v1';
const MAX_FREEZES=2;

export function dayKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function addDays(key:string,n:number){const [y,m,d]=key.split('-').map(Number);const t=new Date(y,m-1,d);t.setDate(t.getDate()+n);return dayKey(t)}
const empty=():Store=>({v:1,xp:0,active:[],frozen:[],freezes:0,keys:[],steps:{},badges:{},counts:{daily:0,perfect:0,mocks:0,downloads:0},articles:[],tools:[],log:[]});

@Injectable({providedIn:'root'})
export class ProgressService{
  private readonly zone=inject(NgZone);private readonly router=inject(Router);
  private store:Store=empty();private started=false;private toastId=0;
  /** Bumped on every change so pages can re-read the getters. */
  readonly version=signal(0);
  readonly toasts=signal<Toast[]>([]);

  /** Call once in the browser (from the app shell). */
  start(){
    if(this.started||typeof window==='undefined')return;this.started=true;
    this.store=this.read();this.reconcileStreak();this.save();
    onTrack((name,params)=>this.zone.run(()=>this.onEvent(name,params)));
    this.onVisit(location.pathname);
    this.router.events.subscribe(e=>{if(e instanceof NavigationEnd)this.zone.run(()=>this.onVisit(e.urlAfterRedirects.split(/[?#]/)[0]))});
    window.addEventListener('storage',e=>{if(e.key===STORE)this.zone.run(()=>{this.store=this.read();this.bump()})});
  }

  // ----- read-only views for pages -----
  get xp(){return this.store.xp}
  get level(){let i=0;while(i<LEVELS.length-1&&this.store.xp>=LEVELS[i+1].min)i++;const cur=LEVELS[i],next=LEVELS[i+1];return {number:i+1,name:cur.name,min:cur.min,next:next?.min??null,nextName:next?.name??null,pct:next?Math.round((this.store.xp-cur.min)/(next.min-cur.min)*100):100}}
  get freezes(){return this.store.freezes}
  get streak(){
    const kept=new Set([...this.store.active,...this.store.frozen]);let d=dayKey();if(!kept.has(d))d=addDays(d,-1);let n=0;
    while(kept.has(d)){n++;d=addDays(d,-1)}return n;
  }
  get practisedToday(){return this.store.active.includes(dayKey())}
  /** Last n days, oldest first, for streak calendars. */
  days(n:number){const out:{key:string;state:'done'|'frozen'|'none';today:boolean}[]=[];let d=addDays(dayKey(),-(n-1));for(let i=0;i<n;i++){out.push({key:d,state:this.store.active.includes(d)?'done':this.store.frozen.includes(d)?'frozen':'none',today:i===n-1});d=addDays(d,1)}return out}
  get log(){return this.store.log}
  get stats(){return {...this.store.counts,articles:this.store.articles.length,tools:this.store.tools.length,journeys:JOURNEYS.filter(j=>this.journeyDone(j)).length}}
  badgeEarned(id:string){return this.store.badges[id]??null}
  get earnedCount(){return Object.keys(this.store.badges).length}
  stepDone(j:Journey,s:JourneyStep){return this.store.steps[j.id]?.includes(s.id)??false}
  journeyProgress(j:Journey){const done=j.steps.filter(s=>this.stepDone(j,s)).length;return {done,total:j.steps.length,pct:Math.round(done/j.steps.length*100)}}
  journeyDone(j:Journey){return j.steps.every(s=>this.stepDone(j,s))}
  /** The first unfinished step, or null when the journey is complete. */
  nextStep(j:Journey){return j.steps.find(s=>!this.stepDone(j,s))??null}
  get hasStarted(){return this.store.xp>0||Object.keys(this.store.steps).length>0}

  /** Marks a journey step done by hand ("I've done this"). */
  completeStep(j:Journey,s:JourneyStep){this.finishStep(j,s)}
  reset(){this.store=empty();this.save();this.bump()}
  dismiss(id:number){this.toasts.update(t=>t.filter(x=>x.id!==id))}

  // ----- earning -----
  private onEvent(name:string,p:Record<string,string|number>){
    const today=dayKey(),c=this.store.counts;
    if(name==='daily_practice_complete'){
      const score=Number(p['score'])||0;
      if(this.once(`daily|${today}|${p['track']}`)){c.daily++;if(score>=5)c.perfect++;this.award(20+score*5,`Daily practice: ${score} out of 5`,'✅')}
    }else if(name==='simulator_complete'){
      const full=p['mode']==='full',exam=String(p['exam']??'');
      if(full){c.mocks++;this.award(150,`Full ${exam} mock exam finished`,'🎓')}
      else{for(let i=1;i<=3;i++)if(this.once(`practice|${today}|${exam}|${i}`)){this.award(40,`${exam} practice set finished`,'📝');break}}
    }else if(name==='article_complete'){
      const a=String(p['article']??'');if(a&&!this.store.articles.includes(a)){this.store.articles.push(a);this.award(20,'Article read to the end','📖')}
    }else if(name==='tool_use'){
      const page=String(p['page_path']??'');if(page&&!this.store.tools.includes(page))this.store.tools.push(page);
      if(this.once(`tool|${today}|${page}`))this.award(10,`Used ${String(p['tool']??'a tool').slice(0,60)}`,'🛠️');
    }else if(name==='file_download'){
      if(this.once(`download|${today}|${p['file_name']}`)){c.downloads++;if(this.once(`download-pay|${today}|${p['page_path']}`))this.award(10,'Saved a template or export','📄')}
    }
    this.matchSteps(name,JSON.stringify(p));
    this.after();
  }
  private onVisit(path:string){this.matchSteps('visit',path);this.after()}
  private matchSteps(event:string,text:string){
    for(const j of JOURNEYS)for(const s of j.steps){
      if(s.done.event!==event||this.stepDone(j,s))continue;
      if(event==='visit'?text.replace(/\/$/,'')===s.done.match:!s.done.match||text.includes(s.done.match))this.finishStep(j,s,false);
    }
  }
  private finishStep(j:Journey,s:JourneyStep,settle=true){
    if(this.stepDone(j,s))return;(this.store.steps[j.id]??=[]).push(s.id);
    this.award(s.xp,`${j.title}: ${s.title}`,'🧭');
    if(this.journeyDone(j)&&this.once(`journey|${j.id}`)){this.award(200,`Journey complete: ${j.title}`,'🏁');this.toast('🏁',`Journey complete!`,j.title)}
    if(settle)this.after();
  }
  private award(xp:number,text:string,icon:string){
    if(xp<=0)return;const before=this.level.number;const today=dayKey();
    this.store.xp+=xp;this.store.log.unshift({at:Date.now(),text,xp});this.store.log.length=Math.min(this.store.log.length,40);
    if(!this.store.active.includes(today)){this.reconcileStreak();this.store.active.push(today);this.earnFreeze()}
    this.toast(icon,`+${xp} points`,text);
    const lv=this.level;if(lv.number>before)this.toast('⬆️',`Level ${lv.number}: ${lv.name}`,'You levelled up');
  }
  /** A streak freeze is earned for every 7 days in a row (up to 2 kept). */
  private earnFreeze(){const st=this.streak;if(st>0&&st%7===0&&this.store.freezes<MAX_FREEZES&&this.once(`freeze|${dayKey()}`)){this.store.freezes++;this.toast('🧊','Streak freeze earned','It saves your streak if you miss a day')}}
  /** Missed days since the last active day use up freezes, one per day, while any are left. */
  private reconcileStreak(){
    const kept=[...this.store.active,...this.store.frozen].sort();const last=kept.at(-1);if(!last)return;
    const yesterday=addDays(dayKey(),-1);const missed:string[]=[];for(let d=addDays(last,1);d<=yesterday;d=addDays(d,1))missed.push(d);
    // Freezes are only spent when they can save the whole gap; otherwise the streak ends and they are kept for next time.
    if(missed.length&&missed.length<=this.store.freezes){this.store.freezes-=missed.length;this.store.frozen.push(...missed);if(this.started)this.toast('🧊',`Streak saved by ${missed.length===1?'a freeze':missed.length+' freezes'}`,'You missed '+(missed.length===1?'a day':missed.length+' days'))}
  }
  private after(){this.checkBadges();this.save();this.bump()}
  private checkBadges(){
    const st=this.stats,streak=this.streak;
    const areas=new Set(JOURNEYS.filter(j=>(this.store.steps[j.id]?.length??0)>0).map(j=>j.area));
    const rules:Record<string,boolean>={
      'first-step':this.store.xp>0,'streak-3':streak>=3,'streak-7':streak>=7,'streak-30':streak>=30,
      'daily-perfect':st.perfect>0,'daily-10':st.daily>=10,'first-mock':st.mocks>=1,'mocks-5':st.mocks>=5,
      'reader-5':st.articles>=5,'tools-10':st.tools>=10,'downloads-5':st.downloads>=5,'journey-1':st.journeys>=1,
      'all-areas':areas.size>=4,'xp-1000':this.store.xp>=1000};
    for(const b of BADGES)if(rules[b.id]&&!this.store.badges[b.id]){this.store.badges[b.id]=Date.now();this.toast(b.icon,`Badge earned: ${b.name}`,b.how)}
  }
  private once(key:string){if(this.store.keys.includes(key))return false;this.store.keys.push(key);if(this.store.keys.length>600)this.store.keys.splice(0,this.store.keys.length-600);return true}
  private toast(icon:string,text:string,sub?:string){
    const t:Toast={id:++this.toastId,icon,text,sub};this.toasts.update(list=>[...list.slice(-2),t]);
    setTimeout(()=>this.dismiss(t.id),4000);
  }
  private bump(){this.version.update(v=>v+1)}
  private read():Store{try{const s=JSON.parse(localStorage.getItem(STORE)||'null') as Store|null;if(s&&s.v===1&&typeof s.xp==='number')return {...empty(),...s,counts:{...empty().counts,...s.counts}}}catch{}return empty()}
  private save(){
    const cutoff=addDays(dayKey(),-120);this.store.active=this.store.active.filter(d=>d>=cutoff);this.store.frozen=this.store.frozen.filter(d=>d>=cutoff);
    try{localStorage.setItem(STORE,JSON.stringify(this.store))}catch{}
  }
}
