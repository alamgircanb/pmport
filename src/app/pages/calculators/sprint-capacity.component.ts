import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CALC_STYLES,CalcMoreComponent,num} from './calc-shared';
import {sprintCapacity} from './calc-math';

@Component({
  standalone:true,selector:'app-sprint-capacity',imports:[FormsModule,RouterLink,CalcMoreComponent],
  template:`
  <section class="page calc">
    <a routerLink="/pm-calculators" class="back">← PM Calculators</a>
    <header class="calc-head"><p class="eyebrow">Free PM calculator · Agile</p><h1>Sprint Capacity &amp; Velocity Forecast Calculator</h1>
      <p class="lead">Work out your team's capacity for the next sprint and forecast how many sprints the remaining backlog will take, using your recent velocity.</p></header>
    <div class="card">
      <p class="eyebrow">1 · Team capacity for the next sprint</p>
      <div class="table-wrap"><table class="grid-input">
        <thead><tr><th>Team member</th><th>Days available</th><th>Hours per day</th><th>Focus %</th><th>Hours</th><th></th></tr></thead>
        <tbody>@for(m of members;track $index;let i=$index){<tr>
          <td><input [(ngModel)]="m.name" [attr.aria-label]="'Member '+(i+1)+' name'"></td>
          <td><input type="number" min="0" [(ngModel)]="m.days" [attr.aria-label]="'Member '+(i+1)+' days available'"></td>
          <td><input type="number" min="0" [(ngModel)]="m.hours" [attr.aria-label]="'Member '+(i+1)+' hours per day'"></td>
          <td><input type="number" min="0" max="100" [(ngModel)]="m.focus" [attr.aria-label]="'Member '+(i+1)+' focus percent'"></td>
          <td>{{num((+m.days||0)*(+m.hours||0)*(+m.focus||0)/100,1)}}</td>
          <td><button type="button" (click)="remove(i)" [attr.aria-label]="'Remove member '+(i+1)">✕</button></td></tr>}</tbody>
      </table></div>
      <div class="row-actions"><button type="button" class="button secondary small" (click)="add()">+ Add member</button></div>
    </div>
    <div class="card" style="margin-top:1rem">
      <p class="eyebrow">2 · Velocity and backlog</p>
      <div class="inputs vel">
        <label>Velocity of the last sprints <small>Story points completed, comma-separated</small><input [(ngModel)]="velocityText"></label>
        <label>Remaining backlog (story points) <input type="number" min="0" [(ngModel)]="backlog"></label>
        <label>Sprint length (weeks) <input type="number" min="1" [(ngModel)]="weeks"></label>
      </div>
    </div>
    <div class="results" style="margin-top:1rem" aria-live="polite">
      <div class="r good"><span>Team capacity</span><strong>{{num(r.hours,0)}} h</strong><small>Hours of focused work this sprint</small></div>
      <div class="r"><span>Average velocity</span><strong>{{num(r.avgVelocity,1)}} pts</strong><small>Range {{r.low}}–{{r.high}}</small></div>
      <div class="r warn"><span>Sprints needed (average)</span><strong>{{r.sprintsAvg??'–'}}</strong><small>≈ {{r.sprintsAvg?r.sprintsAvg*weeks:'–'}} weeks</small></div>
      <div class="r"><span>Best / worst case</span><strong>{{r.sprintsBest??'–'}} / {{r.sprintsWorst??'–'}}</strong><small>Using your highest and lowest velocity</small></div>
    </div>
    <div class="explain">
      <h2>How sprint capacity and velocity forecasting work</h2>
      <p><strong>Capacity</strong> is the time the team can actually spend on sprint work. It is days available × hours per day × a focus factor, which covers meetings, support and interruptions. Most teams use 60–80% focus. Use capacity in sprint planning to avoid over-committing.</p>
      <div class="formula">Capacity (hours) = Σ days available × hours per day × focus %<br>Sprints needed = remaining backlog ÷ average velocity (rounded up)</div>
      <p><strong>Velocity</strong> is the number of story points the team completes per sprint. Forecasting with a range (best, average and worst velocity) is more honest than a single date, and it matches how agile teams communicate release plans.</p>
      <h3>Worked example</h3>
      <p>A team with velocities of 28, 32 and 30 averages 30 points. A 240-point backlog needs 8 sprints on average, and 8 to 9 sprints across the best and worst cases. With two-week sprints, that is about 16 to 18 weeks.</p>
      <h3>Tips</h3>
      <ul><li>Use at least three recent sprints. Velocity from a new or changing team is unreliable.</li>
        <li>Velocity is for planning, not for comparing teams. Points are relative to each team.</li>
        <li>Add to the backlog estimate when scope grows. A <a routerLink="/pm-glossary/burnup-chart">burnup chart</a> makes this visible.</li></ul>
      <p>Related: <a routerLink="/pm-glossary/velocity">velocity</a>, <a routerLink="/pm-glossary/story-points">story points</a>, <a routerLink="/pm-glossary/sprint-planning">sprint planning</a>, <a routerLink="/pm-glossary/burndown-chart">burndown chart</a>.</p>
    </div>
    <app-calc-more current="sprint-capacity-velocity-calculator"></app-calc-more>
  </section>`,
  styles:[CALC_STYLES+`.vel{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}.grid-input td:nth-child(1){min-width:160px}.grid-input td:nth-child(5){font-weight:700;color:#fff}`]
})
export class SprintCapacityComponent{
  members=[{name:'Developer 1',days:9,hours:6,focus:75},{name:'Developer 2',days:10,hours:6,focus:75},{name:'Developer 3',days:8,hours:6,focus:70},{name:'Tester',days:10,hours:6,focus:80},{name:'Business analyst',days:10,hours:6,focus:60}];
  velocityText='28, 32, 30';backlog=240;weeks=2;
  readonly num=num;
  get r(){
    const v=this.velocityText.split(/[,\s]+/).map(Number).filter(n=>n>0);
    return sprintCapacity(this.members.map(m=>({name:m.name,daysAvailable:+m.days||0,hoursPerDay:+m.hours||0,focus:(+m.focus||0)/100})),v,+this.backlog||0);
  }
  add(){this.members=[...this.members,{name:'',days:10,hours:6,focus:75}];}
  remove(i:number){this.members=this.members.filter((_,j)=>j!==i);}
}
