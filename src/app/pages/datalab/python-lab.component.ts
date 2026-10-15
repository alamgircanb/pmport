import {Component,NgZone,OnInit,inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatalabNavComponent,LAB_STYLES,loadScript,progress} from './datalab-shared';
import {DATASET,datasetCsv} from './datalab-data';
import {PY_EXERCISES,PY_GRADER,type PyExercise} from './python-lab-data';

interface Pyodide{
  loadPackage(names:string|string[]):Promise<unknown>;
  runPython(code:string):unknown;
  globals:{set(name:string,value:unknown):void};
  setStdout(opts:{batched:(s:string)=>void}):void;
}
declare global{interface Window{loadPyodide?:(cfg:{indexURL:string})=>Promise<Pyodide>}}
const PYODIDE='https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

const HELPERS=`
import io, json, traceback
import pandas as pd
${PY_GRADER}
def _fresh():
    ns = {"pd": pd}
    for t, text in _csvs.items():
        ns[t] = pd.read_csv(io.StringIO(text))
    return ns
def _show(v):
    if isinstance(v, (pd.DataFrame, pd.Series)):
        return v.to_string(max_rows=40)
    return repr(v)
def _run(user, setup, solution):
    out = {"ok": None, "result": None, "error": None}
    ns = _fresh()
    try:
        if setup: exec(setup, ns)
        exec(user, ns)
    except Exception as e:
        tb = traceback.format_exception_only(type(e), e)
        out["error"] = "".join(tb).strip()
        return json.dumps(out)
    if "result" in ns:
        out["result"] = _show(ns["result"])
    if solution is not None:
        if "result" not in ns:
            out["ok"] = False
        else:
            ref = _fresh()
            if setup: exec(setup, ref)
            exec(solution, ref)
            out["ok"] = bool(_same(ns["result"], ref["result"]))
    return json.dumps(out)
`;

/** DataLab, Python module: pandas exercises that run in the browser with Pyodide. */
@Component({
  standalone:true,selector:'app-python-lab',imports:[FormsModule,DatalabNavComponent],
  template:`
  <section class="page">
    <app-datalab-nav></app-datalab-nav>
    <header class="lab-head"><p class="eyebrow">DataLab · Python</p><h1>Python for data</h1>
      <p class="lead">Practise pandas on project data, right in your browser. The DataFrames <code>projects</code>, <code>tasks</code>, <code>resources</code> and <code>risks</code> are already loaded. Store your answer in a variable called <code>result</code>.</p></header>
    @if(state!=='ready'){
      <div class="card start">
        @if(state==='idle'){<p>Python runs entirely in your browser. The first start downloads about 15 MB (Python and pandas), then it is fast.</p>
          <button type="button" class="button primary" (click)="start()">Start Python</button>}
        @if(state==='loading'){<p role="status">{{loadingText}}</p><div class="bar"><span></span></div>}
        @if(state==='failed'){<p class="feedback bad">{{loadingText}}</p><button type="button" class="button primary" (click)="start()">Try again</button>}
      </div>
    }
    <div class="lab">
      <aside class="ex-list" aria-label="Python exercises">
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
        @if(current.setup){<p class="kbd">Already loaded for this exercise:</p><pre class="code">{{current.setup}}</pre>}
        <label class="sr-only" for="py-editor">Your Python code</label>
        <textarea id="py-editor" class="editor" [(ngModel)]="code" spellcheck="false" (keydown)="keys($event)" placeholder="result = ..."></textarea>
        <div class="toolbar">
          <button type="button" class="button primary" (click)="exec(true)" [disabled]="state!=='ready'||busy">Check answer</button>
          <button type="button" class="button secondary" (click)="exec(false)" [disabled]="state!=='ready'||busy">Run</button>
          <button type="button" class="button secondary" (click)="showHint=!showHint">{{showHint?'Hide hint':'Hint'}}</button>
          <button type="button" class="button secondary" (click)="reveal()">Show solution</button>
          <span class="kbd">Ctrl + Enter runs the code</span>
        </div>
        @if(showHint){<div class="hint">{{current.hint}}</div>}
        @if(showSolution){<pre class="code">{{current.solution}}</pre>}
        @if(status){<div class="feedback" [class.ok]="kind==='ok'" [class.bad]="kind==='bad'" role="status">{{status}}</div>}
        @if(output){<p class="kbd">Printed output</p><pre class="code">{{output}}</pre>}
        @if(resultText!==null){<p class="kbd">result</p><pre class="code">{{resultText}}</pre>}
        <div class="nav-row">
          <button type="button" class="button secondary small" (click)="step(-1)" [disabled]="index(current)===0">‹ Previous</button>
          <button type="button" class="button secondary small" (click)="step(1)" [disabled]="index(current)===exercises.length-1">Next ›</button>
        </div>
        <details class="panel"><summary>DataFrame columns</summary>
          @for(t of tables;track t.name){<p><strong>{{t.name}}</strong><br><code>{{t.columns}}</code></p>}
          <p class="kbd">Every run starts from fresh copies of the data, so changes you make do not carry over.</p>
        </details>
      </div>
    </div>
  </section>`,
  styles:[LAB_STYLES+`
    code{color:#bfe9f3}
    .start{margin-bottom:1.25rem;display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between}
    .start p{margin:0;color:#c9dcec}
    .bar{width:100%;height:6px;border-radius:99px;background:#0c2b49;overflow:hidden}
    .bar span{display:block;width:40%;height:100%;background:var(--accent);animation:slide 1.4s ease-in-out infinite}
    @keyframes slide{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}
  `]
})
export class PythonLabComponent implements OnInit{
  private zone=inject(NgZone);
  readonly exercises=PY_EXERCISES;
  readonly groups=[...new Set(PY_EXERCISES.map(e=>e.level))].map(level=>({level,items:PY_EXERCISES.filter(e=>e.level===level)}));
  readonly tables=Object.entries(DATASET).map(([name,t])=>({name,columns:t.columns.join(', ')}));
  current:PyExercise=PY_EXERCISES[0];
  code='';status='';kind:'ok'|'bad'|''='';output='';resultText:string|null=null;showHint=false;showSolution=false;busy=false;done:string[]=[];
  state:'idle'|'loading'|'ready'|'failed'='idle';loadingText='';
  private py?:Pyodide;

  ngOnInit(){this.done=progress.get('python');const first=PY_EXERCISES.find(e=>!this.done.includes(e.id));if(first)this.open(first);}
  index(e:PyExercise){return this.exercises.indexOf(e);}
  open(e:PyExercise){this.current=e;this.code='';this.status='';this.kind='';this.output='';this.resultText=null;this.showHint=false;this.showSolution=false;}
  step(d:number){const i=this.index(this.current)+d;if(this.exercises[i])this.open(this.exercises[i]);}
  reveal(){this.showSolution=true;if(!this.code.trim())this.code=this.current.solution;}
  keys(e:KeyboardEvent){
    if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();if(this.state==='ready')this.exec(false);return;}
    if(e.key==='Tab'){e.preventDefault();const t=e.target as HTMLTextAreaElement;const s=t.selectionStart;this.code=this.code.slice(0,s)+'    '+this.code.slice(t.selectionEnd);
      setTimeout(()=>{t.selectionStart=t.selectionEnd=s+4;});}
  }

  async start(){
    this.state='loading';this.loadingText='Downloading Python…';
    try{
      await loadScript(PYODIDE+'pyodide.js');
      const py=await window.loadPyodide!({indexURL:PYODIDE});
      this.zone.run(()=>this.loadingText='Loading pandas…');
      await py.loadPackage('pandas');
      const csvs=Object.fromEntries(Object.keys(DATASET).map(k=>[k,datasetCsv(k)]));
      py.globals.set('_csvs_json',JSON.stringify(csvs));
      py.runPython('import json\n_csvs = json.loads(_csvs_json)\n'+HELPERS);
      py.setStdout({batched:s=>{this.output+=s+'\n';}});
      this.py=py;this.zone.run(()=>this.state='ready');
    }catch(e){this.zone.run(()=>{this.state='failed';this.loadingText=`Python could not start: ${(e as Error).message}`;});}
  }

  exec(check:boolean){
    if(!this.py)return;
    if(!this.code.trim()){this.set('Write some code first.','bad');return;}
    this.busy=true;this.output='';this.resultText=null;this.set(check?'Checking…':'Running…','');
    // Let the "Running…" message paint before Python blocks the page.
    setTimeout(()=>{
      try{
        const py=this.py!;
        py.globals.set('_user',this.code);py.globals.set('_setup',this.current.setup??'');py.globals.set('_solution',check?this.current.solution:null);
        const out=JSON.parse(String(py.runPython('_run(_user, _setup, _solution)'))) as {ok:boolean|null;result:string|null;error:string|null};
        this.zone.run(()=>{
          this.resultText=out.result;
          if(out.error){this.set(out.error,'bad');}
          else if(!check){this.set(out.result===null?'Your code ran. Set a variable called result to see your answer here.':'','');}
          else if(out.result===null){this.set('Your code ran, but it did not set a variable called result.','bad');}
          else if(out.ok){this.done=progress.mark('python',this.current.id);this.set('Correct! Your result matches the expected answer.','ok');}
          else this.set('Not quite: your result is different from the expected answer. Compare it with what the question asks, or open the hint.','bad');
          this.busy=false;
        });
      }catch(e){this.zone.run(()=>{this.set(String((e as Error).message??e),'bad');this.busy=false;});}
    },30);
  }
  private set(m:string,k:'ok'|'bad'|''){this.status=m;this.kind=k;}
}
