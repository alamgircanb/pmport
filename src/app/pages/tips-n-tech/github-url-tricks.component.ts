import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {GITHUB_SHORTCUTS,GITHUB_TIPS,REPO_TOOLS,TIP_CATS,Tip,TipCat} from './tips-data';

/** Tips n Tech → GitHub URL Tricks (/tips-n-tech/github-url-tricks).
 * Tips, shortcuts and the "transform a repo" tools are listed in tips-data.ts.
 * The static intro text is also copied into the pre-built HTML for search engines. */
@Component({
  standalone:true,selector:'app-github-url-tricks',imports:[RouterLink],
  template:`
  <article class="page tnt">
    <a routerLink="/tips-n-tech" class="back">← Tips n Tech</a>

    <header class="hero">
      <div class="glow g1" aria-hidden="true"></div><div class="glow g2" aria-hidden="true"></div>
      <div class="hero-copy">
        <p class="eyebrow">Tips n Tech · GitHub · Developer productivity</p>
        <h1>GitHub URL Tricks</h1>
        <p class="lead">Change one word in a GitHub address and the same repository opens as a code editor, an architecture diagram, an AI-written wiki or a text digest you can paste into Claude or ChatGPT. Here are 140 tricks and 14 keyboard shortcuts, with no extensions and nothing to install.</p>
        <p class="byline">Md Alamgir Hossain, PMP® · November 15, 2026 · Bookmark it and come back</p>
        <div class="stats"><span><b>{{tips.length}}</b> URL tricks</span><span><b>{{shortcuts.length}}</b> shortcuts</span><span><b>0</b> installs</span></div>
      </div>
      <div class="browser" aria-hidden="true">
        <div class="bar"><i></i><i></i><i></i></div>
        <div class="url"><span class="lock">🔒</span><span class="proto">https://</span><span class="swap"><span class="reel">
          <span>github.com</span><span>github1s.com</span><span>gitdiagram.com</span><span>githubbox.com</span><span>gitingest.com</span><span>deepwiki.com</span><span>github.dev</span><span>uithub.com</span><span>github.com</span>
        </span></span><span class="path">/microsoft/vscode</span></div>
        <div class="screen"><span class="swap big"><span class="reel">
          <span>📁 The repo you know</span><span>🧑‍💻 VS Code in the browser</span><span>🗺️ Architecture diagram</span><span>📦 Runs in CodeSandbox</span><span>🤖 Text digest for AI</span><span>📚 AI wiki you can question</span><span>✏️ Edit and commit online</span><span>📄 One page for LLMs</span><span>📁 The repo you know</span>
        </span></span></div>
      </div>
    </header>

    <section>
      <p class="eyebrow">The secret</p>
      <h2>Five patterns behind every trick</h2>
      <div class="patterns">
        @for(p of patterns;track p.name){
          <div class="pattern"><span class="p-icon" aria-hidden="true">{{p.icon}}</span><h3>{{p.name}}</h3><p>{{p.what}}</p><code>{{p.from}}</code><span class="arrow" aria-hidden="true">↓</span><code class="to">{{p.to}}</code></div>
        }
      </div>
    </section>

    <section class="transform">
      <p class="eyebrow">Try it now</p>
      <h2>Transform any repository</h2>
      <p class="muted">Paste a GitHub address (or just owner/repo) and open it in {{tools.length}} different tools.</p>
      <div class="t-input">
        <span aria-hidden="true">🔗</span>
        <input type="text" [value]="repoInput" (input)="repoInput=$any($event.target).value" placeholder="https://github.com/owner/repo" aria-label="GitHub repository address" spellcheck="false">
      </div>
      @if(repo;as rp){
        <p class="found">Repository: <b>{{rp.owner}}/{{rp.name}}</b></p>
        <div class="tools">
          @for(t of tools;track t.name){
            <div class="tool">
              <a [href]="t.url(rp.owner,rp.name)" target="_blank" rel="noopener noreferrer"><span class="t-icon" aria-hidden="true">{{t.icon}}</span><span><b>{{t.name}}</b><small>{{t.what}}</small></span><span class="out" aria-hidden="true">↗</span></a>
              <button type="button" class="copy" (click)="copy(t.url(rp.owner,rp.name),'t-'+t.name)" [attr.aria-label]="'Copy '+t.name+' link'">{{copied==='t-'+t.name?'✓':'⧉'}}</button>
            </div>
          }
        </div>
      } @else {
        <p class="warn">That doesn't look like a GitHub repository yet. Try <code>microsoft/vscode</code>.</p>
      }
    </section>

    <section>
      <p class="eyebrow">The full list</p>
      <h2>Explore all {{tips.length}} tricks</h2>
      <div class="filters">
        <div class="search"><span aria-hidden="true">🔎</span><input type="search" [value]="q" (input)="q=$any($event.target).value" placeholder="Search: diagram, PDF, patch, stars…" aria-label="Search tips"></div>
        <div class="chips" role="group" aria-label="Category">
          <button type="button" [class.on]="cat==='all'" [attr.aria-pressed]="cat==='all'" (click)="cat='all'">All <small>{{tips.length}}</small></button>
          @for(c of cats;track c.id){
            <button type="button" [class.on]="cat===c.id" [attr.aria-pressed]="cat===c.id" (click)="cat=c.id" [style.--cc]="c.color">{{c.icon}} {{c.label}} <small>{{countOf(c.id)}}</small></button>
          }
        </div>
      </div>
      <p class="muted count">Showing {{filtered.length}} of {{tips.length}}. <b>OWNER</b>, <b>REPO</b>, <b>USER</b>, <b>SHA</b> and <b>FILE</b> are placeholders; "..." means the repo address.</p>
      <div class="cards">
        @for(t of filtered;track t.pattern){
          <div class="tip" [style.--cc]="catOf(t.cat).color">
            <div class="tip-top"><span class="cat">{{catOf(t.cat).icon}} {{catOf(t.cat).label}}</span><span class="num">#{{numberOf(t)}}</span></div>
            <div class="code-row"><code>{{t.pattern}}</code><button type="button" class="copy" (click)="copy(t.pattern,t.pattern)" aria-label="Copy pattern">{{copied===t.pattern?'✓':'⧉'}}</button></div>
            <p class="what">{{t.what}}</p>
            <p class="how"><span>How</span>{{t.how}}</p>
            @if(t.example){
              @if(linkable(t.example)){<a class="ex" [href]="'https://'+t.example" target="_blank" rel="noopener noreferrer">Try: {{t.example}} ↗</a>}
              @else {<p class="ex plain">e.g. {{t.example}}</p>}
            }
          </div>
        } @empty {
          <p class="muted">No tips match "{{q}}". Try another word or pick All.</p>
        }
      </div>
    </section>

    <section>
      <p class="eyebrow">Even faster</p>
      <h2>Keyboard shortcuts on github.com</h2>
      <div class="keys">
        @for(s of shortcuts;track s.what){
          <div class="key"><span class="caps">@for(k of s.keys;track $index){<kbd>{{k}}</kbd>}</span><span><b>{{s.what}}</b><small>{{s.where}}</small></span></div>
        }
      </div>
    </section>

    <section class="flow-sec">
      <p class="eyebrow">Workflow</p>
      <h2>Understand any codebase in 10 minutes</h2>
      <div class="flow">
        <div class="step"><span class="n">1</span><b>GitDiagram</b><p>See the big picture: which parts exist and how they connect.</p></div>
        <span class="link" aria-hidden="true">→</span>
        <div class="step"><span class="n">2</span><b>DeepWiki</b><p>Read the plain-English explanation and ask follow-up questions.</p></div>
        <span class="link" aria-hidden="true">→</span>
        <div class="step"><span class="n">3</span><b>Gitingest</b><p>Paste the digest into Claude or ChatGPT with your own question.</p></div>
        <span class="link" aria-hidden="true">→</span>
        <div class="step"><span class="n">4</span><b>github.dev</b><p>Press the full-stop key and make your change right in the browser.</p></div>
      </div>
    </section>

    <section class="safety">
      <h2>Use them safely</h2>
      <ul>
        <li><b>Keep private code private.</b> Don't paste a private or work repository into a third-party AI tool unless your organisation allows it. The code is sent to their servers.</li>
        <li><b>Check the spelling.</b> Lookalike domains exist. Bookmark the tools you use.</li>
        <li><b>Expect change.</b> Community tools come and go. GitHub's own tricks (files, commits, issues, search, shortcuts) are the most reliable.</li>
      </ul>
    </section>

    <nav class="more"><a routerLink="/tips-n-tech" class="button secondary">← All Tips n Tech</a><a routerLink="/pm-learninglink" class="button primary">Free courses &amp; channels →</a></nav>
  </article>`,
  styles:[`
    .tnt{max-width:1180px}.back{display:inline-block;margin-bottom:1rem;color:var(--accent);font-weight:700}
    .tnt section{margin:0 0 3.5rem}.tnt h2{font-size:clamp(1.7rem,3vw,2.5rem)!important;line-height:1.15!important;margin:0 0 1rem!important;letter-spacing:-.02em!important}
    code,kbd,.url,.swap{font-family:'JetBrains Mono',Consolas,'Courier New',monospace}

    .hero{position:relative;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:center;padding:clamp(1.8rem,5vw,3.8rem);border-radius:28px;border:1px solid var(--line);background:linear-gradient(135deg,#0d1117,#0b2340 55%,#161b3d);margin-bottom:3rem}
    .glow{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none}.g1{width:380px;height:380px;background:#6f8fff;opacity:.4;top:-140px;right:-60px}.g2{width:300px;height:300px;background:#3ddc97;opacity:.18;bottom:-150px;left:20%}
    .hero-copy{position:relative;z-index:1}.hero h1{font-size:clamp(2.4rem,5vw,4.4rem);margin:.3rem 0 1rem;background:linear-gradient(90deg,#fff,#bfe9ff 60%,#a9b8ff);-webkit-background-clip:text;background-clip:text;color:transparent}
    .byline{font-size:.88rem;color:#a9bfd2}
    .stats{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1rem}.stats span{padding:.5rem .85rem;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);font-size:.9rem}.stats b{color:var(--accent);font-size:1.1rem;margin-right:.2rem}
    .browser{position:relative;z-index:1;border-radius:16px;background:#0d1117;border:1px solid #30363d;box-shadow:0 30px 60px rgba(0,0,0,.45);overflow:hidden}
    .bar{display:flex;gap:.4rem;padding:.7rem .9rem;background:#161b22;border-bottom:1px solid #30363d}.bar i{width:11px;height:11px;border-radius:50%;background:#ff5f57}.bar i:nth-child(2){background:#febc2e}.bar i:nth-child(3){background:#28c840}
    .url{display:flex;align-items:center;gap:.15rem;margin:.9rem;padding:.6rem .8rem;border-radius:10px;background:#010409;border:1px solid #30363d;font-size:clamp(.72rem,1.4vw,.92rem);white-space:nowrap;overflow:hidden}
    .lock{margin-right:.35rem;font-size:.8em}.proto{color:#6e7681}.path{color:#c9d1d9}
    .swap{display:inline-block;height:1.6em;line-height:1.6em;overflow:hidden;vertical-align:middle}
    .url .swap{min-width:14.5ch;color:#49cce1;font-weight:700}
    .reel{display:flex;flex-direction:column;animation:reel 20s cubic-bezier(.7,0,.3,1) infinite}.reel>span{height:1.6em;line-height:1.6em;display:block}
    .screen{display:grid;place-items:center;min-height:170px;margin:0 .9rem .9rem;border-radius:12px;background:radial-gradient(circle at 30% 20%,rgba(111,143,255,.25),transparent 60%),linear-gradient(135deg,#0b2340,#071a31);border:1px dashed #30506f}
    .swap.big{font-family:Manrope,Inter,sans-serif;font-size:clamp(1rem,2.2vw,1.45rem);font-weight:800;text-align:center}
    @keyframes reel{0%,10%{transform:translateY(0)}12.5%,22.5%{transform:translateY(-1.6em)}25%,35%{transform:translateY(-3.2em)}37.5%,47.5%{transform:translateY(-4.8em)}50%,60%{transform:translateY(-6.4em)}62.5%,72.5%{transform:translateY(-8em)}75%,85%{transform:translateY(-9.6em)}87.5%,97.5%{transform:translateY(-11.2em)}100%{transform:translateY(-12.8em)}}

    .patterns{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1rem}
    .pattern{display:flex;flex-direction:column;gap:.35rem;padding:1.2rem;border-radius:18px;background:var(--panel);border:1px solid var(--line)}
    .p-icon{font-size:1.8rem}.pattern h3{margin:.2rem 0 0;font-size:1.05rem}.pattern p{margin:0 0 .4rem;color:#b9cbdd;font-size:.9rem;line-height:1.5;flex:1}
    .pattern code{font-size:.74rem;padding:.4rem .5rem;border-radius:8px;background:#010409;color:#9db1c7;word-break:break-all}.pattern code.to{color:#49cce1;border:1px solid rgba(73,204,225,.35)}.arrow{text-align:center;color:#6f8fff}

    .transform{padding:clamp(1.4rem,4vw,2.5rem);border-radius:24px;background:linear-gradient(135deg,rgba(111,143,255,.14),rgba(73,204,225,.08));border:1px solid #2b4f8a}
    .t-input,.search{display:flex;align-items:center;gap:.6rem;padding:.2rem .2rem .2rem 1rem;border-radius:14px;background:#010409;border:1px solid #30506f}
    .t-input:focus-within,.search:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(73,204,225,.2)}
    .t-input input,.search input{flex:1;min-width:0;min-height:48px;background:transparent;border:0;color:#fff;outline:none;font-family:'JetBrains Mono',Consolas,monospace}
    .found{margin:1rem 0 .8rem;color:#b9cbdd}.found b{color:var(--accent)}.warn{color:#ffb36b;margin-top:1rem}
    .tools{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:.7rem}
    .tool{display:flex;align-items:stretch;border-radius:14px;background:var(--panel);border:1px solid var(--line);transition:border-color .15s,transform .15s}
    .tool:hover{border-color:var(--accent);transform:translateY(-2px)}
    .tool a{flex:1;display:flex;align-items:center;gap:.7rem;padding:.75rem .8rem;text-decoration:none;color:#fff;min-width:0}
    .t-icon{font-size:1.4rem;width:40px;height:40px;display:grid;place-items:center;border-radius:10px;background:rgba(255,255,255,.06);flex:none}
    .tool b{display:block;font-size:.95rem}.tool small{display:block;color:var(--muted);font-size:.8rem}.out{margin-left:auto;color:var(--accent)}
    .copy{flex:none;min-width:44px;border:0;border-left:1px solid var(--line);background:transparent;color:#c6d6e6;cursor:pointer;border-radius:0 14px 14px 0;font-size:1rem}.copy:hover{color:var(--accent);background:rgba(73,204,225,.08)}

    .filters{display:grid;gap:1rem;margin-bottom:.8rem}
    .chips{display:flex;flex-wrap:wrap;gap:.45rem}
    .chips button{--cc:#49cce1;min-height:38px;padding:.4rem .8rem;border-radius:999px;border:1px solid var(--line);background:var(--panel);color:#d6e4f0;cursor:pointer;font-size:.86rem;font-weight:700}
    .chips button small{opacity:.65;margin-left:.2rem}.chips button.on{background:var(--cc);border-color:var(--cc);color:#031220}
    .count{font-size:.88rem}
    .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1rem}
    .tip{--cc:#49cce1;position:relative;display:flex;flex-direction:column;gap:.55rem;padding:1.1rem 1.1rem 1.2rem;border-radius:18px;background:var(--panel);border:1px solid var(--line);border-top:4px solid var(--cc);transition:transform .15s,box-shadow .15s}
    .tip:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(0,0,0,.3)}
    .tip-top{display:flex;justify-content:space-between;align-items:center;font-size:.78rem}.cat{color:var(--cc);font-weight:800}.num{color:#6e8aa6;font-weight:800}
    .code-row{display:flex;align-items:stretch;border-radius:10px;background:#010409;border:1px solid #23415f}
    .code-row code{flex:1;padding:.6rem .7rem;font-size:.8rem;color:#7fe0ff;word-break:break-all;line-height:1.5}
    .code-row .copy{border-radius:0 10px 10px 0;border-left-color:#23415f}
    .what{margin:0;font-weight:700;line-height:1.5;color:#eaf3fc}
    .how{margin:0;color:#b9cbdd;font-size:.9rem;line-height:1.5}.how span{display:inline-block;margin-right:.45rem;padding:.05rem .45rem;border-radius:6px;background:rgba(255,255,255,.08);font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#9db1c7}
    .ex{margin-top:auto;font-size:.82rem;color:var(--accent);word-break:break-all;text-decoration:none;font-family:'JetBrains Mono',Consolas,monospace}.ex:hover{text-decoration:underline}.ex.plain{color:#9db1c7}

    .keys{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:.7rem}
    .key{display:flex;align-items:center;gap:.9rem;padding:.8rem 1rem;border-radius:14px;background:var(--panel);border:1px solid var(--line)}
    .caps{display:flex;gap:.3rem;flex:none;min-width:84px}
    kbd{display:inline-grid;place-items:center;min-width:2.1rem;height:2.1rem;padding:0 .5rem;border-radius:8px;background:linear-gradient(#f4f7fb,#cfd8e3);color:#0d1117;font-weight:800;font-size:.9rem;box-shadow:0 3px 0 #8796a8,0 4px 8px rgba(0,0,0,.35)}
    .key b{display:block;font-size:.92rem}.key small{color:var(--muted);font-size:.8rem}

    .flow{display:flex;align-items:stretch;gap:.6rem}
    .step{flex:1;position:relative;padding:1.3rem 1.1rem 1.1rem;border-radius:18px;background:linear-gradient(160deg,var(--panel-2),var(--panel));border:1px solid var(--line)}
    .step .n{position:absolute;top:-14px;left:1rem;width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#49cce1,#6f8fff);color:#031220;font-weight:900}
    .step b{display:block;font-size:1.05rem;margin-top:.3rem}.step p{margin:.4rem 0 0;color:#b9cbdd;font-size:.9rem;line-height:1.55}
    .link{align-self:center;color:#6f8fff;font-size:1.6rem;font-weight:900}

    .safety{padding:1.6rem 1.8rem;border-radius:20px;background:rgba(255,179,107,.07);border:1px solid rgba(255,179,107,.35)}
    .safety h2{font-size:1.5rem!important}.safety ul{margin:0;padding-left:1.2rem}.safety li{color:#d8e4ee;line-height:1.75;margin-bottom:.4rem}
    .more{display:flex;flex-wrap:wrap;gap:.8rem;justify-content:space-between}

    @media(max-width:1000px){.patterns{grid-template-columns:repeat(2,minmax(0,1fr))}.flow{flex-direction:column}.link{transform:rotate(90deg)}}
    @media(max-width:860px){.hero{grid-template-columns:1fr}}
    @media(max-width:520px){.patterns{grid-template-columns:1fr}.cards{grid-template-columns:1fr}}
    @media(prefers-reduced-motion:reduce){.reel{animation:none}.tip,.tool{transition:none}}
  `]
})
export class GithubUrlTricksComponent{
  readonly tips=GITHUB_TIPS;readonly cats=TIP_CATS;readonly shortcuts=GITHUB_SHORTCUTS;readonly tools=REPO_TOOLS;
  readonly patterns=[
    {icon:'🔁',name:'Domain swap',what:'Replace github.com with another site.',from:'github.com/o/r',to:'github1s.com/o/r'},
    {icon:'✂️',name:'Word swap',what:'Replace just "hub" with a new word.',from:'github.com/o/r',to:'gitingest.com/o/r'},
    {icon:'⏮️',name:'Prefix',what:'Put a service in front of the address.',from:'github.com/o/r',to:'sourcegraph.com/github.com/o/r'},
    {icon:'⏭️',name:'Suffix',what:'Add something to the end.',from:'.../commit/SHA',to:'.../commit/SHA.patch'},
    {icon:'🎛️',name:'Parameter',what:'Add ?key=value to change the view.',from:'.../pull/12/files',to:'.../pull/12/files?w=1'},
  ];
  repoInput='https://github.com/microsoft/vscode';
  q='';cat:TipCat|'all'='all';copied:string|null=null;

  /** Reads owner/repo from a full GitHub address or from "owner/repo". */
  get repo(){
    const s=this.repoInput.trim().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/^github\.com\//,'');
    const m=/^([A-Za-z0-9-]+)\/([A-Za-z0-9._-]+)/.exec(s);
    if(!m)return null;
    const name=m[2].replace(/\.git$/,'');
    return name?{owner:m[1],name}:null;
  }
  get filtered(){
    const q=this.q.trim().toLowerCase();
    return this.tips.filter(t=>(this.cat==='all'||t.cat===this.cat)&&(!q||`${t.pattern} ${t.what} ${t.how} ${t.example||''}`.toLowerCase().includes(q)));
  }
  countOf(c:TipCat){return this.tips.filter(t=>t.cat===c).length;}
  catOf(c:TipCat){return this.cats.find(x=>x.id===c)!;}
  numberOf(t:Tip){return this.tips.indexOf(t)+1;}
  /** Examples without placeholders can be opened directly. */
  linkable(ex:string){return !/OWNER|REPO|USER|SHA|FILE|\.\.\./.test(ex);}
  async copy(text:string,key:string){
    try{await navigator.clipboard.writeText(text);this.copied=key;setTimeout(()=>{if(this.copied===key)this.copied=null;},1500);}catch{/* clipboard blocked: nothing to do */}
  }
}
