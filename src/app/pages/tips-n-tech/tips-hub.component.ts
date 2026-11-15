import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TIP_COLLECTIONS} from './tips-data';

/** Tips n Tech hub (/tips-n-tech): one card per tip collection. Collections are listed in tips-data.ts. */
@Component({
  standalone:true,selector:'app-tips-hub',imports:[RouterLink],
  template:`
  <section class="page tnt-hub">
    <header class="hub-hero">
      <div class="glow g1" aria-hidden="true"></div><div class="glow g2" aria-hidden="true"></div>
      <div class="hero-copy">
        <p class="eyebrow">Learn · Tips n Tech</p>
        <h1>Tips <span class="amp">n</span> Tech</h1>
        <p class="lead">Small tricks that save real time. Change one word in a link, press one key or add one filter, and the tools you already use do far more.</p>
        <div class="chips"><span>⚡ Quick wins</span><span>🆓 Free</span><span>🧩 No installs</span></div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="tile t1"><b>github</b><i>→</i><b class="hl">github1s</b></div>
        <div class="tile t2"><b>?t=</b><i>→</i><b class="hl">1m20s</b></div>
        <div class="tile t3"><b>/edit</b><i>→</i><b class="hl">/copy</b></div>
        <div class="tile t4"><b>site:</b><b class="hl">filetype:pdf</b></div>
      </div>
    </header>

    <div class="grid">
      @for(c of collections;track c.id){
        @if(c.live&&c.path){
          <a class="card live" [routerLink]="c.path" [style.--c1]="c.colors[0]" [style.--c2]="c.colors[1]">
            <span class="badge new">New</span>
            <span class="icon" aria-hidden="true">{{c.icon}}</span>
            <h2>{{c.title}}</h2>
            <p>{{c.blurb}}</p>
            <div class="foot"><span class="count">{{c.count}}</span><span class="go">Open →</span></div>
            <div class="tags">@for(t of c.tags;track t){<span>{{t}}</span>}</div>
          </a>
        } @else {
          <div class="card soon" [style.--c1]="c.colors[0]" [style.--c2]="c.colors[1]">
            <span class="badge">Coming soon</span>
            <span class="icon" aria-hidden="true">{{c.icon}}</span>
            <h2>{{c.title}}</h2>
            <p>{{c.blurb}}</p>
            <div class="foot"><span class="count">{{c.count}}</span></div>
            <div class="tags">@for(t of c.tags;track t){<span>{{t}}</span>}</div>
          </div>
        }
      }
    </div>
    <p class="muted note">New collections are added regularly. Tips that point to other websites use free community tools that PMPORT does not run; they can change over time.</p>
  </section>`,
  styles:[`
    .hub-hero{position:relative;overflow:hidden;display:grid;grid-template-columns:1.1fr .9fr;gap:2rem;align-items:center;padding:clamp(2rem,5vw,4rem);border-radius:28px;border:1px solid var(--line);background:linear-gradient(135deg,#0b2340,#071a31 60%,#0d1f45);margin-bottom:2.5rem}
    .glow{position:absolute;border-radius:50%;filter:blur(60px);opacity:.55;pointer-events:none}.g1{width:340px;height:340px;background:#6f8fff;top:-120px;right:8%}.g2{width:260px;height:260px;background:#49cce1;bottom:-120px;left:-60px;opacity:.35}
    .hero-copy{position:relative;z-index:1}.hub-hero h1{margin:.3rem 0 1rem}
    .amp{background:linear-gradient(90deg,#49cce1,#6f8fff,#b47cff);-webkit-background-clip:text;background-clip:text;color:transparent;font-style:italic}
    .chips{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.2rem}.chips span{padding:.45rem .8rem;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);font-size:.88rem;font-weight:700}
    .hero-art{position:relative;z-index:1;display:grid;gap:.8rem}
    .tile{display:flex;align-items:center;gap:.6rem;padding:.85rem 1rem;border-radius:14px;background:rgba(4,18,35,.75);border:1px solid #24527d;font-family:'JetBrains Mono',Consolas,monospace;font-size:.95rem;box-shadow:0 12px 30px rgba(0,0,0,.3);animation:float 6s ease-in-out infinite}
    .tile b{font-weight:600;color:#9db1c7}.tile i{color:#6f8fff;font-style:normal}.tile .hl{color:#49cce1}
    .t2{margin-left:2.5rem;animation-delay:-1.5s}.t3{margin-left:1rem;animation-delay:-3s}.t4{margin-left:3.5rem;animation-delay:-4.5s}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.2rem}
    .card{position:relative;display:flex;flex-direction:column;gap:.4rem;padding:1.6rem;border-radius:20px;background:var(--panel);border:1px solid var(--line);text-decoration:none;color:#fff;overflow:hidden;transition:transform .2s,border-color .2s,box-shadow .2s}
    .card::before{content:'';position:absolute;inset:0 0 auto 0;height:5px;background:linear-gradient(90deg,var(--c1),var(--c2))}
    .card::after{content:'';position:absolute;width:200px;height:200px;right:-70px;top:-70px;border-radius:50%;background:radial-gradient(circle,var(--c1),transparent 70%);opacity:.22}
    .card.live:hover,.card.live:focus-visible{transform:translateY(-4px);border-color:var(--c2);box-shadow:0 18px 40px rgba(0,0,0,.35)}
    .card.soon{opacity:.72}
    .icon{font-size:2.4rem;line-height:1;width:64px;height:64px;display:grid;place-items:center;border-radius:16px;background:linear-gradient(135deg,var(--c1),var(--c2));box-shadow:0 10px 24px rgba(0,0,0,.3);margin-bottom:.6rem}
    .card h2{font-size:1.35rem!important;letter-spacing:-.01em!important;margin:0}
    .card p{color:#b9cbdd;line-height:1.65;margin:.2rem 0 .6rem;flex:1}
    .foot{display:flex;justify-content:space-between;align-items:center}.count{font-weight:800;color:var(--c2)}.go{font-weight:800;color:var(--accent)}
    .tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.6rem}.tags span{font-size:.75rem;padding:.2rem .55rem;border-radius:999px;background:rgba(255,255,255,.06);color:#c6d6e6}
    .badge{position:absolute;top:1.1rem;right:1.1rem;z-index:1;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;padding:.3rem .6rem;border-radius:999px;background:rgba(255,255,255,.1);color:#c6d6e6}.badge.new{background:var(--accent);color:#031220}
    .note{margin-top:2rem;font-size:.9rem}
    @media(max-width:860px){.hub-hero{grid-template-columns:1fr}.hero-art{display:none}}
    @media(prefers-reduced-motion:reduce){.tile{animation:none}.card{transition:none}}
  `]
})
export class TipsHubComponent{readonly collections=TIP_COLLECTIONS;}
