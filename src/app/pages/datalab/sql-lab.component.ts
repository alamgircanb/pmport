import {Component,NgZone,OnInit,inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {DatalabNavComponent,LAB_STYLES,loadScript,progress} from './datalab-shared';
import {DATASET,datasetSql} from './datalab-data';
import {SQL_EXERCISES,type SqlExercise} from './sql-lab-data';

type SqlValue=string|number|null|Uint8Array;
interface QueryResult{columns:string[];values:SqlValue[][]}
interface SqlDb{exec(sql:string):QueryResult[];close():void}
interface SqlJs{Database:new()=>SqlDb}
declare global{interface Window{initSqlJs?:(cfg:{locateFile:(f:string)=>string})=>Promise<SqlJs>}}

const SQLJS='https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/';

/** PM DataLab, SQL module: graded SQL exercises on a sample project database, run in the browser with sql.js. */
@Component({
  standalone:true,selector:'app-sql-lab',imports:[FormsModule,RouterLink,DatalabNavComponent],
  template:`
  <section class="page">
    <app-datalab-nav></app-datalab-nav>
    <header class="lab-head"><p class="eyebrow">PM DataLab · SQL</p><h1>SQL for analysts</h1>
      <p class="lead">Practise SQL on a sample project portfolio: projects, tasks, people and risks. Your query runs in your browser, and each answer is checked instantly.</p></header>
    <div class="lab">
      <aside class="ex-list" aria-label="SQL exercises">
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
        <label class="sr-only" for="sql-editor">Your SQL query</label>
        <textarea id="sql-editor" class="editor" [(ngModel)]="query" spellcheck="false" (keydown)="keys($event)" placeholder="SELECT ..."></textarea>
        <div class="toolbar">
          <button type="button" class="button primary" (click)="check()" [disabled]="busy">Check answer</button>
          <button type="button" class="button secondary" (click)="run()" [disabled]="busy">Run</button>
          <button type="button" class="button secondary" (click)="showHint=!showHint">{{showHint?'Hide hint':'Hint'}}</button>
          <button type="button" class="button secondary" (click)="reveal()">Show solution</button>
          <span class="kbd">Ctrl + Enter runs the query</span>
        </div>
        @if(showHint){<div class="hint">{{current.hint}}</div>}
        @if(showSolution){<pre class="code">{{current.solution}}</pre>}
        @if(status){<div class="feedback" [class.ok]="statusKind==='ok'" [class.bad]="statusKind==='bad'" role="status">{{status}}</div>}
        @if(result){
          <p class="kbd">{{result.values.length}} row{{result.values.length===1?'':'s'}}{{result.values.length>200?' (first 200 shown)':''}}</p>
          <div class="result-wrap"><table class="result"><thead><tr>@for(c of result.columns;track $index){<th>{{c}}</th>}</tr></thead>
            <tbody>@for(r of result.values.slice(0,200);track $index){<tr>@for(v of r;track $index){<td [class.n]="isNum(v)">{{show(v)}}</td>}</tr>}</tbody></table></div>
        }
        <div class="nav-row">
          <button type="button" class="button secondary small" (click)="step(-1)" [disabled]="index(current)===0">‹ Previous</button>
          <button type="button" class="button secondary small" (click)="step(1)" [disabled]="index(current)===exercises.length-1">Next ›</button>
        </div>
        <details class="panel" open><summary>Database tables</summary>
          @for(t of tables;track t.name){<p><strong>{{t.name}}</strong> <span class="kbd">({{t.rows}} rows)</span><br><code>{{t.columns}}</code></p>}
          <p class="kbd">The database resets every time you run a query, so you can't break anything. Download the same data as CSV from the <a routerLink="/pm-datalab">PM DataLab overview</a>.</p>
        </details>
      </div>
    </div>
  </section>`,
  styles:[LAB_STYLES+`code{color:#bfe9f3;font-size:.85rem;line-height:1.6}`]
})
export class SqlLabComponent implements OnInit{
  private zone=inject(NgZone);
  readonly exercises=SQL_EXERCISES;
  readonly groups=[...new Set(SQL_EXERCISES.map(e=>e.level))].map(level=>({level,items:SQL_EXERCISES.filter(e=>e.level===level)}));
  readonly tables=Object.entries(DATASET).map(([name,t])=>({name,rows:t.rows.length,columns:t.columns.join(', ')}));
  current:SqlExercise=SQL_EXERCISES[0];
  query='';result?:QueryResult;status='';statusKind:'ok'|'bad'|''='';showHint=false;showSolution=false;busy=false;
  done:string[]=[];
  private sql?:Promise<SqlJs>;
  private readonly setupSql=datasetSql();

  ngOnInit(){this.done=progress.get('sql');const first=SQL_EXERCISES.find(e=>!this.done.includes(e.id));if(first)this.open(first);}
  index(e:SqlExercise){return this.exercises.indexOf(e);}
  open(e:SqlExercise){this.current=e;this.query='';this.result=undefined;this.status='';this.statusKind='';this.showHint=false;this.showSolution=false;}
  step(d:number){const i=this.index(this.current)+d;if(this.exercises[i])this.open(this.exercises[i]);}
  reveal(){this.showSolution=true;if(!this.query.trim())this.query=this.current.solution;}
  keys(e:KeyboardEvent){if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();this.run();}}
  isNum(v:SqlValue){return typeof v==='number';}
  show(v:SqlValue){return v===null?'NULL':v instanceof Uint8Array?'[binary]':typeof v==='number'&&!Number.isInteger(v)?String(Math.round(v*10000)/10000):String(v);}

  private engine():Promise<SqlJs>{
    if(!this.sql)this.sql=loadScript(SQLJS+'sql-wasm.js').then(()=>window.initSqlJs!({locateFile:f=>SQLJS+f}));
    this.sql.catch(()=>this.sql=undefined);
    return this.sql;
  }
  /** Runs SQL on a fresh copy of the sample database and returns the last result set. */
  private async exec(sql:string):Promise<QueryResult>{
    const SQL=await this.engine();const db=new SQL.Database();
    try{
      db.exec(this.setupSql);const res=db.exec(sql);return res.length?res[res.length-1]:{columns:[],values:[]};}
    finally{db.close();}
  }

  async run(){
    if(!this.query.trim()){this.set('Type a query first.','bad');return;}
    this.busy=true;this.set('Running…','');
    try{const r=await this.exec(this.query);this.zone.run(()=>{this.result=r;this.set(r.columns.length?'':'The query ran but returned no rows. (Statements like UPDATE do not return rows.)','');});}
    catch(e){this.zone.run(()=>{this.result=undefined;this.set(this.friendly(e),'bad');});}
    finally{this.zone.run(()=>this.busy=false);}
  }

  async check(){
    if(!this.query.trim()){this.set('Type a query first.','bad');return;}
    this.busy=true;this.set('Checking…','');
    try{
      const [mine,expected]=await Promise.all([this.exec(this.query),this.exec(this.current.solution)]);
      this.zone.run(()=>{this.result=mine;const verdict=this.compare(mine,expected);
        if(verdict===true){this.done=progress.mark('sql',this.current.id);this.set('Correct! Your result matches the expected answer.','ok');}
        else this.set(verdict,'bad');});
    }catch(e){this.zone.run(()=>{this.result=undefined;this.set(this.friendly(e),'bad');});}
    finally{this.zone.run(()=>this.busy=false);}
  }

  private compare(mine:QueryResult,exp:QueryResult):true|string{
    if(!mine.columns.length)return 'Your query did not return any rows.';
    if(mine.columns.length!==exp.columns.length)return `Your result has ${mine.columns.length} column${mine.columns.length===1?'':'s'}; the answer needs ${exp.columns.length}. Check which columns the question asks for.`;
    if(mine.values.length!==exp.values.length)return `Your result has ${mine.values.length} row${mine.values.length===1?'':'s'}; the answer has ${exp.values.length}. Check your filters (WHERE, HAVING, JOIN or LIMIT).`;
    const norm=(v:SqlValue)=>typeof v==='number'?String(Math.round(v*100)/100):v===null?'NULL':String(v);
    const rowKey=(r:SqlValue[])=>r.map(norm).join('\u0001');
    const a=mine.values.map(rowKey).sort(),b=exp.values.map(rowKey).sort();
    if(a.some((k,i)=>k!==b[i]))return 'The number of rows and columns is right, but some values differ. Compare your result with what the question asks (and check the column order).';
    const oc=this.current.orderCol;
    if(oc!==undefined&&mine.values.some((r,i)=>norm(r[oc])!==norm(exp.values[i][oc])))return 'The values are right, but the rows are not in the requested order. Add or fix ORDER BY.';
    return true;
  }
  private friendly(e:unknown){const m=(e as Error)?.message??String(e);return m.startsWith('Could not load')?m:`SQL error: ${m}`;}
  private set(msg:string,kind:'ok'|'bad'|''){this.status=msg;this.statusKind=kind;}
}
