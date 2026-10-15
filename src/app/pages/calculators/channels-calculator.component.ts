import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CALC_STYLES,CalcMoreComponent} from './calc-shared';
import {channels} from './calc-math';

@Component({
  standalone:true,selector:'app-channels-calculator',imports:[FormsModule,RouterLink,CalcMoreComponent],
  template:`
  <section class="page calc">
    <a routerLink="/pm-calculators" class="back">← Calculators</a>
    <header class="calc-head"><p class="eyebrow">Free PM calculator · Communication</p><h1>Communication Channels Calculator</h1>
      <p class="lead">Find how many communication channels a team or stakeholder group has, and how many are added when people join. This is a classic PMP exam question.</p></header>
    <div class="tool">
      <div class="card inputs">
        <label>Current number of people <input type="number" min="0" [(ngModel)]="now" inputmode="numeric"></label>
        <label>People joining <small>Optional</small><input type="number" min="0" [(ngModel)]="joining" inputmode="numeric"></label>
      </div>
      <div>
        <div class="results" aria-live="polite">
          <div class="r"><span>Channels now</span><strong>{{a.toLocaleString('en-CA')}}</strong><small>{{n}} × {{n>0?n-1:0}} ÷ 2</small></div>
          <div class="r"><span>Channels after</span><strong>{{b.toLocaleString('en-CA')}}</strong><small>{{n2}} people</small></div>
          <div class="r warn"><span>Channels added</span><strong>+{{(b-a).toLocaleString('en-CA')}}</strong><small>{{a>0?'+'+Math.round((b-a)/a*100)+'%':''}}</small></div>
        </div>
        <div class="card dots" aria-hidden="true">
          <svg viewBox="-110 -110 220 220" width="100%" height="220">
            @for(l of lines;track $index){<line [attr.x1]="l[0]" [attr.y1]="l[1]" [attr.x2]="l[2]" [attr.y2]="l[3]" stroke="#49cce1" stroke-opacity=".35" stroke-width="1"/>}
            @for(p of points;track $index){<circle [attr.cx]="p[0]" [attr.cy]="p[1]" r="6" [attr.fill]="$index>=n?'#f6c35b':'#49cce1'"/>}
          </svg>
          <p class="kbd">{{n2<=20?'Each line is one channel. New people are shown in yellow.':'Diagram shown for up to 20 people.'}}</p>
        </div>
      </div>
    </div>
    <div class="explain">
      <h2>The communication channels formula</h2>
      <p>Every pair of people on a project is a possible communication path. As the team grows, the number of channels grows much faster than the number of people. That is why communication planning matters more on large projects.</p>
      <div class="formula">Channels = n × (n − 1) ÷ 2, where n is the number of people</div>
      <h3>Worked example</h3>
      <p>A team of 8 has 8 × 7 ÷ 2 = 28 channels. If 4 more people join, 12 people have 12 × 11 ÷ 2 = 66 channels, so <strong>38 channels are added</strong>. On the PMP exam, read carefully whether the question asks for the total or the number added, and whether to count the project manager.</p>
      <h3>What it means in practice</h3>
      <ul><li>Bigger teams need a clear <a routerLink="/pm-glossary/communications-management-plan">communications management plan</a>, not ad hoc messages.</li>
        <li>Split large groups into smaller teams with defined interfaces, as agile scaling frameworks do.</li>
        <li>Use information radiators and shared channels to reduce one-to-one updates.</li></ul>
      <p>Related: <a routerLink="/pm-glossary/communication-channels">communication channels</a>, <a routerLink="/pm-glossary/stakeholder-engagement">stakeholder engagement</a>, <a routerLink="/pm-glossary/information-radiator">information radiator</a>.</p>
    </div>
    <app-calc-more current="communication-channels-calculator"></app-calc-more>
  </section>`,
  styles:[CALC_STYLES+`.dots{margin-top:1rem;text-align:center}.kbd{font-size:.8rem;color:var(--muted);margin:.3rem 0 0}`]
})
export class ChannelsCalculatorComponent{
  now=8;joining=4;
  readonly Math=Math;
  get n(){return Math.max(0,Math.floor(+this.now||0));}
  get n2(){return this.n+Math.max(0,Math.floor(+this.joining||0));}
  get a(){return channels(this.n);}
  get b(){return channels(this.n2);}
  get points(){const k=Math.min(this.n2,20);return Array.from({length:k},(_,i)=>{const t=i/k*2*Math.PI-Math.PI/2;return [Math.round(Math.cos(t)*95*10)/10,Math.round(Math.sin(t)*95*10)/10];});}
  get lines(){const p=this.points,out:number[][]=[];for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++)out.push([p[i][0],p[i][1],p[j][0],p[j][1]]);return out;}
}
