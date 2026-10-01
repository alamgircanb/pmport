import {CommonModule} from '@angular/common';
import {Component, OnInit, HostListener} from '@angular/core';
import {RouterLink} from '@angular/router';
import {exportWorkbook,exportTablePdf} from '../../core/export-utils';
import {FormsModule} from '@angular/forms';

interface ToolColumn {
  key:string;
  label:string;
  type:'text'|'number'|'date'|'select';
  options?:string[];
}

interface ToolDefinition {
  id:string;
  name:string;
  icon:string;
  description:string;
  columns:ToolColumn[];
  sampleRows:Record<string,string>[];
}

@Component({
  selector:'app-pm-tools',
  standalone:true,
  imports:[CommonModule,FormsModule,RouterLink],
  templateUrl:'./pm-tools.component.html',
  styleUrl:'./pm-tools.component.css'
})
export class PMToolsComponent implements OnInit {
  readonly tools:ToolDefinition[]=[
{"id": "charter", "name": "Project Charter", "icon": "\u25a7", "description": "Authorize a project and agree on its purpose, boundaries and authority.", "columns": [{"key": "f0", "label": "Section", "type": "text"}, {"key": "f1", "label": "Details", "type": "text"}, {"key": "f2", "label": "Owner / Approver", "type": "text"}], "sampleRows": [{"f0": "Purpose", "f1": "Reduce application processing time", "f2": "Sponsor"}, {"f0": "Objectives", "f1": "Reduce turnaround by 20% within six months", "f2": "Project Manager"}, {"f0": "Scope", "f1": "Online intake and staff training", "f2": "Business Lead"}, {"f0": "Out of scope", "f1": "Replacing the finance system", "f2": "Sponsor"}, {"f0": "Deliverables", "f1": "Portal, training and transition plan", "f2": "Project Team"}, {"f0": "Milestones", "f1": "Pilot, acceptance, launch", "f2": "Project Manager"}, {"f0": "Budget", "f1": "Enter approved funding and currency", "f2": "Sponsor"}, {"f0": "Risks", "f1": "Availability of subject matter experts", "f2": "Project Manager"}, {"f0": "Approval", "f1": "Record sponsor approval and date", "f2": "Sponsor"}]},{"id": "business-case", "name": "Business Case", "icon": "\u25a7", "description": "Compare options, costs, benefits and the recommended investment.", "columns": [{"key": "f0", "label": "Section", "type": "text"}, {"key": "f1", "label": "Details", "type": "text"}, {"key": "f2", "label": "Measure / Evidence", "type": "text"}], "sampleRows": [{"f0": "Problem", "f1": "Long processing times", "f2": "Baseline: 10 days"}, {"f0": "Options", "f1": "Improve current process or introduce online intake", "f2": "Options appraisal"}, {"f0": "Recommendation", "f1": "Pilot online intake", "f2": "Sponsor decision"}, {"f0": "Costs", "f1": "Implementation and ongoing support", "f2": "Estimate with assumptions"}, {"f0": "Benefits", "f1": "Shorter turnaround and fewer errors", "f2": "Benefits owner and target"}, {"f0": "Risks", "f1": "Adoption and integration", "f2": "Risk register"}]},{"id": "scope", "name": "Scope Statement", "icon": "\u25a7", "description": "Define deliverables, exclusions, constraints and acceptance.", "columns": [{"key": "f0", "label": "Deliverable", "type": "text"}, {"key": "f1", "label": "Included Work", "type": "text"}, {"key": "f2", "label": "Exclusions", "type": "text"}, {"key": "f3", "label": "Acceptance Criteria", "type": "text"}, {"key": "f4", "label": "Owner", "type": "text"}], "sampleRows": [{"f0": "Online intake", "f1": "Form and status tracking", "f2": "Payment processing", "f3": "Users can submit and track an application", "f4": "Business Lead"}]},{"id": "milestones", "name": "Milestone Schedule", "icon": "\u25a7", "description": "Track key approvals and delivery dates.", "columns": [{"key": "f0", "label": "Milestone", "type": "text"}, {"key": "f1", "label": "Target Date", "type": "date"}, {"key": "f2", "label": "Actual Date", "type": "date"}, {"key": "f3", "label": "Owner", "type": "text"}, {"key": "f4", "label": "Status", "type": "text"}, {"key": "f5", "label": "Dependencies", "type": "text"}], "sampleRows": [{"f0": "Charter approved", "f1": "2026-10-05", "f2": "", "f3": "Sponsor", "f4": "Planned", "f5": "Business case"}]},{"id": "communications", "name": "Communication Plan", "icon": "\u25a7", "description": "Specify who needs what information, when and how.", "columns": [{"key": "f0", "label": "Audience", "type": "text"}, {"key": "f1", "label": "Information", "type": "text"}, {"key": "f2", "label": "Channel", "type": "text"}, {"key": "f3", "label": "Frequency", "type": "text"}, {"key": "f4", "label": "Owner", "type": "text"}, {"key": "f5", "label": "Feedback Method", "type": "text"}], "sampleRows": [{"f0": "Sponsor", "f1": "Status, risks and decisions", "f2": "Briefing", "f3": "Biweekly", "f4": "Project Manager", "f5": "Decision log"}]},{"id": "budget", "name": "Budget Tracker", "icon": "\u25a7", "description": "Compare planned and actual costs by category.", "columns": [{"key": "f0", "label": "Category", "type": "text"}, {"key": "f1", "label": "Planned Cost", "type": "number"}, {"key": "f2", "label": "Actual Cost", "type": "number"}, {"key": "f3", "label": "Forecast Cost", "type": "number"}, {"key": "f4", "label": "Owner", "type": "text"}, {"key": "f5", "label": "Notes", "type": "text"}], "sampleRows": [{"f0": "Development", "f1": "10000", "f2": "8500", "f3": "10500", "f4": "Technical Lead", "f5": "Illustrative budget; use one currency throughout"}]},{"id": "change", "name": "Change Request Register", "icon": "\u25a7", "description": "Evaluate and approve proposed changes against baselines.", "columns": [{"key": "f0", "label": "ID", "type": "text"}, {"key": "f1", "label": "Requested Change", "type": "text"}, {"key": "f2", "label": "Reason", "type": "text"}, {"key": "f3", "label": "Scope / Cost / Schedule Impact", "type": "text"}, {"key": "f4", "label": "Decision", "type": "text"}, {"key": "f5", "label": "Approver", "type": "text"}, {"key": "f6", "label": "Date", "type": "date"}], "sampleRows": [{"f0": "CR-01", "f1": "Add status notifications", "f2": "User feedback", "f3": "Estimate additional effort before approval", "f4": "Pending", "f5": "Sponsor", "f6": "2026-10-02"}]},{"id": "status", "name": "Project Status Report", "icon": "\u25a7", "description": "Communicate delivery health, achievements and decisions.", "columns": [{"key": "f0", "label": "Reporting Period", "type": "text"}, {"key": "f1", "label": "Area", "type": "text"}, {"key": "f2", "label": "Status", "type": "text"}, {"key": "f3", "label": "Progress / Evidence", "type": "text"}, {"key": "f4", "label": "Next Step", "type": "text"}, {"key": "f5", "label": "Owner", "type": "text"}], "sampleRows": [{"f0": "Week 1", "f1": "Schedule", "f2": "On track", "f3": "Charter approved", "f4": "Confirm detailed milestones", "f5": "Project Manager"}, {"f0": "Week 1", "f1": "Risks", "f2": "Attention", "f3": "Vendor availability uncertain", "f4": "Confirm delivery commitment", "f5": "Procurement Lead"}]},{"id": "actions", "name": "Action Log", "icon": "\u25a7", "description": "Assign and follow up agreed actions.", "columns": [{"key": "f0", "label": "ID", "type": "text"}, {"key": "f1", "label": "Action", "type": "text"}, {"key": "f2", "label": "Owner", "type": "text"}, {"key": "f3", "label": "Due Date", "type": "date"}, {"key": "f4", "label": "Status", "type": "text"}, {"key": "f5", "label": "Notes", "type": "text"}], "sampleRows": [{"f0": "A-01", "f1": "Validate user requirements", "f2": "Business Analyst", "f3": "2026-10-07", "f4": "Open", "f5": "Stakeholder review"}]},{"id": "decisions", "name": "Decision Log", "icon": "\u25a7", "description": "Keep the rationale and authority for project decisions.", "columns": [{"key": "f0", "label": "ID", "type": "text"}, {"key": "f1", "label": "Decision", "type": "text"}, {"key": "f2", "label": "Rationale", "type": "text"}, {"key": "f3", "label": "Decision Maker", "type": "text"}, {"key": "f4", "label": "Date", "type": "date"}, {"key": "f5", "label": "Impact", "type": "text"}], "sampleRows": [{"f0": "D-01", "f1": "Run a pilot before full release", "f2": "Validate service performance", "f3": "Sponsor", "f4": "2026-10-03", "f5": "Pilot milestone added"}]},{"id": "backlog", "name": "Product Backlog", "icon": "\u25a7", "description": "Prioritize valuable work and define completion.", "columns": [{"key": "f0", "label": "ID", "type": "text"}, {"key": "f1", "label": "Backlog Item", "type": "text"}, {"key": "f2", "label": "Priority", "type": "text"}, {"key": "f3", "label": "Estimate", "type": "text"}, {"key": "f4", "label": "Acceptance Criteria", "type": "text"}, {"key": "f5", "label": "Status", "type": "text"}], "sampleRows": [{"f0": "PB-01", "f1": "Submit application online", "f2": "High", "f3": "5", "f4": "Valid submission returns a tracking ID", "f5": "Ready"}]},{"id": "stories", "name": "User Stories", "icon": "\u25a7", "description": "Describe user needs with testable acceptance criteria.", "columns": [{"key": "f0", "label": "ID", "type": "text"}, {"key": "f1", "label": "As a", "type": "text"}, {"key": "f2", "label": "I Want", "type": "text"}, {"key": "f3", "label": "So That", "type": "text"}, {"key": "f4", "label": "Acceptance Criteria", "type": "text"}, {"key": "f5", "label": "Priority", "type": "text"}], "sampleRows": [{"f0": "US-01", "f1": "Applicant", "f2": "To track my application", "f3": "I know its current status", "f4": "Given an application ID, when I search, then its current status is shown", "f5": "High"}]},{"id": "traceability", "name": "Requirements Traceability Matrix", "icon": "\u25a7", "description": "Connect needs, requirements, deliverables and test evidence.", "columns": [{"key": "f0", "label": "ID", "type": "text"}, {"key": "f1", "label": "Business Need", "type": "text"}, {"key": "f2", "label": "Requirement", "type": "text"}, {"key": "f3", "label": "Deliverable", "type": "text"}, {"key": "f4", "label": "Test / Acceptance", "type": "text"}, {"key": "f5", "label": "Status", "type": "text"}], "sampleRows": [{"f0": "REQ-01", "f1": "Improve access", "f2": "Allow online submissions", "f3": "Intake portal", "f4": "UAT-01", "f5": "Draft"}]},{"id": "lessons", "name": "Lessons Learned", "icon": "\u25a7", "description": "Capture experience and practical improvements.", "columns": [{"key": "f0", "label": "Date", "type": "date"}, {"key": "f1", "label": "Topic", "type": "text"}, {"key": "f2", "label": "What Worked", "type": "text"}, {"key": "f3", "label": "What to Improve", "type": "text"}, {"key": "f4", "label": "Recommendation", "type": "text"}, {"key": "f5", "label": "Owner", "type": "text"}], "sampleRows": [{"f0": "2026-10-10", "f1": "Requirements", "f2": "Early user review", "f3": "Late stakeholder availability", "f4": "Schedule discovery workshops earlier", "f5": "Business Analyst"}]},{"id": "closure", "name": "Project Closure Report", "icon": "\u25a7", "description": "Confirm acceptance, handover and remaining responsibilities.", "columns": [{"key": "f0", "label": "Section", "type": "text"}, {"key": "f1", "label": "Details", "type": "text"}, {"key": "f2", "label": "Owner", "type": "text"}, {"key": "f3", "label": "Completion / Approval Date", "type": "date"}], "sampleRows": [{"f0": "Deliverable acceptance", "f1": "Record sign-off against acceptance criteria", "f2": "Sponsor", "f3": ""}, {"f0": "Handover", "f1": "Document support arrangements and training", "f2": "Service Owner", "f3": ""}, {"f0": "Financial closure", "f1": "Confirm final costs and outstanding invoices", "f2": "Finance", "f3": ""}, {"f0": "Open items", "f1": "Assign residual actions and risks", "f2": "Project Manager", "f3": ""}]},{"id": "benefits", "name": "Benefits Realization Tracker", "icon": "\u25a7", "description": "Monitor outcomes after delivery against an agreed baseline.", "columns": [{"key": "f0", "label": "Benefit", "type": "text"}, {"key": "f1", "label": "KPI", "type": "text"}, {"key": "f2", "label": "Baseline", "type": "text"}, {"key": "f3", "label": "Target", "type": "text"}, {"key": "f4", "label": "Current Value", "type": "text"}, {"key": "f5", "label": "Owner", "type": "text"}, {"key": "f6", "label": "Review Date", "type": "date"}], "sampleRows": [{"f0": "Faster processing", "f1": "Average turnaround (days)", "f2": "10", "f3": "8", "f4": "", "f5": "Service Owner", "f6": "2027-01-15"}]},
    {
      id:'gantt',name:'Gantt Chart',icon:'▤',
      description:'Plan tasks, dates, owners, progress and dependencies.',
      columns:[
        {key:'task',label:'Task',type:'text'},{key:'owner',label:'Owner',type:'text'},
        {key:'start',label:'Start',type:'date'},{key:'end',label:'End',type:'date'},
        {key:'progress',label:'Progress %',type:'number'},{key:'dependsOn',label:'Depends on',type:'text'}
      ],
      sampleRows:[
        {task:'Define project scope',owner:'Project Manager',start:'2026-10-01',end:'2026-10-05',progress:'100',dependsOn:'—'},
        {task:'Build deliverables',owner:'Project Team',start:'2026-10-06',end:'2026-10-18',progress:'45',dependsOn:'Define project scope'}
      ]
    },
    {
      id:'raci',name:'RACI Matrix',icon:'◎',
      description:'Clarify who is responsible, accountable, consulted and informed.',
      columns:[
        {key:'activity',label:'Activity / Decision',type:'text'},
        {key:'responsible',label:'Responsible (R)',type:'text'},
        {key:'accountable',label:'Accountable (A)',type:'text'},
        {key:'consulted',label:'Consulted (C)',type:'text'},
        {key:'informed',label:'Informed (I)',type:'text'}
      ],
      sampleRows:[
        {activity:'Approve project charter',responsible:'Project Manager',accountable:'Sponsor',consulted:'Business Lead',informed:'Project Team'},
        {activity:'Confirm requirements',responsible:'Business Analyst',accountable:'Product Owner',consulted:'Users',informed:'Project Manager'}
      ]
    },
    {
      id:'raid',name:'RAID Log',icon:'⚑',
      description:'Track risks, assumptions, issues and dependencies in one place.',
      columns:[
        {key:'type',label:'Type',type:'select',options:['Risk','Assumption','Issue','Dependency']},
        {key:'description',label:'Description',type:'text'},{key:'owner',label:'Owner',type:'text'},
        {key:'impact',label:'Impact',type:'select',options:['Low','Medium','High','Critical']},
        {key:'response',label:'Response / Action',type:'text'},
        {key:'status',label:'Status',type:'select',options:['Open','Monitoring','Closed']}
      ],
      sampleRows:[
        {type:'Risk',description:'Vendor delivery may be delayed',owner:'Procurement Lead',impact:'High',response:'Confirm backup supplier',status:'Monitoring'}
      ]
    },
    {
      id:'stakeholders',name:'Stakeholder Register',icon:'◇',
      description:'Map stakeholder influence, interest and engagement actions.',
      columns:[
        {key:'name',label:'Stakeholder',type:'text'},{key:'role',label:'Role / Group',type:'text'},
        {key:'influence',label:'Influence',type:'select',options:['Low','Medium','High']},
        {key:'interest',label:'Interest',type:'select',options:['Low','Medium','High']},
        {key:'strategy',label:'Engagement Strategy',type:'text'},{key:'owner',label:'Relationship Owner',type:'text'}
      ],
      sampleRows:[
        {name:'Executive Sponsor',role:'Sponsor',influence:'High',interest:'High',strategy:'Manage closely; biweekly briefing',owner:'Project Manager'}
      ]
    },
    {
      id:'wbs',name:'Work Breakdown Structure',icon:'⌘',
      description:'Break project scope into manageable deliverables and work packages.',
      columns:[
        {key:'code',label:'WBS Code',type:'text'},{key:'deliverable',label:'Deliverable / Work Package',type:'text'},
        {key:'parent',label:'Parent',type:'text'},{key:'owner',label:'Owner',type:'text'},
        {key:'effort',label:'Effort (hours)',type:'number'},{key:'acceptance',label:'Acceptance Criteria',type:'text'}
      ],
      sampleRows:[
        {code:'1.0',deliverable:'Project Management',parent:'—',owner:'Project Manager',effort:'40',acceptance:'Approved plan and reports'},
        {code:'1.1',deliverable:'Project Charter',parent:'1.0',owner:'Project Manager',effort:'8',acceptance:'Sponsor approval received'}
      ]
    },
    {
      id:'evm',name:'Earned Value Tracker',icon:'∑',
      description:'Enter PV, EV and AC to calculate schedule and cost performance.',
      columns:[
        {key:'period',label:'Period / Work Package',type:'text'},
        {key:'pv',label:'Planned Value (PV)',type:'number'},
        {key:'ev',label:'Earned Value (EV)',type:'number'},
        {key:'ac',label:'Actual Cost (AC)',type:'number'},
        {key:'notes',label:'Notes',type:'text'}
      ],
      sampleRows:[
        {period:'Month 1',pv:'10000',ev:'9000',ac:'9500',notes:'Initial delivery period'}
      ]
    }
  ];

  private readonly defaults=JSON.parse(JSON.stringify(this.tools)) as ToolDefinition[];
  selectedTool=this.tools[0];
  projectName='My Project';
  rows:Record<string,string>[]=[];
  savedAt='';
  message='';
  dirty=false;
  newColumn='';

  ngOnInit():void { this.selectTool(this.tools[0]); }

  /** Opens a tool and restores the visitor's last saved version on this device. */
  selectTool(tool:ToolDefinition):void {
    if(this.dirty&&!confirm('Switch tools and discard unsaved changes? Select Cancel to save first.'))return;
    this.dirty=false;
    this.selectedTool=tool;
    tool.columns=this.defaults.find(t=>t.id===tool.id)!.columns.map(c=>({...c}));
    let saved:string|null=null;try{saved=localStorage.getItem(this.storageKey(tool.id))}catch{this.message='Browser storage is unavailable.'}
    if(saved){
      try {
        const workspace=JSON.parse(saved) as {projectName?:string;rows?:Record<string,string>[];savedAt?:string;columns?:ToolColumn[]};
        this.projectName=workspace.projectName||'My Project';
        this.rows=Array.isArray(workspace.rows)?workspace.rows.map(row=>({...row})):this.cloneSampleRows(tool);
        this.savedAt=workspace.savedAt||'';
        if(workspace.columns?.length)this.selectedTool.columns=workspace.columns;
      } catch { this.loadSamples(tool); }
    } else { this.loadSamples(tool); }
    this.message='';
  }

  /** Adds a blank editable row containing every field required by the active tool. */
  addRow():void {
    const row:Record<string,string>={};
    for(const column of this.selectedTool.columns){row[column.key]=column.options?.[0]||'';}
    this.rows.push(row);this.dirty=true;
    this.message='New row added. Enter your information, then select Save.';
  }

  deleteRow(index:number):void {
    if(confirm('Delete this row?')){
      this.rows.splice(index,1);this.dirty=true;
      this.message='Row deleted. Select Save to keep this change.';
    }
  }

  moveRow(index:number,direction:-1|1):void {
    const destination=index+direction;
    if(destination<0||destination>=this.rows.length)return;
    [this.rows[index],this.rows[destination]]=[this.rows[destination],this.rows[index]];this.dirty=true;
  }

  /** Saves only in the current browser; no visitor information is sent to a server. */
  saveWorkspace():void {
    const now=new Date().toISOString();
    try{localStorage.setItem(this.storageKey(this.selectedTool.id),JSON.stringify({projectName:this.projectName,rows:this.rows,savedAt:now,columns:this.selectedTool.columns}));}catch{this.message='Unable to save. Browser storage may be full or unavailable.';return;}
    this.savedAt=now;this.dirty=false;
    this.message='Saved on this device.';
  }

  resetWorkspace():void {
    if(!confirm(`Reset ${this.selectedTool.name} to its example data?`))return;
    localStorage.removeItem(this.storageKey(this.selectedTool.id));
    this.selectedTool.columns=this.defaults.find(t=>t.id===this.selectedTool.id)!.columns.map(c=>({...c}));
    this.loadSamples(this.selectedTool);this.dirty=false;
    this.message='Example data restored.';
  }

  /** Exports an Excel-compatible .xls workbook without needing an external service. */
  async exportExcel():Promise<void> {
    try{await exportWorkbook(this.projectName+' — '+this.selectedTool.name,this.selectedTool.columns.map(c=>c.label),this.rows.map(r=>this.selectedTool.columns.map(c=>r[c.key]||'')),this.fileBase());this.message='Excel workbook exported.'}catch{this.message='Export failed. Please try again.'}
  }
  async exportPdf():Promise<void> {
    try{await exportTablePdf(this.projectName+' — '+this.selectedTool.name,this.selectedTool.columns.map(c=>c.label),this.rows.map(r=>this.selectedTool.columns.map(c=>r[c.key]||'')),this.fileBase());this.message='PDF exported.'}catch{this.message='PDF export failed. Please try again.'}
  }
  budgetSummary(){const total=(key:string)=>this.rows.reduce((n,r)=>n+(Number(r[key])||0),0);const planned=total('f1'),actual=total('f2'),forecast=total('f3');return {planned,actual,forecast,variance:planned-forecast}}
  /** EVM values are calculated live from the visitor's editable PV, EV and AC fields. */
  evmSummary(){
    const sum=(key:string)=>this.rows.reduce((total,row)=>total+(Number(row[key])||0),0);
    const pv=sum('pv'),ev=sum('ev'),ac=sum('ac');
    return {pv,ev,ac,sv:ev-pv,cv:ev-ac,spi:pv?ev/pv:0,cpi:ac?ev/ac:0};
  }

  addColumn(){const label=this.newColumn.trim();if(!label)return;const key='custom_'+Date.now();this.selectedTool.columns.push({key,label,type:'text'});this.rows.forEach(r=>r[key]='');this.newColumn='';this.dirty=true;}
  removeColumn(key:string){if(this.selectedTool.columns.length<2)return;if(!confirm('Remove this column and its values?'))return;this.selectedTool.columns=this.selectedTool.columns.filter(c=>c.key!==key);this.rows.forEach(r=>delete r[key]);this.dirty=true;}
  backup(){this.download(new Blob([JSON.stringify({toolId:this.selectedTool.id,projectName:this.projectName,columns:this.selectedTool.columns,rows:this.rows},null,2)],{type:'application/json'}),this.fileBase()+'.json')}
  async importFile(event:Event){const file=(event.target as HTMLInputElement).files?.[0];if(!file)return;try{if(file.size>2e6)throw Error();const d=JSON.parse(await file.text());if(d.toolId!==this.selectedTool.id||!Array.isArray(d.rows)||!Array.isArray(d.columns)||typeof d.projectName!=='string'||d.columns.length>30||d.rows.length>1000||!d.columns.length)throw Error();for(const c of d.columns){if(typeof c.key!=='string'||typeof c.label!=='string'||!['text','number','date','select'].includes(c.type)||c.type==='select'&&(!Array.isArray(c.options)||c.options.some((x:any)=>typeof x!=='string')))throw Error()}for(const r of d.rows){if(!r||typeof r!=='object'||Object.values(r).some(x=>typeof x!=='string'))throw Error()}if(this.dirty&&!confirm('Replace unsaved changes with this file?'))return;this.projectName=d.projectName;this.rows=d.rows;this.selectedTool.columns=d.columns;this.dirty=true;this.message='Artifact imported. Select Save to keep it on this device.'}catch{this.message='Choose a valid editable file for the current tool.'}finally{(event.target as HTMLInputElement).value=''}}
  @HostListener('window:beforeunload',['$event']) unload(e:BeforeUnloadEvent){if(this.dirty)e.preventDefault()}
  progress(value:string):number { return Math.min(100,Math.max(0,Number(value)||0)); }
  trackRow(index:number):number{return index;}

  private loadSamples(tool:ToolDefinition):void {
    this.projectName='My Project';
    this.rows=this.cloneSampleRows(tool);
    this.savedAt='';
  }
  private cloneSampleRows(tool:ToolDefinition){return tool.sampleRows.map(row=>({...row}));}
  private storageKey(id:string){return `pmport-pm-tool-${id}`;}
  private fileBase(){return `${this.projectName}-${this.selectedTool.name}`.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'pm-tool';}
  private download(blob:Blob,name:string){const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=name;link.click();URL.revokeObjectURL(url);}
  private xml(value:string){return this.html(value).replace(/'/g,'&apos;');}
  private html(value:string){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]||char));}
}
