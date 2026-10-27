import {Component,inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {BADGES,JOURNEYS,ProgressService} from '../../core/progress/progress.service';

/** The visitor's level, points, streak, badges and journeys, all kept in this browser. */
@Component({standalone:true,selector:'app-my-progress',imports:[RouterLink],template:`
<section class="page progress-page">
  <header class="page-header"><p class="eyebrow">Your learning</p><h1>My progress</h1>
    <p class="lead">Earn points by practising, reading and using the tools. Keep a daily streak, unlock badges and level up.</p></header>

  <div class="top">
    <article class="card level">
      <p class="eyebrow">Level {{lv.number}}</p>
      <h2>{{lv.name}}</h2>
      <p class="pts"><strong>{{progress.xp}}</strong> points</p>
      <div class="bar" role="progressbar" [attr.aria-valuenow]="lv.pct" aria-valuemin="0" aria-valuemax="100" aria-label="Progress to the next level"><span [style.width.%]="lv.pct"></span></div>
      <p class="muted">{{nextText}}</p>
    </article>
    <article class="card streak">
      <p class="eyebrow">Daily streak</p>
      <h2><span aria-hidden="true">🔥</span> {{progress.streak}} {{progress.streak===1?'day':'days'}}</h2>
      <p class="muted">{{progress.practisedToday?'You have practised today. See you tomorrow.':'Do any activity today to keep your streak going.'}}</p>
      <ol class="cal" aria-label="Last 28 days">@for(d of days;track d.key){<li [class]="d.state" [class.today]="d.today" [title]="d.key+(d.state==='done'?': practised':d.state==='frozen'?': saved by a freeze':'')"></li>}</ol>
      <p class="freeze"><span aria-hidden="true">🧊</span> {{progress.freezes}} of 2 streak freezes. You earn one for every 7 days in a row; a freeze saves your streak if you miss a day.</p>
    </article>
  </div>

  <section class="section-block">
    <h2>Badges <span class="count">{{progress.earnedCount}} of {{badges.length}}</span></h2>
    <ul class="badges">
      @for(b of badges;track b.id){<li [class.earned]="progress.badgeEarned(b.id)"><span class="b-icon" aria-hidden="true">{{b.icon}}</span><strong>{{b.name}}</strong><span>{{b.how}}</span>@if(progress.badgeEarned(b.id)){<span class="sr-only">Earned</span>}@else{<span class="sr-only">Not earned yet</span>}</li>}
    </ul>
  </section>

  <section class="section-block">
    <h2>Learning journeys</h2>
    <ul class="jlist">
      @for(j of journeys;track j.id){
        @let pr=progress.journeyProgress(j);
        <li><a [routerLink]="'/journeys/'+j.id"><span aria-hidden="true">{{j.icon}}</span> {{j.title}}</a><div class="bar small" aria-hidden="true"><span [style.width.%]="pr.pct"></span></div><span class="muted">{{pr.done}}/{{pr.total}}</span></li>
      }
    </ul>
  </section>

  <section class="section-block">
    <h2>How to earn points</h2>
    <ul class="earn">
      <li><strong>+20 to +45</strong> Finish daily practice (5 extra points per correct answer)</li>
      <li><strong>+40</strong> Finish an exam practice set (up to 3 a day per exam)</li>
      <li><strong>+150</strong> Finish a full mock exam</li>
      <li><strong>+20</strong> Read an article to the end</li>
      <li><strong>+10</strong> Use a calculator, lab, simulation or template (each tool once a day)</li>
      <li><strong>+10 to +40</strong> Complete a journey step, and <strong>+200</strong> for finishing a journey</li>
    </ul>
  </section>

  <section class="section-block">
    <h2>Recent activity</h2>
    @if(progress.log.length){<ul class="log">@for(a of progress.log.slice(0,12);track a.at+a.text){<li><span>{{a.text}}</span><strong>+{{a.xp}}</strong><time>{{when(a.at)}}</time></li>}</ul>}
    @else{<p class="muted">Nothing yet. Start with <a routerLink="/daily-practice">today's daily practice</a> or a <a routerLink="/journeys">learning journey</a>.</p>}
  </section>

  <section class="section-block reset">
    <p class="muted">Progress is saved in this browser only. Clearing your browser data, or using another device or browser, starts fresh.</p>
    @if(!confirmReset){<button type="button" class="link" (click)="confirmReset=true">Reset my progress</button>}
    @else{<p>Delete all points, badges and journey progress in this browser? <button type="button" class="button small secondary" (click)="progress.reset();confirmReset=false">Yes, reset</button> <button type="button" class="link" (click)="confirmReset=false">Cancel</button></p>}
  </section>
</section>`,styles:[`
.top{display:grid;grid-template-columns:1fr 1.3fr;gap:1rem}
.level,.streak{padding:1.5rem}
.level h2,.streak h2{font-size:clamp(1.6rem,3vw,2.2rem);margin:.2rem 0 .4rem;letter-spacing:-.02em}
.pts{margin:0 0 .75rem;color:#9db1c7}.pts strong{color:#fff;font-size:1.3rem}
.bar{height:10px;border-radius:10px;background:#12304d;overflow:hidden;margin-bottom:.6rem}.bar span{display:block;height:100%;background:var(--accent)}
.bar.small{height:6px;margin:0;flex:1;max-width:220px}
.cal{display:grid;grid-template-columns:repeat(14,1fr);gap:5px;list-style:none;margin:1rem 0;padding:0;max-width:420px}
.cal li{aspect-ratio:1;border-radius:5px;background:#10304f}.cal li.done{background:var(--accent)}.cal li.frozen{background:#9bd4ff}.cal li.today{outline:2px solid #ffffff55;outline-offset:1px}
.freeze{margin:0;color:#9db1c7;font-size:.9rem;line-height:1.5}
.section-block h2{font-size:1.5rem;margin:2rem 0 1rem}.count{font-size:1rem;color:#9db1c7;font-weight:500}
.badges{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:.75rem;list-style:none;margin:0;padding:0}
.badges li{display:grid;gap:.25rem;justify-items:center;text-align:center;padding:1rem .75rem;border:1px solid #1f3f5f;border-radius:14px;background:#0a1f38;opacity:.55;filter:grayscale(1)}
.badges li.earned{opacity:1;filter:none;border-color:#f6c860;background:linear-gradient(160deg,#1b3550,#0b2340)}
.b-icon{font-size:2rem}.badges strong{font-size:.98rem}.badges li span:not(.b-icon){color:#9db1c7;font-size:.82rem;line-height:1.4}
.jlist,.log,.earn{list-style:none;margin:0;padding:0;display:grid;gap:.6rem}
.jlist li{display:flex;align-items:center;gap:1rem}.jlist a{color:#fff;font-weight:700;text-decoration:none;min-width:0;flex:0 1 320px}.jlist a:hover{text-decoration:underline}
.earn li{color:#c5d4e5;line-height:1.5}.earn strong{display:inline-block;min-width:110px;color:#8fe8f5}
.log li{display:flex;gap:1rem;align-items:baseline;padding:.6rem 0;border-bottom:1px solid #16344f}.log span{flex:1;min-width:0}.log strong{color:#3ecf8e}.log time{color:#7f98b0;font-size:.85rem;white-space:nowrap}
.link{background:none;border:0;color:#8fe8f5;font:inherit;cursor:pointer;text-decoration:underline;padding:.4rem 0}
.reset{margin-top:2rem}
@media(max-width:800px){.top{grid-template-columns:1fr}.jlist li{flex-wrap:wrap}.earn strong{min-width:0;margin-right:.4rem}.log li{flex-wrap:wrap;gap:.25rem 1rem}}
`]})
export class MyProgressComponent{
  readonly progress=inject(ProgressService);readonly badges=BADGES;readonly journeys=JOURNEYS;confirmReset=false;
  get lv(){return this.progress.level}
  get days(){return this.progress.days(28)}
  get nextText(){const l=this.lv;return l.next===null?'Top level reached.':`${l.next-this.progress.xp} points to Level ${l.number+1}: ${l.nextName}`}
  when(t:number){const d=new Date(t);return d.toLocaleDateString('en-CA',{month:'short',day:'numeric'})+' '+d.toLocaleTimeString('en-CA',{hour:'numeric',minute:'2-digit'})}
}
