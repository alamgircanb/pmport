import {Component,OnInit,inject} from '@angular/core';
import {ActivatedRoute,Router,RouterLink} from '@angular/router';
import {Built,CHARTS,ChartDef,FAMILIES,Family,build} from './chart-lab-model';

/** Chart Lab: move demo data with sliders, watch the chart change and read the data story it tells. */
@Component({
  standalone:true,selector:'app-chart-lab',imports:[RouterLink],
  template:`
  <section class="page chartlab">
    <header class="lab-head"><p class="eyebrow">Practice · Data storytelling</p><h1>Chart Lab: make the data tell its story</h1>
      <p class="lead">Twelve charts that project managers and business analysts use every week. Move the sliders to change the demo data, watch the chart react, and read the story the numbers now tell. Each chart comes with a short guide: what it is, when to use it, how to read it and the mistakes to avoid.</p>
      <a routerLink="/pm-playground" class="back">← All project simulations</a></header>

    <section class="chooser" aria-label="Choose a chart by question">
      <h2>What question are you answering?</h2>
      <div class="fams"><button type="button" [class.on]="!family" (click)="family=null">All charts</button>@for(f of families;track f.family){<button type="button" [class.on]="family===f.family" (click)="family=f.family"><strong>{{f.family}}</strong><span>{{f.question}}</span></button>}</div>
      <div class="tabs" role="tablist" aria-label="Charts">@for(c of visible;track c.id;let i=$index){<button type="button" role="tab" [attr.aria-selected]="c.id===chart.id" [class.on]="c.id===chart.id" (click)="select(c)"><small>{{c.family}}</small>{{c.name}}</button>}</div>
    </section>

    <div class="stage">
      <figure class="card chart">
        <figcaption><span class="eyebrow">{{chart.family}}</span><strong>{{chart.name}}</strong> · {{built.caption}}</figcaption>
        <p class="scenario">{{chart.scenario}}</p>
        <svg viewBox="0 0 600 300" role="img" [attr.aria-label]="chart.name+': '+built.story.headline">
          @for(sh of built.shapes;track $index){@let s=$any(sh);@switch(s.t){
            @case('rect'){<rect [attr.x]="s.x" [attr.y]="s.y" [attr.width]="max0(s.w)" [attr.height]="max0(s.h)" [attr.rx]="s.rx??0" [class]="s.c" [style.fill]="s.fill??null"/>}
            @case('line'){<line [attr.x1]="s.x1" [attr.y1]="s.y1" [attr.x2]="s.x2" [attr.y2]="s.y2" [class]="s.c"/>}
            @case('path'){<path [attr.d]="s.d" [class]="s.c"/>}
            @case('circle'){<circle [attr.cx]="s.x" [attr.cy]="s.y" [attr.r]="s.r" [class]="s.c"/>}
            @case('text'){<text [attr.x]="s.x" [attr.y]="s.y" [attr.text-anchor]="s.a??'start'" [class]="s.c">{{s.s}}</text>}
          }}
        </svg>
        @if(built.legend.length){<div class="legend">@for(l of built.legend;track l.label){<span><i [class]="'sw '+l.c"></i>{{l.label}}</span>}</div>}
      </figure>

      <aside class="card controls" aria-label="Change the data">
        <h2>Move the data</h2>
        @for(s of chart.sliders;track s.key){<label class="slider"><span>{{s.label}} <b>{{show(values[s.key],s.step)}}{{s.unit??''}}</b></span>
          <input type="range" [min]="s.min" [max]="s.max" [step]="s.step" [value]="values[s.key]" (input)="set(s.key,$event)"></label>}
        <p class="mini">Try a scenario</p>
        <div class="presets">@for(p of chart.presets;track p.label){<button type="button" class="button secondary small" (click)="preset(p.values)">{{p.label}}</button>}<button type="button" class="button secondary small" (click)="reset()">Reset</button></div>
      </aside>
    </div>

    <section class="card story" aria-live="polite">
      <p class="eyebrow">The data story</p>
      <h2>{{built.story.headline}}</h2>
      <ul>@for(l of built.story.lines;track $index){<li>{{l}}</li>}</ul>
      <p class="sowhat"><strong>So what?</strong> {{built.story.soWhat}}</p>
    </section>

    <section class="guide" aria-label="Chart guide">
      <article class="card"><h3>What it is</h3><p>{{chart.what}}</p><p class="q"><strong>Answers:</strong> {{chart.question}}</p></article>
      <article class="card"><h3>When to use it</h3><ul>@for(x of chart.use;track x){<li>{{x}}</li>}</ul></article>
      <article class="card"><h3>How to read it</h3><ul>@for(x of chart.read;track x){<li>{{x}}</li>}</ul></article>
      <article class="card"><h3>Common mistakes</h3><ul>@for(x of chart.mistakes;track x){<li>{{x}}</li>}</ul></article>
    </section>

    <section class="explain card">
      <h2>How to tell a story with data</h2>
      <ol class="steps">
        <li><strong>Start with the question.</strong> "Are we on budget?" leads to a different chart than "Where are the defects?"</li>
        <li><strong>Pick the chart that fits the question</strong>, not the one that looks most impressive.</li>
        <li><strong>Lead with the headline.</strong> Say what the chart shows in one sentence, as the story box above does.</li>
        <li><strong>Highlight what matters</strong> with one accent colour, and keep everything else quiet.</li>
        <li><strong>End with "so what?"</strong>: the decision or action the data supports.</li>
      </ol>
      <p class="muted">The data on this page is made up for practice. Build your own reports in <a routerLink="/pm-datalab">DataLab</a> and look up terms in the <a routerLink="/pm-glossary">Glossary</a>.</p>
    </section>
  </section>`,
  styles:[`
  .chartlab{max-width:1320px}.lab-head h1{font-size:clamp(2rem,4.5vw,3.4rem)!important;line-height:1.05!important}.back{color:var(--accent);font-weight:700;text-decoration:none}
  .chooser{margin:2rem 0 1rem}.chooser h2{font-size:1.35rem!important;letter-spacing:-.01em!important;margin-bottom:.8rem!important}
  .fams{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:.6rem}.fams button,.tabs button{border:1px solid #2b4d6c;background:#0a2039;color:#d7e5f2;border-radius:12px;padding:.65rem .8rem;text-align:left;cursor:pointer;font:inherit}
  .fams button strong{display:block;font-size:.92rem}.fams button span{display:block;font-size:.78rem;color:var(--muted);margin-top:.15rem}.fams button.on,.tabs button.on{border-color:var(--accent);background:#0d2f4d;color:#fff}
  .tabs{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}.tabs button{padding:.5rem .8rem;font-weight:700;font-size:.9rem}.tabs small{display:block;font-weight:600;font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
  .stage{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(260px,.8fr);gap:1rem;margin-top:1rem}
  .chart{margin:0}.chart figcaption{display:flex;flex-wrap:wrap;gap:.2rem .5rem;align-items:baseline;color:#d7e5f2}.chart figcaption .eyebrow{margin:0 .4rem 0 0}.scenario{color:var(--muted);margin:.35rem 0 .2rem;font-size:.92rem}
  svg{width:100%;height:auto;display:block}
  .legend{display:flex;flex-wrap:wrap;gap:.4rem 1.1rem;font-size:.82rem;color:#c3d3e3;margin-top:.3rem}.legend span{display:inline-flex;align-items:center;gap:.4rem}.sw{display:inline-block;width:12px;height:12px;border-radius:3px}
  .controls h2,.story h2{font-size:1.25rem!important;letter-spacing:-.01em!important;margin:0 0 .8rem!important;line-height:1.25!important}
  .slider{display:grid;gap:.35rem;margin-bottom:1rem;font-size:.88rem;color:#c3d3e3}.slider b{color:#fff}.slider input{width:100%;accent-color:#49cce1}
  .mini{font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin:.4rem 0 .5rem}.presets{display:flex;flex-wrap:wrap;gap:.45rem}
  .story{margin-top:1rem;border-color:#2f6f86}.story ul{margin:.2rem 0 .8rem;padding-left:1.2rem;line-height:1.65;color:#d7e5f2}.sowhat{margin:0;padding:.75rem .9rem;border-radius:10px;background:#0f3b2b;color:#d6f6e4;line-height:1.6}
  .guide{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem;margin-top:1rem}.guide h3{margin:0 0 .5rem;font-size:1.02rem}.guide p,.guide li{color:#c3d3e3;line-height:1.55;font-size:.92rem}.guide ul{padding-left:1.1rem;margin:0}.guide .q{margin-top:.6rem}
  .explain{margin-top:1.5rem}.explain h2{font-size:1.35rem!important;letter-spacing:-.01em!important;margin-bottom:.6rem!important}.steps{line-height:1.7;color:#d7e5f2;padding-left:1.2rem}.explain a{color:var(--accent)}
  .grid{stroke:#1d3a57}.ax{fill:#8ea6bf;font-size:11px}.val{fill:#e6f1fb;font-size:11.5px;font-weight:700}.lab{fill:#c3d3e3;font-size:12px}.warnTxt{fill:#f6c35b;font-size:11px;font-weight:700}
  .sliceTxt,.barTxt,.cellTxt{fill:#041223;font-size:11.5px;font-weight:800}.cellTxt{fill:#fff;font-size:11px}
  .s1{fill:#49cce1}.s2{fill:#f6c35b}.s3{fill:#8f9bff}.s4{fill:#5fd39a}.s5{fill:#ff8f8f}.s6{fill:#c9a3ff}
  .sw.s1{background:#49cce1}.sw.s2{background:#f6c35b}.sw.s3{background:#8f9bff}.sw.s4{background:#5fd39a}.sw.s5{background:#ff8f8f}.sw.s6{background:#c9a3ff}
  .sw.h1{background:#1f6b8a}.sw.h2{background:#2f8f8c}.sw.h3{background:#e8b04a}.sw.h4{background:#c2413a}
  .slice-s1{fill:#49cce1}.slice-s2{fill:#f6c35b}.slice-s3{fill:#8f9bff}.slice-s4{fill:#5fd39a}.slice-s6{fill:#c9a3ff}
  path[class^=slice]{stroke:#0b2340;stroke-width:2}
  .ln1,.ln2,.radarT,.radarC,.web{fill:none}.ln1{stroke:#49cce1;stroke-width:3}.ln2{stroke:#f6c35b;stroke-width:3}
  .dot1{fill:#49cce1}.dot2{fill:#f6c35b;stroke:#041223;stroke-width:1.5}
  .today{stroke:#f6c35b;stroke-dasharray:4 4;stroke-width:1.5}.budget{stroke:#ff8f8f;stroke-dasharray:6 4;stroke-width:1.5}.trend{stroke:#8f9bff;stroke-width:2;stroke-dasharray:6 4}.ideal{stroke:#8f9bff;stroke-width:2;stroke-dasharray:6 5}
  .whisk{stroke:#c3d3e3;stroke-width:1.5}.medLine{stroke:#ff8f8f;stroke-width:3}.conn{stroke:#56728f;stroke-dasharray:3 3}
  .web{stroke:#1d3a57}.radarT{stroke:#f6c35b;stroke-width:2.5;stroke-dasharray:6 4}.radarC{stroke:#49cce1;stroke-width:3;fill:rgba(73,204,225,.18)}
  .cell{stroke:none}
  @media(max-width:1000px){.stage{grid-template-columns:1fr}.guide{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:600px){.guide{grid-template-columns:1fr}.fams{grid-template-columns:1fr 1fr}}
  `]
})
export class ChartLabComponent implements OnInit{
  private route=inject(ActivatedRoute);private router=inject(Router);
  readonly charts=CHARTS;readonly families=FAMILIES;
  family:Family|null=null;
  chart:ChartDef=CHARTS[0];values:Record<string,number>={};built!:Built;
  get visible(){return this.family?this.charts.filter(c=>c.family===this.family):this.charts;}
  ngOnInit(){const id=this.route.snapshot.queryParamMap.get('chart');this.select(CHARTS.find(c=>c.id===id)??CHARTS[0],false);}
  select(c:ChartDef,updateUrl=true){this.chart=c;this.reset();if(updateUrl)this.router.navigate([],{queryParams:{chart:c.id},replaceUrl:true});}
  reset(){this.values=Object.fromEntries(this.chart.sliders.map(s=>[s.key,s.value]));this.rebuild();}
  preset(v:Record<string,number>){this.values={...this.values,...v};this.rebuild();}
  set(key:string,e:Event){this.values={...this.values,[key]:Number((e.target as HTMLInputElement).value)};this.rebuild();}
  private rebuild(){this.built=build(this.chart.id,this.values);}
  show(v:number|undefined,step:number){return v===undefined?'':step<1?v.toFixed(1):String(v);}
  max0(n:number){return Math.max(0,n);}
}
