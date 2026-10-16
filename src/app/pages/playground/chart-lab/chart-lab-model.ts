/**
 * Chart Lab: twelve chart types, each with a demo project dataset, sliders that reshape the data,
 * a plain-English orientation (what it is, when to use it, how to read it, common mistakes)
 * and a short data story that is re-written from the numbers every time a slider moves.
 * Builders return simple SVG shapes so one template can draw every chart.
 */

export type Family='Compare'|'Change over time'|'Relationship'|'Distribution'|'Part of a whole'|'Pattern';
export interface Slider{key:string;label:string;min:number;max:number;step:number;value:number;unit?:string}
export interface Preset{label:string;values:Record<string,number>}
export interface ChartDef{
  id:string;name:string;family:Family;question:string;scenario:string;
  what:string;use:string[];read:string[];mistakes:string[];
  sliders:Slider[];presets:Preset[];
}
export type Shape=
  {t:'rect';x:number;y:number;w:number;h:number;c:string;fill?:string;rx?:number}|
  {t:'line';x1:number;y1:number;x2:number;y2:number;c:string}|
  {t:'path';d:string;c:string}|
  {t:'circle';x:number;y:number;r:number;c:string}|
  {t:'text';x:number;y:number;s:string;c:string;a?:'start'|'middle'|'end'};
export interface Story{headline:string;lines:string[];soWhat:string}
export interface Built{shapes:Shape[];legend:{label:string;c:string}[];story:Story;caption:string}
type V=Record<string,number>;

const W=600,L=58,R=584,T=24,B=268;
const fmt=(n:number,d=0)=>n.toLocaleString('en-CA',{maximumFractionDigits:d,minimumFractionDigits:d});
const pct=(n:number,d=0)=>`${fmt(n*100,d)}%`;
const money=(n:number)=>n>=1000?`$${fmt(n/1000,0)}k`:`$${fmt(n)}`;
const sum=(a:number[])=>a.reduce((s,x)=>s+x,0);
const niceMax=(m:number)=>{if(m<=0)return 1;const p=10**Math.floor(Math.log10(m));const f=m/p;return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p;};
function rng(seed:number){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function normal(r:()=>number){let u=0,v=0;while(u===0)u=r();while(v===0)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function quantile(sorted:number[],q:number){const i=(sorted.length-1)*q,lo=Math.floor(i),hi=Math.ceil(i);return sorted[lo]+(sorted[hi]-sorted[lo])*(i-lo);}

/** Horizontal grid lines and y-axis labels. */
function yAxis(max:number,label:(v:number)=>string,ticks=5):Shape[]{
  const out:Shape[]=[];
  for(let i=0;i<=ticks;i++){const v=max*i/ticks,y=B-(B-T)*i/ticks;out.push({t:'line',x1:L,y1:y,x2:R,y2:y,c:'grid'},{t:'text',x:L-8,y:y+4,s:label(v),c:'ax',a:'end'});}
  return out;
}
const yOf=(v:number,max:number)=>B-(B-T)*Math.min(1,Math.max(0,v/max));

export const CHARTS:ChartDef[]=[
  {id:'column',name:'Column chart',family:'Change over time',question:'How did a total change from one period to the next?',
   scenario:'Support tickets closed each month by the service desk team.',
   what:'Vertical bars, one per period. The height of each bar shows the value, so you compare heights from left to right.',
   use:['A few periods (about 3–12), such as months or sprints','Totals per period, such as tickets closed, sales or hours','When each period matters on its own, not only the overall trend'],
   read:['Start the axis at zero: bar length is the message','Look for the overall direction first, then the odd bar out','Ask what happened in any period that breaks the pattern'],
   mistakes:['Cutting the axis so small changes look huge','Using columns for 30+ periods (use a line chart instead)','Different colours for every bar when colour carries no meaning'],
   sliders:[{key:'base',label:'Tickets in January',min:20,max:80,step:1,value:40},{key:'growth',label:'Change per month',min:-15,max:25,step:1,value:8,unit:'%'},{key:'dipMonth',label:'Month with a dip (0 = none)',min:0,max:6,step:1,value:4},{key:'dip',label:'Size of the dip',min:0,max:60,step:5,value:30,unit:'%'}],
   presets:[{label:'Steady growth',values:{base:40,growth:8,dipMonth:0,dip:0}},{label:'Holiday dip',values:{base:40,growth:8,dipMonth:4,dip:40}},{label:'Slow decline',values:{base:60,growth:-8,dipMonth:0,dip:0}}]},
  {id:'bar',name:'Bar chart (sorted)',family:'Compare',question:'Which category is biggest, and by how much?',
   scenario:'Open defects by module, two weeks before go-live.',
   what:'Horizontal bars, one per category, sorted from largest to smallest. Long labels fit easily, and the order itself tells the story.',
   use:['Comparing categories with no natural order, such as modules, teams or vendors','Long category names','Ranking: "top 5" or "where is most of the problem?"'],
   read:['The top bar is the biggest contributor','Add up the top bars to see how much of the total they explain (the 80/20 idea)','Compare lengths, not colours'],
   mistakes:['Leaving bars in random or alphabetical order','Too many categories: group the small ones into "Other"','3D bars, which distort length'],
   sliders:[{key:'pay',label:'Payments defects',min:0,max:60,step:1,value:38},{key:'rep',label:'Reports defects',min:0,max:60,step:1,value:22},{key:'login',label:'Login defects',min:0,max:40,step:1,value:12}],
   presets:[{label:'One hot spot',values:{pay:48,rep:10,login:6}},{label:'Spread out',values:{pay:14,rep:13,login:12}},{label:'Payments fixed',values:{pay:4,rep:22,login:12}}]},
  {id:'line',name:'Line chart',family:'Change over time',question:'Is the actual trend following the plan?',
   scenario:'Cumulative planned spend vs actual spend on a $500k project. Today is month 6.',
   what:'Points joined by lines across time. Two lines on the same axis show the gap between plan and reality.',
   use:['Many time periods, or a continuous trend','Comparing two or three series, such as planned vs actual','Showing when a gap opened up'],
   read:['Follow each line from left to right, then look at the gap between them','A gap that widens means the problem is growing','Check the "today" marker: anything to its right is a forecast'],
   mistakes:['Too many lines (more than 4 becomes spaghetti)','Lower spend is not always good news: it can mean work is late','Joining points that are not in time order'],
   sliders:[{key:'over',label:'Cost overrun on work done',min:-15,max:40,step:1,value:10,unit:'%'},{key:'delay',label:'Late start (months)',min:0,max:3,step:1,value:1}],
   presets:[{label:'On plan',values:{over:0,delay:0}},{label:'Late, looks cheap',values:{over:0,delay:2}},{label:'Overrunning',values:{over:30,delay:0}}]},
  {id:'scatter',name:'Scatter plot',family:'Relationship',question:'When one thing goes up, does another go up too?',
   scenario:'30 finished user stories: estimated story points vs actual hours spent.',
   what:'One dot per item, placed by two numbers. The shape of the cloud shows whether the two move together.',
   use:['Checking if two measures are related, such as estimate vs actual','Spotting outliers that do not fit the pattern','Deciding whether a measure is a useful predictor'],
   read:['A tight upward cloud means a strong positive relationship','A round, shapeless cloud means little or no relationship','The r value runs from −1 to +1: near ±1 is strong, near 0 is weak'],
   mistakes:['Treating correlation as proof of cause','Letting one or two outliers drive the conclusion','Drawing a trend line through a cloud with no pattern'],
   sliders:[{key:'strength',label:'How well estimates predict effort',min:0,max:100,step:5,value:70,unit:'%'},{key:'outliers',label:'Surprise stories (outliers)',min:0,max:5,step:1,value:1}],
   presets:[{label:'Reliable estimates',values:{strength:90,outliers:0}},{label:'Guesswork',values:{strength:10,outliers:0}},{label:'Mostly good, a few surprises',values:{strength:75,outliers:4}}]},
  {id:'histogram',name:'Histogram',family:'Distribution',question:'What is typical, and how spread out are the values?',
   scenario:'How many days 120 tasks took from start to finish.',
   what:'Values grouped into ranges (bins). Each bar counts how many items fall in that range, so you see the shape of the data.',
   use:['Understanding what is "normal" for a measure, such as task duration','Seeing spread and long tails before you plan','Checking whether averages can be trusted'],
   read:['The tallest bars show the typical range','A long tail to the right means some items take much longer','If the mean is well above the median, the tail is pulling the average up'],
   mistakes:['Planning with the average when there is a long tail','Bins that are too wide or too narrow and hide the shape','Confusing a histogram with a column chart over time'],
   sliders:[{key:'typical',label:'Typical duration (days)',min:2,max:10,step:1,value:5},{key:'spread',label:'Spread',min:1,max:4,step:0.5,value:2},{key:'tail',label:'Tasks that get stuck',min:0,max:30,step:1,value:10,unit:'%'}],
   presets:[{label:'Predictable',values:{typical:5,spread:1,tail:0}},{label:'Long tail',values:{typical:4,spread:1.5,tail:25}},{label:'Wide spread',values:{typical:7,spread:4,tail:5}}]},
  {id:'box',name:'Box plot',family:'Distribution',question:'How do several groups compare in typical value and consistency?',
   scenario:'Cycle time in days for three delivery teams, 25 items each.',
   what:'Each box shows the middle half of the values, the line inside is the median, and the whiskers show the usual range. Dots beyond the whiskers are outliers.',
   use:['Comparing the spread of several groups at once','Seeing which team is fastest and which is most predictable','Showing outliers without hiding the main pattern'],
   read:['Compare the median lines first: lower is faster here','A taller box means less predictable delivery','Dots outside the whiskers are unusual items worth a look'],
   mistakes:['Showing a box plot to an audience that has never seen one, without a key','Comparing only medians and ignoring spread','Using it for very small samples (fewer than about 10)'],
   sliders:[{key:'bSpread',label:'Team B variability',min:1,max:5,step:0.5,value:3},{key:'cMed',label:'Team C typical cycle time',min:3,max:12,step:1,value:8},{key:'aOut',label:'Team A outliers',min:0,max:3,step:1,value:1}],
   presets:[{label:'Similar teams',values:{bSpread:1.5,cMed:5,aOut:0}},{label:'Fast but erratic B',values:{bSpread:5,cMed:8,aOut:0}},{label:'Slow C',values:{bSpread:2,cMed:12,aOut:2}}]},
  {id:'donut',name:'Donut (pie) chart',family:'Part of a whole',question:'What share of the total does each part take?',
   scenario:'How a project budget is split across five cost categories.',
   what:'A ring split into slices that add up to 100%. It works when one or two slices clearly dominate.',
   use:['Showing parts of one whole that add to 100%','Five slices or fewer','When one share is the message, such as "staff costs are over half"'],
   read:['Find the biggest slice first, then read its percentage','Slices of similar size are hard to compare by eye: read the labels','The centre can hold the total'],
   mistakes:['Too many slices','Comparing two pies side by side (use a stacked or grouped bar)','Slices that do not add up to a meaningful whole'],
   sliders:[{key:'contract',label:'Contractors',min:5,max:60,step:1,value:20,unit:' units'},{key:'software',label:'Software and licences',min:5,max:50,step:1,value:15,unit:' units'}],
   presets:[{label:'Staff-heavy',values:{contract:8,software:10}},{label:'Outsourced',values:{contract:55,software:12}},{label:'Hard to read',values:{contract:45,software:42}}]},
  {id:'stacked',name:'Stacked bar chart',family:'Part of a whole',question:'How is the make-up of a total changing?',
   scenario:'Story points per sprint, split into done, carried over and blocked.',
   what:'Each bar is a total, divided into coloured parts. You see both the total and how its parts change.',
   use:['Showing totals and their composition over a few periods','Two to four parts per bar','Tracking a share that is growing, such as blocked work'],
   read:['The bottom segment is easiest to compare because it starts at zero','Watch whether a warning colour is growing','Compare total heights for the overall trend'],
   mistakes:['Too many segments','Expecting readers to compare middle segments precisely','Mixing parts that do not add up to the total'],
   sliders:[{key:'velocity',label:'Team capacity per sprint',min:20,max:50,step:1,value:32,unit:' pts'},{key:'blocked',label:'Blocked work growth per sprint',min:0,max:5,step:0.5,value:1.5,unit:' pts'}],
   presets:[{label:'Healthy',values:{velocity:34,blocked:0}},{label:'Blockers piling up',values:{velocity:32,blocked:4}}]},
  {id:'heatmap',name:'Heatmap',family:'Pattern',question:'Where are the hot spots across two dimensions?',
   scenario:'Planned workload (% of capacity) for five people over eight weeks.',
   what:'A grid of cells coloured by value. Patterns, clusters and hot spots stand out without reading every number.',
   use:['Two dimensions at once, such as person × week or probability × impact','Finding overloads, gaps or clusters quickly','Many values that would be unreadable in a table'],
   read:['Find the hottest cells first','Look for rows or columns that are hot throughout','Check the colour key: what value is "too hot"?'],
   mistakes:['Colour scales without a key','Rainbow colours that make mid values look alarming','Too many rows to label clearly'],
   sliders:[{key:'week',label:'Release crunch in week',min:1,max:8,step:1,value:6},{key:'extra',label:'Extra team workload in that week',min:0,max:60,step:5,value:35,unit:'%'},{key:'share',label:'How evenly the crunch is shared',min:0,max:100,step:10,value:0,unit:'%'}],
   presets:[{label:'One hero',values:{week:6,extra:50,share:0}},{label:'Shared load',values:{week:6,extra:50,share:100}},{label:'No crunch',values:{week:6,extra:0,share:0}}]},
  {id:'burndown',name:'Burndown chart',family:'Change over time',question:'Will we finish the work in time?',
   scenario:'A 10-day sprint that starts with 40 story points.',
   what:'Remaining work plotted day by day against an ideal straight line to zero. The gap between the lines shows whether the sprint is on track.',
   use:['Tracking a fixed amount of work against a deadline','Daily stand-ups and sprint reviews','Making scope added mid-sprint visible'],
   read:['Above the ideal line means behind; below means ahead','A jump up means work was added','Extend the recent slope to forecast the finish day'],
   mistakes:['Hiding added scope (a burnup shows it more clearly)','Reading one flat day as a crisis','Using it to judge individuals instead of the system'],
   sliders:[{key:'pace',label:'Points finished per day',min:2,max:6,step:0.5,value:4},{key:'addDay',label:'Day scope is added (0 = none)',min:0,max:9,step:1,value:5},{key:'added',label:'Points added',min:0,max:15,step:1,value:8}],
   presets:[{label:'Clean sprint',values:{pace:4,addDay:0,added:0}},{label:'Scope creep',values:{pace:4,addDay:5,added:12}},{label:'Fast team',values:{pace:5.5,addDay:4,added:6}}]},
  {id:'waterfall',name:'Waterfall chart',family:'Compare',question:'What moved us from the starting number to the final number?',
   scenario:'How the forecast cost moved from the $500k baseline.',
   what:'Floating bars that start where the previous one ended. Increases go up, decreases go down, and the last bar is the new total.',
   use:['Explaining a variance: baseline to forecast, budget to actual','Showing the biggest driver of a change','Board and steering-committee updates'],
   read:['Start at the first bar and follow the steps','The tallest step is the biggest driver','Compare the final bar with the first to see the net change'],
   mistakes:['Too many small steps (group them)','Unclear colours for up and down','Not labelling each step with its value'],
   sliders:[{key:'scope',label:'Approved scope changes',min:0,max:120,step:5,value:60,unit:'k'},{key:'rates',label:'Contractor rate increase',min:0,max:60,step:5,value:25,unit:'k'},{key:'savings',label:'Savings found',min:0,max:80,step:5,value:30,unit:'k'},{key:'risk',label:'Risks that occurred',min:0,max:80,step:5,value:20,unit:'k'}],
   presets:[{label:'Scope-driven',values:{scope:110,rates:10,savings:10,risk:10}},{label:'Well managed',values:{scope:30,rates:10,savings:50,risk:5}}]},
  {id:'radar',name:'Radar chart',family:'Compare',question:'How does a profile compare with a target across several areas?',
   scenario:'A business analyst\'s self-rated skills (1–5) vs the target for a senior role.',
   what:'Each spoke is one area, scored on the same scale. Joining the scores makes a shape you can compare with a target shape.',
   use:['A profile across 5–8 areas on the same scale','Comparing current vs target, or one team vs another','Skill gap and maturity assessments'],
   read:['Gaps between the two shapes show where to focus','A lopsided shape means uneven strengths','Read the values: area is easy to misjudge'],
   mistakes:['Mixing different scales on the spokes','Too many overlapping shapes','Using it where a simple bar chart would be clearer'],
   sliders:[{key:'data',label:'Data analysis',min:1,max:5,step:0.5,value:2.5},{key:'stake',label:'Stakeholder management',min:1,max:5,step:0.5,value:4},{key:'model',label:'Process modelling',min:1,max:5,step:0.5,value:3}],
   presets:[{label:'Ready for senior',values:{data:4.5,stake:4.5,model:4.5}},{label:'Big data gap',values:{data:1.5,stake:4.5,model:4}}]},
];

export const FAMILIES:{family:Family;question:string}[]=[
  {family:'Compare',question:'Which is bigger? What drove the change?'},
  {family:'Change over time',question:'Is it going up or down? Are we on track?'},
  {family:'Relationship',question:'Do two things move together?'},
  {family:'Distribution',question:'What is typical? How spread out is it?'},
  {family:'Part of a whole',question:'What share does each part take?'},
  {family:'Pattern',question:'Where are the hot spots?'},
];

const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'];

export function build(id:string,v:V):Built{
  switch(id){
    case 'column':return column(v);case 'bar':return bar(v);case 'line':return line(v);case 'scatter':return scatter(v);
    case 'histogram':return histogram(v);case 'box':return box(v);case 'donut':return donut(v);case 'stacked':return stacked(v);
    case 'heatmap':return heatmap(v);case 'burndown':return burndown(v);case 'waterfall':return waterfall(v);default:return radar(v);
  }
}

function column(v:V):Built{
  const vals=MONTHS.slice(0,6).map((_,i)=>Math.round(v['base']*(1+v['growth']/100)**i*(i+1===v['dipMonth']?1-v['dip']/100:1)));
  const max=niceMax(Math.max(...vals)*1.1),bw=(R-L)/6;
  const shapes:Shape[]=[...yAxis(max,x=>fmt(x))];
  vals.forEach((x,i)=>{const y=yOf(x,max),cx=L+bw*i+bw/2,dip=i+1===v['dipMonth']&&v['dip']>0;
    shapes.push({t:'rect',x:cx-bw*0.32,y,w:bw*0.64,h:B-y,c:dip?'s2':'s1',rx:3},{t:'text',x:cx,y:y-6,s:fmt(x),c:'val',a:'middle'},{t:'text',x:cx,y:B+18,s:MONTHS[i],c:'ax',a:'middle'});});
  const first=vals[0],last=vals[5],change=(last-first)/first,best=vals.indexOf(Math.max(...vals)),total=sum(vals);
  const dipIdx=v['dipMonth']-1,hasDip=v['dipMonth']>0&&v['dip']>0;
  const dir=change>0.05?'grew':change<-0.05?'fell':'stayed about flat';
  const lines=[`Monthly tickets closed ${dir}, from ${first} in January to ${last} in June (${change>=0?'+':''}${pct(change)}).`,`The busiest month was ${MONTHS[best]} with ${vals[best]} tickets; ${fmt(total)} were closed in six months.`];
  if(hasDip){const exp=Math.round(v['base']*(1+v['growth']/100)**dipIdx);lines.push(`${MONTHS[dipIdx]} breaks the pattern: ${vals[dipIdx]} closed, about ${exp-vals[dipIdx]} fewer than the trend suggests. One month does not reverse a trend, but it needs an explanation, such as holidays or an outage.`);}
  return {shapes,legend:hasDip?[{label:'Normal month',c:'s1'},{label:'Month that breaks the pattern',c:'s2'}]:[],caption:'Tickets closed per month',
    story:{headline:hasDip?`Output ${dir} overall, with a dip in ${MONTHS[dipIdx]}`:`Output ${dir} month after month`,lines,
      soWhat:change<-0.05?'Find out why output is falling before it affects service levels, for example staffing, ticket complexity or tooling.':hasDip?'Plan for the dip next year (cover, fewer releases), and keep watching the overall trend rather than a single month.':'The trend is healthy. Check that quality and customer satisfaction are rising too, not only volume.'}};
}

function bar(v:V):Built{
  const items=[{n:'Payments',x:v['pay']},{n:'Reports',x:v['rep']},{n:'Login',x:v['login']},{n:'Search',x:8},{n:'Profile',x:5}].sort((a,b)=>b.x-a.x);
  const total=sum(items.map(i=>i.x))||1,max=niceMax(Math.max(...items.map(i=>i.x),1)*1.1),lx=150,bh=(B-T)/items.length;
  const shapes:Shape[]=[];
  for(let i=0;i<=5;i++){const x=lx+(R-lx)*i/5;shapes.push({t:'line',x1:x,y1:T,x2:x,y2:B,c:'grid'},{t:'text',x,y:B+18,s:fmt(max*i/5),c:'ax',a:'middle'});}
  let cum=0,k80=0;items.forEach((it,i)=>{cum+=it.x;if(!k80&&cum/total>=0.8)k80=i+1;});
  items.forEach((it,i)=>{const y=T+bh*i+bh*0.18,w=(R-lx)*it.x/max;shapes.push({t:'rect',x:lx,y,w,h:bh*0.64,c:i<k80?'s1':'s3',rx:3},{t:'text',x:lx-10,y:y+bh*0.32+5,s:it.n,c:'lab',a:'end'},{t:'text',x:lx+w+8,y:y+bh*0.32+5,s:`${it.x} (${pct(it.x/total)})`,c:'val'});});
  const top=items[0],share=top.x/total;
  const concentrated=share>=0.4;
  return {shapes,caption:'Open defects by module, sorted',legend:[{label:`Modules that make up 80% of defects (${k80})`,c:'s1'},{label:'The rest',c:'s3'}],
    story:{headline:concentrated?`${top.n} holds ${pct(share)} of all open defects`:`Defects are spread across modules; ${top.n} leads with ${pct(share)}`,
      lines:[`There are ${total} open defects. Sorting the bars puts the biggest problem at the top: ${top.n} with ${top.x}.`,`${k80} of 5 modules account for 80% of the defects${k80<=2?', a classic 80/20 pattern':''}.`,items[1]?`${items[1].n} is next with ${items[1].x}, ${top.x===items[1].x?'the same as':fmt(top.x-items[1].x)+' fewer than'} ${top.n}.`:''].filter(Boolean),
      soWhat:concentrated?`Put your strongest testers and developers on ${top.n} first; fixing it removes most of the risk to go-live.`:'No single module dominates, so look for a shared cause (test data, environment, unclear requirements) rather than one hot spot.'}};
}

function line(v:V):Built{
  const BAC=500000,n=10,today=6,over=v['over']/100,delay=v['delay'];
  const s=(t:number)=>t<=0?0:t>=n?1:(1-Math.cos(Math.PI*t/n))/2;
  const pv=Array.from({length:n+1},(_,t)=>BAC*s(t));
  const ac=Array.from({length:n+1},(_,t)=>t>today?NaN:BAC*s(t-delay)*(1+over));
  const max=niceMax(BAC*(1+Math.max(0,over))*1.05),xs=(t:number)=>L+(R-L)*t/n;
  const shapes:Shape[]=[...yAxis(max,money)];
  const pathOf=(arr:number[])=>arr.map((y,t)=>isNaN(y)?'':`${t===0?'M':'L'}${xs(t).toFixed(1)},${yOf(y,max).toFixed(1)}`).join(' ');
  shapes.push({t:'line',x1:xs(today),y1:T,x2:xs(today),y2:B,c:'today'},{t:'text',x:xs(today)+5,y:T+12,s:'Today',c:'warnTxt'});
  shapes.push({t:'line',x1:L,y1:yOf(BAC,max),x2:R,y2:yOf(BAC,max),c:'budget'},{t:'text',x:L+6,y:yOf(BAC,max)-6,s:'Budget $500k',c:'warnTxt'});
  shapes.push({t:'path',d:pathOf(pv),c:'ln1'},{t:'path',d:pathOf(ac),c:'ln2'});
  ac.forEach((y,t)=>{if(!isNaN(y))shapes.push({t:'circle',x:xs(t),y:yOf(y,max),r:3.5,c:'dot2'});});
  for(let t=0;t<=n;t++)shapes.push({t:'text',x:xs(t),y:B+18,s:`M${t}`,c:'ax',a:'middle'});
  const gap=ac[today]-pv[today],gapPct=gap/pv[today];
  const ev=BAC*s(today-delay),eac=BAC*(1+over);
  const headline=delay>0&&gap<0?`Spend is ${money(-gap)} below plan, but only because the work is late`:gap>0?`Actual spend is ${money(gap)} above plan at month ${today}`:Math.abs(gapPct)<0.03?'Spending is tracking the plan':`Actual spend is ${money(-gap)} below plan at month ${today}`;
  const lines=[`By month ${today} the plan expected ${money(pv[today])} spent; the project has spent ${money(ac[today])} (${gap>=0?'+':''}${pct(gapPct)}).`];
  if(delay>0)lines.push(`Work started ${delay} month${delay>1?'s':''} late, so only ${pct(ev/BAC)} of the work is done against ${pct(s(today))} planned. Lower spend here is a schedule warning, not a saving.`);
  lines.push(over!==0?`Each piece of work is costing ${pct(Math.abs(over))} ${over>0?'more':'less'} than estimated, so the forecast at completion is about ${money(eac)} against a ${money(BAC)} budget.`:'Work is costing what was estimated, so the forecast at completion stays at the $500k budget.');
  return {shapes,caption:'Cumulative cost: planned vs actual',legend:[{label:'Planned spend',c:'s1'},{label:'Actual spend',c:'s2'}],
    story:{headline,lines,soWhat:over>0.1?'Raise the overrun now: re-estimate the remaining work, look for scope to cut and agree how the extra cost will be funded.':delay>0?'Report the schedule slip along with the spend, and check whether the end date or the remaining plan needs to change.':'Keep tracking monthly, and pair this chart with progress (earned value) so low spend is never mistaken for savings.'}};
}

function scatter(v:V):Built{
  const r=rng(7),k=v['strength']/100,pts:{x:number;y:number;o:boolean}[]=[];
  const pointsSet=[1,2,3,5,8,13];
  for(let i=0;i<30;i++){const x=pointsSet[Math.floor(r()*pointsSet.length)];const noise=normal(r);
    const y=Math.max(1,6*x*k+(1-k)*(20+r()*40)+noise*(2+6*(1-k)));pts.push({x,y,o:false});}
  for(let i=0;i<v['outliers'];i++){const p=pts[i*5];p.y=p.x<=3?55+i*6:6+i*2;p.o=true;}
  const mx=sum(pts.map(p=>p.x))/pts.length,my=sum(pts.map(p=>p.y))/pts.length;
  const sxy=sum(pts.map(p=>(p.x-mx)*(p.y-my))),sxx=sum(pts.map(p=>(p.x-mx)**2)),syy=sum(pts.map(p=>(p.y-my)**2));
  const rv=sxy/Math.sqrt(sxx*syy||1),slope=sxy/(sxx||1),icpt=my-slope*mx;
  const ymax=niceMax(Math.max(...pts.map(p=>p.y))*1.08),xmax=14,xs=(x:number)=>L+(R-L)*x/xmax;
  const shapes:Shape[]=[...yAxis(ymax,x=>fmt(x))];
  [0,2,4,6,8,10,12,14].forEach(x=>shapes.push({t:'text',x:xs(x),y:B+18,s:String(x),c:'ax',a:'middle'}));
  const jit=rng(3);
  if(Math.abs(rv)>0.3)shapes.push({t:'line',x1:xs(0.5),y1:yOf(icpt+slope*0.5,ymax),x2:xs(13.5),y2:yOf(icpt+slope*13.5,ymax),c:'trend'});
  pts.forEach(p=>shapes.push({t:'circle',x:xs(p.x)+(jit()-0.5)*14,y:yOf(p.y,ymax),r:p.o?6:4.5,c:p.o?'dot2':'dot1'}));
  shapes.push({t:'text',x:R-4,y:T+14,s:`r = ${rv.toFixed(2)}`,c:'val',a:'end'});
  const strength=Math.abs(rv)>=0.7?'strong':Math.abs(rv)>=0.4?'moderate':Math.abs(rv)>=0.2?'weak':'little or no';
  return {shapes,caption:'Story points (x) vs hours spent (y)',legend:[{label:'Story',c:'s1'},{label:'Surprise (outlier)',c:'s2'},...(Math.abs(rv)>0.3?[{label:'Trend line',c:'s3'}]:[])],
    story:{headline:`${strength[0].toUpperCase()+strength.slice(1)} link between estimates and actual effort (r = ${rv.toFixed(2)})`,
      lines:[Math.abs(rv)>=0.4?`Bigger estimates generally mean more hours: each extra story point adds about ${fmt(slope,1)} hours on average.`:'Knowing a story\'s points tells you very little about how long it will take.',
        v['outliers']>0?`${v['outliers']} stor${v['outliers']>1?'ies sit':'y sits'} far from the pattern. Look at these one by one: they often hide unclear requirements or technical surprises.`:'There are no big surprises; every story sits near the pattern.',
        'Remember: this shows that the two move together, not that one causes the other.'],
      soWhat:Math.abs(rv)>=0.7?'Estimates are a reasonable guide for planning. Use the team\'s history to forecast, and review the outliers in the retrospective.':'Estimates are not predicting effort. Try splitting stories smaller, refining them together, or forecasting from throughput instead of points.'}};
}

function histogram(v:V):Built{
  const r=rng(11),vals:number[]=[],tailN=Math.round(120*v['tail']/100);
  for(let i=0;i<120;i++){let d=i<tailN?v['typical']+4+(-Math.log(1-r()))*6:v['typical']+normal(r)*v['spread'];vals.push(Math.max(0.5,Math.min(29.9,d)));}
  const bins=Array(15).fill(0);vals.forEach(x=>bins[Math.min(14,Math.floor(x/2))]++);
  const max=niceMax(Math.max(...bins)*1.1),bw=(R-L)/15,shapes:Shape[]=[...yAxis(max,x=>fmt(x))];
  const sorted=[...vals].sort((a,b)=>a-b),med=quantile(sorted,0.5),mean=sum(vals)/vals.length,p80=quantile(sorted,0.8),over10=vals.filter(x=>x>10).length;
  bins.forEach((c,i)=>{const y=yOf(c,max);shapes.push({t:'rect',x:L+bw*i+1,y,w:bw-2,h:B-y,c:i*2>=10?'s2':'s1'});if(c)shapes.push({t:'text',x:L+bw*i+bw/2,y:y-5,s:String(c),c:'val',a:'middle'});});
  for(let i=0;i<=15;i+=2.5)shapes.push({t:'text',x:L+bw*i,y:B+18,s:String(i*2),c:'ax',a:'middle'});
  const xm=(d:number)=>L+(R-L)*d/30;
  shapes.push({t:'line',x1:xm(med),y1:T,x2:xm(med),y2:B,c:'today'},{t:'text',x:xm(med)+4,y:T+12,s:`Median ${fmt(med,1)}`,c:'warnTxt'});
  shapes.push({t:'line',x1:xm(mean),y1:T+20,x2:xm(mean),y2:B,c:'trend'},{t:'text',x:xm(mean)+4,y:T+32,s:`Mean ${fmt(mean,1)}`,c:'lab'});
  const skew=mean-med>0.6;
  return {shapes,caption:'Number of tasks by duration (2-day bins)',legend:[{label:'10 days or less',c:'s1'},{label:'More than 10 days',c:'s2'}],
    story:{headline:skew?`Most tasks take about ${fmt(med,0)} days, but a long tail drags the average up`:`Most tasks take about ${fmt(med,0)} days, and the spread is ${v['spread']<=1.5?'tight':'wide'}`,
      lines:[`Half of the 120 tasks finish within ${fmt(med,1)} days (the median); the average is ${fmt(mean,1)} days.`,
        `${over10} task${over10===1?'':'s'} (${pct(over10/120)}) took more than 10 days.${skew?' Because of these, the average is higher than what a typical task takes.':''}`,
        `80% of tasks finish within ${fmt(p80,1)} days.`],
      soWhat:skew?`Commit to dates using the 80th percentile (${fmt(p80,0)} days), not the average, and look at why tasks get stuck (waiting for approvals, dependencies).`:`Durations are fairly predictable; planning around ${fmt(p80,0)} days gives an 80% chance of being on time.`}};
}

function box(v:V):Built{
  const r=rng(5),make=(med:number,spread:number,outs:number)=>{const a=Array.from({length:25},()=>Math.max(0.5,med+normal(r)*spread));for(let i=0;i<outs;i++)a[i]=med+spread*4+3+i*2;return a.sort((x,y)=>x-y);};
  const teams=[{n:'Team A',d:make(5,1.2,v['aOut'])},{n:'Team B',d:make(4.5,v['bSpread'],0)},{n:'Team C',d:make(v['cMed'],1.5,0)}];
  const st=teams.map(t=>{const q1=quantile(t.d,0.25),q3=quantile(t.d,0.75),iqr=q3-q1,lo=Math.max(t.d[0],q1-1.5*iqr),hi=Math.min(t.d[t.d.length-1],q3+1.5*iqr);
    return {...t,q1,q3,med:quantile(t.d,0.5),iqr,lo:t.d.find(x=>x>=lo)!,hi:[...t.d].reverse().find(x=>x<=hi)!,out:t.d.filter(x=>x<q1-1.5*iqr||x>q3+1.5*iqr)};});
  const max=niceMax(Math.max(...teams.flatMap(t=>t.d))*1.08),cw=(R-L)/3,shapes:Shape[]=[...yAxis(max,x=>fmt(x))];
  const cols=['s1','s3','s4'];
  st.forEach((t,i)=>{const cx=L+cw*i+cw/2,w=cw*0.36;
    shapes.push({t:'line',x1:cx,y1:yOf(t.hi,max),x2:cx,y2:yOf(t.q3,max),c:'whisk'},{t:'line',x1:cx,y1:yOf(t.q1,max),x2:cx,y2:yOf(t.lo,max),c:'whisk'},
      {t:'line',x1:cx-w/3,y1:yOf(t.hi,max),x2:cx+w/3,y2:yOf(t.hi,max),c:'whisk'},{t:'line',x1:cx-w/3,y1:yOf(t.lo,max),x2:cx+w/3,y2:yOf(t.lo,max),c:'whisk'},
      {t:'rect',x:cx-w/2,y:yOf(t.q3,max),w,h:yOf(t.q1,max)-yOf(t.q3,max),c:cols[i],rx:4},{t:'line',x1:cx-w/2,y1:yOf(t.med,max),x2:cx+w/2,y2:yOf(t.med,max),c:'medLine'},
      {t:'text',x:cx,y:B+18,s:t.n,c:'ax',a:'middle'},{t:'text',x:cx+w/2+6,y:yOf(t.med,max)+4,s:fmt(t.med,1),c:'val'});
    t.out.forEach(o=>shapes.push({t:'circle',x:cx,y:yOf(o,max),r:4,c:'dot2'}));});
  const fastest=[...st].sort((a,b)=>a.med-b.med)[0],steady=[...st].sort((a,b)=>a.iqr-b.iqr)[0],erratic=[...st].sort((a,b)=>b.iqr-a.iqr)[0],outs=sum(st.map(t=>t.out.length));
  return {shapes,caption:'Cycle time in days by team',legend:[{label:'Box = middle 50% of items',c:'s1'},{label:'Line = median',c:'s5'},{label:'Outlier',c:'s2'}],
    story:{headline:fastest.n===steady.n?`${fastest.n} is both the fastest and the most predictable`:`${fastest.n} is fastest, but ${steady.n} is the most predictable`,
      lines:[`Median cycle time: ${st.map(t=>`${t.n} ${fmt(t.med,1)} days`).join(', ')}.`,
        `${erratic.n} has the widest box (${fmt(erratic.iqr,1)} days between the 25th and 75th percentile), so its delivery dates are the hardest to promise.`,
        outs?`${outs} item${outs>1?'s are':' is'} far outside the normal range and worth reviewing one by one.`:'There are no outliers.'],
      soWhat:erratic.iqr>4?`Help ${erratic.n} reduce variation first (smaller items, fewer interruptions); predictability matters as much as speed for planning.`:'All teams are reasonably predictable. Share what the fastest team does differently.'}};
}

function donut(v:V):Built{
  const parts=[{n:'Staff',x:50,c:'s1'},{n:'Contractors',x:v['contract'],c:'s2'},{n:'Software',x:v['software'],c:'s3'},{n:'Training',x:8,c:'s4'},{n:'Travel',x:7,c:'s6'}];
  const total=sum(parts.map(p=>p.x)),cx=210,cy=146,ro=112,ri=66,shapes:Shape[]=[];let a0=-Math.PI/2;
  const pt=(a:number,rad:number)=>`${(cx+rad*Math.cos(a)).toFixed(1)},${(cy+rad*Math.sin(a)).toFixed(1)}`;
  parts.forEach(p=>{const a1=a0+2*Math.PI*p.x/total,lg=a1-a0>Math.PI?1:0;
    shapes.push({t:'path',d:`M${pt(a0,ro)} A${ro},${ro} 0 ${lg} 1 ${pt(a1,ro)} L${pt(a1,ri)} A${ri},${ri} 0 ${lg} 0 ${pt(a0,ri)} Z`,c:'slice-'+p.c});
    const am=(a0+a1)/2;if(p.x/total>0.06)shapes.push({t:'text',x:cx+(ro+ri)/2*Math.cos(am),y:cy+(ro+ri)/2*Math.sin(am)+4,s:pct(p.x/total),c:'sliceTxt',a:'middle'});a0=a1;});
  shapes.push({t:'text',x:cx,y:cy-2,s:'Total',c:'ax',a:'middle'},{t:'text',x:cx,y:cy+18,s:'100%',c:'val',a:'middle'});
  parts.forEach((p,i)=>{const y=60+i*36;shapes.push({t:'rect',x:380,y:y-12,w:16,h:16,c:p.c,rx:3},{t:'text',x:404,y:y+1,s:`${p.n} — ${pct(p.x/total)}`,c:'lab'});});
  const sorted=[...parts].sort((a,b)=>b.x-a.x),top=sorted[0],second=sorted[1],close=(top.x-second.x)/total<0.05;
  return {shapes,caption:'Budget share by cost category',legend:[],
    story:{headline:close?`${top.n} and ${second.n} are almost the same size, so a pie is hard to read here`:`${top.n} takes ${pct(top.x/total)} of the budget`,
      lines:[`The two biggest categories, ${top.n} and ${second.n}, make up ${pct((top.x+second.x)/total)} of spending.`,
        `Training and travel together are only ${pct(15/total)}.`,
        close?'When slices are this close, the eye cannot tell which is bigger. A sorted bar chart would make the difference clear.':'One slice clearly dominates, which is exactly when a pie or donut works well.'],
      soWhat:v['contract']>40?'Heavy reliance on contractors raises cost and knowledge-loss risk: plan knowledge transfer and check rates against the market.':'Check that the split matches the plan, and focus cost reviews on the largest slice.'}};
}

function stacked(v:V):Built{
  const n=6,rows=Array.from({length:n},(_,i)=>{const blocked=Math.round(2+v['blocked']*i),carry=Math.round(4+i*0.5),done=Math.max(0,Math.round(v['velocity']-blocked*0.6-carry*0.3));return {done,carry,blocked};});
  const max=niceMax(Math.max(...rows.map(r=>r.done+r.carry+r.blocked))*1.1),bw=(R-L)/n,shapes:Shape[]=[...yAxis(max,x=>fmt(x))];
  rows.forEach((r,i)=>{const cx=L+bw*i+bw/2,w=bw*0.6;let base=0;
    ([['done','s4'],['carry','s3'],['blocked','s5']] as const).forEach(([k,c])=>{const val=r[k];const y0=yOf(base,max),y1=yOf(base+val,max);shapes.push({t:'rect',x:cx-w/2,y:y1,w,h:y0-y1,c});if(val>=3)shapes.push({t:'text',x:cx,y:(y0+y1)/2+4,s:String(val),c:'barTxt',a:'middle'});base+=val;});
    shapes.push({t:'text',x:cx,y:B+18,s:`Sprint ${i+1}`,c:'ax',a:'middle'});});
  const f=rows[0],l=rows[n-1],tf=f.done+f.carry+f.blocked,tl=l.done+l.carry+l.blocked;
  const bShareF=f.blocked/tf,bShareL=l.blocked/tl;
  return {shapes,caption:'Story points per sprint by status',legend:[{label:'Done',c:'s4'},{label:'Carried over',c:'s3'},{label:'Blocked',c:'s5'}],
    story:{headline:bShareL>bShareF+0.1?`Blocked work has grown from ${pct(bShareF)} to ${pct(bShareL)} of each sprint`:'The mix of work is stable from sprint to sprint',
      lines:[`Done work went from ${f.done} points in Sprint 1 to ${l.done} in Sprint ${n}.`,`Blocked work went from ${f.blocked} to ${l.blocked} points${l.blocked>f.blocked*2?', more than doubling':''}.`,'The total bar height stays similar, so the team is busy; the problem is how much of that effort turns into finished work.'],
      soWhat:bShareL>0.2?'Make blockers visible in stand-ups, name an owner for each one and escalate dependencies that stay blocked for more than a day or two.':'Keep an eye on the red segment; if it starts to grow, deal with blockers before they eat the sprint.'}};
}

function heatmap(v:V):Built{
  const people=['Priya','Marco','Lena','Sam','Aisha'],weeks=8,base=[[85,90,80,85,90,85,80,75],[70,75,70,80,75,70,75,70],[60,65,70,65,60,70,65,60],[90,85,90,95,90,85,90,85],[50,55,60,55,50,55,60,55]];
  const grid=base.map((row,p)=>row.map((x,w)=>{if(w+1!==v['week'])return x;const total=v['extra']*2;const share=v['share']/100;const mine=p===0?total*(1-share)+total*share/5:total*share/5;return Math.round(x+mine);}));
  const cellW=(R-120)/weeks,cellH=(B-T)/people.length,shapes:Shape[]=[];
  const col=(x:number)=>x>110?'#c2413a':x>100?'#e0763a':x>90?'#e8b04a':x>75?'#2f8f8c':x>60?'#1f6b8a':'#1b4a6b';
  grid.forEach((row,p)=>{shapes.push({t:'text',x:110,y:T+cellH*p+cellH/2+5,s:people[p],c:'lab',a:'end'});
    row.forEach((x,w)=>{shapes.push({t:'rect',x:120+cellW*w+2,y:T+cellH*p+2,w:cellW-4,h:cellH-4,c:'cell',fill:col(x),rx:4},{t:'text',x:120+cellW*w+cellW/2,y:T+cellH*p+cellH/2+5,s:`${x}%`,c:'cellTxt',a:'middle'});});});
  for(let w=0;w<weeks;w++)shapes.push({t:'text',x:120+cellW*w+cellW/2,y:B+18,s:`W${w+1}`,c:'ax',a:'middle'});
  const flat=grid.flatMap((row,p)=>row.map((x,w)=>({x,p,w}))),hot=flat.reduce((a,b)=>b.x>a.x?b:a),over=flat.filter(c=>c.x>100);
  const people100=new Set(over.map(c=>c.p));
  return {shapes,caption:'Planned workload as % of capacity',legend:[{label:'Under 75%',c:'h1'},{label:'75–90%',c:'h2'},{label:'90–100%',c:'h3'},{label:'Over 100%',c:'h4'}],
    story:{headline:over.length?`${people100.size===1?people[[...people100][0]]+' is':people100.size+' people are'} overloaded in week ${v['week']}`:'Nobody is planned over 100% of their capacity',
      lines:[`The hottest cell is ${people[hot.p]} in week ${hot.w+1} at ${hot.x}% of capacity.`,
        over.length?`${over.length} cell${over.length>1?'s are':' is'} above 100%. Sam already runs at 85–95% every week, so there is little slack anywhere.`:'Sam runs at 85–95% every week, which leaves little slack for surprises.',
        v['share']<50&&v['extra']>0?`Most of the crunch lands on one person; sharing it would cut the peak.`:'The crunch is shared, so peaks stay lower.'],
      soWhat:over.length?'Rebalance the crunch week: move tasks to Lena or Aisha, who have spare capacity, or move non-urgent work out of that week.':'The plan is workable. Protect the spare capacity of Lena and Aisha for risks rather than filling it with more work.'}};
}

function burndown(v:V):Built{
  const days=10,start=40,rem:number[]=[start];let scope=start,done=0;
  for(let d=1;d<=days;d++){if(d===v['addDay']&&v['added']>0)scope+=v['added'];done=Math.min(scope,done+v['pace']);rem.push(Math.max(0,scope-done));}
  const max=niceMax(Math.max(start+v['added'],start)*1.05),xs=(d:number)=>L+(R-L)*d/days,shapes:Shape[]=[...yAxis(max,x=>fmt(x))];
  shapes.push({t:'line',x1:xs(0),y1:yOf(start,max),x2:xs(days),y2:yOf(0,max),c:'ideal'});
  shapes.push({t:'path',d:rem.map((r,d)=>`${d?'L':'M'}${xs(d).toFixed(1)},${yOf(r,max).toFixed(1)}`).join(' '),c:'ln1'});
  rem.forEach((r,d)=>shapes.push({t:'circle',x:xs(d),y:yOf(r,max),r:3.5,c:d===v['addDay']&&v['added']>0?'dot2':'dot1'}));
  if(v['addDay']>0&&v['added']>0)shapes.push({t:'text',x:xs(v['addDay'])+6,y:yOf(rem[v['addDay']],max)-8,s:`+${v['added']} pts added`,c:'warnTxt'});
  for(let d=0;d<=days;d++)shapes.push({t:'text',x:xs(d),y:B+18,s:`D${d}`,c:'ax',a:'middle'});
  const left=rem[days],total=start+(v['addDay']>0?v['added']:0),finish=Math.ceil(total/v['pace']);
  return {shapes,caption:'Story points remaining each day',legend:[{label:'Remaining work',c:'s1'},{label:'Ideal line',c:'s3'},{label:'Day scope was added',c:'s2'}],
    story:{headline:left<=0?`The sprint finishes on day ${Math.min(days,finish)}${finish<days?', with time to spare':''}`:`${fmt(left,0)} points will be left at the end of the sprint`,
      lines:[`The team finishes about ${fmt(v['pace'],1)} points a day, and the sprint holds ${total} points${v['added']>0&&v['addDay']>0?` after ${v['added']} were added on day ${v['addDay']}`:''}.`,
        left>0?`At this pace the work needs ${finish} days, ${finish-days} more than the sprint allows.`:`At this pace the work needs ${finish} days, within the 10-day sprint.`,
        v['added']>0&&v['addDay']>0?'The jump in the line is the added scope: without it, the sprint would look healthy.':'There were no scope changes, so the line only moves down.'],
      soWhat:left>0?'Talk with the product owner now: remove or swap lower-value items so the sprint goal can still be met, and agree how new requests are handled mid-sprint.':'The sprint is on track. Use spare capacity for quality work or refinement rather than squeezing in more scope.'}};
}

function waterfall(v:V):Built{
  const steps=[{n:'Baseline',x:500,k:'total'},{n:'Scope changes',x:v['scope'],k:'up'},{n:'Rate increase',x:v['rates'],k:'up'},{n:'Savings',x:-v['savings'],k:'down'},{n:'Risks',x:v['risk'],k:'up'}] as {n:string;x:number;k:string}[];
  const final=500+v['scope']+v['rates']-v['savings']+v['risk'];steps.push({n:'Forecast',x:final,k:'total'});
  const max=niceMax(Math.max(final,500+v['scope']+v['rates']+v['risk'])*1.08),bw=(R-L)/steps.length,shapes:Shape[]=[...yAxis(max,x=>`$${fmt(x)}k`)];
  let run=0;steps.forEach((s,i)=>{const cx=L+bw*i+bw/2,w=bw*0.6;let y0:number,y1:number,c:string;
    if(s.k==='total'){y0=yOf(0,max);y1=yOf(s.x,max);run=s.x;c='s1';}else{const a=run,b=run+s.x;y0=yOf(Math.min(a,b),max);y1=yOf(Math.max(a,b),max);run=b;c=s.k==='up'?'s5':'s4';}
    shapes.push({t:'rect',x:cx-w/2,y:y1,w,h:Math.max(1,y0-y1),c,rx:3},{t:'text',x:cx,y:y1-6,s:s.k==='total'?`$${fmt(s.x)}k`:`${s.x>=0?'+':'−'}$${fmt(Math.abs(s.x))}k`,c:'val',a:'middle'},{t:'text',x:cx,y:B+18,s:s.n,c:'ax',a:'middle'});
    if(i<steps.length-1)shapes.push({t:'line',x1:cx+w/2,y1:yOf(run,max),x2:cx+bw-w/2,y2:yOf(run,max),c:'conn'});});
  const drivers=steps.slice(1,-1).sort((a,b)=>Math.abs(b.x)-Math.abs(a.x)),big=drivers[0],net=final-500;
  return {shapes,caption:'From baseline to forecast cost ($ thousands)',legend:[{label:'Total',c:'s1'},{label:'Increase',c:'s5'},{label:'Decrease',c:'s4'}],
    story:{headline:net>0?`The forecast is $${fmt(net)}k (${pct(net/500)}) over the baseline, driven mostly by ${big.n.toLowerCase()}`:`The forecast is $${fmt(-net)}k under the baseline`,
      lines:[`Starting from the $500k baseline, the forecast is now $${fmt(final)}k.`,`The biggest single driver is ${big.n.toLowerCase()} at ${big.x>=0?'+':'−'}$${fmt(Math.abs(big.x))}k.`,v['savings']<=0?'No savings have been found to offset the increases.':v['savings']>=v['scope']+v['rates']+v['risk']?`Savings of $${fmt(v['savings'])}k more than cover all the increases.`:`Savings of $${fmt(v['savings'])}k offset part of the increases.`],
      soWhat:net>50?`Take this to the steering committee: decide whether to fund the increase, reduce scope or find more savings, starting with ${big.n.toLowerCase()}.`:'The variance is small. Keep the bridge up to date so every change to the forecast has an explanation.'}};
}

function radar(v:V):Built{
  const axes=['Elicitation','Data analysis','Stakeholder mgmt','Process modelling','Requirements writing','Business acumen'];
  const cur=[3.5,v['data'],v['stake'],v['model'],4,3],target=[4.5,4,4.5,4,4.5,4];
  const cx=300,cy=148,rad=110,n=axes.length,ang=(i:number)=>-Math.PI/2+2*Math.PI*i/n,pt=(i:number,val:number)=>[cx+rad*val/5*Math.cos(ang(i)),cy+rad*val/5*Math.sin(ang(i))];
  const shapes:Shape[]=[];
  for(let lv=1;lv<=5;lv++)shapes.push({t:'path',d:axes.map((_,i)=>{const [x,y]=pt(i,lv);return `${i?'L':'M'}${x.toFixed(1)},${y.toFixed(1)}`;}).join(' ')+' Z',c:'web'});
  axes.forEach((a,i)=>{const [x,y]=pt(i,5);const [lx,ly]=pt(i,6.1);shapes.push({t:'line',x1:cx,y1:cy,x2:x,y2:y,c:'grid'},{t:'text',x:lx,y:ly+4,s:a,c:'lab',a:Math.abs(lx-cx)<10?'middle':lx>cx?'start':'end'});});
  const poly=(vals:number[])=>vals.map((val,i)=>{const [x,y]=pt(i,val);return `${i?'L':'M'}${x.toFixed(1)},${y.toFixed(1)}`;}).join(' ')+' Z';
  shapes.push({t:'path',d:poly(target),c:'radarT'},{t:'path',d:poly(cur),c:'radarC'});
  cur.forEach((val,i)=>{const [x,y]=pt(i,val);shapes.push({t:'circle',x,y,r:4,c:'dot1'});});
  const gaps=axes.map((a,i)=>({a,g:target[i]-cur[i]})).sort((a,b)=>b.g-a.g),strong=axes.map((a,i)=>({a,x:cur[i]})).sort((a,b)=>b.x-a.x)[0];
  const ready=gaps[0].g<=0.5;
  return {shapes,caption:'Skills (1–5): current vs target for a senior BA role',legend:[{label:'Current',c:'s1'},{label:'Target',c:'s2'}],
    story:{headline:ready?'The profile is close to the senior target in every area':`The biggest gap is ${gaps[0].a.toLowerCase()} (${fmt(gaps[0].g,1)} points below target)`,
      lines:[`Strongest area: ${strong.a.toLowerCase()} at ${fmt(strong.x,1)} of 5.`,`Top gaps: ${gaps.filter(g=>g.g>0.5).slice(0,3).map(g=>`${g.a.toLowerCase()} (−${fmt(g.g,1)})`).join(', ')||'none above half a point'}.`,'Where the blue shape sits inside the amber one, there is room to grow.'],
      soWhat:ready?'Build evidence of senior-level work (case studies, references) rather than more training.':`Make ${gaps[0].a.toLowerCase()} the focus of the next development plan, for example a course plus a real project where you lead that work.`}};
}
