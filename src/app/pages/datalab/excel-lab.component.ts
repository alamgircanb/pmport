import {Component,OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatalabNavComponent,LAB_STYLES,progress} from './datalab-shared';
import {colName,formatValue,isErr,runFormula,sameValue,usesReferences,type Scalar,type Sheet} from './excel-engine';
import {buildSheets,EXCEL_EXERCISES,type ExcelExercise} from './excel-lab-data';

type SheetName='Projects'|'Tasks'|'Resources';

/** DataLab, Excel module: type a formula, it is calculated on a practice sheet and checked (including fill-down). */
@Component({
  standalone:true,selector:'app-excel-lab',imports:[FormsModule,DatalabNavComponent],
  template:`
  <section class="page">
    <app-datalab-nav></app-datalab-nav>
    <header class="lab-head"><p class="eyebrow">DataLab · Excel</p><h1>Excel for project managers</h1>
      <p class="lead">Write the formulas a PMO analyst uses every week. Type a formula, and it is calculated on the practice sheet and checked, including whether it still works when you fill it down.</p></header>
    <div class="lab">
      <aside class="ex-list" aria-label="Excel exercises">
        <p class="progress-line">{{done.length}} of {{exercises.length}} completed</p>
        @for(g of groups;track g.level){
          <h3>{{g.level}}</h3>
          @for(e of g.items;track e.id){<button type="button" [class.active]="e.id===current.id" (click)="open(e)"><span class="tick">{{done.includes(e.id)?'✓':''}}</span><span class="num">{{index(e)+1}}.</span><span>{{e.title}}</span></button>}
        }
      </aside>
      <div class="task">
        <p class="eyebrow">{{current.level}} · Exercise {{index(current)+1}} of {{exercises.length}}</p>
        <h2>{{current.title}}</h2>
        <p class="prompt">{{current.prompt}}</p>
        <div class="formula-bar">
          <span class="cell-name" title="Target cell">{{current.sheet==='Projects'?'':current.sheet+'!'}}{{current.cell}}</span>
          <span class="fx">fx</span>
          <label class="sr-only" for="formula">Formula for {{current.cell}}</label>
          <input id="formula" [(ngModel)]="formula" spellcheck="false" autocomplete="off" placeholder="=" (keydown.enter)="check()">
        </div>
        <div class="toolbar">
          <button type="button" class="button primary" (click)="check()">Check formula</button>
          <button type="button" class="button secondary" (click)="showHint=!showHint">{{showHint?'Hide hint':'Hint'}}</button>
          <button type="button" class="button secondary" (click)="reveal()">Show solution</button>
          <span class="kbd">Press Enter to check</span>
        </div>
        @if(showHint){<div class="hint">{{current.hint}}</div>}
        @if(showSolution){<pre class="code">{{current.solution}}</pre>}
        @if(status){<div class="feedback" [class.ok]="kind==='ok'" [class.bad]="kind==='bad'" role="status">{{status}}</div>}
        <div class="sheet-tabs" role="tablist" aria-label="Sheets">
          @for(s of sheetNames;track s){<button type="button" role="tab" [attr.aria-selected]="view===s" [class.active]="view===s" (click)="view=s">{{s}}</button>}
        </div>
        <div class="grid-wrap" tabindex="0" [attr.aria-label]="view+' sheet'">
          <table class="xl">
            <thead><tr><th class="corner"></th>@for(c of cols(view);track c){<th>{{letter(c)}}</th>}</tr></thead>
            <tbody>@for(r of rows(view);track r){<tr><th>{{r+1}}</th>@for(c of cols(view);track c){
              <td [class.target]="isTarget(r,c)" [class.filled]="isFilled(r,c)" [class.head]="r===0" [class.n]="isNum(r,c)" [class.err]="isError(r,c)">{{cell(r,c)}}</td>}</tr>}</tbody>
          </table>
        </div>
        <div class="nav-row">
          <button type="button" class="button secondary small" (click)="step(-1)" [disabled]="index(current)===0">‹ Previous</button>
          <button type="button" class="button secondary small" (click)="step(1)" [disabled]="index(current)===exercises.length-1">Next ›</button>
        </div>
        <details class="panel"><summary>Functions you can use</summary>
          <p class="kbd">SUM, AVERAGE, MIN, MAX, MEDIAN, COUNT, COUNTA, COUNTBLANK, COUNTIF(S), SUMIF(S), AVERAGEIF(S), SUMPRODUCT, IF, IFS, IFERROR, AND, OR, NOT, ROUND, ROUNDUP, ROUNDDOWN, ABS, VLOOKUP, HLOOKUP, XLOOKUP, INDEX, MATCH, LEFT, RIGHT, LEN, UPPER, LOWER, CONCAT. Use $ to lock a row (for example $A$2) and Sheet!A1 to refer to another sheet.</p>
          <p class="kbd">Want to practise in real Excel? Download the practice workbook from the DataLab overview page.</p>
        </details>
      </div>
    </div>
  </section>`,
  styles:[LAB_STYLES+`
    .formula-bar{display:flex;align-items:stretch;border:1px solid #315370;border-radius:10px;overflow:hidden;background:#06162a}
    .cell-name{min-width:5.5rem;padding:.7rem .8rem;background:#0e2d4e;color:#cfe3f3;font-weight:800;font-family:Consolas,monospace;border-right:1px solid #315370}
    .fx{padding:.7rem .6rem;color:var(--accent);font-style:italic;font-weight:800;border-right:1px solid #315370}
    .formula-bar input{flex:1;min-width:0;background:transparent;border:0;color:#e8f4ff;padding:.7rem .8rem;font-family:Consolas,'Liberation Mono',monospace;font-size:.95rem}
    .formula-bar input:focus{outline:none}.formula-bar:focus-within{outline:2px solid var(--accent)}
    .sheet-tabs{display:flex;gap:.3rem;margin-top:1rem}
    .sheet-tabs button{background:#0b2340;color:#c9d9e7;border:1px solid var(--line);border-bottom:0;border-radius:8px 8px 0 0;padding:.4rem .9rem;cursor:pointer;font-weight:700;font-size:.85rem}
    .sheet-tabs button.active{background:#f3f7fb;color:#0b2340}
    .grid-wrap{overflow:auto;max-height:520px;border:1px solid #9fb3c8;background:#fff}
    table.xl{border-collapse:collapse;font-size:.8rem;color:#1d2a36;font-family:Arial,sans-serif}
    table.xl th{background:#eef2f6;color:#5a6b7c;font-weight:600;border:1px solid #d3dbe3;padding:.2rem .4rem;position:sticky;top:0;z-index:1}
    table.xl tbody th{position:sticky;left:0;z-index:1;top:auto;min-width:2.2rem;text-align:center}
    table.xl th.corner{left:0;z-index:2}
    table.xl td{border:1px solid #e1e6eb;padding:.22rem .45rem;white-space:nowrap;max-width:220px;overflow:hidden;text-overflow:ellipsis}
    table.xl td.head{font-weight:700;background:#f7f9fb}
    table.xl td.n{text-align:right;font-variant-numeric:tabular-nums}
    table.xl td.target{outline:2px solid #1a7f37;outline-offset:-2px;background:#e9f7ee}
    table.xl td.filled{background:#e9f7ee}
    table.xl td.err{color:#b42318;font-weight:700}
  `]
})
export class ExcelLabComponent implements OnInit{
  readonly exercises=EXCEL_EXERCISES;
  readonly groups=[...new Set(EXCEL_EXERCISES.map(e=>e.level))].map(level=>({level,items:EXCEL_EXERCISES.filter(e=>e.level===level)}));
  readonly sheetNames:SheetName[]=['Projects','Tasks','Resources'];
  private base=buildSheets();
  sheets:Record<string,Sheet>=this.base;
  current:ExcelExercise=EXCEL_EXERCISES[0];
  view:SheetName='Projects';
  formula='';status='';kind:'ok'|'bad'|''='';showHint=false;showSolution=false;done:string[]=[];
  private filled=new Set<string>();

  ngOnInit(){this.done=progress.get('excel');const first=EXCEL_EXERCISES.find(e=>!this.done.includes(e.id));this.open(first??EXCEL_EXERCISES[0]);}
  index(e:ExcelExercise){return this.exercises.indexOf(e);}
  step(d:number){const i=this.index(this.current)+d;if(this.exercises[i])this.open(this.exercises[i]);}

  open(e:ExcelExercise){
    this.current=e;this.formula='';this.status='';this.kind='';this.showHint=false;this.showSolution=false;this.view=e.sheet;this.filled.clear();
    // Fresh copy of the practice sheets with this exercise's header or label filled in.
    this.sheets=Object.fromEntries(Object.entries(this.base).map(([k,s])=>[k,{name:s.name,cells:s.cells.map(r=>[...r])}]));
    const {row,col}=this.addr(e.cell);const cells=this.sheets[e.sheet].cells;
    if(e.header){cells[0][col]=e.header;}
    if(e.label){while(cells.length<=row)cells.push([]);cells[row][0]=e.label;}
  }
  reveal(){this.showSolution=true;if(!this.formula.trim())this.formula=this.current.solution;}

  check(){
    const f=this.formula.trim();const e=this.current;
    if(!f){this.set('Type a formula first, starting with =.','bad');return;}
    if(!f.startsWith('=')){this.set('Formulas start with "=". For example: =SUM(G2:G9)','bad');return;}
    if(!usesReferences(f)){this.set('Use cell references (like G2) instead of typing numbers, so the formula updates when the data changes.','bad');return;}
    const [from,to]=e.fill??[this.addr(e.cell).row+1,this.addr(e.cell).row+1];
    const ctx=(off:number)=>({sheets:this.base,sheet:e.sheet,rowOffset:off});
    const {row,col}=this.addr(e.cell);const cells=this.sheets[e.sheet].cells;this.filled.clear();
    let problem='';
    for(let off=0;off<=to-from;off++){
      const mine=runFormula(f,ctx(off));
      if(mine.error){this.set(mine.error,'bad');return;}
      const exp=runFormula(e.solution,ctx(off)).value;
      while(cells.length<=row+off)cells.push([]);
      cells[row+off][col]=mine.value as Scalar;this.filled.add(`${row+off}:${col}`);
      if(!problem&&!sameValue(mine.value,exp)){
        problem=off===0?`Not quite: your formula gives ${this.fmt(mine.value)}, but the answer is ${this.fmt(exp)}.`
          :`Your formula works in row ${from}, but when filled down to row ${from+off} it gives ${this.fmt(mine.value)} instead of ${this.fmt(exp)}.${/LOOKUP|MATCH|INDEX/i.test(f)&&!f.includes('$')?' Lock the lookup range with $ signs (for example Resources!$A$2:$E$11).':' Check which references should move and which should be locked with $.'}`;
      }
    }
    if(problem){this.set(problem,'bad');return;}
    this.done=progress.mark('excel',e.id);
    this.set(e.fill?`Correct! Your formula works on every row from ${from} to ${to}.`:'Correct!','ok');
  }

  // Grid helpers
  private addr(a:string){const m=/^([A-Z]+)(\d+)$/.exec(a)!;return {col:m[1].split('').reduce((n,c)=>n*26+c.charCodeAt(0)-64,0)-1,row:+m[2]-1};}
  cols(s:SheetName){const w=Math.max(...this.sheets[s].cells.map(r=>r.length));const min=s==='Resources'?5:s==='Tasks'?10:19;return [...Array(Math.max(w,min)).keys()];}
  rows(s:SheetName){const h=this.sheets[s].cells.length;const min=s==='Projects'?19:h;return [...Array(Math.max(h,min)).keys()];}
  letter(c:number){return colName(c);}
  cell(r:number,c:number){const v=this.sheets[this.view].cells[r]?.[c];if(v===undefined||v==='')return '';
    if(typeof v==='number'&&r>0){const header=String(this.sheets[this.view].cells[0][c]??'');if(/%/.test(header)&&v<=1.5&&!this.filled.has(`${r}:${c}`))return `${Math.round(v*100)}%`;}
    return this.fmt(v);}
  isNum(r:number,c:number){return typeof this.sheets[this.view].cells[r]?.[c]==='number';}
  isError(r:number,c:number){return isErr(this.sheets[this.view].cells[r]?.[c]);}
  isTarget(r:number,c:number){const a=this.addr(this.current.cell);return this.view===this.current.sheet&&a.row===r&&a.col===c;}
  isFilled(r:number,c:number){return this.view===this.current.sheet&&this.filled.has(`${r}:${c}`);}
  private fmt(v:Scalar|undefined){return formatValue(v);}
  private set(m:string,k:'ok'|'bad'|''){this.status=m;this.kind=k;}
}
