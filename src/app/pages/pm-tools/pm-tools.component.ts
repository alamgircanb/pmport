import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
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
  imports:[CommonModule,FormsModule],
  templateUrl:'./pm-tools.component.html',
  styleUrl:'./pm-tools.component.css'
})
export class PMToolsComponent implements OnInit {
  readonly tools:ToolDefinition[]=[
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

  selectedTool=this.tools[0];
  projectName='My Project';
  rows:Record<string,string>[]=[];
  savedAt='';
  message='';

  ngOnInit():void { this.selectTool(this.tools[0]); }

  /** Opens a tool and restores the visitor's last saved version on this device. */
  selectTool(tool:ToolDefinition):void {
    this.selectedTool=tool;
    const saved=localStorage.getItem(this.storageKey(tool.id));
    if(saved){
      try {
        const workspace=JSON.parse(saved) as {projectName?:string;rows?:Record<string,string>[];savedAt?:string};
        this.projectName=workspace.projectName||'My Project';
        this.rows=workspace.rows?.length?workspace.rows.map(row=>({...row})):this.cloneSampleRows(tool);
        this.savedAt=workspace.savedAt||'';
      } catch { this.loadSamples(tool); }
    } else { this.loadSamples(tool); }
    this.message='';
  }

  /** Adds a blank editable row containing every field required by the active tool. */
  addRow():void {
    const row:Record<string,string>={};
    for(const column of this.selectedTool.columns){row[column.key]=column.options?.[0]||'';}
    this.rows.push(row);
    this.message='New row added. Enter your information, then select Save.';
  }

  deleteRow(index:number):void {
    if(confirm('Delete this row?')){
      this.rows.splice(index,1);
      this.message='Row deleted. Select Save to keep this change.';
    }
  }

  moveRow(index:number,direction:-1|1):void {
    const destination=index+direction;
    if(destination<0||destination>=this.rows.length)return;
    [this.rows[index],this.rows[destination]]=[this.rows[destination],this.rows[index]];
  }

  /** Saves only in the current browser; no visitor information is sent to a server. */
  saveWorkspace():void {
    const now=new Date().toISOString();
    localStorage.setItem(this.storageKey(this.selectedTool.id),JSON.stringify({projectName:this.projectName,rows:this.rows,savedAt:now}));
    this.savedAt=now;
    this.message='Saved on this device.';
  }

  resetWorkspace():void {
    if(!confirm(`Reset ${this.selectedTool.name} to its example data?`))return;
    localStorage.removeItem(this.storageKey(this.selectedTool.id));
    this.loadSamples(this.selectedTool);
    this.message='Example data restored.';
  }

  /** Exports an Excel-compatible .xls workbook without needing an external service. */
  exportExcel():void {
    const headers=this.selectedTool.columns.map(column=>`<Cell><Data ss:Type="String">${this.xml(column.label)}</Data></Cell>`).join('');
    const data=this.rows.map(row=>`<Row>${this.selectedTool.columns.map(column=>`<Cell><Data ss:Type="String">${this.xml(row[column.key]||'')}</Data></Cell>`).join('')}</Row>`).join('');
    const workbook=`<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="${this.xml(this.selectedTool.name.slice(0,31))}"><Table><Row>${headers}</Row>${data}</Table></Worksheet></Workbook>`;
    this.download(new Blob([workbook],{type:'application/vnd.ms-excel'}),`${this.fileBase()}.xls`);
    this.message='Excel file exported.';
  }

  /** Opens a clean printable report; choose “Save as PDF” in the print window. */
  exportPdf():void {
    const popup=window.open('','_blank','width=1000,height=760');
    if(!popup){this.message='Allow pop-ups, then try the PDF export again.';return;}
    const head=this.selectedTool.columns.map(column=>`<th>${this.html(column.label)}</th>`).join('');
    const body=this.rows.map(row=>`<tr>${this.selectedTool.columns.map(column=>`<td>${this.html(row[column.key]||'')}</td>`).join('')}</tr>`).join('');
    popup.document.write(`<!doctype html><html><head><title>${this.html(this.projectName)} — ${this.html(this.selectedTool.name)}</title><style>body{font:13px Arial;color:#17263a;padding:28px}h1{margin-bottom:4px}p{color:#526579}table{width:100%;border-collapse:collapse;margin-top:22px}th,td{border:1px solid #b9c5d2;padding:8px;text-align:left;vertical-align:top}th{background:#eaf3f8}@media print{body{padding:0}}</style></head><body><h1>${this.html(this.projectName)}</h1><p>${this.html(this.selectedTool.name)} · Exported ${new Date().toLocaleString()}</p><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table><script>window.onload=()=>window.print()<\/script></body></html>`);
    popup.document.close();
    this.message='Print window opened. Choose “Save as PDF” as the destination.';
  }

  /** EVM values are calculated live from the visitor's editable PV, EV and AC fields. */
  evmSummary(){
    const sum=(key:string)=>this.rows.reduce((total,row)=>total+(Number(row[key])||0),0);
    const pv=sum('pv'),ev=sum('ev'),ac=sum('ac');
    return {pv,ev,ac,sv:ev-pv,cv:ev-ac,spi:pv?ev/pv:0,cpi:ac?ev/ac:0};
  }

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
