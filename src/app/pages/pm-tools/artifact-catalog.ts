/**
 * Artifacts Lab catalogue: which templates appear on each role page (project managers,
 * business analysts, delivery teams and developers), how they are grouped, and which
 * delivery approaches each one suits. The original templates stay in pm-tools.component.ts;
 * the newer ones are defined here with the compact `tpl()` helper.
 */

export interface ToolColumn{key:string;label:string;type:'text'|'number'|'date'|'select';options?:string[]}
export interface ToolDefinition{id:string;name:string;icon:string;description:string;columns:ToolColumn[];sampleRows:Record<string,string>[]}

export type Approach='predictive'|'agile'|'kanban'|'hybrid';
export const APPROACHES:{id:Approach;label:string;tip:string}[]=[
  {id:'predictive',label:'Predictive (waterfall)',tip:'Plan and baseline scope, schedule and cost up front, then control changes through formal approvals and phase gates.'},
  {id:'agile',label:'Agile (Scrum)',tip:'Deliver in short sprints from a prioritized backlog, review the increment with stakeholders and adapt the plan each sprint.'},
  {id:'kanban',label:'Kanban and Lean',tip:'Pull work through a visible board, limit work in progress, measure flow and remove waste continuously.'},
  {id:'hybrid',label:'Hybrid',tip:'Combine a predictive frame (budget, milestones, gates) with agile or Kanban delivery inside it.'},
];
const ALL:Approach[]=['predictive','agile','kanban','hybrid'];
const P:Approach[]=['predictive','hybrid'],A:Approach[]=['agile','hybrid'],K:Approach[]=['kanban','hybrid'],AK:Approach[]=['agile','kanban','hybrid'];

export type RoleId='pm'|'ba'|'teams';
export interface RoleCategory{name:string;blurb:string;tools:string[]}
export interface RolePage{id:RoleId;path:string;tab:string;eyebrow:string;title:string;lead:string;categories:RoleCategory[];studios:{path:string;eyebrow:string;title:string;text:string}[]}

const DIAGRAM={path:'/pm-tools/diagram-studio',eyebrow:'Diagram Studio',title:'Draw processes and data flows',text:'Context diagrams, DFDs, process maps, swimlanes and WBS. Export PNG, JPG or PDF.'};
const PERT={path:'/pm-tools/pert-cpm',eyebrow:'Schedule analysis',title:'PERT / CPM Calculator',text:'Build activity networks, calculate float and highlight the critical path.'};

export const ROLE_PAGES:RolePage[]=[
  {id:'pm',path:'/pm-tools',tab:'Project managers',eyebrow:'Tools · Templates for project managers',title:'Artifacts Lab: project management templates',
   lead:'Charters, schedules, budgets, risk logs and status reports. Choose a template, enter your project information and export a working copy. Your saved data stays in this browser.',
   studios:[PERT,DIAGRAM],categories:[
    {name:'Start and align',blurb:'Authorize the project and agree who does what.',tools:['charter','stakeholders','raci','communications']},
    {name:'Plan scope and schedule',blurb:'Break down the work and plan when it happens.',tools:['scope','wbs','gantt','milestones','roadmap','hybrid-plan']},
    {name:'Control cost and value',blurb:'Track spending, performance and benefits.',tools:['budget','evm','benefits']},
    {name:'Risks, changes and decisions',blurb:'Keep control of what can go wrong and what changes.',tools:['raid','change','phase-gate','decisions','actions']},
    {name:'Report and close',blurb:'Show progress and capture what was learned.',tools:['status','lessons','closure']},
  ]},
  {id:'ba',path:'/pm-tools/ba',tab:'Business analysts',eyebrow:'Tools · Templates for business analysts',title:'Artifacts Lab: business analysis templates',
   lead:'From the business need to tested requirements: analysis, elicitation, requirements, rules, data and traceability. Choose a template, fill it in and export a working copy.',
   studios:[DIAGRAM],categories:[
    {name:'Understand the need',blurb:'Analyze the current state, the problem and the case for change.',tools:['business-case','swot','process-map','gap','sipoc','value-stream']},
    {name:'Elicit and collaborate',blurb:'Plan sessions with stakeholders and record what you learn.',tools:['elicitation']},
    {name:'Specify requirements',blurb:'Write requirements, stories, rules and data definitions.',tools:['brd','stories','story-map','use-case','rules','data-dictionary','dor']},
    {name:'Trace and validate',blurb:'Link requirements to their source, design and tests.',tools:['traceability']},
  ]},
  {id:'teams',path:'/pm-tools/teams',tab:'Delivery teams and developers',eyebrow:'Tools · Templates for delivery teams and developers',title:'Artifacts Lab: delivery team and developer templates',
   lead:'Backlogs, sprints, Kanban boards, test cases, bugs, technical debt and releases. Choose a template, fill it in and export a working copy.',
   studios:[DIAGRAM],categories:[
    {name:'Plan the work',blurb:'Agree how the team works and what comes next.',tools:['backlog','sprint','kanban-board','team-agreement']},
    {name:'Build with quality',blurb:'Define done, test it and track what breaks.',tools:['dod','test-cases','bugs','tech-debt','adr']},
    {name:'Flow and improvement',blurb:'Measure flow and improve how the team works.',tools:['flow-metrics','retro']},
    {name:'Release and run',blurb:'Plan releases and go live safely.',tools:['release','deploy']},
  ]},
];

/** Which delivery approaches each template suits. Templates not listed suit every approach. */
export const TOOL_APPROACHES:Record<string,Approach[]>={
  charter:ALL,stakeholders:ALL,raci:ALL,communications:ALL,scope:P,wbs:P,gantt:P,milestones:ALL,roadmap:['agile','kanban','hybrid'],'hybrid-plan':['hybrid'],
  budget:ALL,evm:P,benefits:ALL,raid:ALL,change:P,'phase-gate':P,decisions:ALL,actions:ALL,status:ALL,lessons:ALL,closure:ALL,
  'business-case':ALL,swot:ALL,'process-map':ALL,gap:ALL,sipoc:['kanban','predictive','hybrid'],'value-stream':K,elicitation:ALL,brd:P,stories:A,'story-map':A,'use-case':P,rules:ALL,'data-dictionary':ALL,dor:AK,traceability:['predictive','agile','hybrid'],
  backlog:AK,sprint:A,'kanban-board':K,'team-agreement':ALL,dod:AK,'test-cases':ALL,bugs:ALL,'tech-debt':ALL,adr:ALL,'flow-metrics':K,retro:AK,release:ALL,deploy:ALL,
};

type Col=[label:string,type?:ToolColumn['type'],options?:string[]];
function tpl(id:string,name:string,icon:string,description:string,cols:Col[],rows:string[][]):ToolDefinition{
  const columns=cols.map(([label,type='text',options],i)=>({key:'f'+i,label,type,...(options?{options}:{})}));
  return {id,name,icon,description,columns,sampleRows:rows.map(r=>Object.fromEntries(r.map((v,i)=>['f'+i,v])))};
}
const STATUS=['Not started','In progress','Done','Blocked'];
const MOSCOW=['Must','Should','Could','Won\'t'];

export const NEW_TOOLS:ToolDefinition[]=[
  // Project managers
  tpl('roadmap','Product Roadmap','🧭','Show where the product is heading: themes and outcomes for now, next and later.',
    [['Theme'],['Initiative'],['Horizon','select',['Now','Next','Later']],['Outcome / KPI'],['Owner'],['Status','select',STATUS]],
    [['Self-service','Online application form','Now','30% of applications online','Product Owner','In progress'],['Self-service','Status tracking for applicants','Next','Status calls down 40%','Product Owner','Not started'],['Insight','Management dashboard','Later','Weekly report in under 1 hour','Data Lead','Not started']]),
  tpl('hybrid-plan','Hybrid Delivery Plan','⇄','Decide which work streams run predictive, agile or Kanban, and how they connect.',
    [['Work stream'],['Approach','select',['Predictive','Agile (Scrum)','Kanban','Hybrid']],['Cadence / plan'],['Governance / gate'],['Integration point'],['Owner']],
    [['Infrastructure and hosting','Predictive','Fixed plan with milestones','Architecture sign-off','Environment ready by week 6','Infrastructure Lead'],['Customer portal','Agile (Scrum)','Two-week sprints','Sprint review with sponsor','Releases to test environment each sprint','Product Owner'],['Support and fixes','Kanban','Continuous, WIP limit 4','Weekly service review','Fixes deployed with each release','Support Lead']]),
  tpl('phase-gate','Phase Gate Review','⛩','Record the go / no-go decision at the end of each phase and the evidence behind it.',
    [['Phase'],['Gate criteria'],['Evidence'],['Decision','select',['Go','Go with conditions','Hold','Stop']],['Approver'],['Date','date']],
    [['Initiation','Charter approved; business case positive','Signed charter, business case v1.2','Go','Sponsor','2026-10-03'],['Planning','Baselines approved; key risks have owners','Project plan v1.0, risk register','Go with conditions','Steering Committee','2026-11-07']]),
  // Business analysts
  tpl('swot','SWOT Analysis','◩','List internal strengths and weaknesses and external opportunities and threats.',
    [['Category','select',['Strength','Weakness','Opportunity','Threat']],['Factor'],['Impact','select',['Low','Medium','High']],['Action / response']],
    [['Strength','Experienced front-line staff','High','Involve them in designing the new process'],['Weakness','Paper forms re-keyed by hand','High','Move intake online'],['Opportunity','New provincial digital ID service','Medium','Use it for identity checks'],['Threat','Competitor launching an app this year','Medium','Release a first version early']]),
  tpl('process-map','Process Analysis (As-is / To-be)','⇢','Compare each step of today\'s process with the improved process.',
    [['Step'],['Actor'],['As-is'],['Pain point'],['To-be'],['Benefit']],
    [['1','Applicant','Prints and posts a paper form','Slow and error-prone','Completes an online form with validation','Fewer missing details'],['2','Clerk','Re-keys the form into the system','Two days of delay','Data flows straight into the system','Same-day processing']]),
  tpl('gap','Gap Analysis','◫','Show the gap between current and future capabilities and how to close it.',
    [['Capability'],['Current state'],['Future state'],['Gap'],['Action to close'],['Priority','select',['High','Medium','Low']]],
    [['Application intake','Paper forms by post','Online form with validation','No digital channel','Build online intake','High'],['Reporting','Monthly spreadsheet','Live dashboard','Manual data gathering','Automate data feed','Medium']]),
  tpl('sipoc','SIPOC','⇶','Scope a process at a high level: suppliers, inputs, process, outputs and customers.',
    [['Suppliers'],['Inputs'],['Process step'],['Outputs'],['Customers']],
    [['Applicant','Application form, ID','Receive application','Registered application','Intake team'],['Intake team','Registered application','Check eligibility','Eligibility decision','Applicant, case officer'],['Case officer','Decision','Issue approval letter','Approval letter','Applicant']]),
  tpl('value-stream','Value Stream Map','⏱','Measure process time and waiting time at each step to find waste.',
    [['Step'],['Process time (hours)','number'],['Wait time (hours)','number'],['% complete and accurate','number'],['Owner'],['Improvement idea']],
    [['Receive application','0.5','24','70','Intake','Online form with required fields'],['Check eligibility','1','48','90','Case officer','Rules engine for simple cases'],['Approve','0.5','72','95','Manager','Delegate approvals under a threshold']]),
  tpl('elicitation','Elicitation Plan and Log','✎','Plan elicitation sessions and record outcomes and follow-ups.',
    [['Session'],['Technique','select',['Interview','Workshop','Observation','Survey','Document analysis','Prototype','Focus group']],['Stakeholders'],['Date','date'],['Topics / questions'],['Outcome'],['Follow-up']],
    [['Intake process walkthrough','Observation','Intake clerks','2026-10-08','How forms are checked and entered','12 steps mapped; 3 workarounds found','Confirm workarounds with team lead'],['Requirements workshop','Workshop','Clerks, case officers, IT','2026-10-14','Online form fields and rules','45 draft requirements','Send summary for confirmation']]),
  tpl('brd','Business Requirements','☰','List requirements with their type, priority, source and acceptance criteria.',
    [['ID'],['Requirement'],['Type','select',['Business','Stakeholder','Solution - functional','Solution - non-functional','Transition']],['Priority','select',MOSCOW],['Source'],['Acceptance criteria'],['Status','select',['Draft','Reviewed','Approved','Deferred']]],
    [['BR-01','Reduce application turnaround from 10 to 5 days','Business','Must','Business case','Average turnaround of 5 days or less over 3 months','Approved'],['SR-04','Applicants can save a draft and return later','Solution - functional','Should','Workshop 14 Oct','Draft is kept for 30 days and reloads all fields','Reviewed'],['NF-02','Pages load within 2 seconds for 95% of requests','Solution - non-functional','Must','IT standards','Measured in load test with 500 users','Draft']]),
  tpl('story-map','User Story Map','▦','Arrange stories under user activities and slice them into releases.',
    [['Activity (backbone)'],['Step'],['User story'],['Release','select',['MVP','Release 2','Later']],['Priority','select',MOSCOW]],
    [['Apply','Fill in form','As an applicant I want to enter my details online','MVP','Must'],['Apply','Upload documents','As an applicant I want to upload my ID','MVP','Must'],['Track','Check status','As an applicant I want to see where my application is','Release 2','Should'],['Track','Get notifications','As an applicant I want an email when the status changes','Later','Could']]),
  tpl('use-case','Use Case Specification','◉','Describe how an actor uses the system to reach a goal, step by step.',
    [['Section','select',['Use case','Actor','Goal','Preconditions','Main flow','Alternative flow','Exception flow','Postconditions','Business rules']],['Details']],
    [['Use case','UC-03 Submit application'],['Actor','Applicant'],['Preconditions','Applicant has an account and is signed in'],['Main flow','1. Applicant opens the form. 2. Enters details. 3. Uploads ID. 4. Submits. 5. System confirms and sends a reference number.'],['Alternative flow','3a. Applicant saves a draft and returns later.'],['Postconditions','Application is registered with status "Received".']]),
  tpl('rules','Business Rules Catalogue','§','Record business rules separately so they can be reused and changed safely.',
    [['ID'],['Rule'],['Type','select',['Constraint','Calculation','Validation','Authorization','Inference']],['Source'],['Related requirement'],['Owner']],
    [['BR-R01','Applicants must be 18 or older','Validation','Program policy s.2.1','SR-02','Policy Lead'],['BR-R02','Approvals over $5,000 need a manager','Authorization','Delegation policy','SR-07','Finance Manager']]),
  tpl('data-dictionary','Data Dictionary','𝔻','Define each data element: meaning, format, allowed values and source.',
    [['Field'],['Description'],['Data type','select',['Text','Number','Date','Yes/No','Code list']],['Format / length'],['Allowed values'],['Required','select',['Yes','No']],['Source system']],
    [['applicant_id','Unique applicant number','Text','APP-000000','Generated by system','Yes','Intake portal'],['date_of_birth','Applicant date of birth','Date','YYYY-MM-DD','18+ years before today','Yes','Intake portal'],['status','Application status','Code list','—','Received, In review, Approved, Declined','Yes','Case system']]),
  tpl('dor','Definition of Ready','✔','Agree what a backlog item needs before the team takes it into a sprint.',
    [['Criterion'],['Why it matters'],['Checked by'],['Applies to','select',['User story','Bug','Spike','Epic']]],
    [['Clear user, need and benefit (story format)','Everyone understands the value','Product Owner','User story'],['Acceptance criteria written and agreed','The team knows when it is done','Business Analyst','User story'],['Small enough to finish in one sprint','Reduces carry-over','Team','User story'],['Dependencies identified','Avoids blocked work','Scrum Master','User story']]),
  // Delivery teams and developers
  tpl('sprint','Sprint Planning','⟳','Set the sprint goal and plan the stories the team commits to.',
    [['Sprint'],['Sprint goal'],['Story / task'],['Points','number'],['Owner'],['Status','select',['To do','In progress','In review','Done']]],
    [['Sprint 4','Applicants can submit a complete application online','Online form: personal details','5','Dev A','Done'],['Sprint 4','Applicants can submit a complete application online','Upload ID document','8','Dev B','In progress'],['Sprint 4','Applicants can submit a complete application online','Confirmation email','3','Dev C','To do']]),
  tpl('kanban-board','Kanban Board','▥','Visualize work by stage, limit work in progress and spot blocked cards.',
    [['Card'],['Owner'],['Column','select',['Backlog','Ready','In progress','Review','Done']],['Class of service','select',['Standard','Expedite','Fixed date','Intangible']],['Started','date'],['Blocked?','select',['No','Yes']]],
    [['Fix login timeout','Dev A','In progress','Expedite','2026-10-12','No'],['Update help text','Dev C','Review','Standard','2026-10-10','No'],['Upgrade database driver','Dev B','In progress','Intangible','2026-10-09','Yes'],['Year-end report change','Dev D','Ready','Fixed date','','No']]),
  tpl('team-agreement','Team Working Agreement','🤝','Agree how the team works together: hours, meetings, tools and behaviour.',
    [['Topic'],['Our agreement'],['Owner'],['Review date','date']],
    [['Core hours','We are all available 10:00–15:00 Central time','Team','2026-12-01'],['Stand-up','15 minutes at 10:00, camera on, blockers first','Scrum Master','2026-12-01'],['Code reviews','Every pull request reviewed within one working day','Developers','2026-12-01']]),
  tpl('dod','Definition of Done','☑','The quality checklist every increment must meet before it counts as done.',
    [['Criterion'],['Applies to','select',['Story','Sprint','Release']],['How it is checked'],['Status','select',['Met','Not met','Not applicable']]],
    [['Code reviewed and merged','Story','Pull request approved','Met'],['Automated tests pass','Story','CI pipeline green','Met'],['Acceptance criteria verified by the Product Owner','Story','Demo or test evidence','Not met'],['Release notes updated','Release','Checked before deployment','Not met']]),
  tpl('test-cases','Test Cases','🧪','Plan test scenarios with steps, expected results and outcomes.',
    [['ID'],['Requirement'],['Scenario'],['Steps'],['Expected result'],['Result','select',['Not run','Pass','Fail','Blocked']]],
    [['TC-01','SR-04','Save a draft','Fill half the form, select Save, sign out, sign in','Draft reloads with all fields','Pass'],['TC-02','BR-R01','Under-18 applicant','Enter a date of birth 17 years ago','Error message shown, form not submitted','Fail'],['TC-03','NF-02','Page load under load','Run load test with 500 users','95% of pages load in under 2 s','Not run']]),
  tpl('bugs','Bug Tracker','🐞','Log defects with severity, steps to reproduce and status.',
    [['ID'],['Summary'],['Steps to reproduce'],['Severity','select',['Critical','High','Medium','Low']],['Assignee'],['Status','select',['New','In progress','Fixed','Verified','Closed']]],
    [['BUG-12','Under-18 check not applied','Enter DOB 17 years ago and submit','High','Dev A','In progress'],['BUG-13','Typo on confirmation page','Submit any application','Low','Dev C','Fixed'],['BUG-14','Upload fails for files over 5 MB','Upload a 6 MB PDF','Medium','Dev B','New']]),
  tpl('tech-debt','Technical Debt Register','⚙','Make technical debt visible, rate its impact and plan the paydown.',
    [['ID'],['Debt item'],['Area'],['Impact','select',['Low','Medium','High']],['Effort (days)','number'],['Plan'],['Status','select',['Open','Planned','In progress','Paid down']]],
    [['TD-01','No automated tests for payment module','Payments','High','5','Add tests over two sprints','Planned'],['TD-02','Old logging library','Platform','Medium','2','Upgrade during next release','Open']]),
  tpl('adr','Architecture Decision Record','⌘','Record important technical decisions, their context and consequences.',
    [['ID'],['Title'],['Context'],['Decision'],['Consequences'],['Status','select',['Proposed','Accepted','Superseded','Rejected']],['Date','date']],
    [['ADR-001','Store documents in cloud object storage','Uploads must scale and be kept 7 years','Use managed object storage with lifecycle rules','Lower cost; need a retention policy and encryption keys','Accepted','2026-10-06']]),
  tpl('flow-metrics','Flow Metrics Log','📈','Track throughput, cycle time and WIP each week to see how work flows.',
    [['Week'],['Throughput (items done)','number'],['Average cycle time (days)','number'],['WIP (items in progress)','number'],['Blocked items','number'],['Notes']],
    [['W40','9','4.5','6','1','Normal week'],['W41','6','6.2','9','3','WIP limit exceeded; two items waiting for review'],['W42','10','4.1','5','0','Review swarming helped']]),
  tpl('retro','Retrospective Board','↻','Capture what went well, what to improve and the actions the team will take.',
    [['Category','select',['Went well','To improve','Ideas','Action']],['Item'],['Owner'],['Due date','date']],
    [['Went well','Pairing on the upload feature','',''],['To improve','Stories arrived without acceptance criteria','',''],['Action','Hold backlog refinement every Wednesday','Product Owner','2026-10-21']]),
  tpl('release','Release Plan and Notes','🚀','Plan what goes into each release and publish clear release notes.',
    [['Version'],['Target date','date'],['Features'],['Fixes'],['Known issues'],['Owner']],
    [['1.0','2026-11-15','Online application, document upload','—','Status tracking not yet available','Release Manager'],['1.1','2026-12-06','Status tracking','BUG-14 large uploads','—','Release Manager']]),
  tpl('deploy','Deployment / Go-live Checklist','✈','Run go-live step by step with owners, timing and a rollback plan.',
    [['Step'],['Owner'],['When'],['Status','select',['Not started','In progress','Done','Blocked']],['Rollback / contingency']],
    [['Database backup taken','DBA','T-2h','Done','Restore from backup'],['Deploy version 1.0','DevOps','T-0','Not started','Redeploy previous version'],['Smoke test key journeys','QA Lead','T+30m','Not started','Roll back if any test fails'],['Notify support and users','Service Manager','T+1h','Not started','—']]),
];

/** Preview board grouping for the newer templates: [column key, preferred column order]. */
export const BOARDS:Record<string,[string,string[]]>={
  'roadmap':['f2',['Now','Next','Later']],'phase-gate':['f3',['Go','Go with conditions','Hold','Stop']],'swot':['f0',['Strength','Weakness','Opportunity','Threat']],
  'story-map':['f3',['MVP','Release 2','Later']],'brd':['f3',MOSCOW],'sprint':['f5',['To do','In progress','In review','Done']],
  'kanban-board':['f2',['Backlog','Ready','In progress','Review','Done']],'dod':['f3',['Met','Not met','Not applicable']],'test-cases':['f5',['Not run','Pass','Fail','Blocked']],
  'bugs':['f5',['New','In progress','Fixed','Verified','Closed']],'tech-debt':['f6',['Open','Planned','In progress','Paid down']],'retro':['f0',['Went well','To improve','Ideas','Action']],
  'deploy':['f3',['Not started','In progress','Done','Blocked']],'gap':['f5',['High','Medium','Low']],'adr':['f5',['Proposed','Accepted','Superseded','Rejected']],
};
