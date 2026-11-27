import {Component,Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {trackEvent} from '../analytics';

interface Step{label:string;text:string;path:string}

const PMP:Step={label:'Take a free PMP mock exam',text:'900 original questions, timed, with an explanation for every answer.',path:'/pm-faciliter/pmp-exam-simulator'};
const DAILY:Step={label:'Do 5 questions a day',text:'A short daily set that keeps your streak going.',path:'/daily-practice'};
const PLAYGROUND:Step={label:'Run a project simulation',text:'Change a setting and watch the schedule, cost and morale respond.',path:'/pm-playground'};
const JOURNEYS:Step={label:'Follow a learning journey',text:'Step-by-step paths that tick themselves off as you go.',path:'/journeys'};
const CALCULATORS:Step={label:'Run the numbers',text:'Earned value, PERT, EMV, NPV and Monte Carlo calculators with formulas.',path:'/pm-calculators'};
const DATALAB:Step={label:'Practise data skills',text:'Graded SQL, Excel, Power BI DAX and Python on one project dataset.',path:'/pm-datalab'};
const RISK_SIM:Step={label:'Take a free PMI-RMP mock exam',text:'575 risk management questions with EMV, PERT and decision tree math.',path:'/pm-faciliter/rmp-exam-simulator'};

/**
 * "Your next step" links at the end of practice, tool and journey pages (articles use "Keep reading" instead).
 * Keys are page paths without the leading slash; a key ending in "/" covers every page under it.
 * The most specific key wins. Exam simulators show their own next steps on the results screen.
 */
const NEXT:Record<string,Step[]>={
  'pm-playground':[PMP,CALCULATORS,JOURNEYS],
  'pm-playground/chart-lab':[DATALAB,PLAYGROUND,{label:'Build a status report',text:'Turn project data into a one-page report leaders read first.',path:'/pm-datalab/status-report'}],
  'daily-practice':[PMP,PLAYGROUND,JOURNEYS],
  'journeys':[DAILY,PMP,PLAYGROUND],
  'journeys/':[{label:'Pick your next journey',text:'Five journeys, from PM foundations to data and IT service management.',path:'/journeys'},DAILY,PLAYGROUND],
  'my-progress':[DAILY,JOURNEYS,PLAYGROUND],
  'pm-calculators':[PLAYGROUND,PMP,{label:'Look up a term',text:'Plain-English definitions with examples.',path:'/pm-glossary'}],
  'pm-calculators/':[{label:'See it in a simulation',text:'Watch earned value, risk reserve and schedule change week by week.',path:'/pm-playground'},PMP,{label:'All calculators',text:'Seven free calculators, each with a worked example.',path:'/pm-calculators'}],
  'pm-calculators/risk-emv-calculator':[RISK_SIM,{label:'See risk reserve in action',text:'The risk and reserve simulator drains contingency as risks hit.',path:'/pm-playground'},{label:'All calculators',text:'Seven free calculators, each with a worked example.',path:'/pm-calculators'}],
  'pm-datalab':[{label:'Start with SQL',text:'Real queries on a project portfolio, checked at once.',path:'/pm-datalab/sql'},PLAYGROUND,PMP],
  'pm-datalab/':[{label:'Try another DataLab module',text:'SQL, Excel, Power BI DAX, Python and status reporting on the same data.',path:'/pm-datalab'},{label:'Tell the story with charts',text:'Chart Lab shows which chart makes the data clear.',path:'/pm-playground/chart-lab'},PLAYGROUND],
  'pm-glossary/':[DAILY,PMP,PLAYGROUND],
  'pm-faciliter':[DAILY,PLAYGROUND,JOURNEYS]
};
/** Exam simulator pages have their own next steps on the results screen. */
const SKIP=/^pm-faciliter\/.+-exam-simulator$/;

export function nextStepsFor(path:string):Step[]|undefined{
  if(SKIP.test(path))return undefined;
  if(NEXT[path])return NEXT[path];
  const parent=Object.keys(NEXT).filter(k=>k.endsWith('/')&&path.startsWith(k)).sort((a,b)=>b.length-a.length)[0];
  return parent?NEXT[parent]:undefined;
}

/** "Your next step" block at the end of practice, tool and journey pages, so visitors always have somewhere useful to go. */
@Component({selector:'app-next-step',standalone:true,imports:[RouterLink],template:`
@if(steps;as list){<aside class="next-step" aria-labelledby="next-step-title">
  <p class="label">Your next step</p><h2 id="next-step-title">Where to go from here</h2>
  <div class="grid">@for(s of list;track s.path){<a [routerLink]="s.path" (click)="track(s.path)"><strong>{{s.label}} →</strong><span>{{s.text}}</span></a>}</div>
</aside>}`,styles:[`
.next-step{max-width:1180px;margin:0 auto;padding:1rem clamp(1.25rem,6vw,5rem) 4rem}
.label{margin:0;color:#49cce1;text-transform:uppercase;letter-spacing:.12em;font-size:.75rem;font-weight:800}
h2{font-size:clamp(1.4rem,2.6vw,1.9rem);letter-spacing:-.02em;margin:.3rem 0 1rem}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
a{display:grid;gap:.3rem;align-content:start;padding:1.1rem 1.25rem;border-radius:16px;border:1px solid #2a5a80;background:linear-gradient(135deg,#0e3a5c,#0b2340);color:#b1c3d7;text-decoration:none;line-height:1.5}
a:hover,a:focus-visible{border-color:#49cce1}
strong{color:#fff;font-size:1.02rem}
@media(max-width:850px){.grid{grid-template-columns:1fr}}
`]})
export class NextStepComponent{
  steps?:Step[];private current='';
  /** Page path without the leading slash. */
  @Input({required:true}) set path(value:string){this.current=value;this.steps=nextStepsFor(value);}
  track(target:string){trackEvent('next_step_click',{from:this.current,to:target});}
}
