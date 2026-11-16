import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CLAUDE_CATS,CLAUDE_KEYS,CLAUDE_TIPS,ClaudeCat,ClaudeTip} from './claude-tips-data';

/** Tips n Tech → Claude Tips & Tricks (/tips-n-tech/claude-tips).
 * Tips and keys are listed in claude-tips-data.ts.
 * The static intro text is also copied into the pre-built HTML for search engines. */
@Component({
  standalone:true,selector:'app-claude-tips',imports:[RouterLink],
  template:`
  <article class="page tnt">
    <a routerLink="/tips-n-tech" class="back">← Tips n Tech</a>

    <header class="hero">
      <div class="glow g1" aria-hidden="true"></div><div class="glow g2" aria-hidden="true"></div>
      <div class="hero-copy">
        <p class="eyebrow">Tips n Tech · Claude · AI productivity</p>
        <h1>Claude Tips &amp; Tricks</h1>
        <p class="lead">Get more out of Claude in the app, in your browser and in Claude Code: prompt links you can share, shortcuts that save clicks, prompting habits that improve answers, and the commands developers use every day.</p>
        <p class="byline">Md Alamgir Hossain, PMP® · November 15, 2026 · Checked against Claude's help pages and docs</p>
        <div class="stats"><span><b>{{tips.length}}</b> tips</span><span><b>{{cats.length}}</b> categories</span><span><b>1</b> link builder</span></div>
      </div>
      <div class="term" aria-hidden="true">
        <div class="bar"><i></i><i></i><i></i><span>claude</span></div>
        <div class="lines">
          <p class="dim">✻ Welcome to Claude Code</p>
          <p><span class="caret">&gt;</span> <span class="swap"><span class="reel">
            <span>/init</span><span>/plan add a tips page</span><span>&#64;src/app/app.routes.ts</span><span>! npm test</span><span>/btw what is a worktree?</span><span>/rewind</span><span>/code-review</span><span>claude.ai/new?q=…</span><span>/init</span>
          </span></span><span class="cursor">▍</span></p>
          <p class="hint"><span class="swap"><span class="reel">
            <span>writes a starter CLAUDE.md</span><span>plans first, edits after you approve</span><span>points Claude at one file</span><span>runs a shell command</span><span>side question, no context used</span><span>undo conversation, code or both</span><span>checks your changes for bugs</span><span>a link that pre-fills a prompt</span><span>writes a starter CLAUDE.md</span>
          </span></span></p>
          <div class="mode"><kbd>Shift</kbd><kbd>Tab</kbd> <span>⏸ plan mode on</span></div>
        </div>
      </div>
    </header>

    <section class="builder">
      <p class="eyebrow">Try it now</p>
      <h2>Prompt-link builder</h2>
      <p class="muted">Write a prompt once and turn it into links that open Claude with your text already filled in. You still review it and press send.</p>
      <div class="presets" role="group" aria-label="Example prompts">
        @for(p of presets;track p.label){<button type="button" (click)="prompt=p.text">{{p.label}}</button>}
      </div>
      <textarea [value]="prompt" (input)="prompt=$any($event.target).value" rows="3" aria-label="Your prompt" placeholder="Type a prompt…"></textarea>
      <p class="chars">{{prompt.length}} characters</p>
      @if(prompt.trim()){
        <div class="outs">
          @for(o of outputs;track o.label){
            <div class="out">
              <div class="o-head"><span class="o-icon" aria-hidden="true">{{o.icon}}</span><span><b>{{o.label}}</b><small>{{o.note}}</small></span></div>
              <code>{{o.url}}</code>
              <div class="o-actions">
                <button type="button" class="button secondary" (click)="copy(o.url,o.label)">{{copied===o.label?'✓ Copied':'Copy link'}}</button>
                @if(o.open){<a class="button primary" [href]="o.url" target="_blank" rel="noopener noreferrer">Open ↗</a>}
              </div>
            </div>
          }
        </div>
      }
    </section>

    <section>
      <p class="eyebrow">The full list</p>
      <h2>Explore all {{tips.length}} tips</h2>
      <div class="filters">
        <div class="search"><span aria-hidden="true">🔎</span><input type="search" [value]="q" (input)="q=$any($event.target).value" placeholder="Search: plan, memory, shortcut, link…" aria-label="Search tips"></div>
        <div class="chips" role="group" aria-label="Category">
          <button type="button" [class.on]="cat==='all'" [attr.aria-pressed]="cat==='all'" (click)="cat='all'">All <small>{{tips.length}}</small></button>
          @for(c of cats;track c.id){
            <button type="button" [class.on]="cat===c.id" [attr.aria-pressed]="cat===c.id" (click)="cat=c.id" [style.--cc]="c.color">{{c.icon}} {{c.label}} <small>{{countOf(c.id)}}</small></button>
          }
        </div>
      </div>
      <p class="muted count">Showing {{filtered.length}} of {{tips.length}}. Mac users: Ctrl is usually Cmd in the app, but stays Ctrl in Claude Code.</p>
      <div class="cards">
        @for(t of filtered;track t.title){
          <div class="tip" [style.--cc]="catOf(t.cat).color">
            <div class="tip-top"><span class="cat">{{catOf(t.cat).icon}} {{catOf(t.cat).label}}</span><span class="num">#{{numberOf(t)}}</span></div>
            <h3>{{t.title}}</h3>
            <p class="what">{{t.what}}</p>
            <p class="how"><span>How</span>{{t.how}}</p>
            @if(t.code){<div class="code-row"><code>{{t.code}}</code><button type="button" class="copy" (click)="copy(t.code,t.title)" aria-label="Copy">{{copied===t.title?'✓':'⧉'}}</button></div>}
            @if(t.link){<a class="ex" [href]="t.link" target="_blank" rel="noopener noreferrer">Open ↗</a>}
          </div>
        } @empty {
          <p class="muted">No tips match "{{q}}". Try another word or pick All.</p>
        }
      </div>
    </section>

    <section>
      <p class="eyebrow">Muscle memory</p>
      <h2>The 12 Claude Code keys worth learning</h2>
      <div class="keys">
        @for(k of keys;track k.what){
          <div class="key"><span class="caps">@for(x of k.keys;track $index){<kbd>{{x}}</kbd>}</span><b>{{k.what}}</b></div>
        }
      </div>
    </section>

    <section>
      <p class="eyebrow">Workflow</p>
      <h2>A safe Claude Code loop for any change</h2>
      <div class="flow">
        @for(s of flow;track s.n){
          <div class="step"><span class="n">{{s.n}}</span><code>{{s.cmd}}</code><b>{{s.title}}</b><p>{{s.text}}</p></div>
        }
      </div>
    </section>

    <section class="safety">
      <h2>Use Claude wisely</h2>
      <ul>
        <li><b>It drafts, you decide.</b> Check numbers, names, dates and claims before you send or publish anything.</li>
        <li><b>Protect private data.</b> Don't paste passwords, ID numbers or confidential client information.</li>
        <li><b>Keep the safety rails on.</b> Use permission-skipping modes only in a disposable sandbox.</li>
        <li><b>Things change.</b> Claude adds features often. If a shortcut doesn't work, press Ctrl + / in the app or ? in Claude Code to see the current list.</li>
      </ul>
    </section>

    <nav class="more"><a routerLink="/tips-n-tech" class="button secondary">← All Tips n Tech</a><a routerLink="/resources/claude-for-project-management-business-analysis" class="button primary">Claude for PM &amp; BA article →</a></nav>
  </article>`,
  styles:[`
    .tnt{max-width:1180px}.back{display:inline-block;margin-bottom:1rem;color:var(--accent);font-weight:700}
    .tnt section{margin:0 0 3.5rem}.tnt h2{font-size:clamp(1.7rem,3vw,2.5rem)!important;line-height:1.15!important;margin:0 0 1rem!important;letter-spacing:-.02em!important}
    code,kbd,.lines,textarea{font-family:'JetBrains Mono',Consolas,'Courier New',monospace}

    .hero{position:relative;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:center;padding:clamp(1.8rem,5vw,3.8rem);border-radius:28px;border:1px solid var(--line);background:linear-gradient(135deg,#1a1410,#0b2340 55%,#1d1530);margin-bottom:3rem}
    .glow{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none}.g1{width:380px;height:380px;background:#e58b5a;opacity:.33;top:-150px;right:-60px}.g2{width:300px;height:300px;background:#b47cff;opacity:.2;bottom:-150px;left:15%}
    .hero-copy{position:relative;z-index:1}.hero h1{font-size:clamp(2.4rem,5vw,4.4rem);margin:.3rem 0 1rem;background:linear-gradient(90deg,#fff,#ffd9c2 55%,#e58b5a);-webkit-background-clip:text;background-clip:text;color:transparent}
    .byline{font-size:.88rem;color:#a9bfd2}
    .stats{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1rem}.stats span{padding:.5rem .85rem;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);font-size:.9rem}.stats b{color:#f0a57c;font-size:1.1rem;margin-right:.2rem}
    .term{position:relative;z-index:1;border-radius:16px;background:#14110f;border:1px solid #3a2f28;box-shadow:0 30px 60px rgba(0,0,0,.45);overflow:hidden}
    .bar{display:flex;align-items:center;gap:.4rem;padding:.7rem .9rem;background:#1f1a16;border-bottom:1px solid #3a2f28}.bar i{width:11px;height:11px;border-radius:50%;background:#ff5f57}.bar i:nth-child(2){background:#febc2e}.bar i:nth-child(3){background:#28c840}.bar span{margin-left:auto;color:#8c7b6e;font-size:.8rem}
    .lines{padding:1.1rem 1.2rem 1.3rem;font-size:clamp(.8rem,1.5vw,1rem);color:#f3e9e1}.lines p{margin:0 0 .7rem;display:flex;align-items:center;gap:.4rem;white-space:nowrap;overflow:hidden}
    .dim{color:#e58b5a!important;font-weight:700}.caret{color:#e58b5a;font-weight:800}.hint{color:#a8968a;font-size:.88em}
    .cursor{color:#e58b5a;animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}
    .swap{display:inline-block;height:1.6em;line-height:1.6em;overflow:hidden;vertical-align:middle}
    .reel{display:flex;flex-direction:column;animation:reel 20s cubic-bezier(.7,0,.3,1) infinite}.reel>span{height:1.6em;line-height:1.6em;display:block}
    @keyframes reel{0%,10%{transform:translateY(0)}12.5%,22.5%{transform:translateY(-1.6em)}25%,35%{transform:translateY(-3.2em)}37.5%,47.5%{transform:translateY(-4.8em)}50%,60%{transform:translateY(-6.4em)}62.5%,72.5%{transform:translateY(-8em)}75%,85%{transform:translateY(-9.6em)}87.5%,97.5%{transform:translateY(-11.2em)}100%{transform:translateY(-12.8em)}}
    .mode{display:flex;align-items:center;gap:.35rem;margin-top:1rem;padding-top:.8rem;border-top:1px dashed #3a2f28;font-size:.85em;color:#b4a6ff}.mode kbd{font-size:.75rem;min-width:auto;height:1.7rem}

    .builder{padding:clamp(1.4rem,4vw,2.5rem);border-radius:24px;background:linear-gradient(135deg,rgba(229,139,90,.14),rgba(180,124,255,.08));border:1px solid #6b4a3a}
    .presets{display:flex;flex-wrap:wrap;gap:.45rem;margin-bottom:.8rem}
    .presets button{min-height:38px;padding:.4rem .85rem;border-radius:999px;border:1px solid #6b4a3a;background:rgba(0,0,0,.25);color:#ffe2d1;cursor:pointer;font-weight:700;font-size:.86rem}.presets button:hover{border-color:#e58b5a}
    textarea{width:100%;padding:1rem;border-radius:14px;background:#010409;border:1px solid #4a3a30;color:#fff;resize:vertical;font-size:.95rem;line-height:1.5}
    textarea:focus{outline:none;border-color:#e58b5a;box-shadow:0 0 0 3px rgba(229,139,90,.2)}
    .chars{margin:.3rem 0 1rem;font-size:.8rem;color:var(--muted);text-align:right}
    .outs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.9rem}
    .out{display:flex;flex-direction:column;gap:.7rem;padding:1rem;border-radius:16px;background:var(--panel);border:1px solid var(--line)}
    .o-head{display:flex;gap:.7rem;align-items:center}.o-icon{font-size:1.4rem;width:42px;height:42px;display:grid;place-items:center;border-radius:12px;background:rgba(229,139,90,.15);flex:none}
    .o-head b{display:block}.o-head small{display:block;color:var(--muted);font-size:.8rem}
    .out code{font-size:.76rem;padding:.6rem;border-radius:10px;background:#010409;color:#ffc7a6;word-break:break-all;max-height:6.5em;overflow:auto}
    .o-actions{display:flex;gap:.5rem;margin-top:auto}.o-actions .button{flex:1;min-height:40px;padding:.5rem .7rem;font-size:.88rem}

    .search{display:flex;align-items:center;gap:.6rem;padding:.2rem .2rem .2rem 1rem;border-radius:14px;background:#010409;border:1px solid #30506f}
    .search:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(73,204,225,.2)}
    .search input{flex:1;min-width:0;min-height:48px;background:transparent;border:0;color:#fff;outline:none}
    .filters{display:grid;gap:1rem;margin-bottom:.8rem}
    .chips{display:flex;flex-wrap:wrap;gap:.45rem}
    .chips button{--cc:#49cce1;min-height:38px;padding:.4rem .8rem;border-radius:999px;border:1px solid var(--line);background:var(--panel);color:#d6e4f0;cursor:pointer;font-size:.86rem;font-weight:700}
    .chips button small{opacity:.65;margin-left:.2rem}.chips button.on{background:var(--cc);border-color:var(--cc);color:#031220}
    .count{font-size:.88rem}
    .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem}
    .tip{--cc:#49cce1;display:flex;flex-direction:column;gap:.5rem;padding:1.1rem 1.1rem 1.2rem;border-radius:18px;background:var(--panel);border:1px solid var(--line);border-top:4px solid var(--cc);transition:transform .15s,box-shadow .15s}
    .tip:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(0,0,0,.3)}
    .tip-top{display:flex;justify-content:space-between;align-items:center;font-size:.78rem}.cat{color:var(--cc);font-weight:800}.num{color:#6e8aa6;font-weight:800}
    .tip h3{margin:.1rem 0 0;font-size:1.08rem;line-height:1.35}
    .what{margin:0;color:#dbe7f2;line-height:1.55}
    .how{margin:0;color:#b9cbdd;font-size:.9rem;line-height:1.5}.how span{display:inline-block;margin-right:.45rem;padding:.05rem .45rem;border-radius:6px;background:rgba(255,255,255,.08);font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#9db1c7}
    .code-row{display:flex;align-items:stretch;margin-top:auto;border-radius:10px;background:#010409;border:1px solid #23415f}
    .code-row code{flex:1;padding:.55rem .7rem;font-size:.78rem;color:#7fe0ff;word-break:break-all;line-height:1.5}
    .copy{flex:none;min-width:44px;border:0;border-left:1px solid #23415f;background:transparent;color:#c6d6e6;cursor:pointer;border-radius:0 10px 10px 0;font-size:1rem}.copy:hover{color:var(--accent);background:rgba(73,204,225,.08)}
    .ex{font-size:.85rem;font-weight:800;color:var(--accent);text-decoration:none}.ex:hover{text-decoration:underline}

    .keys{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:.7rem}
    .key{display:flex;align-items:center;gap:.9rem;padding:.8rem 1rem;border-radius:14px;background:var(--panel);border:1px solid var(--line)}
    .caps{display:flex;gap:.3rem;flex:none;min-width:96px}.key b{font-size:.92rem}
    kbd{display:inline-grid;place-items:center;min-width:2.1rem;height:2.1rem;padding:0 .5rem;border-radius:8px;background:linear-gradient(#fff6f0,#e8d2c4);color:#2a1a10;font-weight:800;font-size:.85rem;box-shadow:0 3px 0 #a5887a,0 4px 8px rgba(0,0,0,.35)}

    .flow{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.9rem}
    .step{position:relative;padding:1.4rem 1rem 1.1rem;border-radius:18px;background:linear-gradient(160deg,var(--panel-2),var(--panel));border:1px solid var(--line)}
    .step .n{position:absolute;top:-14px;left:1rem;width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#e58b5a,#b47cff);color:#160b05;font-weight:900}
    .step code{display:inline-block;font-size:.78rem;padding:.2rem .5rem;border-radius:6px;background:#010409;color:#ffc7a6;margin-bottom:.5rem}
    .step b{display:block}.step p{margin:.35rem 0 0;color:#b9cbdd;font-size:.88rem;line-height:1.55}

    .safety{padding:1.6rem 1.8rem;border-radius:20px;background:rgba(255,179,107,.07);border:1px solid rgba(255,179,107,.35)}
    .safety h2{font-size:1.5rem!important}.safety ul{margin:0;padding-left:1.2rem}.safety li{color:#d8e4ee;line-height:1.75;margin-bottom:.4rem}
    .more{display:flex;flex-wrap:wrap;gap:.8rem;justify-content:space-between}

    @media(max-width:1000px){.flow{grid-template-columns:repeat(2,minmax(0,1fr))}.outs{grid-template-columns:1fr}}
    @media(max-width:860px){.hero{grid-template-columns:1fr}}
    @media(max-width:520px){.cards,.flow{grid-template-columns:1fr}}
    @media(prefers-reduced-motion:reduce){.reel,.cursor{animation:none}.tip{transition:none}}
  `]
})
export class ClaudeTipsComponent{
  readonly tips=CLAUDE_TIPS;readonly cats=CLAUDE_CATS;readonly keys=CLAUDE_KEYS;
  readonly presets=[
    {label:'📊 Explain EVM',text:'Explain earned value management (PV, EV, AC, CPI, SPI) in plain English with a small worked example.'},
    {label:'🧾 Draft a RACI',text:'Draft a RACI matrix for launching a new website: roles are Sponsor, PM, BA, Developer, QA and Marketing.'},
    {label:'🎤 Interview prep',text:'Ask me 5 behavioural interview questions for a PMO Analyst role, one at a time, and give feedback on each answer.'},
    {label:'📝 Status report',text:'Turn these notes into a one-page project status report with RAG status, risks and next steps: '},
  ];
  readonly flow=[
    {n:1,cmd:'/init',title:'Set the rules',text:'Create CLAUDE.md once so every session knows your project.'},
    {n:2,cmd:'Shift+Tab',title:'Plan first',text:'Switch to plan mode and read the plan before any file changes.'},
    {n:3,cmd:'Approve',title:'Let it build',text:'Approve the plan; press Esc to steer if it drifts.'},
    {n:4,cmd:'/code-review',title:'Review',text:'Check the diff for bugs, then run your tests.'},
    {n:5,cmd:'Esc Esc',title:'Undo or commit',text:'Rewind if it went wrong; commit when it works.'},
  ];
  prompt=this.presets[0].text;
  q='';cat:ClaudeCat|'all'='all';copied:string|null=null;

  get outputs(){
    const e=encodeURIComponent(this.prompt.trim());
    return [
      {icon:'🌐',label:'Claude on the web',note:'Opens claude.ai in the browser',url:`https://claude.ai/new?q=${e}`,open:true},
      {icon:'🖥️',label:'Claude desktop app',note:'Needs the desktop app installed',url:`claude://claude.ai/new?q=${e}`,open:false},
      {icon:'👩‍💻',label:'Claude Code (web)',note:'Starts a coding session',url:`https://claude.ai/code/new?q=${e}`,open:true},
    ];
  }
  get filtered(){
    const q=this.q.trim().toLowerCase();
    return this.tips.filter(t=>(this.cat==='all'||t.cat===this.cat)&&(!q||`${t.title} ${t.what} ${t.how} ${t.code||''}`.toLowerCase().includes(q)));
  }
  countOf(c:ClaudeCat){return this.tips.filter(t=>t.cat===c).length;}
  catOf(c:ClaudeCat){return this.cats.find(x=>x.id===c)!;}
  numberOf(t:ClaudeTip){return this.tips.indexOf(t)+1;}
  async copy(text:string,key:string){
    try{await navigator.clipboard.writeText(text);this.copied=key;setTimeout(()=>{if(this.copied===key)this.copied=null;},1500);}catch{/* clipboard blocked: nothing to do */}
  }
}
