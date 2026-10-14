import {Component,ElementRef,Input,ViewChild} from '@angular/core';
import {exportSvg} from '../../core/export-utils';
import {benefitProgress,budgetBars,evmSeries,ganttLayout,groupBy,milestoneLayout,raciMatrix,stakeholderGrid,statusColor,wbsLayout,type Row} from './preview-layout';

interface Col{key:string;label:string}
const SVG_KINDS=['wbs','gantt','milestones','stakeholders','budget','evm','benefits'];

/** Live preview canvas under each PM Artifacts Lab template: a diagram, chart, board or formatted document built from the rows. */
@Component({
  standalone:true,selector:'app-artifact-preview',
  template:`
  <section class="preview" aria-label="Preview">
    <header class="pv-head">
      <div><p class="eyebrow">Live preview</p><h3>{{heading}}</h3></div>
      @if(isSvg){<div class="pv-actions"><button type="button" class="button secondary small" (click)="download('png')">Download PNG</button><button type="button" class="button secondary small" (click)="download('pdf')">Download diagram PDF</button></div>}
    </header>
    @if(msg){<p class="warn" role="status">{{msg}}</p>}
    @if(!rows.length){<p class="pv-empty">Add rows to see the preview.</p>}
    @else{
    <div class="paper">
      <p class="paper-title">{{projectName||'Project'}} · {{toolName}}</p>
      @switch(toolId){
        @case('wbs'){@let w=wbs;
          <div class="scroll"><svg #canvas [attr.viewBox]="'0 0 '+w.width+' '+w.height" [attr.width]="w.width" [attr.height]="w.height" font-family="Arial, sans-serif" role="img" aria-label="Work breakdown structure tree">
            <rect [attr.width]="w.width" [attr.height]="w.height" fill="#ffffff"/>
            @for(e of w.edges;track $index){<path [attr.d]="'M'+e.x1+','+e.y1+' V'+e.ym+' H'+e.x2+' V'+e.y2" fill="none" stroke="#7b8fa3" stroke-width="1.5"/>}
            @for(nd of w.nodes;track $index){<g [attr.transform]="'translate('+nd.x+','+nd.y+')'">
              <rect [attr.width]="w.boxW" [attr.height]="w.boxH" rx="8" [attr.fill]="nd.depth===0?'#0b2340':nd.leaf?'#eef6fb':'#d9ecf7'" [attr.stroke]="nd.depth===0?'#0b2340':'#3b7bb0'" stroke-width="1.5"/>
              <text x="10" y="20" font-size="12" font-weight="700" [attr.fill]="nd.depth===0?'#49cce1':'#1f6f8b'">{{nd.virtual?'Project':nd.code}}</text>
              <text x="10" y="40" font-size="13" font-weight="700" [attr.fill]="nd.depth===0?'#ffffff':'#0b2340'">{{clip(nd.name,24)}}</text>
              <text x="10" y="60" font-size="11" [attr.fill]="nd.depth===0?'#cfe3f3':'#4a5d70'">{{nd.owner?clip(nd.owner,14)+' · ':''}}{{nd.leaf?nd.effort+' h':'Σ '+nd.total+' h'}}</text>
            </g>}
          </svg></div>
          @if(w.warnings.length){<ul class="warn">@for(m of w.warnings;track $index){<li>{{m}}</li>}</ul>}
          <p class="pv-note">Each box shows its WBS code, deliverable, owner and effort. Parent boxes (Σ) add up their children's hours.</p>
        }
        @case('gantt'){@let g=gantt;
          <div class="scroll"><svg #canvas [attr.viewBox]="'0 0 '+g.width+' '+g.height" [attr.width]="g.width" [attr.height]="g.height" font-family="Arial, sans-serif" role="img" aria-label="Gantt chart">
            <rect [attr.width]="g.width" [attr.height]="g.height" fill="#ffffff"/>
            @for(t of g.ticks;track $index){<line [attr.x1]="t.x" [attr.x2]="t.x" y1="24" [attr.y2]="g.height" stroke="#e3e9f0"/><text [attr.x]="t.x+3" y="16" font-size="10" fill="#5a6b7c">{{t.label}}</text>}
            @for(b of g.bars;track $index){
              <text x="8" [attr.y]="b.y+19" font-size="12" fill="#16222f">{{clip(b.name,30)}}</text>
              <rect [attr.x]="b.x" [attr.y]="b.y+7" [attr.width]="b.w" height="18" rx="4" fill="#b9d7ee"/>
              <rect [attr.x]="b.x" [attr.y]="b.y+7" [attr.width]="b.w*b.progress/100" height="18" rx="4" fill="#2b7bb9"/>
              <text [attr.x]="b.x+b.w+5" [attr.y]="b.y+20" font-size="10" fill="#4a5d70">{{b.progress}}%</text>
            }
            @for(d of g.deps;track $index){<path [attr.d]="'M'+d.x1+','+d.y1+' h6 V'+d.y2+' H'+d.x2" fill="none" stroke="#c27c0e" stroke-width="1.2" stroke-dasharray="3 2"/>}
            @if(g.today!==null){<line [attr.x1]="g.today" [attr.x2]="g.today" y1="22" [attr.y2]="g.height" stroke="#b42318" stroke-width="1.5"/><text [attr.x]="g.today+3" y="30" font-size="10" fill="#b42318">Today</text>}
          </svg></div>
          @if(g.skipped){<ul class="warn"><li>{{g.skipped}} task{{g.skipped===1?' has':'s have'}} no valid start date and {{g.skipped===1?'is':'are'}} not shown.</li></ul>}
          <p class="pv-note">Dark fill shows progress. Dashed orange lines link a task to the task it depends on.</p>
        }
        @case('milestones'){@let m=milestones;
          <div class="scroll"><svg #canvas [attr.viewBox]="'0 0 '+m.width+' 220'" [attr.width]="m.width" height="220" font-family="Arial, sans-serif" role="img" aria-label="Milestone timeline">
            <rect [attr.width]="m.width" height="220" fill="#ffffff"/><line x1="30" [attr.x2]="m.width-30" y1="110" y2="110" stroke="#7b8fa3" stroke-width="3"/>
            @for(p of m.points;track $index){<g [attr.transform]="'translate('+p.x+',110)'">
              <line x1="0" x2="0" [attr.y1]="p.above?-12:12" [attr.y2]="p.above?-40:40" stroke="#b6c4d1"/>
              <rect x="-9" y="-9" width="18" height="18" [attr.fill]="p.color" transform="rotate(45)"/>
              <text text-anchor="middle" [attr.y]="p.above?-62:58" font-size="12" font-weight="700" fill="#16222f">{{clip(p.name,22)}}</text>
              <text text-anchor="middle" [attr.y]="p.above?-46:74" font-size="10" fill="#4a5d70">{{p.date}} · {{p.status}}</text></g>}
          </svg></div>
          <p class="pv-note">Diamonds are coloured by status: green done, amber at risk or pending, red late, blue planned.</p>
        }
        @case('stakeholders'){@let s=stake;
          <div class="scroll"><svg #canvas viewBox="0 0 760 480" width="760" height="480" font-family="Arial, sans-serif" role="img" aria-label="Influence and interest grid">
            <rect width="760" height="480" fill="#ffffff"/>
            @for(r of [2,1,0];track r;let ri=$index){@for(c of [0,1,2];track c){
              <rect [attr.x]="100+c*210" [attr.y]="20+ri*140" width="206" height="136" [attr.fill]="quad(r,c).fill" stroke="#ffffff"/>
              <text [attr.x]="108+c*210" [attr.y]="38+ri*140" font-size="10" font-weight="700" fill="#4a5d70">{{quad(r,c).label}}</text>
              @for(name of s[r][c].slice(0,5);track $index){<text [attr.x]="108+c*210" [attr.y]="58+ri*140+$index*16" font-size="12" fill="#16222f">• {{clip(name,26)}}</text>}
              @if(s[r][c].length>5){<text [attr.x]="108+c*210" [attr.y]="58+ri*140+80" font-size="11" fill="#4a5d70">+{{s[r][c].length-5}} more</text>}
            }}
            <text x="20" y="95" font-size="11" fill="#4a5d70">High</text><text x="20" y="235" font-size="11" fill="#4a5d70">Medium</text><text x="20" y="375" font-size="11" fill="#4a5d70">Low</text>
            <text x="16" y="470" font-size="11" font-weight="700" fill="#0b2340">↑ Influence</text>
            <text x="175" y="458" font-size="11" fill="#4a5d70">Low</text><text x="378" y="458" font-size="11" fill="#4a5d70">Medium</text><text x="595" y="458" font-size="11" fill="#4a5d70">High</text><text x="640" y="474" font-size="11" font-weight="700" fill="#0b2340">Interest →</text>
          </svg></div>
        }
        @case('budget'){@let b=budget;
          <div class="scroll"><svg #canvas [attr.viewBox]="'0 0 800 '+(70+b.items.length*58)" width="800" [attr.height]="70+b.items.length*58" font-family="Arial, sans-serif" role="img" aria-label="Budget chart">
            <rect width="800" [attr.height]="70+b.items.length*58" fill="#ffffff"/>
            <g font-size="11"><rect x="200" y="10" width="12" height="12" fill="#7aa7d6"/><text x="216" y="20" fill="#16222f">Planned</text><rect x="290" y="10" width="12" height="12" fill="#2b7bb9"/><text x="306" y="20" fill="#16222f">Actual</text><rect x="370" y="10" width="12" height="12" fill="#c27c0e"/><text x="386" y="20" fill="#16222f">Forecast</text></g>
            @for(it of b.items;track $index){<g [attr.transform]="'translate(0,'+(40+$index*58)+')'">
              <text x="8" y="26" font-size="12" font-weight="700" fill="#16222f">{{clip(it.name,24)}}</text>
              <rect x="200" y="4" [attr.width]="520*it.planned/b.max" height="14" fill="#7aa7d6"/><rect x="200" y="20" [attr.width]="520*it.actual/b.max" height="14" fill="#2b7bb9"/><rect x="200" y="36" [attr.width]="520*it.forecast/b.max" height="14" [attr.fill]="it.forecast>it.planned?'#b42318':'#c27c0e'"/>
              <text [attr.x]="205+520*Math.max(it.planned,it.actual,it.forecast)/b.max" y="30" font-size="10" fill="#4a5d70">{{money(it.forecast-it.planned,true)}}</text></g>}
          </svg></div>
          <p class="pv-note">Totals: planned {{money(b.tot.planned)}}, actual {{money(b.tot.actual)}}, forecast {{money(b.tot.forecast)}}. A red forecast bar means that category is forecast over plan.</p>
        }
        @case('evm'){@let e=evm;
          <div class="scroll"><svg #canvas [attr.viewBox]="'0 0 '+(e.L+e.W+40)+' '+(e.T+e.H+50)" [attr.width]="e.L+e.W+40" [attr.height]="e.T+e.H+50" font-family="Arial, sans-serif" role="img" aria-label="Earned value S-curve">
            <rect [attr.width]="e.L+e.W+40" [attr.height]="e.T+e.H+50" fill="#ffffff"/>
            @for(gr of e.grid;track $index){<line [attr.x1]="e.L" [attr.x2]="e.L+e.W" [attr.y1]="gr.y" [attr.y2]="gr.y" stroke="#e3e9f0"/><text [attr.x]="e.L-6" [attr.y]="gr.y+4" font-size="10" fill="#5a6b7c" text-anchor="end">{{short(gr.v)}}</text>}
            <path [attr.d]="e.paths.pv" fill="none" stroke="#7aa7d6" stroke-width="2.5"/><path [attr.d]="e.paths.ev" fill="none" stroke="#1f7a46" stroke-width="2.5"/><path [attr.d]="e.paths.ac" fill="none" stroke="#b42318" stroke-width="2.5" stroke-dasharray="6 3"/>
            @for(p of e.pts;track $index){<circle [attr.cx]="p.x" [attr.cy]="p.ypv" r="4" fill="#7aa7d6"/><circle [attr.cx]="p.x" [attr.cy]="p.yev" r="4" fill="#1f7a46"/><circle [attr.cx]="p.x" [attr.cy]="p.yac" r="4" fill="#b42318"/>}
            @for(p of e.pts;track $index){<text [attr.x]="p.x" [attr.y]="e.T+e.H+18" font-size="10" fill="#5a6b7c" text-anchor="middle">{{clip(p.label,12)}}</text>}
            <g font-size="11" [attr.transform]="'translate('+e.L+','+(e.T+e.H+38)+')'"><rect width="12" height="4" y="-4" fill="#7aa7d6"/><text x="16" fill="#16222f">PV (planned)</text><rect x="120" width="12" height="4" y="-4" fill="#1f7a46"/><text x="136" fill="#16222f">EV (earned)</text><rect x="230" width="12" height="4" y="-4" fill="#b42318"/><text x="246" fill="#16222f">AC (actual)</text><text x="360" fill="#0b2340" font-weight="700">CPI {{fix(e.cpi)}} · SPI {{fix(e.spi)}}</text></g>
          </svg></div>
          <p class="pv-note">Cumulative S-curves. EV below PV means behind schedule; AC above EV means over budget.</p>
        }
        @case('benefits'){
          <div class="scroll"><svg #canvas [attr.viewBox]="'0 0 800 '+(20+benefits.length*64)" width="800" [attr.height]="20+benefits.length*64" font-family="Arial, sans-serif" role="img" aria-label="Benefits progress">
            <rect width="800" [attr.height]="20+benefits.length*64" fill="#ffffff"/>
            @for(bn of benefits;track $index){<g [attr.transform]="'translate(0,'+(14+$index*64)+')'">
              <text x="8" y="14" font-size="12" font-weight="700" fill="#16222f">{{clip(bn.name,40)}}</text><text x="8" y="30" font-size="10" fill="#4a5d70">{{clip(bn.kpi,50)}} · baseline {{bn.baseline}} → target {{bn.target}} · now {{bn.current}}</text>
              <rect x="8" y="38" width="560" height="12" rx="6" fill="#e3e9f0"/><rect x="8" y="38" [attr.width]="560*Math.min(1,bn.pct)" height="12" rx="6" [attr.fill]="bn.pct>=1?'#1f7a46':'#2b7bb9'"/>
              <text x="578" y="48" font-size="11" font-weight="700" fill="#0b2340">{{(bn.pct*100).toFixed(0)}}% of target</text></g>}
          </svg></div>
        }
        @case('raci'){@let r=raci;
          <div class="scroll"><table class="pv-table"><thead><tr><th>Activity</th>@for(p of r.people;track p){<th>{{p}}</th>}<th>Check</th></tr></thead>
            <tbody>@for(row of r.grid;track $index){<tr><td>{{row.activity}}</td>@for(c of row.cells;track $index){<td class="raci" [class]="'raci '+c">{{c}}</td>}<td>{{row.accountable===1?'✓':row.accountable===0?'No A':'More than one A'}}</td></tr>}</tbody></table></div>
          <p class="pv-note">Each activity should have exactly one Accountable (A) person.</p>
        }
        @case('raid'){
          <div class="board">@for(col of board('type',['Risk','Assumption','Issue','Dependency']);track col.name){<div class="col"><h4>{{col.name}} <small>{{col.items.length}}</small></h4>
            @for(it of col.items;track $index){<div class="card-i" [style.borderLeftColor]="impactColor(it['impact'])"><strong>{{it['description']||'—'}}</strong><small>{{it['impact']}} impact · {{it['status']}}{{it['owner']?' · '+it['owner']:''}}</small>@if(it['response']){<p>{{it['response']}}</p>}</div>}</div>}</div>
        }
        @case('status'){
          <div class="status-grid">@for(it of rows;track $index){<div class="st" [style.borderTopColor]="color(it['f2'])"><small>{{it['f0']}}</small><h4>{{it['f1']||'Area'}}</h4><span class="pill" [style.background]="color(it['f2'])">{{it['f2']||'No status'}}</span><p>{{it['f3']}}</p>@if(it['f4']){<p class="next">Next: {{it['f4']}}</p>}</div>}</div>
        }
        @case('stories'){
          <div class="status-grid">@for(it of rows;track $index){<div class="story"><small>{{it['f0']}} · {{it['f5']}} priority</small><p><strong>As a</strong> {{it['f1']}}, <strong>I want</strong> {{lower(it['f2'])}} <strong>so that</strong> {{lower(it['f3'])}}.</p>@if(it['f4']){<p class="ac">✓ {{it['f4']}}</p>}</div>}</div>
        }
        @default{
          @if(boardKey){<div class="board">@for(col of board(boardKey);track col.name){<div class="col"><h4>{{col.name}} <small>{{col.items.length}}</small></h4>
            @for(it of col.items;track $index){<div class="card-i" [style.borderLeftColor]="color(col.name)"><strong>{{titleOf(it)}}</strong>@for(c of detailCols;track c.key){@if(it[c.key]){<small>{{c.label}}: {{it[c.key]}}</small>}}</div>}</div>}</div>}
          @else{<div class="doc">@for(it of rows;track $index){<section><h4>{{titleOf(it)}}</h4>@for(c of detailCols;track c.key){@if(it[c.key]){<p><span>{{c.label}}</span>{{it[c.key]}}</p>}}</section>}</div>}
        }
      }
    </div>}
  </section>`,
  styles:[`
    .preview{margin-top:1.5rem;border-top:1px solid var(--line);padding-top:1.2rem}
    .pv-head{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;flex-wrap:wrap;margin-bottom:.8rem}.pv-head h3{margin:0}.pv-head .eyebrow{margin-bottom:.3rem}
    .pv-actions{display:flex;gap:.5rem;flex-wrap:wrap}
    .paper{background:#f7f9fc;color:#16222f;border-radius:14px;padding:1rem;overflow:hidden}
    .paper-title{margin:0 0 .7rem;font-weight:800;color:#0b2340}
    .scroll{overflow:auto;background:#fff;border:1px solid #d9e2ec;border-radius:10px}
    .scroll svg{display:block}
    .pv-empty,.pv-note{color:var(--muted);font-size:.88rem}.paper .pv-note{color:#4a5d70;margin:.6rem 0 0}
    .warn{margin:.6rem 0 0;padding:.6rem .9rem .6rem 1.8rem;background:#fff4e5;border:1px solid #f0c27b;border-radius:8px;color:#7a4b00;font-size:.88rem}
    .pv-table{border-collapse:collapse;width:100%;font-size:.88rem}.pv-table th,.pv-table td{border:1px solid #d9e2ec;padding:.45rem .6rem;text-align:center;color:#16222f}.pv-table th{background:#eef2f6}.pv-table td:first-child{text-align:left}
    .raci{font-weight:800}.raci.A{background:#ffe2e0}.raci.R{background:#dff3e7}.raci.C{background:#e0ecfb}.raci.I{background:#f1f3f5}
    .board{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.7rem}
    .col{background:#eef2f6;border-radius:10px;padding:.6rem}.col h4{margin:0 0 .5rem;color:#0b2340}.col h4 small{color:#5a6b7c}
    .card-i{background:#fff;border-radius:8px;border-left:4px solid #2563eb;padding:.55rem .65rem;margin-bottom:.45rem;display:grid;gap:.15rem}
    .card-i strong{font-size:.9rem;color:#16222f}.card-i small{color:#4a5d70;font-size:.78rem}.card-i p{margin:.2rem 0 0;font-size:.82rem;color:#2f3f50}
    .status-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.7rem}
    .st,.story{background:#fff;border:1px solid #d9e2ec;border-top:5px solid #2563eb;border-radius:10px;padding:.8rem}.st h4{margin:.2rem 0 .4rem;color:#0b2340}.st small,.story small{color:#5a6b7c}
    .pill{display:inline-block;color:#fff;border-radius:99px;padding:.15rem .6rem;font-size:.75rem;font-weight:800}.st p,.story p{margin:.5rem 0 0;font-size:.88rem;color:#2f3f50}.next{color:#1f6f8b!important}
    .story{border-top-color:#49cce1}.ac{color:#1f7a46!important}
    .doc section{background:#fff;border:1px solid #d9e2ec;border-radius:10px;padding:.8rem 1rem;margin-bottom:.6rem}.doc h4{margin:0 0 .4rem;color:#0b2340}
    .doc p{margin:.25rem 0;font-size:.9rem;color:#2f3f50;line-height:1.55}.doc p span{display:inline-block;min-width:9rem;font-weight:700;color:#5a6b7c;margin-right:.4rem}
  `]
})
export class ArtifactPreviewComponent{
  @Input() toolId='';@Input() toolName='';@Input() projectName='';
  @Input() columns:Col[]=[];@Input() rows:Row[]=[];
  @ViewChild('canvas') canvas?:ElementRef<SVGSVGElement>;
  readonly Math=Math;

  get isSvg(){return SVG_KINDS.includes(this.toolId)&&this.rows.length>0;}
  /** The diagram, if this template has one (used to add it to the PDF export). */
  svg():SVGSVGElement|undefined{return this.isSvg?this.canvas?.nativeElement:undefined;}
  get heading(){return ({wbs:'WBS tree',gantt:'Gantt chart',milestones:'Milestone timeline',stakeholders:'Influence / interest grid',budget:'Budget chart',evm:'Earned value S-curve',benefits:'Benefits progress',raci:'RACI matrix',raid:'RAID board',status:'Status dashboard',stories:'Story cards',backlog:'Backlog board',actions:'Action board',change:'Change board'} as Record<string,string>)[this.toolId]??'Document view';}
  get wbs(){return wbsLayout(this.rows,this.projectName);}
  get gantt(){return ganttLayout(this.rows);}
  get milestones(){return milestoneLayout(this.rows);}
  get stake(){return stakeholderGrid(this.rows);}
  get budget(){return budgetBars(this.rows);}
  get evm(){return evmSeries(this.rows);}
  get benefits(){return benefitProgress(this.rows);}
  get raci(){return raciMatrix(this.rows);}
  get boardKey(){return ({backlog:'f5',actions:'f4',change:'f4'} as Record<string,string>)[this.toolId]??'';}
  board(key:string,order:string[]=[]){return groupBy(this.rows,key,order);}
  /** True when the first column is an ID, so the title combines it with the second column. */
  get idFirst(){return /^(id|#)$/i.test(this.columns[0]?.label??'');}
  get detailCols(){return this.columns.slice(this.idFirst?2:1).filter(c=>c.key!==this.boardKey);}
  titleOf(r:Row){const first=this.columns[0]?.key;const second=this.columns[1]?.key;
    const a=first?r[first]:'',b=second?r[second]:'';return this.idFirst?[a,b].filter(Boolean).join(' · ')||'Untitled':a||'Untitled';}
  /** Power/interest strategy for a cell: r = influence level, c = interest level (0 low … 2 high). */
  quad(r:number,c:number){
    if(r===2&&c===2)return {label:'MANAGE CLOSELY',fill:'#ffe2e0'};
    if(r===2)return {label:'KEEP SATISFIED',fill:'#fff4d6'};
    if(c===2||(r===1&&c===1))return {label:'KEEP INFORMED',fill:'#e0ecfb'};
    return {label:'MONITOR',fill:'#f1f3f5'};
  }
  color(s:string){return statusColor(s);}
  impactColor(s:string){const v=(s||'').toLowerCase();return v==='critical'?'#7a0916':v==='high'?'#b42318':v==='medium'?'#c27c0e':'#1f7a46';}
  clip(s:string,n:number){s=s||'';return s.length>n?s.slice(0,n-1)+'…':s;}
  lower(s:string){s=(s||'').trim();return s?s[0].toLowerCase()+s.slice(1):'';}
  fix(v:number){return isFinite(v)?v.toFixed(2):'–';}
  short(v:number){return v>=1e6?(v/1e6).toFixed(1)+'M':v>=1e3?(v/1e3).toFixed(0)+'k':v.toFixed(0);}
  money(v:number,signed=false){const s=Math.round(v).toLocaleString('en-CA');return signed&&v>0?'+'+s:s;}
  async download(fmt:'png'|'pdf'){const el=this.svg();if(!el)return;
    const base=`${this.projectName||'project'}-${this.toolName}-preview`.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    this.msg='';try{await exportSvg(el,base,fmt);}catch(e){console.error(e);this.msg='The diagram could not be downloaded. Reload the page and try again.';}}
  msg='';
}
