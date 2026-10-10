import {Component,EventEmitter,Input,Output} from '@angular/core';
import {GRAPHICS,GraphicSpec} from './exam-graphics-data';

/** Renders exhibits from GRAPHICS. In hotspot mode, nodes, risks and stakeholders emit their index. */
@Component({
  standalone:true,
  selector:'app-exam-graphic',
  template:`
  @if(spec;as g){
  <figure class="exhibit" [class.hot]="hotspot" [attr.data-graphic]="id">
    <p class="cap">Exhibit · {{g.label}}</p>
    @switch(g.kind){
    @case('ev'){@if(ev;as e){
      <svg viewBox="0 0 560 320" role="img" [attr.aria-label]="e.aria">
        <g class="axis">@for(t of e.ticks;track t){<line x1="56" x2="530" [attr.y1]="e.y(t)" [attr.y2]="e.y(t)"/><text x="50" [attr.y]="e.y(t)+4" text-anchor="end">{{fmt(t)}}</text>}
          @for(m of e.xs;track m){<text [attr.x]="e.x(m)" y="300" text-anchor="middle">{{m}}</text>}<text x="293" y="318" text-anchor="middle">Month</text></g>
        <line class="status" [attr.x1]="e.x(e.s)" [attr.x2]="e.x(e.s)" y1="20" y2="285"/><text class="label" [attr.x]="e.x(e.s)+4" y="30">Status date</text>
        <polyline class="pv" [attr.points]="e.pv"/><polyline class="evl" [attr.points]="e.ev"/><polyline class="ac" [attr.points]="e.ac"/>
        <text class="pv-t" [attr.x]="e.x(e.s)-8" [attr.y]="e.y(e.PV)-8" text-anchor="end">PV {{fmt(e.PV)}}</text>
        <text class="ac-t" [attr.x]="e.x(e.s)+8" [attr.y]="e.y(e.AC)+(e.AC>=e.EV?-4:14)">AC {{fmt(e.AC)}}</text>
        <text class="ev-t" [attr.x]="e.x(e.s)+8" [attr.y]="e.y(e.EV)+(e.EV>e.AC?-4:14)">EV {{fmt(e.EV)}}</text>
        <text class="label" x="530" [attr.y]="e.y(e.bac)-6" text-anchor="end">BAC {{fmt(e.bac)}}</text>
        <g class="legend"><rect x="76" y="40" width="12" height="3" class="pvf"/><text x="94" y="45">Planned value</text><rect x="76" y="56" width="12" height="3" class="evf"/><text x="94" y="61">Earned value</text><rect x="76" y="72" width="12" height="3" class="acf"/><text x="94" y="77">Actual cost</text></g>
      </svg>}}
    @case('burndown'){@if(bdn;as b){
      <svg viewBox="0 0 560 320" role="img" [attr.aria-label]="b.aria">
        <g class="axis">@for(t of b.ticks;track t){<line x1="56" x2="530" [attr.y1]="b.y(t)" [attr.y2]="b.y(t)"/><text x="50" [attr.y]="b.y(t)+4" text-anchor="end">{{t}}</text>}
          @for(d of b.xs;track d){<text [attr.x]="b.x(d)" y="300" text-anchor="middle">{{d}}</text>}<text x="293" y="318" text-anchor="middle">Sprint day</text></g>
        <line class="ideal" [attr.x1]="b.x(0)" [attr.y1]="b.y(b.total)" [attr.x2]="b.x(b.days)" [attr.y2]="b.y(0)"/>
        <polyline class="evl" [attr.points]="b.line"/>@for(p of b.dots;track $index){<circle class="dot" [attr.cx]="p[0]" [attr.cy]="p[1]" r="3.5"/>}
        <text class="ev-t" [attr.x]="b.x(b.last)+8" [attr.y]="b.y(b.remaining)-8">{{b.remaining}} remaining (day {{b.last}})</text>
        <text class="label" [attr.x]="b.x(b.days*0.55)" [attr.y]="b.y(b.total*0.45)+18">Ideal</text>
      </svg>}}
    @case('burnup'){@if(bup;as u){
      <svg viewBox="0 0 560 320" role="img" [attr.aria-label]="u.aria">
        <g class="axis">@for(t of u.ticks;track t){<line x1="56" x2="530" [attr.y1]="u.y(t)" [attr.y2]="u.y(t)"/><text x="50" [attr.y]="u.y(t)+4" text-anchor="end">{{t}}</text>}
          @for(s of u.xs;track s){<text [attr.x]="u.x(s)" y="300" text-anchor="middle">{{s}}</text>}<text x="293" y="318" text-anchor="middle">Sprint</text></g>
        <polyline class="pv" [attr.points]="u.scope"/><polyline class="evl" [attr.points]="u.done"/><line class="ideal" [attr.x1]="u.fx1" [attr.y1]="u.fy1" [attr.x2]="u.fx2" [attr.y2]="u.fy2"/>
        <text class="pv-t" [attr.x]="u.x(u.n*0.62)" [attr.y]="u.y(u.scopeMax)-10">Total scope</text><text class="ev-t" [attr.x]="u.x(u.lastDone)-6" [attr.y]="u.y(u.doneNow)-10" text-anchor="end">Completed {{u.doneNow}}</text>
      </svg>}}
    @case('network'){@if(net;as n){
      <svg [attr.viewBox]="'0 0 '+n.w+' 280'" role="img" [attr.aria-label]="n.aria">
        <defs><marker [attr.id]="'arr-'+id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="arrowhead"/></marker></defs>
        @for(e of n.edges;track $index){<line class="edge" [attr.x1]="e[0]" [attr.y1]="e[1]" [attr.x2]="e[2]" [attr.y2]="e[3]" [attr.marker-end]="'url(#arr-'+id+')'"/>}
        @for(node of n.nodes;track node.id){
          <g [class.region]="hotspot&&node.idx>=0" [class.picked]="hotspot&&node.idx===selected" (click)="pick(node.idx)" (keydown.enter)="pick(node.idx)" [attr.tabindex]="hotspot&&node.idx>=0?0:null" [attr.role]="hotspot&&node.idx>=0?'button':null" [attr.aria-label]="node.aria">
            <rect class="box" [attr.x]="node.x" [attr.y]="node.y" [attr.width]="node.w" height="44" rx="8"/>
            <text class="node-t" [attr.x]="node.x+node.w/2" [attr.y]="node.y+19" text-anchor="middle">{{node.id}}</text>@if(node.d){<text class="node-d" [attr.x]="node.x+node.w/2" [attr.y]="node.y+35" text-anchor="middle">{{node.d}} days</text>}
          </g>}
      </svg>}}
    @case('risk'){@if(risk;as r){
      <svg viewBox="0 0 520 380" role="img" aria-label="Probability and impact matrix">
        @for(p of five;track p){@for(i of five;track i){<rect [attr.class]="'cell '+zone(p*i)" [attr.x]="60+(i-1)*84" [attr.y]="20+(5-p)*62" width="82" height="60"/>}}
        @for(k of five;track k){<text class="axis-t" x="48" [attr.y]="20+(5-k)*62+34" text-anchor="end">{{k}}</text><text class="axis-t" [attr.x]="60+(k-1)*84+41" y="346" text-anchor="middle">{{k}}</text>}
        <text class="axis-t" x="270" y="372" text-anchor="middle">Impact →</text><text class="axis-t" x="14" y="180" transform="rotate(-90 14 180)" text-anchor="middle">Probability →</text>
        @for(k of r;track k.id;let idx=$index){<g [class.region]="hotspot" [class.picked]="hotspot&&idx===selected" (click)="pick(idx)" (keydown.enter)="pick(idx)" [attr.tabindex]="hotspot?0:null" [attr.role]="hotspot?'button':null" [attr.aria-label]="k.id+': probability '+k.p+', impact '+k.i">
          <circle class="risk" [attr.cx]="60+(k.i-1)*84+41" [attr.cy]="20+(5-k.p)*62+30" r="18"/><text class="risk-t" [attr.x]="60+(k.i-1)*84+41" [attr.y]="20+(5-k.p)*62+35" text-anchor="middle">{{k.id}}</text></g>}
      </svg>}}
    @case('grid'){@if(grid;as items){
      <svg viewBox="0 0 520 360" role="img" aria-label="Power and interest grid">
        <rect class="quad" x="60" y="20" width="220" height="150"/><rect class="quad" x="282" y="20" width="220" height="150"/><rect class="quad" x="60" y="172" width="220" height="150"/><rect class="quad" x="282" y="172" width="220" height="150"/>
        <text class="axis-t" x="281" y="350" text-anchor="middle">Interest →</text><text class="axis-t" x="20" y="170" transform="rotate(-90 20 170)" text-anchor="middle">Power →</text>
        <text class="axis-t" x="66" y="340">Low</text><text class="axis-t" x="496" y="340" text-anchor="end">High</text>
        @for(s of items;track s.label;let idx=$index){<g [class.region]="hotspot" [class.picked]="hotspot&&idx===selected" (click)="pick(idx)" (keydown.enter)="pick(idx)" [attr.tabindex]="hotspot?0:null" [attr.role]="hotspot?'button':null" [attr.aria-label]="s.label">
          <rect class="chip" [attr.x]="s.x-102" [attr.y]="s.y-20" width="204" height="40" rx="20"/><text class="chip-t" [attr.x]="s.x" [attr.y]="s.y+5" text-anchor="middle">{{s.label}}</text></g>}
      </svg>}}
    @case('cfd'){@if(cfd;as c){
      <svg viewBox="0 0 640 320" role="img" [attr.aria-label]="c.aria">
        <g class="axis">@for(t of c.ticks;track t){<line x1="56" x2="500" [attr.y1]="c.y(t)" [attr.y2]="c.y(t)"/><text x="50" [attr.y]="c.y(t)+4" text-anchor="end">{{t}}</text>}
          @for(d of c.xs;track d){<text [attr.x]="c.x(d)" y="300" text-anchor="middle">{{d}}</text>}<text x="278" y="318" text-anchor="middle">Day</text></g>
        @for(b of c.bands;track b.name;let k=$index){<polygon [attr.class]="'band b'+k" [attr.points]="b.points"/>}
        @for(b of c.bands;track b.name){<text class="band-t" x="506" [attr.y]="b.labelY">{{b.name}}</text>}
      </svg>}}
    @case('control'){@if(ctl;as k){
      <svg viewBox="0 0 580 300" role="img" [attr.aria-label]="k.aria">
        <line class="limit" x1="56" x2="510" [attr.y1]="k.y(k.ucl)" [attr.y2]="k.y(k.ucl)"/><line class="limit" x1="56" x2="510" [attr.y1]="k.y(k.lcl)" [attr.y2]="k.y(k.lcl)"/><line class="mean" x1="56" x2="510" [attr.y1]="k.y(k.mean)" [attr.y2]="k.y(k.mean)"/>
        <text class="label" x="514" [attr.y]="k.y(k.ucl)+4">UCL {{k.ucl}}</text><text class="label" x="514" [attr.y]="k.y(k.mean)+4">Mean {{k.mean}}</text><text class="label" x="514" [attr.y]="k.y(k.lcl)+4">LCL {{k.lcl}}</text>
        <polyline class="evl" [attr.points]="k.line"/>@for(p of k.dots;track $index){<circle class="dot" [attr.cx]="p[0]" [attr.cy]="p[1]" r="3.5"/>}
        <g class="axis">@for(p of k.dots;track $index){<text [attr.x]="p[0]" y="290" text-anchor="middle">{{$index+1}}</text>}<text x="8" y="14">{{k.unit}}</text></g>
      </svg>}}
    @case('pareto'){@if(par;as p){
      <svg viewBox="0 0 580 330" role="img" [attr.aria-label]="p.aria">
        <g class="axis">@for(t of p.ticks;track t){<line x1="56" x2="520" [attr.y1]="p.y(t)" [attr.y2]="p.y(t)"/><text x="50" [attr.y]="p.y(t)+4" text-anchor="end">{{t}}</text>}<text x="524" [attr.y]="p.y(p.max)+4">100%</text><text x="8" y="14">Defects</text></g>
        @for(b of p.bars;track b.label){<rect class="bar-r" [attr.x]="b.x" [attr.y]="b.y" [attr.width]="b.w" [attr.height]="b.h"/><text [attr.class]="b.h>24?'bar-v':'label'" [attr.x]="b.x+b.w/2" [attr.y]="b.h>24?b.y+18:b.y-6" text-anchor="middle">{{b.v}}</text><text class="axis-t small" [attr.x]="b.x+b.w/2" y="300" text-anchor="middle">{{b.label}}</text>}
        <polyline class="cum" [attr.points]="p.cum"/>@for(b of p.bars;track b.label){<circle class="dot cumdot" [attr.cx]="b.cx" [attr.cy]="b.cy" r="3.5"/><text class="cum-t" [attr.x]="b.cx-7" [attr.y]="b.cy-7" text-anchor="end">{{b.cumPct}}%</text>}
      </svg>}}
    @case('tornado'){@if(tor;as t){
      <svg viewBox="0 0 580 300" role="img" [attr.aria-label]="t.aria">
        <line class="mean" [attr.x1]="t.cx" [attr.x2]="t.cx" y1="20" y2="262"/><text class="label" [attr.x]="t.cx" y="285" text-anchor="middle">Base NPV {{t.base}}</text>
        @for(b of t.bars;track b.label){<text class="axis-t" x="196" [attr.y]="b.y+17" text-anchor="end">{{b.label}}</text>
          <rect class="bar-low" [attr.x]="b.lx" [attr.y]="b.y" [attr.width]="b.lw" height="26"/><rect class="bar-high" [attr.x]="t.cx" [attr.y]="b.y" [attr.width]="b.hw" height="26"/>
          <text class="label" [attr.x]="b.lx-4" [attr.y]="b.y+17" text-anchor="end">{{b.low}}</text><text class="label" [attr.x]="t.cx+b.hw+4" [attr.y]="b.y+17">+{{b.high}}</text>}
      </svg>}}
    @case('resource'){@if(res;as r){
      <svg viewBox="0 0 560 310" role="img" [attr.aria-label]="r.aria">
        <g class="axis">@for(t of r.ticks;track t){<line x1="56" x2="530" [attr.y1]="r.y(t)" [attr.y2]="r.y(t)"/><text x="50" [attr.y]="r.y(t)+4" text-anchor="end">{{t}}</text>}<text x="8" y="14">{{r.unit}}</text><text x="293" y="306" text-anchor="middle">Week</text></g>
        @for(b of r.bars;track $index){<rect [attr.class]="b.over?'bar-over':'bar-r'" [attr.x]="b.x" [attr.y]="b.y" [attr.width]="b.w" [attr.height]="b.h"/><text class="axis-t" [attr.x]="b.x+b.w/2" y="288" text-anchor="middle">{{$index+1}}</text>}
        <line class="limit" x1="56" x2="530" [attr.y1]="r.y(r.limit)" [attr.y2]="r.y(r.limit)"/><text class="label" x="530" [attr.y]="r.y(r.limit)-6" text-anchor="end">Available: {{r.limit}}</text>
      </svg>}}
    }
    @if(hotspot){<figcaption>Click an item in the exhibit to select your answer.</figcaption>}
  </figure>}`,
  styles:[`
    .exhibit{margin:0 0 1rem;padding:.75rem;border:1px solid var(--line);border-radius:12px;background:#061629;overflow-x:auto}
    @media(max-width:600px){svg{min-width:500px}figcaption::after{content:' Swipe sideways to see the whole exhibit.'}}
    .cap{margin:0 0 .4rem;font-size:.8rem;font-weight:700;color:#9db1c7}
    svg{display:block;width:100%;height:auto;font:13px Inter,Arial,sans-serif}
    figcaption{margin-top:.4rem;font-size:.85rem;color:var(--muted)}
    .axis line{stroke:#1d3a57;stroke-width:1}.axis text,.axis-t{fill:#9db1c7}
    .pv{fill:none;stroke:#8fa8ff;stroke-width:2.5;stroke-dasharray:6 4}.evl{fill:none;stroke:#49cce1;stroke-width:2.5}.ac{fill:none;stroke:#ff9c7a;stroke-width:2.5}
    .pvf{fill:#8fa8ff}.evf{fill:#49cce1}.acf{fill:#ff9c7a}.legend text{fill:#dcebf7}
    .pv-t{fill:#aebfff;font-weight:700}.ev-t{fill:#7fe0ef;font-weight:700}.ac-t{fill:#ffb59c;font-weight:700}.label{fill:#c9d9e7}
    .status{stroke:#f0c36b;stroke-dasharray:4 4}.ideal{stroke:#7d93a8;stroke-width:2;stroke-dasharray:6 5}.dot{fill:#49cce1}
    .edge{stroke:#7d93a8;stroke-width:1.6}.arrowhead{fill:#7d93a8}
    .box{fill:#0b2340;stroke:#3b5874;stroke-width:1.5}.node-t{fill:#fff;font-weight:800;font-size:15px}.node-d{fill:#9db1c7}
    .cell{stroke:#061629;stroke-width:2}.cell.red{fill:#7a2a33}.cell.amber{fill:#7a5a22}.cell.green{fill:#1f5a45}
    .risk{fill:#0b2340;stroke:#fff;stroke-width:1.5}.risk-t{fill:#fff;font-weight:800}
    .quad{fill:#0b2340;stroke:#1d3a57}.chip{fill:#123459;stroke:#49cce1}.chip-t{fill:#eaf3fc;font-weight:700;font-size:15px}
    .band{stroke:#061629;stroke-width:1}.b0{fill:#2f7d5b}.b1{fill:#b8783a}.b2{fill:#3c6fb0}.b3{fill:#3a4a63}.band-t{fill:#dcebf7;font-weight:700}
    .limit{stroke:#ff8f8f;stroke-dasharray:6 4}.mean{stroke:#9db1c7}
    .bar-r{fill:#3c6fb0}.bar-over{fill:#b8505a}.bar-low{fill:#b8505a}.bar-high{fill:#2f7d5b}.cum{fill:none;stroke:#f0c36b;stroke-width:2.5}.cumdot{fill:#f0c36b}.cum-t{fill:#ffd98c;font-size:12px;font-weight:700}.bar-v{fill:#fff;font-weight:800}.small{font-size:11px}
    .hot .region{cursor:pointer}.hot .region:hover .box,.hot .region:hover .risk,.hot .region:hover .chip,.hot .region:focus .box,.hot .region:focus .risk,.hot .region:focus .chip{stroke:#f0c36b;stroke-width:3}
    .picked .box,.picked .risk,.picked .chip{stroke:#f0c36b!important;stroke-width:4!important;fill:#4a3a12!important}
    .region:focus{outline:none}
  `]
})
export class ExamGraphicComponent{
  @Input({required:true}) id!:string;
  @Input() hotspot=false;
  @Input() selected:number|null=null;
  @Input() disabled=false;
  @Output() picked=new EventEmitter<number>();
  pick(i:number){if(this.hotspot&&!this.disabled&&i>=0)this.picked.emit(i)}
  readonly five=[1,2,3,4,5];
  get spec():GraphicSpec|undefined{return GRAPHICS[this.id]}
  fmt(n:number){return n.toLocaleString('en-CA')}
  zone(s:number){return s>=15?'red':s>=6?'amber':'green'}

  private axis(max:number,steps=4){const raw=max/steps;const mag=10**Math.floor(Math.log10(raw));const nice=[1,2,2.5,5,10].map(m=>m*mag).find(m=>m>=raw)!;return Array.from({length:steps+1},(_,i)=>Math.round(i*nice*100)/100)}
  private range(n:number,from=0){return Array.from({length:n-from+1},(_,i)=>i+from)}

  get ev(){const g=this.spec;if(g?.kind!=='ev')return null;
    const ticks=this.axis(Math.max(...g.pv,...g.ac,g.bac));const top=ticks[ticks.length-1];
    const x=(m:number)=>56+m*(474/g.months),y=(v:number)=>285-v*(260/top);const pts=(a:number[])=>a.map((v,i)=>`${x(i)},${y(v)}`).join(' ');
    const s=g.status;return {ticks,x,y,xs:this.range(g.months),s,bac:g.bac,pv:pts(g.pv),ev:pts(g.ev),ac:pts(g.ac),PV:g.pv[s],EV:g.ev[s],AC:g.ac[s],
      aria:`Earned value chart. At month ${s}: PV ${g.pv[s]}, EV ${g.ev[s]}, AC ${g.ac[s]}; BAC ${g.bac}.`}}
  get bdn(){const g=this.spec;if(g?.kind!=='burndown')return null;
    const ticks=this.axis(Math.max(g.total,...g.actual));const top=ticks[ticks.length-1];
    const x=(d:number)=>56+d*(474/g.days),y=(v:number)=>285-v*(260/top);const last=g.actual.length-1;
    return {ticks,x,y,xs:this.range(g.days),days:g.days,total:g.total,last,remaining:g.actual[last],line:g.actual.map((v,i)=>`${x(i)},${y(v)}`).join(' '),dots:g.actual.map((v,i)=>[x(i),y(v)]),
      aria:`Sprint burndown. Planned ${g.total} points over ${g.days} days. Remaining by day: ${g.actual.join(', ')}.`}}
  get bup(){const g=this.spec;if(g?.kind!=='burnup')return null;
    const scopeMax=Math.max(...g.scope);const ticks=this.axis(scopeMax*1.1);const top=ticks[ticks.length-1];
    const x=(s:number)=>56+s*(474/g.sprints),y=(v:number)=>285-v*(260/top);const lastDone=g.done.length-1;const doneNow=g.done[lastDone];
    const rate=doneNow/lastDone;const finalScope=g.scope[g.scope.length-1];const endS=Math.min(g.sprints,lastDone+(finalScope-doneNow)/rate);
    return {ticks,x,y,xs:this.range(g.sprints),n:g.sprints,scopeMax,lastDone,doneNow,scope:g.scope.map((v,i)=>`${x(i)},${y(v)}`).join(' '),done:g.done.map((v,i)=>`${x(i)},${y(v)}`).join(' '),
      fx1:x(lastDone),fy1:y(doneNow),fx2:x(endS),fy2:y(doneNow+rate*(endS-lastDone)),
      aria:`Release burnup. Scope by sprint: ${g.scope.join(', ')}. Completed by sprint: ${g.done.join(', ')}. Dashed line shows the forecast at the current rate.`}}
  get net(){const g=this.spec;if(g?.kind!=='network')return null;
    let k=0;const nodes=g.nodes.map(n=>{const act=n.id!=='Start'&&n.id!=='End';const w=act?70:64;return {...n,w,idx:act?k++:-1,aria:act?`Activity ${n.id}, ${n.d} days`:n.id}});
    const find=(id:string)=>nodes.find(n=>n.id===id)!;
    const edges=g.edges.map(([a,b])=>{const A=find(a),B=find(b);return [A.x+A.w,A.y+22,B.x,B.y+22]});
    const w=Math.max(...nodes.map(n=>n.x+n.w))+10;
    return {nodes,edges,w,aria:'Network diagram: '+g.edges.filter(e=>e[0]!=='Start'&&e[1]!=='End').map(e=>`${e[0]} to ${e[1]}`).join('; ')+'. Durations: '+nodes.filter(n=>n.idx>=0).map(n=>`${n.id} ${n.d}`).join(', ')+' days.'}}
  get risk(){const g=this.spec;return g?.kind==='risk'?g.risks:null}
  get grid(){const g=this.spec;return g?.kind==='grid'?g.items:null}
  get cfd(){const g=this.spec;if(g?.kind!=='cfd')return null;
    const n=g.bands[0].v.length;const totals=this.range(n-1).map(i=>g.bands.reduce((s,b)=>s+b.v[i],0));const ticks=this.axis(Math.max(...totals));const top=ticks[ticks.length-1];
    const x=(d:number)=>56+(d-1)*(444/(n-1)),y=(v:number)=>285-v*(260/top);
    const cum=(k:number,i:number)=>g.bands.slice(0,k+1).reduce((s,b)=>s+b.v[i],0);const xs=this.range(n,1);
    const bands=g.bands.map((b,k)=>{const top=xs.map((d,i)=>`${x(d)},${y(cum(k,i))}`);const bottom=xs.map((d,i)=>`${x(d)},${y(k?cum(k-1,i):0)}`).reverse();const lo=k?cum(k-1,n-1):0;return {name:b.name,points:[...top,...bottom].join(' '),labelY:y((lo+cum(k,n-1))/2)+4}});
    for(let k=1;k<bands.length;k++)if(bands[k].labelY>bands[k-1].labelY-16)bands[k].labelY=bands[k-1].labelY-16;
    return {ticks,x,y,xs,bands,aria:'Cumulative flow diagram. '+g.bands.map(b=>`${b.name}: ${b.v.join(', ')}`).join('. ')}}
  get ctl(){const g=this.spec;if(g?.kind!=='control')return null;
    const lo=Math.min(g.lcl,...g.values),hi=Math.max(g.ucl,...g.values);const pad=(hi-lo)*0.15;const y=(v:number)=>262-(v-(lo-pad))*(240/((hi+pad)-(lo-pad)));const x=(i:number)=>70+i*(430/(g.values.length-1));
    return {...g,y,line:g.values.map((v,i)=>`${x(i)},${y(v)}`).join(' '),dots:g.values.map((v,i)=>[x(i),y(v)]),aria:`Control chart in ${g.unit}. Mean ${g.mean}, UCL ${g.ucl}, LCL ${g.lcl}. Values: ${g.values.join(', ')}.`}}
  get par(){const g=this.spec;if(g?.kind!=='pareto')return null;
    const total=g.bars.reduce((s,b)=>s+b.v,0);const ticks=this.axis(total);const max=ticks[ticks.length-1];const y=(v:number)=>280-v*(250/max);const w=70,gap=(464-g.bars.length*w)/(g.bars.length+1);let c=0;
    const bars=g.bars.map((b,i)=>{c+=b.v;const x=56+gap+i*(w+gap);return {...b,x,w,y:y(b.v),h:280-y(b.v),cx:x+w/2,cy:y(c/total*max),cumPct:Math.round(c/total*100)}});
    return {ticks,y,max,bars,cum:bars.map(b=>`${b.cx},${b.cy}`).join(' '),aria:'Pareto chart. '+g.bars.map(b=>`${b.label} ${b.v}`).join(', ')+`. Total ${total}.`}}
  get tor(){const g=this.spec;if(g?.kind!=='tornado')return null;
    const m=Math.max(...g.bars.map(b=>Math.max(-b.low,b.high)));const cx=392,scale=140/m;
    return {cx,base:g.base,bars:g.bars.map((b,i)=>({...b,y:24+i*46,lx:cx+b.low*scale,lw:-b.low*scale,hw:b.high*scale})),aria:'Tornado diagram of NPV swing from base '+g.base+': '+g.bars.map(b=>`${b.label} ${b.low} to +${b.high}`).join('; ')}}
  get res(){const g=this.spec;if(g?.kind!=='resource')return null;
    const ticks=this.axis(Math.max(g.limit,...g.values)+1);const top=ticks[ticks.length-1];const y=(v:number)=>270-v*(240/top);const w=34,gap=(474-g.values.length*w)/(g.values.length+1);
    return {...g,ticks,y,bars:g.values.map((v,i)=>({x:56+gap+i*(w+gap),w,y:y(v),h:270-y(v),over:v>g.limit})),aria:`Resource histogram. ${g.unit} per week: ${g.values.join(', ')}. Available ${g.limit}.`}}
}
