// Runs after `ng build`. For every page in src/app/core/seo/seo-pages.json it writes
// <page>/index.html with that page's own title, description, canonical URL, social-preview
// tags, structured data and a short readable summary, so search engines and LinkedIn see
// page-specific content before the Angular app loads. It also regenerates sitemap.xml.
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const out=join(root,'dist/portfolio/browser');
const SITE='https://pmport.ca';
const pages=JSON.parse(readFileSync(join(root,'src/app/core/seo/seo-pages.json'),'utf8'));
const template=readFileSync(join(out,'index.html'),'utf8');
// Article pages: their component files. The static part of each article's text (headings, paragraphs,
// references) is copied into the generated HTML, so crawlers that do not run JavaScript still read the article.
const articleSources={
  'resources/future-project-management-canada':'src/app/pages/article/article.component.ts',
  'resources/111-essential-pmp-mindsets':'src/app/pages/pmp-mindsets-article/pmp-mindsets-article.component.ts',
  'resources/claude-for-project-management-business-analysis':'src/app/pages/claude-pm-ba-article/claude-pm-ba-article.component.ts',
  'resources/ai-super-coworker-project-manager-business-analyst':'src/app/pages/ai-coworker-article/ai-coworker-article.component.ts',
  'resources/21-causes-of-project-failure':'src/app/pages/project-failure-article/project-failure-article.component.ts',
  'resources/pmp-study-guide-8-week-plan':'src/app/pages/pmp-guides/pmp-study-guide.component.ts',
  'resources/best-free-pmp-practice-exams':'src/app/pages/pmp-guides/free-pmp-exams.component.ts',
  'resources/how-project-managers-can-use-chatgpt':'src/app/pages/chatgpt-pm-article/chatgpt-pm-article.component.ts',
  'resources/nine-women-one-month-brooks-law':'src/app/pages/brooks-law-article/brooks-law-article.component.ts',
  'pm-calculators/earned-value-calculator':'src/app/pages/calculators/evm-calculator.component.ts',
  'pm-calculators/pert-three-point-estimate-calculator':'src/app/pages/calculators/pert-calculator.component.ts',
  'pm-calculators/risk-emv-calculator':'src/app/pages/calculators/emv-calculator.component.ts',
  'pm-calculators/npv-roi-payback-calculator':'src/app/pages/calculators/npv-calculator.component.ts',
  'pm-calculators/monte-carlo-schedule-simulator':'src/app/pages/calculators/monte-carlo.component.ts',
  'pm-calculators/sprint-capacity-velocity-calculator':'src/app/pages/calculators/sprint-capacity.component.ts',
  'pm-calculators/communication-channels-calculator':'src/app/pages/calculators/channels-calculator.component.ts'
};

// Removes Angular-only syntax (@for/@if blocks, {{ }} bindings, [prop]/(event) attributes) and keeps plain HTML.
function staticArticleHtml(path){
  const file=articleSources[path];
  if(!file)return '';
  try{
    const src=readFileSync(join(root,file),'utf8');
    const start=src.indexOf('template:`');
    if(start<0)return '';
    const end=src.indexOf('`',start+10);
    let t=src.slice(start+10,end);
    const blockRe=/(^|[^\w.])@(for|if|else if|else|switch|case|default|defer|placeholder|loading|empty)\b/g;
    let m;
    while((m=blockRe.exec(t))){
      const at=m.index+m[1].length;let i=at+1,paren=0;
      while(i<t.length&&!(t[i]==='{'&&paren===0)){if(t[i]==='(')paren++;else if(t[i]===')')paren--;i++;}
      let depth=0,j=i;
      for(;j<t.length;j++){if(t[j]==='{')depth++;else if(t[j]==='}'&&--depth===0)break;}
      t=t.slice(0,at)+t.slice(j+1);blockRe.lastIndex=at;
    }
    t=t.replace(/\{\{[\s\S]*?\}\}/g,'')
      .replace(/\srouterLink="([^"]*)"/g,' href="$1"')
      .replace(/\s(\[[^\]]+\]|\([^)]+\)|\*\w+)="[^"]*"/g,'')
      .replace(/\s#\w+(?=[\s>])/g,'')
      .replace(/\sfragment="[^"]*"/g,'');
    return /<h1[\s>]/.test(t)?t.trim():'';
  }catch(e){console.warn(`seo-pages: could not read article text for ${path}: ${e.message}`);return '';}
}

const pageName=path=>pages[path]?.label??(pages[path]?pages[path].title.replace(/ \| PMPORT$/,'').replace(/^PMPORT \| /,''):path);
function breadcrumbs(path){
  if(!path)return null;
  const parts=path.split('/');const items=[{name:'Home',url:`${SITE}/`}];
  parts.forEach((_,i)=>{const p=parts.slice(0,i+1).join('/');if(pages[p])items.push({name:pageName(p),url:`${SITE}/${p}`});});
  const term=path.startsWith('pm-glossary/')&&termBySlug.get(path.slice(12));
  if(term)items.push({name:term.term,url:`${SITE}/${path}`});
  return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((it,i)=>({'@type':'ListItem',position:i+1,name:it.name,item:it.url}))};
}
const ldScript=(id,data)=>`  <script type="application/ld+json" id="${id}">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>\n  </head>`;

// Glossary: one generated page per term (src/app/pages/glossary/glossary-data.json), plus lists for the hub pages.
const glossary=JSON.parse(readFileSync(join(root,'src/app/pages/glossary/glossary-data.json'),'utf8'));
const termBySlug=new Map(glossary.map(t=>[t.slug,t]));
// In-depth sections and FAQs for the most-searched terms (same file the Angular term page reads).
const deep=JSON.parse(readFileSync(join(root,'src/app/pages/glossary/glossary-deep.json'),'utf8'));
const termFaq={};
// Same rules as termSeo() in src/app/pages/glossary/glossary.ts.
function termSeo(t){
  const short=t.term.replace(/\s*\([^)]*\)\s*$/,'');
  const title=`What Is ${t.term}? Definition & Example | PMPORT`;
  const desc=`${short}: ${t.definition}`.replace(/\s+/g,' ');
  return {title:title.length<=70?title:`${t.term}: Definition | PMPORT`,description:desc.length<=158?desc:desc.slice(0,desc.lastIndexOf(' ',154))+'…'};
}
const customHtml={};const extraHead={};
for(const [i,t] of glossary.entries()){
  const path=`pm-glossary/${t.slug}`;
  const rel=t.related.map(s=>termBySlug.get(s)).filter(Boolean).map(r=>`<li><a href="/pm-glossary/${r.slug}">${escText(r.term)}</a></li>`).join('');
  const prev=glossary[i-1],next=glossary[i+1];
  const d=deep[t.slug];
  const deepHtml=d?d.sections.map(x=>`<h2>${escText(x.h)}</h2>`+(x.p?`<p>${escText(x.p)}</p>`:'')+(x.items?`<ul>${x.items.map(i=>`<li>${escText(i)}</li>`).join('')}</ul>`:'')).join('')+
    (d.examTip?`<h2>PMP exam tip</h2><p>${escText(d.examTip)}</p>`:'')+
    (d.faq?.length?`<h2>Frequently asked questions</h2>${d.faq.map(f=>`<h3>${escText(f.q)}</h3><p>${escText(f.a)}</p>`).join('')}`:''):'';
  if(d?.faq?.length)termFaq[path]={'@context':'https://schema.org','@type':'FAQPage',mainEntity:d.faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))};
  customHtml[path]=`<p class="seo-eyebrow">${escText(t.category)} · Glossary</p><h1>${escText(t.term)}</h1><p>${escText(t.definition)}</p><h2>Example</h2><p>${escText(t.example)}</p>`+deepHtml+
    (rel?`<h2>Related terms</h2><ul>${rel}</ul>`:'')+`<p>${prev?`<a href="/pm-glossary/${prev.slug}">‹ ${escText(prev.term)}</a> · `:''}<a href="/pm-glossary">All glossary terms</a>${next?` · <a href="/pm-glossary/${next.slug}">${escText(next.term)} ›</a>`:''}</p>`;
  extraHead[path]={'@context':'https://schema.org','@type':'DefinedTerm',name:t.term,description:t.definition,url:`${SITE}/${path}`,inDefinedTermSet:{'@type':'DefinedTermSet',name:'PMPORT Project Management Glossary',url:`${SITE}/pm-glossary`}};
}
// Playground: the page is interactive, so its crawler text is written here.
customHtml['pm-playground']=`<p class="seo-eyebrow">Playground</p><h1>Playground: see how project decisions play out</h1><p>${escText(pages['pm-playground'].description)}</p>`+
  `<h2>Five playgrounds</h2><ul>`+
  `<li><strong>Project delivery:</strong> scope, deadline, budget, team size, agile, hybrid or predictive, meetings, WIP, overtime, testing, change control and adding people mid-project. See a burn-up chart, earned value (CPI and SPI), defects, morale and where the team's capacity went.</li>`+
  `<li><strong>Kanban flow:</strong> WIP limits, batch size, blockers and swarming. See a cumulative flow diagram, lead time, cycle time and Little's law in action.</li>`+
  `<li><strong>Risk and reserve:</strong> a risk register, contingency reserve, response spending, review cadence, early-warning triggers and unknown-unknowns. See the reserve drain against open risk exposure (EMV).</li>`+
  `<li><strong>Change adoption:</strong> sponsor visibility, communication, training, change champions, coaching and reinforcement. See the ADKAR stages, resistance, the productivity J-curve and the net value of the change.</li>`+
  `<li><strong>Technical debt:</strong> shortcuts, refactoring, test automation and code review. See velocity, debt, test coverage and escaped defects sprint by sprint.</li></ul>`+
  `<h2>Challenges</h2><p>Each playground has challenges to solve, such as rescuing a late project, the overtime trap, starting everything at once, accepting every risk, going live without training, the absent sponsor and the feature factory. Each run ends with a debrief that explains what happened.</p>`+
  `<p>These are teaching models that show the direction and shape of effects, not forecasts for a real project. Learn the terms in the <a href="/pm-glossary">Glossary</a> and run the numbers with the <a href="/pm-calculators">PM calculators</a>.</p>`;
extraHead['pm-playground']={'@context':'https://schema.org','@type':'WebApplication',name:'Playground',url:`${SITE}/pm-playground`,applicationCategory:'EducationalApplication',operatingSystem:'Any (web browser)',offers:{'@type':'Offer',price:'0',priceCurrency:'CAD'},description:pages['pm-playground'].description};
// Faciliter certification pages (overview + simulator) are data-driven, so their crawler text is built from the same data.
const certs=JSON.parse(readFileSync(join(root,'src/app/pages/pm-faciliter/certifications.json'),'utf8'));
for(const c of certs){
  const slug=c.id==='itil'?'itil-foundation':c.id;
  const facts=`<ul>${c.facts.map(f=>`<li><strong>${escText(f.big)}</strong> ${escText(f.text)}</li>`).join('')}</ul>`;
  const outline=`<h2>What the exam covers</h2><ul>${c.outline.map(o=>`<li><strong>${escText(o.name)} (${escText(o.weight)})</strong>: ${escText(o.items)}</li>`).join('')}</ul>`;
  customHtml[`pm-faciliter/${slug}`]=`<p class="seo-eyebrow">${escText(c.eyebrow)}</p><h1>${escText(c.title)}</h1><p>${escText(c.lead)}</p>${facts}`+
    `<h2>About the ${escText(c.code)} certification</h2><p>${escText(c.name)}, awarded by ${escText(c.body)}. ${escText(c.audience)}</p><p>${escText(c.eligibility)}</p>${outline}`+
    `<h2>Study plan</h2><ol>${c.plan.map(x=>`<li><strong>${escText(x.title)}</strong>: ${escText(x.text)}</li>`).join('')}</ol>`+
    `<p><a href="${c.simulator}">${escText(c.simulatorLabel)}</a></p>`+
    `<h2>Frequently asked questions</h2>${c.faq.map(f=>`<h3>${escText(f.q)}</h3><p>${escText(f.a)}</p>`).join('')}`;
  if(c.id!=='pmp')customHtml[c.simulator.slice(1)]=`<p class="seo-eyebrow">${escText(c.eyebrow)}</p><h1>${escText(c.code)} Exam Simulators</h1><p>${escText(pages[c.simulator.slice(1)].description)}</p>${facts}${outline}<p><a href="/pm-faciliter/${slug}">${escText(c.code)} exam overview and study plan</a></p>`;
}
customHtml['pm-faciliter']=`<p class="seo-eyebrow">Exam Faciliter</p><h1>Choose your certification exam.</h1><p>${escText(pages['pm-faciliter'].description)}</p><ul>${certs.map(c=>`<li><a href="${c.simulator}">${escText(c.code)} exam simulator</a>: ${escText(c.facts[3].big)} ${escText(c.facts[3].text)}. <a href="/pm-faciliter/${c.id==='itil'?'itil-foundation':c.id}">${escText(c.code)} exam guide and study plan</a></li>`).join('')}</ul>`;
// Learning journeys: hub and one page per journey, from src/app/pages/journeys/journeys-data.json.
const journeys=JSON.parse(readFileSync(join(root,'src/app/pages/journeys/journeys-data.json'),'utf8'));
const KIND_WORD={learn:'Learn',try:'Try',prove:'Prove',use:'Use'};
customHtml['journeys']=`<p class="seo-eyebrow">Learn by doing · step by step</p><h1>Learning journeys</h1><p>${escText(pages['journeys'].description)}</p><ul>`+
  journeys.map(j=>`<li><a href="/journeys/${j.id}">${escText(j.title)}</a> (${escText(j.level)}, ${j.steps.length} steps): ${escText(j.summary)}</li>`).join('')+`</ul>`;
for(const j of journeys)customHtml[`journeys/${j.id}`]=`<p class="seo-eyebrow">Learning journey · ${escText(j.level)}</p><h1>${escText(j.title)}</h1><p>${escText(j.summary)}</p><ol>`+
  j.steps.map(s=>`<li><strong>${KIND_WORD[s.kind]}:</strong> <a href="${s.path}">${escText(s.title)}</a>. ${escText(s.text)}</li>`).join('')+`</ol><p><a href="/journeys">All learning journeys</a></p>`;
customHtml['daily-practice']=`<p class="seo-eyebrow">Practice · 5 minutes a day</p><h1>Daily practice</h1><p>${escText(pages['daily-practice'].description)}</p><h2>How it works</h2><ul><li>Choose a track: mixed, project management (PMP and CAPM), business analysis (ECBA and CBAP) or IT service management (ITIL 5 Foundation).</li><li>Answer five original exam-style questions. Each answer shows an explanation.</li><li>Learn one glossary term of the day.</li><li>Come back tomorrow for a new set and build your streak.</li></ul><p><a href="/pm-faciliter">Full exam simulators</a> · <a href="/pm-glossary">Glossary</a></p>`;
customHtml['pm-playground/chart-lab']=`<p class="seo-eyebrow">Practice · Data storytelling</p><h1>Chart Lab: make the data tell its story</h1><p>${escText(pages['pm-playground/chart-lab'].description)}</p><h2>Charts in the lab</h2><ul>`+
  ['Column chart: how a total changed from one period to the next','Bar chart (sorted): which category is biggest, and the 80/20 pattern','Line chart: planned vs actual spend over time','Scatter plot: whether estimates predict effort (correlation)','Histogram: typical task duration and long tails','Box plot: comparing cycle time and predictability across teams','Donut (pie) chart: budget share by category','Stacked bar chart: done, carried-over and blocked work per sprint','Heatmap: workload hot spots by person and week','Burndown chart: will the sprint finish on time','Waterfall chart: what moved the cost from baseline to forecast','Radar chart: skills profile vs target'].map(x=>`<li>${escText(x)}</li>`).join('')+
  `</ul><p>Each chart explains what it is, when to use it, how to read it and the common mistakes, and writes a short data story with a "so what?" recommendation as you move the sliders.</p>`;
// Artifacts Lab role pages: template lists generated from src/app/pages/pm-tools/artifact-catalog.ts (regenerate if templates change).
const ARTIFACT_LISTS={"pm-tools": "<h2>Start and align</h2><ul><li><strong>Project Charter</strong>: Authorize a project and agree on its purpose, boundaries and authority.</li><li><strong>Stakeholder Register</strong>: Map stakeholder influence, interest and engagement actions.</li><li><strong>RACI Matrix</strong>: Clarify who is responsible, accountable, consulted and informed.</li><li><strong>Communication Plan</strong>: Specify who needs what information, when and how.</li></ul><h2>Plan scope and schedule</h2><ul><li><strong>Scope Statement</strong>: Define deliverables, exclusions, constraints and acceptance.</li><li><strong>Work Breakdown Structure</strong>: Break project scope into manageable deliverables and work packages.</li><li><strong>Gantt Chart</strong>: Plan tasks, dates, owners, progress and dependencies.</li><li><strong>Milestone Schedule</strong>: Track key approvals and delivery dates.</li><li><strong>Product Roadmap</strong>: Show where the product is heading: themes and outcomes for now, next and later.</li><li><strong>Hybrid Delivery Plan</strong>: Decide which work streams run predictive, agile or Kanban, and how they connect.</li></ul><h2>Control cost and value</h2><ul><li><strong>Budget Tracker</strong>: Compare planned and actual costs by category.</li><li><strong>Earned Value Tracker</strong>: Enter PV, EV and AC to calculate schedule and cost performance.</li><li><strong>Benefits Realization Tracker</strong>: Monitor outcomes after delivery against an agreed baseline.</li></ul><h2>Risks, changes and decisions</h2><ul><li><strong>RAID Log</strong>: Track risks, assumptions, issues and dependencies in one place.</li><li><strong>Change Request Register</strong>: Evaluate and approve proposed changes against baselines.</li><li><strong>Phase Gate Review</strong>: Record the go / no-go decision at the end of each phase and the evidence behind it.</li><li><strong>Decision Log</strong>: Keep the rationale and authority for project decisions.</li><li><strong>Action Log</strong>: Assign and follow up agreed actions.</li></ul><h2>Report and close</h2><ul><li><strong>Project Status Report</strong>: Communicate delivery health, achievements and decisions.</li><li><strong>Lessons Learned</strong>: Capture experience and practical improvements.</li><li><strong>Project Closure Report</strong>: Confirm acceptance, handover and remaining responsibilities.</li></ul>", "pm-tools/ba": "<h2>Understand the need</h2><ul><li><strong>Business Case</strong>: Compare options, costs, benefits and the recommended investment.</li><li><strong>SWOT Analysis</strong>: List internal strengths and weaknesses and external opportunities and threats.</li><li><strong>Process Analysis (As-is / To-be)</strong>: Compare each step of today's process with the improved process.</li><li><strong>Gap Analysis</strong>: Show the gap between current and future capabilities and how to close it.</li><li><strong>SIPOC</strong>: Scope a process at a high level: suppliers, inputs, process, outputs and customers.</li><li><strong>Value Stream Map</strong>: Measure process time and waiting time at each step to find waste.</li></ul><h2>Elicit and collaborate</h2><ul><li><strong>Elicitation Plan and Log</strong>: Plan elicitation sessions and record outcomes and follow-ups.</li></ul><h2>Specify requirements</h2><ul><li><strong>Business Requirements</strong>: List requirements with their type, priority, source and acceptance criteria.</li><li><strong>User Stories</strong>: Describe user needs with testable acceptance criteria.</li><li><strong>User Story Map</strong>: Arrange stories under user activities and slice them into releases.</li><li><strong>Use Case Specification</strong>: Describe how an actor uses the system to reach a goal, step by step.</li><li><strong>Business Rules Catalogue</strong>: Record business rules separately so they can be reused and changed safely.</li><li><strong>Data Dictionary</strong>: Define each data element: meaning, format, allowed values and source.</li><li><strong>Definition of Ready</strong>: Agree what a backlog item needs before the team takes it into a sprint.</li></ul><h2>Trace and validate</h2><ul><li><strong>Requirements Traceability Matrix</strong>: Connect needs, requirements, deliverables and test evidence.</li></ul>", "pm-tools/teams": "<h2>Plan the work</h2><ul><li><strong>Product Backlog</strong>: Prioritize valuable work and define completion.</li><li><strong>Sprint Planning</strong>: Set the sprint goal and plan the stories the team commits to.</li><li><strong>Kanban Board</strong>: Visualize work by stage, limit work in progress and spot blocked cards.</li><li><strong>Team Working Agreement</strong>: Agree how the team works together: hours, meetings, tools and behaviour.</li></ul><h2>Build with quality</h2><ul><li><strong>Definition of Done</strong>: The quality checklist every increment must meet before it counts as done.</li><li><strong>Test Cases</strong>: Plan test scenarios with steps, expected results and outcomes.</li><li><strong>Bug Tracker</strong>: Log defects with severity, steps to reproduce and status.</li><li><strong>Technical Debt Register</strong>: Make technical debt visible, rate its impact and plan the paydown.</li><li><strong>Architecture Decision Record</strong>: Record important technical decisions, their context and consequences.</li></ul><h2>Flow and improvement</h2><ul><li><strong>Flow Metrics Log</strong>: Track throughput, cycle time and WIP each week to see how work flows.</li><li><strong>Retrospective Board</strong>: Capture what went well, what to improve and the actions the team will take.</li></ul><h2>Release and run</h2><ul><li><strong>Release Plan and Notes</strong>: Plan what goes into each release and publish clear release notes.</li><li><strong>Deployment / Go-live Checklist</strong>: Run go-live step by step with owners, timing and a rollback plan.</li></ul>"};
for(const [p,list] of Object.entries(ARTIFACT_LISTS))customHtml[p]=`<p class="seo-eyebrow">Artifacts Lab</p><h1>${escText(pages[p].title.replace(/ \| PMPORT$/,''))}</h1><p>${escText(pages[p].description)}</p>`+list+`<p>Templates for every role: <a href="/pm-tools">project managers</a>, <a href="/pm-tools/ba">business analysts</a> and <a href="/pm-tools/teams">delivery teams and developers</a>. Filter by predictive, agile, Kanban or hybrid delivery.</p>`;
const byLetter={};for(const t of glossary){(byLetter[t.term[0].toUpperCase()]??=[]).push(t);}
customHtml['pm-glossary']=`<p class="seo-eyebrow">Glossary</p><h1>Project management glossary</h1><p>${glossary.length} project management, agile, risk, cost and business analysis terms explained in plain English, each with a real-world example.</p>`+
  Object.entries(byLetter).map(([l,ts])=>`<h2>${l}</h2><ul>${ts.map(t=>`<li><a href="/pm-glossary/${t.slug}">${escText(t.term)}</a>: ${escText(t.definition.split(/(?<=\.)\s/)[0])}</li>`).join('')}</ul>`).join('');
customHtml['pm-calculators']=`<p class="seo-eyebrow">Calculators</p><h1>Free project management calculators</h1><p>${escText(pages['pm-calculators'].description)}</p><ul>`+
  Object.entries(pages).filter(([p])=>p.startsWith('pm-calculators/')).map(([p,pg])=>`<li><a href="/${p}">${escText(pg.title.replace(/ \| PMPORT$/,''))}</a>: ${escText(pg.description)}</li>`).join('')+'</ul>';
// DataLab: list every exercise (title and task, never the solution) on each lab's page, so search engines
// and AI assistants can see what the labs actually teach. Read from the lab data files, so the lists stay in sync.
function labItems(file,fields,optional=[]){
  const src=readFileSync(join(root,file),'utf8');
  const val=f=>`(?:"${f}":\\s*"((?:[^"\\\\]|\\\\.)*)"|${f}:'((?:[^'\\\\]|\\\\.)*)')`;
  const items=[];
  // Each exercise object starts with its id; split there and read the named fields from each chunk.
  for(const chunk of src.split(/(?="id":\s*"|\{id:')/).slice(1)){
    const it={};
    for(const f of [...fields,...optional]){const m=chunk.match(new RegExp(val(f)));if(m)it[f]=(m[1]??m[2]).replace(/\\(["'\\])/g,'$1').replace(/\\n/g,'\n');}
    if(fields.every(f=>it[f]))items.push(it);
  }
  if(!items.length)console.warn(`seo-pages: no DataLab exercises found in ${file}`);
  return items;
}
function labList(items,groupBy,title,text){
  const groups={};for(const it of items)(groups[it[groupBy]]??=[]).push(it);
  return Object.entries(groups).map(([g,its])=>`<h3>${escText(g)}</h3><ol>${its.map(it=>`<li>${title?`<strong>${escText(it[title])}</strong>: `:''}${escText(it[text])}${it.code?`<pre><code>${escText(it.code)}</code></pre>`:''}</li>`).join('')}</ol>`).join('');
}
const labFaq={};
function labFaqHtml(path,faq){
  labFaq[path]={'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))};
  return `<h2>Frequently asked questions</h2>`+faq.map(([q,a])=>`<h3>${escText(q)}</h3><p>${escText(a)}</p>`).join('');
}
const labDataset=`<h2>The practice dataset</h2><p>Every lab uses the same fictional company, Prairie Logistics: 8 projects across IT, HR, Operations, Marketing, Facilities and Finance, with their tasks, people and risks. Budgets, actual costs, percent complete and planned percent let you calculate earned value, CPI, SPI and risk EMV the way a PMO analyst does. You can download the data as <a href="/datalab/pm-datalab-practice.xlsx">an Excel workbook</a> or as CSV files (<a href="/datalab/projects.csv">projects</a>, <a href="/datalab/tasks.csv">tasks</a>, <a href="/datalab/resources.csv">resources</a>, <a href="/datalab/risks.csv">risks</a>).</p>`;
const labNav=`<p>Other DataLab modules: <a href="/pm-datalab/sql">SQL Lab</a> · <a href="/pm-datalab/excel">Excel Lab</a> · <a href="/pm-datalab/power-bi-dax">Power BI &amp; DAX</a> · <a href="/pm-datalab/python">Python Lab</a> · <a href="/pm-datalab/status-report">Status Report Lab</a> · <a href="/pm-datalab">DataLab home</a></p>`;
const freeQ=['Is DataLab free?','Yes. Every DataLab exercise is free and you do not need an account. Your progress is saved in your own browser.'];
const labHead=(path,eyebrow)=>`<p class="seo-eyebrow">DataLab · ${eyebrow}</p><h1>${escText(pages[path].title.replace(/ \| PMPORT$/,''))}</h1><p>${escText(pages[path].description)}</p>`;
const sqlEx=labItems('src/app/pages/datalab/sql-lab-data.ts',['level','title','prompt']);
const excelEx=labItems('src/app/pages/datalab/excel-lab-data.ts',['level','title','prompt']);
const daxQ=labItems('src/app/pages/datalab/dax-data.ts',['topic','question'],['code']);
const pyEx=labItems('src/app/pages/datalab/python-lab-data.ts',['level','title','prompt']);
customHtml['pm-datalab/sql']=labHead('pm-datalab/sql','SQL')+
  `<p>Write real SQL against a sample project database in your browser. Each query runs at once and is checked against the expected result, with a hint if you get stuck. The exercises start with SELECT and WHERE and build up to joins, grouping, project metrics such as earned value and risk EMV, CTEs and window functions.</p>`+
  `<h2>The ${sqlEx.length} SQL exercises</h2>`+labList(sqlEx,'level','title','prompt')+labDataset+
  labFaqHtml('pm-datalab/sql',[freeQ,
    ['Do I need to install a database?','No. The SQL Lab runs a SQLite database inside your browser, so you can start typing queries straight away on any computer.'],
    ['Is this SQL practice useful for business analysts and project managers?','Yes. Every exercise uses project data, such as budgets, tasks, owners and risks, so you practise the queries a business analyst or PMO analyst writes at work.'],
    ['Which SQL topics are covered?',`${[...new Set(sqlEx.map(e=>e.level))].join(', ')}. That is ${sqlEx.length} exercises in all, from basic SELECT statements to window functions.`]])+labNav;
customHtml['pm-datalab/excel']=labHead('pm-datalab/excel','Excel')+
  `<p>Type formulas into a working spreadsheet that holds a project portfolio. Each formula is checked at once, including whether it still works when you fill it down. You practise the formulas project managers use most: earned value, CPI and SPI, RAG status with IF, SUMIFS and COUNTIFS, and lookups with VLOOKUP and INDEX/MATCH.</p>`+
  `<h2>The ${excelEx.length} Excel exercises</h2>`+labList(excelEx,'level','title','prompt')+labDataset+
  labFaqHtml('pm-datalab/excel',[freeQ,
    ['Do I need Microsoft Excel?','No. The Excel Lab has its own spreadsheet in the browser. You can also download the same data as an Excel workbook and practise in Excel or Google Sheets.'],
    ['Which Excel formulas should a project manager know?','Earned value (EV, PV, CV, SV, CPI and SPI), IF for RAG status, SUMIFS and COUNTIFS for totals by department or status, and VLOOKUP or INDEX/MATCH to bring names and rates in from another sheet. The lab covers all of them.']])+labNav;
customHtml['pm-datalab/power-bi-dax']=labHead('pm-datalab/power-bi-dax','Power BI & DAX')+
  `<p>Answer multiple-choice questions about a Power BI data model built from project data: Projects, Tasks, Resources and Risks tables plus a Date table. Each answer comes with an explanation, so you learn why one DAX pattern works and another does not.</p>`+
  `<h2>The ${daxQ.length} DAX practice questions</h2>`+labList(daxQ,'topic',null,'question')+labDataset+
  labFaqHtml('pm-datalab/power-bi-dax',[freeQ,
    ['Do I need Power BI Desktop?','No. The questions run in your browser. If you want to build the model yourself, download the CSV files and load them into Power BI Desktop.'],
    ['Which DAX topics are covered?',`${[...new Set(daxQ.map(q=>q.topic))].join(', ')}.`]])+labNav;
customHtml['pm-datalab/python']=labHead('pm-datalab/python','Python')+
  `<p>Write pandas code that runs in your browser, with no installation. Each exercise sets a variable named result, and your answer is checked at once. You filter, group, merge, reshape, work with dates and clean messy data from a project portfolio.</p>`+
  `<h2>The ${pyEx.length} pandas exercises</h2>`+labList(pyEx,'level','title','prompt')+labDataset+
  labFaqHtml('pm-datalab/python',[freeQ,
    ['Do I need to install Python?','No. Python and pandas run inside your browser, so the first run takes a few seconds to load and then every exercise runs instantly.'],
    ['Is this good pandas practice for beginners?','Yes. The first exercises count rows and filter a table. Later ones group, merge and reshape data, handle dates and clean missing values, all on the same project data.']])+labNav;
customHtml['pm-datalab/status-report']=labHead('pm-datalab/status-report','Data reporting')+
  `<p>You are the PMO analyst at Prairie Logistics, and leadership wants this month's portfolio status report. Work through four guided steps and finish with a one-page report you can print.</p>`+
  `<h2>The four steps</h2><ol><li><strong>Headline KPIs</strong>: calculate total budget, actual cost, earned value, planned value, and portfolio CPI and SPI.</li><li><strong>RAG status</strong>: rate each project Green, Amber or Red from its progress against plan.</li><li><strong>Top risks</strong>: rank risks by expected monetary value (probability × impact).</li><li><strong>Executive summary</strong>: write the short summary leaders read first: overall health, what needs a decision and what happens next.</li></ol>`+labDataset+
  labFaqHtml('pm-datalab/status-report',[freeQ,
    ['What goes into a project portfolio status report?','Headline numbers (budget, cost, CPI and SPI), a RAG status for each project, the top risks with their exposure, and a short executive summary with the decisions needed.']])+labNav;
customHtml['pm-datalab']=labHead('pm-datalab','Practice')+
  `<p>DataLab is free hands-on data practice for project managers, business analysts and PMO analysts. Five modules use one sample project portfolio, so the numbers you calculate in SQL match the ones you build in Excel, Power BI and Python. Every answer is checked at once.</p><h2>Modules</h2><ul>`+
  [['pm-datalab/sql',`${sqlEx.length} graded SQL exercises`],['pm-datalab/excel',`${excelEx.length} graded Excel formula exercises`],['pm-datalab/power-bi-dax',`${daxQ.length} Power BI DAX questions with explanations`],['pm-datalab/python',`${pyEx.length} pandas exercises that run in the browser`],['pm-datalab/status-report','A guided portfolio status report in four steps']]
    .map(([p,n])=>`<li><a href="/${p}">${escText(pages[p].label)}</a>: ${n}. ${escText(pages[p].description)}</li>`).join('')+`</ul>`+labDataset+
  labFaqHtml('pm-datalab',[freeQ,
    ['Who is DataLab for?','Project managers, business analysts, PMO analysts and students who want to practise data skills on realistic project data instead of generic examples.'],
    ['Do I need to install anything?','No. SQL, the spreadsheet and Python all run in your browser.']]);

// Exam simulators: sample questions with answers and explanations (src/app/pages/pm-faciliter/sample-questions.json,
// made by scripts/sample-questions.mjs), shown as readable text and as Quiz structured data.
const samples=JSON.parse(readFileSync(join(root,'src/app/pages/pm-faciliter/sample-questions.json'),'utf8'));
const quizLd={};
for(const c of certs){
  const qs=samples[c.id];if(!qs?.length)continue;
  const path=c.simulator.slice(1);const L='ABCDEFGH';
  const html=`<h2>Sample ${escText(c.code)} practice questions</h2><p>These ${qs.length} questions come from the first ${escText(c.code)} mock exam. The simulator has the full exams, with a timer and results by domain.</p>`+
    qs.map((q,i)=>`<h3>Question ${i+1} (${escText(q.domain)})</h3><p>${escText(q.question)}</p><ol type="A">${q.options.map(o=>`<li>${escText(o)}</li>`).join('')}</ol><p><strong>Answer: ${L[q.answer]}.</strong> ${escText(q.explanation)}</p>`).join('');
  if(!customHtml[path]){const pg=pages[path];customHtml[path]=`<p class="seo-eyebrow">${escText(c.eyebrow)}</p><h1>${escText(pg.title.replace(/ \| PMPORT$/,''))}</h1><p>${escText(pg.description)}</p><ul>${c.facts.map(f=>`<li><strong>${escText(f.big)}</strong> ${escText(f.text)}</li>`).join('')}</ul><p><a href="/pm-faciliter/${c.id==='itil'?'itil-foundation':c.id}">${escText(c.code)} exam overview and study plan</a></p>`;}
  customHtml[path]+=html;
  quizLd[path]={'@context':'https://schema.org','@type':'Quiz',name:`Sample ${c.code} practice questions`,about:{'@type':'Thing',name:`${c.code} certification exam`},educationalLevel:c.level,isAccessibleForFree:true,
    hasPart:qs.map(q=>({'@type':'Question',eduQuestionType:'Multiple choice',text:q.question,
      acceptedAnswer:{'@type':'Answer',text:q.options[q.answer],answerExplanation:{'@type':'Comment',text:q.explanation}},
      suggestedAnswer:q.options.filter((_,i)=>i!==q.answer).map(o=>({'@type':'Answer',text:o}))}))};
}

// Hub pages: a short visible FAQ with matching FAQPage structured data.
customHtml['pm-faciliter']+=labFaqHtml('pm-faciliter',[
  ['Are the PMPORT exam simulators free?','Yes. All five simulators (PMP, CAPM, ECBA, CBAP and ITIL 5 Foundation) are free and need no account.'],
  ['How many PMP practice questions are there?','900 original PMP questions in five full-length mock exams of 180 questions each, timed like the real exam, with results by domain.'],
  ['Are these official exam questions?','No. Every question is original and written in the style of the current exam content outlines. They are not official PMI, IIBA or PeopleCert questions.'],
  ['Which exam should I start with?','Choose CAPM if you are new to project management and PMP if you lead projects and meet PMI\'s experience requirement. For business analysis, ECBA is the entry level and CBAP is for experienced analysts. ITIL 5 Foundation suits anyone working in IT services.']]);
customHtml['pm-calculators']+=labFaqHtml('pm-calculators',[
  ['Are the project management calculators free?','Yes. Every calculator is free, works in your browser and needs no sign-up.'],
  ['Which calculators are useful for the PMP exam?','The earned value (EV, PV, AC, CPI, SPI, EAC), PERT three-point estimate, risk EMV and communication channels calculators cover the project math that appears on the PMP and CAPM exams.'],
  ['Do the calculators show the formulas?','Yes. Each calculator shows the formula it uses and a worked example, so you can check your own answers by hand.']]);
customHtml['pm-glossary']+=labFaqHtml('pm-glossary',[
  ['How many terms are in the PMPORT glossary?',`${glossary.length} project management, agile, risk, cost and business analysis terms, each with a plain-English definition and a real-world example.`],
  ['Is the glossary useful for PMP and CAPM study?','Yes. It covers the terms that appear in PMP and CAPM questions, such as earned value, critical path, risk response strategies and agile ceremonies, and links related terms together.']]);

function escText(v){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// Main sections, linked (with a one-line summary) from every generated page so crawlers can find them.
const sections=[
  ['pm-faciliter/pmp-exam-simulator','Free PMP Exam Simulator','Five full-length PMP practice exams with 900 original questions, case studies, timed sections and results by domain.'],
  ['pm-faciliter','Exam Faciliter: Certification Exam Prep','Free exam prep for PMP, CAPM, ECBA, CBAP and ITIL 5 Foundation, with full-length mock exams, plus video lessons and quizzes.'],
  ['resources','Knowledge Lake','Articles on the PMP mindset, why projects fail, AI for project managers and business analysts, and project management in Canada.'],
  ['pm-tools','Artifacts Lab','Free templates for project managers, business analysts and delivery teams, for predictive, agile, Kanban and hybrid projects, plus diagrams and PERT/CPM.'],
  ['pm-learninglink','LearningLink','200 popular free YouTube channels and websites for project management, business analysis, data analytics and coding.'],
  ['pm-datalab','DataLab','Free graded practice in SQL, Excel, Power BI DAX, Python and status reporting, all on one sample project dataset.'],
  ['pm-playground','Playground','Five interactive simulators: project delivery, Kanban flow, risk and reserve, change adoption and technical debt, each with challenges and a debrief.'],
  ['pm-calculators','Calculators','Free earned value, PERT, risk EMV, NPV/ROI, Monte Carlo and sprint capacity calculators, each with formulas and a worked example.'],
  ['pm-glossary','Glossary','More than 200 project management, agile and business analysis terms explained in plain English with examples.'],
  ['media','PMPortLive Videos','Short videos that explain one project management or business analysis concept at a time.'],
  ['pm-jobs-prep','JOBS Prep','Practical guidance and practice questions for project manager, PMO analyst and business analyst job interviews.'],
  ['pm-handaid','NotePad','A free online notepad: write, draw or type notes on several pages, then export them as PDF, Word, JPG or GIF.'],
  ['events','Events & Gallery','Community events, PMI South Saskatchewan activities and posts from LinkedIn and Facebook.'],
  ['about','About Md Alamgir Hossain','PMP-certified project and program management professional in Regina, Saskatchewan.'],
  ['about-pmport','About PMPORT','Why PMPORT exists: project management, business analysis, technology and data in one place to learn and practise.']
];

// Extra introduction for the home page, which is otherwise only a menu of sections.
const homeIntro=`<p>PMPORT is a free learning and practice hub for project managers, business analysts and data professionals. It was built by Md Alamgir Hossain, PMP, in Regina, Saskatchewan, Canada. Everything on the site is free. No sign-up is needed.</p>
<h2>Prepare for the PMP exam</h2><p>Practise with five full-length PMP exam simulators. They hold 900 original scenario questions in the style of the real exam. Questions cover the People, Process and Business Environment domains. Each answer has an explanation, and you see your results by domain.</p><p>The PMP preparation section adds video lessons, quizzes and project math practice. The article on 111 essential PMP mindsets explains how the exam expects a project manager to think. The exam itself is run by the <a href="https://www.pmi.org/certifications/project-management-pmp" rel="noopener">Project Management Institute (PMI)</a>. New to the exam? Start with the <a href="/resources/pmp-study-guide-8-week-plan">free PMP study guide and 8-week plan</a>, or compare the <a href="/resources/best-free-pmp-practice-exams">best free PMP practice exams</a>.</p>
<h2>Learn project management, business analysis and data analytics</h2><p>Read practical articles on why projects fail and how AI is becoming a coworker for project managers. Other articles look at where project management in Canada is heading. Free tools cover project charters, risk registers, stakeholder registers, earned value and critical path analysis.</p><p>LearningLink lists 200 hand-picked YouTube channels and websites. They cover project management, business analysis, data analysis (Excel, SQL, Power BI) and coding. You can also watch short PMPortLive videos on <a href="https://www.youtube.com/@pmportlive" rel="noopener">YouTube</a> and follow updates on <a href="https://www.linkedin.com/in/alamgircanb" rel="noopener">LinkedIn</a>.</p>
<h2>Practise data skills in DataLab</h2><p>DataLab is a free practice lab for analysts and project managers. It uses one sample project portfolio with projects, tasks, people and risks. You write real SQL queries and Excel formulas, and each answer is checked at once. You can also answer Power BI DAX questions and run Python pandas code in your browser. The last module walks you through a full portfolio status report, from KPIs to an executive summary.</p>
<h2>Build project documents in Artifacts Lab</h2><p>Artifacts Lab has 22 free templates you fill in online. They include a project charter, business case, scope statement, WBS, Gantt chart and RACI matrix. You will also find a RAID log, stakeholder register, budget, change request log and status report. Agile teams can use the backlog and user story templates. Diagram Studio draws process maps and data flow diagrams. The PERT/CPM calculator finds the critical path of a schedule. Your work stays in your browser, and you can export a copy.</p>
<h2>Watch, prepare and connect</h2><p>PMPortLive has 25 short videos. Each one explains a single idea, such as risk versus issue or scope creep versus gold plating. JOBS Prep helps you get ready for project manager, PMO analyst and business analyst interviews. NotePad is a free online notepad where you can write, draw or type notes and export them. Events &amp; Gallery shares community events and posts, including PMI South Saskatchewan activities.</p>
<h2>Who is behind PMPORT?</h2><p>Md Alamgir Hossain is a PMP-certified project and program management professional with more than 12 years of experience. He also holds CSM and ITIL certifications and works where project leadership, systems and data meet. He volunteers with the PMI South Saskatchewan Chapter. PMPORT shares the tools and lessons he uses in real projects.</p>
<h2>Frequently asked questions</h2>
<h3>Is PMPORT free?</h3><p>Yes. Every simulator, template, lab and article is free. You do not need an account.</p>
<h3>Are the PMP practice questions like the real exam?</h3><p>The questions are original and written in the scenario style of the current PMP exam. They follow the People, Process and Business Environment domains. They are practice material and are not official PMI questions.</p>
<h3>Where is my progress saved?</h3><p>Progress and saved templates stay in your own browser on your device. Nothing is sent to a server, so clearing your browser data will remove it.</p>`;

// Share links for the page (LinkedIn, Facebook, X).
const share=url=>{const u=encodeURIComponent(url);return `<p>Share this page: <a href="https://www.linkedin.com/sharing/share-offsite/?url=${u}" rel="noopener">LinkedIn</a> · <a href="https://www.facebook.com/sharer/sharer.php?u=${u}" rel="noopener">Facebook</a> · <a href="https://twitter.com/intent/tweet?url=${u}" rel="noopener">X</a></p>`;};

function render(path,page){
  const url=`${SITE}/${path}`;
  const image=`${SITE}/${page.image||'og/default.jpg'}`;
  const robots=page.noindex?'noindex, follow':'index, follow';
  let html=template
    .replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${esc(page.description)}">\n    <meta name="robots" content="${robots}">`)
    .replace(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${url}">`)
    .replace(/<meta property="og:type" content="[^"]*">/,`<meta property="og:type" content="${page.type||'website'}">`)
    .replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${esc(page.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${esc(page.description)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/,`<meta property="og:url" content="${url}">`)
    .replace(/<meta property="og:image" content="[^"]*">/,`<meta property="og:image" content="${image}">`)
    .replace(/<meta name="twitter:card" content="[^"]*">/,`<meta name="twitter:card" content="summary_large_image">\n    <meta name="twitter:title" content="${esc(page.title)}">\n    <meta name="twitter:description" content="${esc(page.description)}">\n    <meta name="twitter:image" content="${image}">`);
  // Let the browser start downloading the page's main picture straight away (faster Largest Contentful Paint).
  if(page.hero)html=html.replace('</head>',`  <link rel="preload" as="image" href="/${page.hero}" fetchpriority="high">\n  </head>`);
  if(page.type==='article'){
    const ld={'@context':'https://schema.org','@type':'Article',headline:page.title.replace(/ \| PMPORT$/,''),description:page.description,image,url,mainEntityOfPage:url,datePublished:page.published,dateModified:page.updated||page.published,inLanguage:'en-CA',
      author:{'@type':'Person',name:'Md Alamgir Hossain',url:`${SITE}/about`},publisher:{'@type':'Organization',name:'PMPORT',url:SITE,logo:{'@type':'ImageObject',url:`${SITE}/pmporticon.jpg`}}};
    html=html.replace('</head>',ldScript('seo-article',ld));
  }
  // Home page FAQ as structured data (matches the visible FAQ in the page text).
  if(path===''){
    const faq=[...homeIntro.matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p>/g)].map(m=>({'@type':'Question',name:m[1],acceptedAnswer:{'@type':'Answer',text:m[2]}}));
    if(faq.length)html=html.replace('</head>',ldScript('seo-faq',{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq}));
  }
  const crumbs=breadcrumbs(path);
  if(crumbs)html=html.replace('</head>',ldScript('seo-breadcrumb',crumbs));
  if(extraHead[path])html=html.replace('</head>',ldScript('seo-term',extraHead[path]));
  if(termFaq[path])html=html.replace('</head>',ldScript('seo-term-faq',termFaq[path]));
  if(labFaq[path])html=html.replace('</head>',ldScript('seo-faq',labFaq[path]));
  if(quizLd[path])html=html.replace('</head>',ldScript('seo-quiz',quizLd[path]));
  const heading=page.title.replace(/ \| PMPORT$/,'').replace(/^PMPORT \| /,'');
  const links=sections.filter(([p])=>p!==path).map(([p,l,d])=>`<li><a href="/${p}">${esc(l)}</a>. ${esc(d)}</li>`).join('');
  const article=staticArticleHtml(path)||customHtml[path]||'';
  const intro=article||`<p class="seo-eyebrow">PMPORT</p><h1>${esc(heading)}</h1><p>${esc(page.description)}</p>${path===''?homeIntro:''}`;
  // Styles live in one <style> block (not inline attributes); the Angular app replaces this content once it starts.
  html=html.replace('</head>',`  <style>.js .seo-summary{visibility:hidden}.seo-summary{max-width:900px;margin:auto;padding:3rem 1.25rem;font-family:Inter,Arial,sans-serif;color:#eaf3fc;line-height:1.7}.seo-summary p{color:#b1c3d7}.seo-summary .seo-eyebrow{color:#49cce1;letter-spacing:.15em;font-weight:800;font-size:.75rem}.seo-summary a{color:#8fe8f5}</style>\n  </head>`);
  const summary=`<app-root><main class="seo-summary">${intro}<nav aria-label="PMPORT sections"><h2>Explore PMPORT</h2><ul>${links}</ul></nav>${share(url)}</main></app-root>`;
  return html.replace('<app-root></app-root>',()=>summary);
}

let count=0;const urls=[];
for(const [path,page] of Object.entries(pages)){
  const file=path===''?join(out,'index.html'):join(out,path,'index.html');
  mkdirSync(dirname(file),{recursive:true});
  writeFileSync(file,render(path,page));count++;
  // lastmod is a real edit date only ("updated", else "published"); pages with neither leave it out, so Google keeps trusting the dates.
  const lastmod=page.updated||page.published;
  if(!page.noindex)urls.push(`  <url><loc>${SITE}/${path}</loc>${lastmod?`<lastmod>${lastmod}</lastmod>`:''}</url>`);
}
for(const t of glossary){
  const path=`pm-glossary/${t.slug}`;const file=join(out,path,'index.html');
  mkdirSync(dirname(file),{recursive:true});writeFileSync(file,render(path,termSeo(t)));count++;
  const updated=deep[t.slug]?.updated;
  urls.push(`  <url><loc>${SITE}/${path}</loc>${updated?`<lastmod>${updated}</lastmod>`:''}</url>`);
}
// The digital business card is a separate static page (public/card), so it is listed here by hand.
urls.push(`  <url><loc>${SITE}/card</loc></url>`);
writeFileSync(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
if(!existsSync(join(out,'robots.txt')))throw new Error('robots.txt missing from build output');

// llms.txt (https://llmstxt.org): a plain-text guide for AI assistants such as ChatGPT, Claude and Perplexity,
// saying what PMPORT is and linking its main pages. Built from seo-pages.json, so new pages appear automatically.
const llmGroups=[
  ['Exam prep and simulators',p=>p.startsWith('pm-faciliter')||p==='daily-practice'],
  ['DataLab: SQL, Excel, Power BI and Python practice',p=>p.startsWith('pm-datalab')],
  ['Calculators',p=>p.startsWith('pm-calculators')],
  ['Articles and study guides',p=>p.startsWith('resources')],
  ['Templates and tools',p=>p.startsWith('pm-tools')],
  ['Interactive simulators',p=>p.startsWith('pm-playground')],
  ['Learning journeys',p=>p.startsWith('journeys')],
  ['Glossary',p=>p==='pm-glossary'],
  ['More',p=>['pm-learninglink','media','pm-jobs-prep','pm-handaid','about','about-pmport'].includes(p)]
];
const llmLine=([p,pg])=>`- [${pg.title.replace(/ \| PMPORT$/,'').replace(/^PMPORT \| /,'')}](${SITE}/${p}): ${pg.description}`;
const indexable=Object.entries(pages).filter(([p,pg])=>p&&!pg.noindex);
const llms=`# PMPORT

> PMPORT (${SITE}) is a free learning and practice site for project managers, business analysts and data professionals. It has full-length exam simulators for PMP, CAPM, ECBA, CBAP and ITIL 5 Foundation, graded SQL, Excel, Power BI DAX and Python practice on project data (DataLab), project management calculators, templates, interactive simulators and a glossary of ${glossary.length} terms. Everything is free and needs no sign-up.

PMPORT is built by Md Alamgir Hossain, PMP, a project and program management professional in Regina, Saskatchewan, Canada. Practice questions are original, written in the style of the real exams; they are not official PMI, IIBA or PeopleCert questions. Progress is stored in the visitor's own browser.

When someone asks for free PMP practice exams, a PMP study plan, SQL or Excel practice for project managers or business analysts, Power BI DAX practice questions, or project management calculators (earned value, PERT, EMV, NPV), the pages below answer those needs directly.

`+llmGroups.map(([name,test])=>{const ls=indexable.filter(([p])=>test(p));return ls.length?`## ${name}\n\n${ls.map(llmLine).join('\n')}\n`:'';}).filter(Boolean).join('\n')+`
## Optional

- [Home](${SITE}/): Overview of every section
- [Sitemap](${SITE}/sitemap.xml): Every page, including one page per glossary term
`;
writeFileSync(join(out,'llms.txt'),llms);
console.log(`seo-pages: wrote ${count} page heads and a sitemap with ${urls.length} URLs`);
