import {DATASET,type Cell} from './datalab-data';
import type {Scalar,Sheet} from './excel-engine';

/** Practice sheets built from the shared dataset, laid out the way a PMO analyst would keep them in Excel. */
export function buildSheets():Record<string,Sheet>{
  const p=DATASET['projects'],t=DATASET['tasks'],r=DATASET['resources'];
  const col=(tbl:typeof p,row:Cell[],name:string)=>row[tbl.columns.indexOf(name)] as Scalar;
  const projects:Scalar[][]=[['Project ID','Project','Department','Manager ID','Status','Priority','Budget (BAC)','Actual Cost (AC)','% Complete','Planned %']];
  for(const row of p.rows)projects.push(['project_id','name','department','manager_id','status','priority','budget','actual_cost','percent_complete','planned_percent'].map(c=>col(p,row,c)));
  const tasks:Scalar[][]=[['Task ID','Project ID','Task','Phase','Planned Hours','Actual Hours','Status','Owner ID']];
  for(const row of t.rows)tasks.push(['task_id','project_id','name','phase','planned_hours','actual_hours','status','owner_id'].map(c=>col(t,row,c)));
  const resources:Scalar[][]=[['Resource ID','Name','Role','Department','Hourly Rate']];
  for(const row of r.rows)resources.push(['resource_id','name','role','department','hourly_rate'].map(c=>col(r,row,c)));
  return {Projects:{name:'Projects',cells:projects},Tasks:{name:'Tasks',cells:tasks},Resources:{name:'Resources',cells:resources}};
}

export interface ExcelExercise{
  id:string;level:string;title:string;sheet:'Projects'|'Tasks';cell:string;header?:string;label?:string;
  prompt:string;hint:string;solution:string;
  /** Rows the formula must also work on when filled down (Excel row numbers). */
  fill?:[number,number];
}

export const EXCEL_EXERCISES:ExcelExercise[]=[
  {id:'x01',level:'Earned value',title:'Earned value (EV)',sheet:'Projects',cell:'L2',header:'EV',fill:[2,9],
    prompt:'In L2, calculate Earned Value for the first project: EV = Budget × % Complete. Your formula must still work when filled down to row 9.',
    hint:'Multiply the budget cell by the % complete cell on the same row: =G2*I2',solution:'=G2*I2'},
  {id:'x02',level:'Earned value',title:'Planned value (PV)',sheet:'Projects',cell:'M2',header:'PV',fill:[2,9],
    prompt:'In M2, calculate Planned Value: PV = Budget × Planned %. It must work when filled down.',
    hint:'Same idea as EV, but with the Planned % column (J).',solution:'=G2*J2'},
  {id:'x03',level:'Earned value',title:'Cost variance (CV)',sheet:'Projects',cell:'N2',header:'CV',fill:[2,9],
    prompt:'In N2, calculate Cost Variance: CV = EV − AC. Calculate EV inside the formula (do not refer to L2). Negative means over budget.',
    hint:'EV is G2*I2 and AC is H2.',solution:'=G2*I2-H2'},
  {id:'x04',level:'Earned value',title:'CPI with IFERROR',sheet:'Projects',cell:'O2',header:'CPI',fill:[2,9],
    prompt:'In O2, calculate the Cost Performance Index: CPI = EV ÷ AC. One project has no cost yet, which causes a #DIV/0! error. Wrap the formula so it shows 0 instead.',
    hint:'=IFERROR(your_formula, 0) returns 0 when your formula fails.',solution:'=IFERROR(G2*I2/H2,0)'},
  {id:'x05',level:'Earned value',title:'Schedule performance (SPI)',sheet:'Projects',cell:'P2',header:'SPI',fill:[2,9],
    prompt:'In P2, calculate SPI = EV ÷ PV, which simplifies to % Complete ÷ Planned %. If Planned % is 0, show 1.',
    hint:'=IF(J2=0, 1, I2/J2)',solution:'=IF(J2=0,1,I2/J2)'},
  {id:'x06',level:'Logic',title:'RAG status',sheet:'Projects',cell:'Q2',header:'RAG',fill:[2,9],
    prompt:'In Q2, return a RAG status from SPI: "Green" if Planned % is 0 or SPI ≥ 0.95, "Amber" if SPI ≥ 0.85, otherwise "Red".',
    hint:'Nest IFs: =IF(J2=0,"Green",IF(I2/J2>=0.95,"Green",IF(I2/J2>=0.85,"Amber","Red")))',
    solution:'=IF(J2=0,"Green",IF(I2/J2>=0.95,"Green",IF(I2/J2>=0.85,"Amber","Red")))'},
  {id:'x07',level:'Logic',title:'Budget check',sheet:'Projects',cell:'R2',header:'Budget check',fill:[2,9],
    prompt:'In R2, show "Over budget" when Actual Cost is greater than Budget, otherwise "Within budget".',
    hint:'=IF(H2>G2,"Over budget","Within budget")',solution:'=IF(H2>G2,"Over budget","Within budget")'},
  {id:'x08',level:'Lookups',title:'Manager name lookup',sheet:'Projects',cell:'S2',header:'Manager',fill:[2,9],
    prompt:'In S2, look up the manager\'s name from the Resources sheet (Resources!A2:E11) using the Manager ID in D2. Lock the lookup range with $ so it does not move when filled down.',
    hint:'=VLOOKUP(D2,Resources!$A$2:$E$11,2,FALSE). XLOOKUP and INDEX/MATCH also work.',solution:'=VLOOKUP(D2,Resources!$A$2:$E$11,2,FALSE)'},
  {id:'x09',level:'Totals',title:'Total budget',sheet:'Projects',cell:'G11',label:'Total',
    prompt:'In G11, add up the budgets of all eight projects (G2 to G9).',hint:'=SUM(G2:G9)',solution:'=SUM(G2:G9)'},
  {id:'x10',level:'Totals',title:'Total actual cost',sheet:'Projects',cell:'H11',label:'Total',
    prompt:'In H11, add up the actual cost of all projects.',hint:'=SUM(H2:H9)',solution:'=SUM(H2:H9)'},
  {id:'x11',level:'Totals',title:'Average % complete',sheet:'Projects',cell:'I11',label:'Total',
    prompt:'In I11, calculate the average % complete across the projects.',hint:'=AVERAGE(I2:I9)',solution:'=AVERAGE(I2:I9)'},
  {id:'x12',level:'Conditional totals',title:'Count in-progress projects',sheet:'Projects',cell:'B13',label:'In-progress projects',
    prompt:'In B13, count how many projects have the status "In Progress".',hint:'=COUNTIF(E2:E9,"In Progress")',solution:'=COUNTIF(E2:E9,"In Progress")'},
  {id:'x13',level:'Conditional totals',title:'Budget of high-priority projects',sheet:'Projects',cell:'B14',label:'High-priority budget',
    prompt:'In B14, add up the budget of projects whose priority is "High".',hint:'=SUMIF(F2:F9,"High",G2:G9): the range to test, the criteria, then the range to add.',solution:'=SUMIF(F2:F9,"High",G2:G9)'},
  {id:'x14',level:'Conditional totals',title:'Portfolio CPI',sheet:'Projects',cell:'B15',label:'Portfolio CPI',
    prompt:'In B15, calculate the CPI of the whole portfolio: total EV ÷ total AC. Total EV is the sum of Budget × % Complete for every project, in one formula.',
    hint:'SUMPRODUCT multiplies two ranges row by row and adds the results: =SUMPRODUCT(G2:G9,I2:I9)/SUM(H2:H9)',solution:'=SUMPRODUCT(G2:G9,I2:I9)/SUM(H2:H9)'},
  {id:'x15',level:'Conditional totals',title:'Blocked tasks',sheet:'Projects',cell:'B16',label:'Blocked tasks',
    prompt:'In B16, count the tasks on the Tasks sheet with status "Blocked" (Tasks!G2:G32).',hint:'=COUNTIF(Tasks!G2:G32,"Blocked")',solution:'=COUNTIF(Tasks!G2:G32,"Blocked")'},
  {id:'x16',level:'Conditional totals',title:'Planned hours for one project',sheet:'Projects',cell:'B17',label:'P04 planned hours',
    prompt:'In B17, add up the planned hours (Tasks!E2:E32) of all tasks for project "P04" (Tasks!B2:B32).',
    hint:'=SUMIFS(Tasks!E2:E32,Tasks!B2:B32,"P04"). SUMIFS puts the range to add first.',solution:'=SUMIFS(Tasks!E2:E32,Tasks!B2:B32,"P04")'},
  {id:'x17',level:'Conditional totals',title:'Done tasks in a project',sheet:'Projects',cell:'B18',label:'P01 tasks done',
    prompt:'In B18, count tasks that belong to project "P01" and have status "Done".',hint:'COUNTIFS takes pairs of range and criteria: =COUNTIFS(Tasks!B2:B32,"P01",Tasks!G2:G32,"Done")',
    solution:'=COUNTIFS(Tasks!B2:B32,"P01",Tasks!G2:G32,"Done")'},
  {id:'x18',level:'Lookups',title:'Project with the largest budget',sheet:'Projects',cell:'B19',label:'Largest project',
    prompt:'In B19, return the name of the project with the largest budget, using INDEX and MATCH (no typing the name).',
    hint:'MATCH(MAX(G2:G9),G2:G9,0) finds the row position; INDEX(B2:B9, position) returns the name.',solution:'=INDEX(B2:B9,MATCH(MAX(G2:G9),G2:G9,0))'},
  {id:'x19',level:'Task tracking',title:'Hours variance %',sheet:'Tasks',cell:'I2',header:'Hours variance %',fill:[2,32],
    prompt:'On the Tasks sheet, in I2, calculate the hours variance as a fraction: (Actual Hours − Planned Hours) ÷ Planned Hours. It must work when filled down to row 32.',
    hint:'Put the subtraction in brackets: =(F2-E2)/E2',solution:'=(F2-E2)/E2'},
  {id:'x20',level:'Task tracking',title:'Labour cost per task',sheet:'Tasks',cell:'J2',header:'Labour cost',fill:[2,32],
    prompt:'On the Tasks sheet, in J2, calculate labour cost: Actual Hours × the owner\'s hourly rate, looked up from Resources (rate is column 5 of Resources!A2:E11).',
    hint:'=F2*VLOOKUP(H2,Resources!$A$2:$E$11,5,FALSE). Remember the $ signs.',solution:'=F2*VLOOKUP(H2,Resources!$A$2:$E$11,5,FALSE)'},
];
