import {Component,EventEmitter,Input,Output} from '@angular/core';
import {GraphicId} from './exam-types';

/** Exhibit charts used by graphic-based and hotspot questions. Hotspot regions emit their option index. */
@Component({
  standalone:true,
  selector:'app-exam-graphic',
  template:`
  <figure class="exhibit" [class.hot]="hotspot">
    @switch(id){
    @case('ev-curve'){
      <svg viewBox="0 0 560 320" role="img" aria-label="Earned value chart: at month 6, PV 600 thousand, EV 480 thousand, AC 540 thousand dollars; BAC 1,000 thousand">
        <g class="axis">@for(t of [0,250,500,750,1000];track t){<line [attr.x1]="50" [attr.x2]="530" [attr.y1]="ev(t)" [attr.y2]="ev(t)"/><text x="44" [attr.y]="ev(t)+4" text-anchor="end">{{t}}</text>}
          @for(m of months;track m){<text [attr.x]="mx(m)" y="300" text-anchor="middle">{{m}}</text>}<text x="290" y="318" text-anchor="middle">Month</text><text x="12" y="20">$000</text></g>
        <line class="status" [attr.x1]="mx(6)" [attr.x2]="mx(6)" y1="20" y2="285"/><text class="label" [attr.x]="mx(6)+4" y="30">Status date</text>
        <polyline class="pv" [attr.points]="pts(pv)"/><polyline class="evl" [attr.points]="pts(evv)"/><polyline class="ac" [attr.points]="pts(ac)"/>
        <text class="pv-t" [attr.x]="mx(6)-8" [attr.y]="ev(600)-8" text-anchor="end">PV 600</text><text class="ac-t" [attr.x]="mx(6)+8" [attr.y]="ev(540)+4">AC 540</text><text class="ev-t" [attr.x]="mx(6)+8" [attr.y]="ev(480)+16">EV 480</text>
        <text class="label" x="530" [attr.y]="ev(1000)-6" text-anchor="end">BAC 1,000</text>
        <g class="legend"><rect x="70" y="40" width="12" height="3" class="pvf"/><text x="88" y="45">Planned value</text><rect x="70" y="56" width="12" height="3" class="evf"/><text x="88" y="61">Earned value</text><rect x="70" y="72" width="12" height="3" class="acf"/><text x="88" y="77">Actual cost</text></g>
      </svg>}
    @case('burndown'){
      <svg viewBox="0 0 560 320" role="img" aria-label="Sprint burndown: ideal line from 80 points to 0 over 10 days; actual remaining 66 points at day 7">
        <g class="axis">@for(t of [0,20,40,60,80];track t){<line x1="50" x2="530" [attr.y1]="bd(t)" [attr.y2]="bd(t)"/><text x="44" [attr.y]="bd(t)+4" text-anchor="end">{{t}}</text>}
          @for(d of days;track d){<text [attr.x]="dx(d)" y="300" text-anchor="middle">{{d}}</text>}<text x="290" y="318" text-anchor="middle">Sprint day</text><text x="12" y="20">Story points remaining</text></g>
        <line class="ideal" [attr.x1]="dx(0)" [attr.y1]="bd(80)" [attr.x2]="dx(10)" [attr.y2]="bd(0)"/>
        <polyline class="evl" [attr.points]="bdPts()"/>@for(v of burndown;track $index){<circle class="dot" [attr.cx]="dx($index)" [attr.cy]="bd(v)" r="3.5"/>}
        <text class="ev-t" [attr.x]="dx(7)+8" [attr.y]="bd(66)-8">66 remaining (day 7)</text><text class="label" [attr.x]="dx(5)" [attr.y]="bd(40)+18">Ideal</text>
      </svg>}
    @case('network'){
      <svg viewBox="0 0 640 280" role="img" aria-label="Network diagram: A 3 days to B 4 and C 6; B to D 5 and E 2; C to E; D and E to F 3">
        <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="arrowhead"/></marker></defs>
        @for(e of edges;track $index){<line class="edge" [attr.x1]="node(e[0]).x+node(e[0]).w" [attr.y1]="node(e[0]).y+22" [attr.x2]="node(e[1]).x" [attr.y2]="node(e[1]).y+22" marker-end="url(#arr)"/>}
        @for(n of nodes;track n.id){
          <g [class.region]="hotspot&&n.idx>=0" [class.picked]="hotspot&&n.idx===selected" (click)="pick(n.idx)" (keydown.enter)="pick(n.idx)" [attr.tabindex]="hotspot&&n.idx>=0?0:null" [attr.role]="hotspot&&n.idx>=0?'button':null" [attr.aria-label]="n.label">
            <rect class="box" [attr.x]="n.x" [attr.y]="n.y" [attr.width]="n.w" height="44" rx="8"/>
            <text class="node-t" [attr.x]="n.x+n.w/2" [attr.y]="n.y+19" text-anchor="middle">{{n.id}}</text>@if(n.d){<text class="node-d" [attr.x]="n.x+n.w/2" [attr.y]="n.y+35" text-anchor="middle">{{n.d}} days</text>}
          </g>}
      </svg>}
    @case('risk-matrix'){
      <svg viewBox="0 0 520 380" role="img" aria-label="Probability and impact matrix with risks R1 to R6">
        @for(p of five;track p){@for(i of five;track i){<rect [attr.class]="'cell '+zone(p*i)" [attr.x]="60+(i-1)*84" [attr.y]="20+(5-p)*62" width="82" height="60"/>}}
        @for(n of five;track n){<text class="axis-t" x="48" [attr.y]="20+(5-n)*62+34" text-anchor="end">{{n}}</text><text class="axis-t" [attr.x]="60+(n-1)*84+41" y="346" text-anchor="middle">{{n}}</text>}
        <text class="axis-t" x="270" y="372" text-anchor="middle">Impact →</text><text class="axis-t" x="14" y="180" transform="rotate(-90 14 180)" text-anchor="middle">Probability →</text>
        @for(r of risks;track r.id){<g [class.region]="hotspot" [class.picked]="hotspot&&r.idx===selected" (click)="pick(r.idx)" (keydown.enter)="pick(r.idx)" [attr.tabindex]="hotspot?0:null" [attr.role]="hotspot?'button':null" [attr.aria-label]="r.id+': probability '+r.p+', impact '+r.i">
          <circle class="risk" [attr.cx]="60+(r.i-1)*84+41+r.dx" [attr.cy]="20+(5-r.p)*62+30" r="17"/><text class="risk-t" [attr.x]="60+(r.i-1)*84+41+r.dx" [attr.y]="20+(5-r.p)*62+35" text-anchor="middle">{{r.id}}</text></g>}
      </svg>}
    @case('stakeholder-grid'){
      <svg viewBox="0 0 520 360" role="img" aria-label="Power and interest grid with four stakeholders">
        <rect class="quad" x="60" y="20" width="220" height="150"/><rect class="quad" x="282" y="20" width="220" height="150"/><rect class="quad" x="60" y="172" width="220" height="150"/><rect class="quad" x="282" y="172" width="220" height="150"/>
        <text class="axis-t" x="281" y="350" text-anchor="middle">Interest →</text><text class="axis-t" x="20" y="170" transform="rotate(-90 20 170)" text-anchor="middle">Power →</text>
        <text class="axis-t" x="66" y="340">Low</text><text class="axis-t" x="496" y="340" text-anchor="end">High</text>
        @for(s of stakeholders;track s.label){<g [class.region]="hotspot" [class.picked]="hotspot&&s.idx===selected" (click)="pick(s.idx)" (keydown.enter)="pick(s.idx)" [attr.tabindex]="hotspot?0:null" [attr.role]="hotspot?'button':null" [attr.aria-label]="s.label">
          <rect class="chip" [attr.x]="s.x-78" [attr.y]="s.y-17" width="156" height="34" rx="17"/><text class="chip-t" [attr.x]="s.x" [attr.y]="s.y+5" text-anchor="middle">{{s.label}}</text></g>}
      </svg>}
    @case('cfd'){
      <svg viewBox="0 0 560 320" role="img" aria-label="Cumulative flow diagram over 10 days: Testing band widens while Done grows slowly">
        <g class="axis">@for(t of [0,12,24,36,48];track t){<line x1="50" x2="530" [attr.y1]="cy(t)" [attr.y2]="cy(t)"/><text x="44" [attr.y]="cy(t)+4" text-anchor="end">{{t}}</text>}
          @for(d of tenDays;track d){<text [attr.x]="cx(d)" y="300" text-anchor="middle">{{d}}</text>}<text x="290" y="318" text-anchor="middle">Day</text><text x="12" y="16">Work items</text></g>
        @for(b of cfdBands;track b.name;let k=$index){<polygon [attr.class]="'band b'+k" [attr.points]="band(k)"/>}
        @for(b of cfdBands;track b.name;let k=$index){<text class="band-t" x="536" [attr.y]="labelY(k)">{{b.name}}</text>}
      </svg>}
    @case('burnup'){
      <svg viewBox="0 0 560 320" role="img" aria-label="Release burnup: scope 200 points rising to 260 at sprint 5; completed 25 points per sprint, 150 at sprint 6">
        <g class="axis">@for(t of [0,100,200,300];track t){<line x1="50" x2="530" [attr.y1]="by(t)" [attr.y2]="by(t)"/><text x="44" [attr.y]="by(t)+4" text-anchor="end">{{t}}</text>}
          @for(s of sprints;track s){<text [attr.x]="sx(s)" y="300" text-anchor="middle">{{s}}</text>}<text x="290" y="318" text-anchor="middle">Sprint</text><text x="12" y="16">Story points</text></g>
        <polyline class="pv" [attr.points]="scopePts()"/><polyline class="evl" [attr.points]="donePts()"/><line class="ideal" [attr.x1]="sx(6)" [attr.y1]="by(150)" [attr.x2]="sx(10)" [attr.y2]="by(250)"/>
        <text class="pv-t" [attr.x]="sx(7)" [attr.y]="by(260)-8">Total scope (200 → 260)</text><text class="ev-t" [attr.x]="sx(6)-6" [attr.y]="by(150)-10" text-anchor="end">Completed 150</text><text class="label" [attr.x]="sx(8)+8" [attr.y]="by(200)+18">Forecast</text>
      </svg>}
    @case('control-chart'){
      <svg viewBox="0 0 560 300" role="img" aria-label="Control chart of 15 concrete strength results; mean 35 MPa, UCL 38, LCL 32; the last eight results are above the mean">
        <line class="limit" x1="50" x2="530" [attr.y1]="kv(38)" [attr.y2]="kv(38)"/><line class="limit" x1="50" x2="530" [attr.y1]="kv(32)" [attr.y2]="kv(32)"/><line class="mean" x1="50" x2="530" [attr.y1]="kv(35)" [attr.y2]="kv(35)"/>
        <text class="label" x="534" [attr.y]="kv(38)+4">UCL 38</text><text class="label" x="534" [attr.y]="kv(35)+4">Mean 35</text><text class="label" x="534" [attr.y]="kv(32)+4">LCL 32</text>
        <polyline class="evl" [attr.points]="ccPts()"/>@for(v of control;track $index){<circle class="dot" [attr.cx]="kx($index)" [attr.cy]="kv(v)" r="3.5"/>}
        <g class="axis">@for(v of control;track $index){<text [attr.x]="kx($index)" y="290" text-anchor="middle">{{$index+1}}</text>}<text x="12" y="16">MPa</text></g>
      </svg>}
    }
    @if(hotspot){<figcaption>Click an item in the exhibit to select your answer.</figcaption>}
  </figure>`,
  styles:[`
    .exhibit{margin:0 0 1rem;padding:.75rem;border:1px solid var(--line);border-radius:12px;background:#061629}
    svg{display:block;width:100%;height:auto;font:12px Inter,Arial,sans-serif}
    figcaption{margin-top:.4rem;font-size:.85rem;color:var(--muted)}
    .axis line{stroke:#1d3a57;stroke-width:1}.axis text,.axis-t{fill:#9db1c7}
    .pv{fill:none;stroke:#8fa8ff;stroke-width:2.5;stroke-dasharray:6 4}.evl{fill:none;stroke:#49cce1;stroke-width:2.5}.ac{fill:none;stroke:#ff9c7a;stroke-width:2.5}
    .pvf{fill:#8fa8ff}.evf{fill:#49cce1}.acf{fill:#ff9c7a}.legend text{fill:#dcebf7}
    .pv-t{fill:#aebfff;font-weight:700}.ev-t{fill:#7fe0ef;font-weight:700}.ac-t{fill:#ffb59c;font-weight:700}.label{fill:#c9d9e7}
    .status{stroke:#f0c36b;stroke-dasharray:4 4}.ideal{stroke:#7d93a8;stroke-width:2;stroke-dasharray:6 5}.dot{fill:#49cce1}
    .edge{stroke:#7d93a8;stroke-width:1.6}.arrowhead{fill:#7d93a8}
    .box{fill:#0b2340;stroke:#3b5874;stroke-width:1.5}.node-t{fill:#fff;font-weight:800;font-size:14px}.node-d{fill:#9db1c7}
    .cell{stroke:#061629;stroke-width:2}.cell.red{fill:#7a2a33}.cell.amber{fill:#7a5a22}.cell.green{fill:#1f5a45}
    .risk{fill:#0b2340;stroke:#fff;stroke-width:1.5}.risk-t{fill:#fff;font-weight:800}
    .quad{fill:#0b2340;stroke:#1d3a57}.chip{fill:#123459;stroke:#49cce1}.chip-t{fill:#eaf3fc;font-weight:700}
    .band{stroke:#061629;stroke-width:1}.b0{fill:#2f7d5b}.b1{fill:#b8783a}.b2{fill:#3c6fb0}.b3{fill:#3a4a63}.band-t{fill:#dcebf7;font-weight:700}
    .limit{stroke:#ff8f8f;stroke-dasharray:6 4}.mean{stroke:#9db1c7}
    .hot .region{cursor:pointer}.hot .region:hover .box,.hot .region:hover .risk,.hot .region:hover .chip,.hot .region:focus .box,.hot .region:focus .risk,.hot .region:focus .chip{stroke:#f0c36b;stroke-width:3}
    .picked .box,.picked .risk,.picked .chip{stroke:#f0c36b!important;stroke-width:4!important;fill:#4a3a12!important}
    .region:focus{outline:none}
  `]
})
export class ExamGraphicComponent{
  @Input({required:true}) id!:GraphicId;
  @Input() hotspot=false;
  @Input() selected:number|null=null;
  @Input() disabled=false;
  @Output() picked=new EventEmitter<number>();
  pick(i:number){if(this.hotspot&&!this.disabled&&i>=0)this.picked.emit(i)}

  readonly five=[1,2,3,4,5];
  // Earned value
  readonly months=[0,1,2,3,4,5,6,7,8,9,10];
  readonly pv=[0,40,100,190,300,440,600,750,870,950,1000];
  readonly evv=[0,35,85,160,250,360,480];
  readonly ac=[0,40,95,180,280,400,540];
  mx(m:number){return 50+m*48}
  ev(v:number){return 285-v*0.255}
  pts(a:number[]){return a.map((v,i)=>`${this.mx(i)},${this.ev(v)}`).join(' ')}
  // Burndown
  readonly days=[0,1,2,3,4,5,6,7,8,9,10];
  readonly burndown=[80,80,78,76,76,74,70,66];
  dx(d:number){return 50+d*48}
  bd(v:number){return 285-v*3.15}
  bdPts(){return this.burndown.map((v,i)=>`${this.dx(i)},${this.bd(v)}`).join(' ')}
  // Network (AON)
  readonly nodes=[
    {id:'Start',d:0,x:10,y:118,w:64,idx:-1,label:'Start'},
    {id:'A',d:3,x:110,y:118,w:70,idx:0,label:'Activity A, 3 days'},
    {id:'B',d:4,x:225,y:40,w:70,idx:1,label:'Activity B, 4 days'},
    {id:'C',d:6,x:225,y:196,w:70,idx:2,label:'Activity C, 6 days'},
    {id:'D',d:5,x:345,y:40,w:70,idx:3,label:'Activity D, 5 days'},
    {id:'E',d:2,x:345,y:196,w:70,idx:4,label:'Activity E, 2 days'},
    {id:'F',d:3,x:465,y:118,w:70,idx:5,label:'Activity F, 3 days'},
    {id:'End',d:0,x:568,y:118,w:64,idx:-1,label:'End'}];
  readonly edges=[['Start','A'],['A','B'],['A','C'],['B','D'],['B','E'],['C','E'],['D','F'],['E','F'],['F','End']];
  node(id:string){return this.nodes.find(n=>n.id===id)!}
  // Risk matrix
  readonly risks=[{id:'R1',p:4,i:5,idx:0,dx:0},{id:'R2',p:2,i:2,idx:1,dx:0},{id:'R3',p:5,i:2,idx:2,dx:0},{id:'R4',p:1,i:5,idx:3,dx:0},{id:'R5',p:3,i:4,idx:4,dx:0},{id:'R6',p:4,i:1,idx:5,dx:0}];
  zone(s:number){return s>=15?'red':s>=6?'amber':'green'}
  // Stakeholder grid
  readonly stakeholders=[{label:'Regional VP',x:170,y:80,idx:0},{label:'Union representative',x:392,y:95,idx:1},{label:'Call-centre agents',x:400,y:250,idx:2},{label:'Vendor account manager',x:165,y:255,idx:3}];
  // Cumulative flow (bands from bottom: Done, Testing, In progress, To do)
  readonly tenDays=[1,2,3,4,5,6,7,8,9,10];
  readonly cfdBands=[
    {name:'Done',v:[0,2,4,5,6,7,8,9,10,11]},
    {name:'Testing',v:[2,4,6,9,12,15,18,21,24,27]},
    {name:'In progress',v:[6,6,7,6,6,7,6,6,7,6]},
    {name:'To do',v:[40,36,31,28,24,19,16,12,7,4]}];
  cx(d:number){return 50+(d-1)*53.3}
  cy(v:number){return 285-v*5.5}
  private cum(k:number,i:number){let s=0;for(let j=0;j<=k;j++)s+=this.cfdBands[j].v[i];return s}
  band(k:number){const top=this.tenDays.map((d,i)=>`${this.cx(d)},${this.cy(this.cum(k,i))}`);const bottom=this.tenDays.map((d,i)=>`${this.cx(d)},${this.cy(k?this.cum(k-1,i):0)}`).reverse();return [...top,...bottom].join(' ')}
  labelY(k:number){const i=9;const lo=k?this.cum(k-1,i):0;return this.cy((lo+this.cum(k,i))/2)+4}
  // Burnup
  readonly sprints=[0,1,2,3,4,5,6,7,8,9,10];
  sx(s:number){return 50+s*48}
  by(v:number){return 285-v*0.88}
  scopePts(){return this.sprints.map(s=>`${this.sx(s)},${this.by(s<5?200:260)}`).join(' ')}
  donePts(){return [0,1,2,3,4,5,6].map(s=>`${this.sx(s)},${this.by(s*25)}`).join(' ')}
  // Control chart
  readonly control=[34.2,35.6,33.8,36.1,34.5,35.2,33.9,35.8,36.4,35.9,36.8,36.2,37.1,36.5,36.9];
  kx(i:number){return 60+i*32}
  kv(v:number){return 270-(v-30)*28}
  ccPts(){return this.control.map((v,i)=>`${this.kx(i)},${this.kv(v)}`).join(' ')}
}
