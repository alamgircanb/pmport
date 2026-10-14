import {Component,DestroyRef,Input,OnInit,inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {money,pct,type Control,type ChartDef,type Fmt,type P,type Part,type Row,type SimChallenge,type SimDef,type Tile} from './sims/sim-engine';

/** One playground (Kanban flow, risk and reserve, change adoption, technical debt…) in the same layout as the project delivery playground. */
@Component({
  standalone:true,selector:'app-sim-panel',imports:[FormsModule],styleUrl:'./playground-shared.css',
  template:`
  <section class="pg-section" [id]="'pg-'+def.id" [attr.aria-label]="def.title">
    <p class="eyebrow">{{def.eyebrow}}</p><h2>{{def.title}}</h2><p class="intro">{{def.intro}}</p>
    <div class="bar card">
      <div class="transport">
        <button type="button" class="round play" (click)="toggle()" [attr.aria-label]="playing?'Pause':'Play'">{{playing?'❚❚':'▶'}}</button>
        <button type="button" class="round" (click)="stepOnce()" [disabled]="done" [attr.aria-label]="'Step one '+def.unit.toLowerCase()">⏭</button>
        <button type="button" class="round" (click)="reset()" aria-label="Reset">↺</button>
        <div class="week"><span>{{def.unit}}</span><strong>{{rows.length}}</strong><small>of {{def.horizon(p)}}</small></div>
        <label class="speed">Speed <select [(ngModel)]="speed" (ngModelChange)="restartTimer()"><option [ngValue]="700">Slow</option><option [ngValue]="300">Normal</option><option [ngValue]="90">Fast</option></select></label>
      </div>
      <div class="challenge">
        <label>Challenge <select [ngModel]="challengeId" (ngModelChange)="pickChallenge($event)"><option value="">Free play (sandbox)</option>@for(c of def.challenges;track c.id){<option [value]="c.id">{{c.title}}</option>}</select></label>
      </div>
    </div>
    @if(challenge){<div class="mission card"><p class="eyebrow">Challenge</p><p><strong>{{challenge.title}}.</strong> {{challenge.story}}</p><p class="goal">🎯 Goal: {{challenge.goal}}</p>
      @if(result){<p class="verdict" [class.win]="result.ok" [class.lose]="!result.ok">{{result.ok?'✅ Challenge complete!':'❌ Not this time.'}} {{result.detail}} @if(!result.ok){<span>Tip: {{challenge.hint}}</span>}</p>}</div>}

    <div class="grid3">
      <section class="col card" aria-label="Setup">
        <h2>1 · Setup</h2><p class="note">Changing these restarts the simulation.</p>
        @for(c of def.setup;track c.key){
          @if(c.kind==='toggle'){<label class="check"><input type="checkbox" [checked]="!!p[c.key]" (change)="set(c,$any($event.target).checked?1:0,true)"> {{c.label}}</label>}
          @else{<label>{{c.label}} <b>{{show(c)}}</b><input type="range" [min]="c.min" [max]="c.max" [step]="c.step" [value]="p[c.key]" (input)="set(c,+$any($event.target).value,true)"></label>}
        }
        <button type="button" class="button secondary small" (click)="newRun()">New random run</button>
      </section>
      <section class="col card" aria-label="Decisions">
        <h2>2 · Your decisions</h2><p class="note">Change these any time, even mid-run.</p>
        @for(c of def.levers;track c.key){
          @if(c.kind==='toggle'){<label class="check"><input type="checkbox" [checked]="!!p[c.key]" (change)="set(c,$any($event.target).checked?1:0,false)"> {{c.label}}</label>}
          @else{<label>{{c.label}} <b>{{show(c)}}</b><input type="range" [min]="c.min" [max]="c.max" [step]="c.step" [value]="p[c.key]" (input)="set(c,+$any($event.target).value,false)"></label>}
        }
        <h3>Disturbances</h3>
        @for(c of def.disturbances;track c.key){
          @if(c.kind==='toggle'){<label class="check"><input type="checkbox" [checked]="!!p[c.key]" (change)="set(c,$any($event.target).checked?1:0,false)"> {{c.label}}</label>}
          @else{<label>{{c.label}} <b>{{show(c)}}</b><input type="range" [min]="c.min" [max]="c.max" [step]="c.step" [value]="p[c.key]" (input)="set(c,+$any($event.target).value,false)"></label>}
        }
      </section>
      <section class="col card out" aria-label="Results" aria-live="polite">
        <h2>3 · Results</h2>
        <div class="tiles">@for(t of tiles;track t.label){<div class="t" [class.good]="t.tone==='good'" [class.bad]="t.tone==='bad'"><span>{{t.label}}</span><strong>{{t.value}}</strong>@if(t.sub){<small>{{t.sub}}</small>}</div>}</div>
        @if(stack.parts.length){<div class="cap"><p class="mini">{{stack.title}}</p>
          <div class="stack">@for(sg of stack.parts;track sg.label){<i [style.width.%]="sg.pct" [style.background]="sg.color" [title]="sg.label+': '+sg.pct.toFixed(0)+'%'"></i>}</div>
          <div class="legend">@for(sg of stack.parts;track sg.label){<span><i [style.background]="sg.color"></i>{{sg.label}} {{sg.pct.toFixed(0)}}%</span>}</div></div>}
      </section>
    </div>

    <div class="charts">
      @for(c of def.charts;track c.title){@let sc=scale(c);
      <figure class="card"><figcaption>{{c.title}}</figcaption>
        <svg viewBox="0 0 560 230" role="img" [attr.aria-label]="c.title">
          @for(g of sc.grid;track $index){<line x1="44" x2="550" [attr.y1]="g.y" [attr.y2]="g.y" class="grid"/><text x="40" [attr.y]="g.y+4" class="ax" text-anchor="end">{{fmt(g.v,c.fmt)}}</text>}
          @if(sc.lo<0){<line x1="44" x2="550" [attr.y1]="y(0,sc)" [attr.y2]="y(0,sc)" class="zero"/>}
          @for(r of refs(c);track $index){
            @if(r.axis==='x'){<line [attr.x1]="x(r.v)" [attr.x2]="x(r.v)" y1="10" y2="200" class="deadline"/><text [attr.x]="x(r.v)+4" y="20" class="ax warn">{{r.label}}</text>}
            @else{<line x1="44" x2="550" [attr.y1]="y(r.v,sc)" [attr.y2]="y(r.v,sc)" class="deadline"/><text x="48" [attr.y]="y(r.v,sc)-4" class="ax warn">{{r.label}}</text>}
          }
          @for(s of c.series;track s.key){
            @if(s.style==='bars'){@for(r of rows;track r.t){<rect [attr.x]="x(r.t)-barW/2" [attr.y]="Math.min(y(r[s.key],sc),y(0,sc))" [attr.width]="barW" [attr.height]="Math.abs(y(0,sc)-y(r[s.key],sc))" [attr.fill]="s.color" opacity=".45"/>}}
            @else{
              @if(s.style==='area'&&rows.length>1){<path [attr.d]="area(s.key,sc)" [attr.fill]="s.color" opacity=".14"/>}
              <path [attr.d]="path(s.key,sc)" fill="none" [attr.stroke]="s.color" [attr.stroke-width]="s.style==='dash'?2:2.5" [attr.stroke-dasharray]="s.style==='dash'?'6 3':null"/>
            }
          }
          @for(t of xTicks;track t){<text [attr.x]="x(t)" y="218" class="ax" text-anchor="middle">{{t}}</text>}
        </svg>
        <div class="key">@for(s of c.series;track s.key){<span class="k" [style.color]="s.color"><i [class.dash]="s.style==='dash'" [style.background]="s.color"></i>{{s.label}}</span>}</div>
      </figure>}
      <div class="card log"><p class="mini">What happened</p>
        @if(!events.length){<p class="note">Press ▶ to start. Events will appear here as the simulation runs.</p>}
        <ol reversed>@for(e of events;track $index){<li><b>{{def.unit[0]}}{{e.t}}</b> {{e.text}}</li>}</ol></div>
    </div>

    @if(lessons.length){<section class="card lessons"><p class="eyebrow">Debrief</p><h3>What this run shows</h3><ul>@for(l of lessons;track $index){<li>{{l}}</li>}</ul></section>}
    <div class="principles">@for(pr of def.principles;track pr.title){<div class="card"><h3>{{pr.title}}</h3><p>{{pr.text}}</p></div>}</div>
  </section>`
})
export class SimPanelComponent implements OnInit{
  @Input({required:true}) def!:SimDef;
  private destroy=inject(DestroyRef);readonly Math=Math;
  p:P={};sim:any;rows:Row[]=[];events:{t:number;text:string}[]=[];lessons:string[]=[];
  playing=false;speed=300;challengeId='';challenge?:SimChallenge<any>;result?:{ok:boolean;detail:string};
  tiles:Tile[]=[];stack:{title:string;parts:(Part&{pct:number})[]}={title:'',parts:[]};
  private timer?:ReturnType<typeof setInterval>;

  ngOnInit(){this.p={...this.def.defaults};this.reset();this.destroy.onDestroy(()=>this.stop());}
  get done(){return this.def.model.finished(this.sim,this.p)||this.rows.length>=this.def.maxSteps;}

  toggle(){if(this.playing)this.stop();else{if(this.done)this.reset();this.playing=true;this.restartTimer();}}
  restartTimer(){if(this.timer)clearInterval(this.timer);if(this.playing)this.timer=setInterval(()=>this.tick(),this.speed);}
  stop(){this.playing=false;if(this.timer){clearInterval(this.timer);this.timer=undefined;}}
  stepOnce(){this.stop();this.tick();}
  reset(){this.stop();this.sim=this.def.model.create(this.p);this.rows=[];this.events=[];this.lessons=[];this.result=undefined;this.refresh();}
  private tick(){
    if(this.done){this.finish();return;}
    const {row,events}=this.def.model.step(this.sim,this.p);const t=this.rows.length+1;
    this.rows=[...this.rows,{...row,t} as Row];
    for(const e of events)this.events.unshift({t,text:e});if(this.events.length>60)this.events.length=60;
    this.refresh();if(this.done)this.finish();
  }
  private finish(){this.stop();this.lessons=this.def.model.insights(this.sim,this.p,this.rows);if(this.challenge)this.result=this.challenge.check(this.sim,this.p,this.rows);}
  private refresh(){
    this.tiles=this.def.model.tiles(this.sim,this.p,this.rows);
    const st=this.def.model.stack(this.sim,this.p);const total=st.parts.reduce((a,x)=>a+Math.max(0,x.v),0);
    this.stack={title:st.title,parts:total>0?st.parts.filter(x=>x.v>total*0.005).map(x=>({...x,pct:x.v/total*100})):[]};
  }

  /** Setup changes restart the run; decisions apply from the next step. */
  set(c:Control,v:number,restart:boolean){
    this.p={...this.p,[c.key]:v};
    if(restart){this.reset();return;}
    if(this.rows.length)this.events.unshift({t:this.rows.length,text:`You changed ${c.label.toLowerCase()} to ${this.show(c)}.`});
  }
  pickChallenge(id:string){this.challengeId=id;this.challenge=this.def.challenges.find(c=>c.id===id);this.p={...this.def.defaults,...(this.challenge?.params??{})};this.reset();}
  newRun(){this.p={...this.p,seed:Math.round(Math.random()*1000)};this.reset();}
  show(c:Control){const v=this.p[c.key];if(c.kind==='toggle')return v?'On':'Off';return c.fmt?c.fmt(v):String(v);}

  // ---- charts ----
  get maxX(){return Math.max(this.def.horizon(this.p),this.rows.length+1);}
  get barW(){return Math.max(2,506/this.maxX*0.6);}
  get xTicks(){const m=this.maxX,s=m<=20?2:m<=40?5:10;const out:number[]=[];for(let t=0;t<=m;t+=s)out.push(t);return out;}
  x(t:number){return 44+t/this.maxX*506;}
  refs(c:ChartDef){return c.refs?c.refs(this.p):[];}
  scale(c:ChartDef){
    const vals=this.rows.flatMap(r=>c.series.map(s=>r[s.key]??0));const refY=this.refs(c).filter(r=>r.axis==='y').map(r=>r.v);
    const lo=Math.min(0,...vals);let hi=c.max?c.max(this.rows,this.p):Math.max(1,...vals,...refY)*1.1;if(hi<=lo)hi=lo+1;
    return {lo,hi,grid:[0,.25,.5,.75,1].map(f=>{const v=lo+(hi-lo)*f;return {v,y:200-f*190};})};
  }
  y(v:number,sc:{lo:number;hi:number}){return 200-Math.max(0,Math.min(1,(v-sc.lo)/(sc.hi-sc.lo)))*190;}
  path(key:string,sc:{lo:number;hi:number}){return this.rows.map((r,i)=>`${i?'L':'M'}${this.x(r.t).toFixed(1)},${this.y(r[key]??0,sc).toFixed(1)}`).join(' ');}
  area(key:string,sc:{lo:number;hi:number}){const b=this.y(Math.max(sc.lo,0),sc).toFixed(1);return this.path(key,sc)+` L${this.x(this.rows[this.rows.length-1].t).toFixed(1)},${b} L${this.x(this.rows[0].t).toFixed(1)},${b} Z`;}
  fmt(v:number,f:Fmt){return f==='money'?money(v):f==='pct'?pct(v):f==='dec'?v.toFixed(1):Math.round(v).toLocaleString('en-CA');}
}
