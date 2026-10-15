import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

type Stat={value:string;label:string;source:string;ref:number};
type Era={years:string;name:string;role:string;detail:string;milestone:string};
type Horizon={id:string;years:string;title:string;tagline:string;predictions:{title:string;detail:string}[];evidence:string};
type Ref={n:number;text:string;url:string};

@Component({
  standalone:true,
  selector:'app-ai-coworker-article',
  imports:[RouterLink],
  template:`
  <article class="page coworker-article">
    <a routerLink="/resources" class="back">← Knowledge Lake</a>

    <header class="article-hero">
      <img src="ai-super-coworker.webp" alt="A project manager and a business analyst discuss a holographic project board with a glowing AI coworker, under icons showing AI evolving from calculator to spreadsheet, chat and connected agents">
      <div class="hero-overlay">
        <p class="eyebrow">Future of work · AI in project delivery</p>
        <h1>AI Will Be Not Only a Tool, but a Super Coworker</h1>
        <p class="hero-lead">How AI is evolving from software we operate into a teammate we lead, and what the next ten years mean for the next-generation project manager and business analyst.</p>
        <p class="byline">Md Alamgir Hossain, PMP®, CSM®, ITIL® · October 13, 2026 · 15-minute read</p>
      </div>
    </header>

    <section class="opening card">
      <p class="dropcap">It is 8:10 on a Monday morning in 2030. Before you have finished your coffee, your AI coworker has read the weekend’s 214 emails and chat threads, updated the schedule with two supplier delays, re-run the Monte Carlo forecast, drafted a change request for the scope your sponsor hinted at on Friday, and flagged one stakeholder whose tone has quietly shifted from supportive to worried. It has not made a single decision for you. It has made sure that every decision you make today is better informed.</p>
      <p>That scene is not science fiction. Each piece of it already exists in some form in 2026. What is changing is <strong>who does the work</strong>. For forty years, software has been something project managers and business analysts <em>operate</em>. AI is becoming something we <em>work alongside</em>: it takes initiative, remembers context, owns tasks, and hands back results for review. This article follows that shift through the evidence: where AI came from, where it stands today, and where the next decade is heading.</p>
    </section>

    <section class="stats" aria-label="Key numbers">
      @for(s of stats;track s.label){
        <div class="stat"><strong>{{s.value}}</strong><span>{{s.label}}</span><a [routerLink]="path" fragment="references">{{s.source}} [{{s.ref}}]</a></div>
      }
    </section>

    <nav class="toc card" aria-label="Article contents">
      <p class="eyebrow">In this article</p>
      <div class="toc-grid">
        @for(t of toc;track t.id){<a [routerLink]="path" [fragment]="t.id">{{t.label}}</a>}
      </div>
    </nav>

    <section id="evolution" class="block">
      <div class="section-heading"><span>01</span><div><p class="eyebrow">From calculator to colleague</p><h2>Seventy years of AI, in five eras</h2></div></div>
      <p class="body">AI did not arrive suddenly in 2022. It climbed a long staircase, and each step changed the relationship between people and machines. Read the timeline below as a story about <strong>who holds the initiative</strong>: in the early eras, the human does all the thinking and the machine calculates. By the last era, the machine proposes, acts and reports back, while the human sets direction and stays accountable.</p>
      <ol class="timeline">
        @for(e of eras;track e.name;let i=$index){
          <li>
            <div class="dot">{{i+1}}</div>
            <div class="era">
              <p class="years">{{e.years}}</p>
              <h3>{{e.name}} <small>· {{e.role}}</small></h3>
              <p>{{e.detail}}</p>
              <p class="milestone"><strong>Milestone</strong>{{e.milestone}}</p>
            </div>
          </li>
        }
      </ol>
      <p class="body">Two numbers explain why the last step felt so sudden. ChatGPT reached an estimated <strong>100 million monthly users within two months</strong> of launch, the fastest uptake of any consumer application measured at the time [1]. And the length of tasks frontier AI systems can complete on their own (measured by METR, an AI research nonprofit) has been <strong>doubling roughly every seven months for six years</strong> [2]. Exponential curves look flat for a long time, and then they don’t.</p>
    </section>

    <section id="today" class="block">
      <div class="section-heading"><span>02</span><div><p class="eyebrow">The evidence in 2026</p><h2>Where we stand today</h2></div></div>
      <div class="two-col">
        <div>
          <h3>Adoption is nearly universal…</h3>
          <p class="body">McKinsey’s 2025 global survey of almost 2,000 organizations found <strong>88%</strong> now use AI regularly in at least one business function, up from 78% a year earlier. <strong>62%</strong> are already experimenting with AI agents, and 23% are scaling them somewhere in the enterprise [3]. Stanford’s 2026 AI Index reports that generative AI reached about <strong>53% population adoption</strong> in roughly three years, faster than the personal computer or the internet [4].</p>
          <p class="body">Project professionals are moving too. In PMI’s research, the share of “high adopters” (people using generative AI on half or more of their projects) rose <strong>86%</strong> in less than a year, and about two in five surveyed project professionals now use it in most of their project work [5].</p>
        </div>
        <div>
          <h3>…but value is not.</h3>
          <p class="body">The same McKinsey survey found that only <strong>39%</strong> of organizations can point to any profit (EBIT) impact from AI, and only about <strong>6%</strong> qualify as “high performers” [3]. Gartner expects <strong>over 40% of agentic AI projects to be cancelled by the end of 2027</strong> because of rising costs, unclear business value or weak risk controls [6].</p>
          <p class="body">Read those numbers as a project manager would. The technology is not the bottleneck. <strong>Scoping, change management, governance and benefits realization are.</strong> Those are exactly the disciplines that project managers and business analysts own. The AI boom is, quietly, a project-delivery problem.</p>
        </div>
      </div>
      <figure class="evidence card">
        <figcaption><p class="eyebrow">PMI research</p><h3>What “trailblazers” report compared with occasional users</h3><p class="muted">Share of project professionals reporting improvement, heavy generative-AI adopters vs light adopters (500 respondents) [7]</p></figcaption>
        <div class="bars">
          @for(b of pmiBars;track b.label){
            <div class="bar-row"><span class="bar-label">{{b.label}}</span>
              <div class="bar-track"><div class="bar hi" [style.width.%]="b.hi"><b>{{b.hi}}%</b></div></div>
              <div class="bar-track"><div class="bar lo" [style.width.%]="b.lo"><b>{{b.lo}}%</b></div></div>
            </div>
          }
          <p class="legend"><span class="key hi"></span>Trailblazers <span class="key lo"></span>Explorers</p>
        </div>
        <p class="caution">Self-reported and correlational: confident adopters may simply be stronger performers. Still, the gap is too wide to ignore.</p>
      </figure>
    </section>

    <section id="coworker" class="block">
      <div class="section-heading"><span>03</span><div><p class="eyebrow">The real shift</p><h2>Tool or super coworker: what is the difference?</h2></div></div>
      <p class="body">A tool waits. A coworker participates. Gartner describes the same transition in enterprise software: from assistants that depend on human prompts in 2025, to <strong>task-specific agents in up to 40% of enterprise applications in 2026</strong>, up from less than 5% the year before, and then to networks of agents that collaborate across applications by 2028 [8]. Microsoft calls the organizations at the front of this curve “Frontier Firms”, where every employee becomes an <strong>“agent boss”</strong> who builds, delegates to and manages AI agents. In its survey of 31,000 workers, 82% of leaders expected to use this “digital labour” to expand their workforce’s capacity within 12–18 months [9].</p>
      <div class="compare" role="table" aria-label="AI as a tool versus AI as a coworker">
        <div class="compare-row head" role="row"><span role="columnheader">Dimension</span><span role="columnheader">AI as a tool</span><span role="columnheader">AI as a super coworker</span></div>
        @for(c of compare;track c.dim){
          <div class="compare-row" role="row"><span role="cell"><strong>{{c.dim}}</strong></span><span role="cell">{{c.tool}}</span><span role="cell" class="cw">{{c.coworker}}</span></div>
        }
      </div>
      <p class="body">The word <strong>“super”</strong> matters. This coworker never sleeps, reads a 300-page contract in seconds, remembers every decision in the log, and can run a thousand schedule simulations before lunch. But it has no stake in the outcome, no relationships, and no accountability. Its strengths and ours are almost perfect opposites, which is exactly why the pairing works.</p>
    </section>

    <section id="day" class="block">
      <div class="section-heading"><span>04</span><div><p class="eyebrow">Practical picture</p><h2>A working day with your AI coworker</h2></div></div>
      <div class="lanes">
        <div class="lane card">
          <p class="eyebrow">Project manager</p><h3>From status chaser to decision leader</h3>
          <ul>@for(x of pmDay;track x){<li>{{x}}</li>}</ul>
        </div>
        <div class="lane card">
          <p class="eyebrow">Business analyst</p><h3>From note-taker to value architect</h3>
          <ul>@for(x of baDay;track x){<li>{{x}}</li>}</ul>
        </div>
      </div>
      <p class="body">Back in 2019, Gartner predicted that <strong>80% of project-management tasks</strong> (data collection, tracking and reporting above all) would be run by AI by 2030 [10]. Seven years on, that prediction looks less like a threat and more like a job description. Remove the 80% that is administration, and what remains is the 20% that was always the real job: <strong>judgment, alignment and leadership</strong>.</p>
    </section>

    <section id="future" class="block">
      <div class="section-heading"><span>05</span><div><p class="eyebrow">Forecast 2026–2036</p><h2>The next ten years: three horizons</h2></div></div>
      <p class="body">Forecasts are hypotheses, not facts, so each horizon below is anchored to published evidence and labelled with the signal that would confirm or refute it. Treat this section the way you would treat a risk register: as a living view to revisit, not a promise.</p>
      <div class="horizons">
        @for(h of horizons;track h.id){
          <section class="horizon card" [id]="h.id">
            <p class="years">{{h.years}}</p>
            <h3>{{h.title}}</h3>
            <p class="tagline">{{h.tagline}}</p>
            <ul>@for(p of h.predictions;track p.title){<li><strong>{{p.title}}</strong> {{p.detail}}</li>}</ul>
            <p class="anchor"><strong>Evidence anchor</strong>{{h.evidence}}</p>
          </section>
        }
      </div>
      <div class="constant card">
        <h3>What will <em>not</em> change by 2036</h3>
        <p class="body">Accountability stays human. Regulators, boards and courts will keep asking a person, not a model, to explain why a decision was made. Trust is still built face-to-face. Value is still defined by people with competing interests. The more capable AI becomes, the more valuable the people who can <strong>frame the right problem, negotiate the trade-offs and own the outcome</strong> will be.</p>
      </div>
    </section>

    <section id="human" class="block">
      <div class="section-heading"><span>06</span><div><p class="eyebrow">Your edge</p><h2>Five things your AI coworker cannot do for you</h2></div></div>
      <div class="edge-grid">
        @for(e of edges;track e.title;let i=$index){
          <div class="edge"><span>{{i+1}}</span><h3>{{e.title}}</h3><p>{{e.detail}}</p></div>
        }
      </div>
      <p class="body">The World Economic Forum expects <strong>39% of workers’ core skills to change by 2030</strong>, with 170 million jobs created and 92 million displaced globally, and 85% of employers planning to prioritize upskilling [11]. For project professionals the message is clear: the skills rising fastest are the ones that combine technology fluency with human judgment.</p>
    </section>

    <section id="playbook" class="playbook card">
      <p class="eyebrow">Start this quarter</p>
      <h2>The next-gen PM/BA playbook: 10 moves</h2>
      <ol>@for(p of playbook;track p.title){<li><strong>{{p.title}}</strong> {{p.detail}}</li>}</ol>
    </section>

    <section id="risks" class="block">
      <div class="section-heading"><span>07</span><div><p class="eyebrow">Responsible use</p><h2>Guardrails every AI-enabled project needs</h2></div></div>
      <div class="risk-grid">
        @for(r of risks;track r.title){<div class="risk"><h3>{{r.title}}</h3><p>{{r.detail}}</p></div>}
      </div>
    </section>

    <section class="golden">
      <p class="eyebrow">Key lesson</p>
      <blockquote>Tools make us faster. Coworkers make us better. The next-generation project manager and business analyst will not compete with AI. They will lead it, and that will make human judgment more valuable than ever.</blockquote>
    </section>

    <section id="references" class="refs">
      <h2>References</h2>
      <ol>@for(r of refs;track r.n){<li><a [href]="r.url" target="_blank" rel="noreferrer">{{r.text}}</a></li>}</ol>
      <p class="muted small">Statistics are quoted from the sources above as published; survey results are self-reported. Forecasts in section 05 are the author’s analysis, built on the cited trends.</p>
    </section>

    <footer class="disclaimer"><p>PMPORT is an independent project-management learning platform. PMP® and PMI® are registered marks of Project Management Institute, Inc. This educational article is not endorsed by or affiliated with PMI, Gartner, McKinsey, Microsoft, Stanford HAI, METR or the World Economic Forum.</p><a routerLink="/resources" class="button primary">Back to Knowledge Lake</a></footer>
  </article>`,
  styles:[`
    .coworker-article{max-width:1180px}.back{display:inline-block;margin-bottom:1rem;color:var(--accent);font-weight:700}
    .article-hero{position:relative;min-height:590px;overflow:hidden;border-radius:24px;margin-bottom:2rem;background:#071a33}.article-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:75% center}
    .hero-overlay{position:relative;z-index:1;display:flex;min-height:590px;width:56%;padding:clamp(2rem,6vw,5rem);flex-direction:column;justify-content:center;background:linear-gradient(90deg,rgba(4,18,35,.96),rgba(4,18,35,.75) 72%,transparent);color:#fff}
    .hero-overlay h1{font-size:clamp(2.3rem,4.6vw,4.3rem);line-height:1.04;margin:.7rem 0 1rem}.hero-lead{font-size:clamp(1.05rem,2vw,1.3rem);line-height:1.6;color:#d8e8f5}.byline{font-size:.88rem;color:#a9bfd2;line-height:1.6}
    .opening{margin-bottom:2rem}.opening p,.body{font-size:1.06rem;line-height:1.85;color:#c4d4e2}
    .dropcap::first-letter{float:left;font-size:4.2rem;line-height:.9;margin:.3rem .25rem 0 0;color:var(--accent);font-weight:800;font-family:Manrope,Inter,sans-serif}
    .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;margin-bottom:2rem}
    .stat{display:flex;flex-direction:column;gap:.35rem;padding:1.3rem;border-radius:16px;border:1px solid var(--line);background:linear-gradient(145deg,#0e2d4e,#081e36)}
    .stat strong{font-size:clamp(2rem,4vw,2.8rem);font-family:Manrope,Inter,sans-serif;background:linear-gradient(90deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1.1}
    .stat span{color:#d6e4ef;line-height:1.5}.stat a{font-size:.78rem;color:#8fb0c8;margin-top:auto}
    .toc{margin-bottom:3rem}.toc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem}.toc a{padding:.85rem 1rem;border:1px solid var(--line);border-radius:10px;color:#d9eef7;background:#082039;text-decoration:none}
    .block{padding-top:1rem;margin-bottom:3.5rem;scroll-margin-top:80px}
    .section-heading{display:flex;align-items:center;gap:1rem;margin-bottom:1.2rem}.section-heading>span{display:grid;place-items:center;flex:0 0 56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#041223;font-size:1.15rem;font-weight:800}.section-heading h2{font-size:clamp(1.7rem,3vw,2.5rem);margin:.2rem 0}.section-heading p{margin:0}
    .timeline{list-style:none;padding:0;margin:1.5rem 0;position:relative}
    .timeline:before{content:'';position:absolute;left:21px;top:8px;bottom:8px;width:2px;background:linear-gradient(var(--accent),var(--accent-2))}
    .timeline li{display:flex;gap:1.2rem;margin-bottom:1.1rem;position:relative}
    .dot{flex:0 0 44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#041223;border:2px solid var(--accent);color:var(--accent);font-weight:800;z-index:1}
    .era{flex:1;padding:1.1rem 1.3rem;border:1px solid var(--line);border-radius:14px;background:#0b2340}
    .era h3{margin:.1rem 0 .5rem;font-size:1.2rem}.era h3 small{color:var(--accent);font-weight:600;font-size:.9rem}.era p{margin:0 0 .6rem;color:#c9d9e7;line-height:1.65}
    .years{margin:0;color:#8fb0c8;font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;font-weight:800}
    .milestone{padding:.6rem .85rem;border-left:3px solid var(--accent);border-radius:6px;background:rgba(73,204,225,.07)}.milestone strong,.anchor strong{display:block;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:.15rem}
    .two-col{display:grid;grid-template-columns:1fr 1fr;gap:2rem}.two-col h3{font-size:1.35rem;margin:.4rem 0 .2rem}
    .evidence{margin-top:1.5rem}.evidence h3{margin:.2rem 0}.bars{display:grid;gap:.6rem;margin-top:1rem}
    .bar-row{display:grid;grid-template-columns:150px 1fr 1fr;gap:.6rem;align-items:center}.bar-label{color:#d6e4ef;font-size:.92rem}
    .bar-track{background:#071a30;border-radius:6px;height:26px;overflow:hidden}.bar{height:100%;border-radius:6px;display:flex;align-items:center;justify-content:flex-end;padding-right:.45rem;min-width:2.6rem}.bar b{font-size:.78rem;color:#041223}
    .bar.hi{background:linear-gradient(90deg,#2aa7c0,var(--accent))}.bar.lo{background:#3b5874}.bar.lo b{color:#e7f0f8}
    .legend{display:flex;align-items:center;gap:.5rem;color:#9db1c7;font-size:.85rem;margin:.4rem 0 0}.key{display:inline-block;width:14px;height:14px;border-radius:3px}.key.hi{background:var(--accent)}.key.lo{background:#3b5874;margin-left:1rem}
    .caution{margin:1rem 0 0;color:#9db1c7;font-size:.9rem;font-style:italic}
    .compare{margin:1.5rem 0;border:1px solid var(--line);border-radius:14px;overflow:hidden}
    .compare-row{display:grid;grid-template-columns:.8fr 1fr 1.2fr}.compare-row>span{padding:.85rem 1rem;border-top:1px solid var(--line);color:#c9d9e7;line-height:1.5}
    .compare-row.head>span{border-top:0;background:#0e2d4e;color:#fff;font-weight:800;font-size:.85rem;text-transform:uppercase;letter-spacing:.06em}
    .compare-row .cw{color:#e9fbff;background:rgba(73,204,225,.06)}
    .lanes{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}.lane h3{margin:.2rem 0 .8rem}.lane ul{margin:0;padding-left:1.1rem;display:grid;gap:.55rem}.lane li{color:#d6e4ef;line-height:1.6}.lane li::marker{color:var(--accent)}
    .horizons{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;margin:1.5rem 0}
    .horizon{display:flex;flex-direction:column;gap:.5rem;scroll-margin-top:80px}.horizon h3{margin:0;font-size:1.3rem}.tagline{margin:0;color:var(--accent);font-weight:700}
    .horizon ul{margin:.3rem 0;padding-left:1.1rem;display:grid;gap:.6rem}.horizon li{color:#d6e4ef;line-height:1.55}.horizon li strong{color:#fff}
    .anchor{margin-top:auto;padding:.7rem .85rem;border-left:3px solid var(--accent-2);border-radius:6px;background:rgba(111,143,255,.08);color:#c9d9e7;line-height:1.55;font-size:.92rem}.anchor strong{color:#a9b9ff}
    .constant h3{margin:.2rem 0 .4rem}
    .edge-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1rem;margin-bottom:1.5rem}
    .edge{padding:1.2rem;border:1px solid var(--line);border-radius:14px;background:#0b2340}.edge span{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--accent);color:#041223;font-weight:800}.edge h3{margin:.7rem 0 .4rem;font-size:1.05rem}.edge p{margin:0;color:#c9d9e7;line-height:1.55;font-size:.95rem}
    .playbook{margin:1rem 0 3.5rem;scroll-margin-top:80px}.playbook h2{font-size:clamp(1.8rem,3vw,2.5rem)}.playbook ol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem 2rem;padding-left:1.4rem}.playbook li{line-height:1.6;color:#d6e4ef}.playbook li::marker{color:var(--accent);font-weight:800}.playbook li strong{color:#fff}
    .risk-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.risk{padding:1.2rem;border-left:3px solid #ff7a6b;border-radius:10px;background:rgba(255,122,107,.06)}.risk h3{margin:0 0 .4rem;font-size:1.05rem;color:#ffc2b8}.risk p{margin:0;color:#c9d9e7;line-height:1.55}
    .golden{padding:2.5rem;border-radius:20px;background:linear-gradient(135deg,#10395b,#142a55);margin:3rem 0}.golden blockquote{margin:1.5rem 0 0;padding:1.2rem 1.5rem;border-left:4px solid var(--accent);background:#071a33;color:#dcebf7;line-height:1.7;font-size:clamp(1.2rem,2.4vw,1.7rem);font-weight:700}
    .refs{scroll-margin-top:80px;margin-bottom:2rem}.refs h2{font-size:1.8rem}.refs ol{padding-left:1.4rem;display:grid;gap:.5rem}.refs li{color:#9db1c7;line-height:1.55}.refs a{color:#bfe9f2}.small{font-size:.85rem}
    .disclaimer{padding-top:2rem;border-top:1px solid var(--line)}.disclaimer p{max-width:850px;color:#91a8bc;line-height:1.7;font-size:.88rem}.disclaimer .button{margin-top:1rem}
    @media(max-width:1000px){.edge-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.horizons,.risk-grid{grid-template-columns:1fr}.stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:800px){.article-hero,.hero-overlay{min-height:640px}.hero-overlay{width:100%;justify-content:flex-end;background:linear-gradient(0deg,rgba(4,18,35,.99),rgba(4,18,35,.72) 60%,rgba(4,18,35,.08))}.toc-grid,.two-col,.lanes,.playbook ol{grid-template-columns:1fr}.section-heading{align-items:flex-start}.golden{padding:1.5rem}
      .compare-row{grid-template-columns:1fr}.compare-row.head{display:none}.compare-row>span:first-child{background:#0e2d4e}.bar-row{grid-template-columns:1fr}.bar-label{margin-top:.4rem}}
    @media(max-width:520px){.stats,.edge-grid{grid-template-columns:1fr}}
  `]
})
export class AiCoworkerArticleComponent{
  readonly path='/resources/ai-super-coworker-project-manager-business-analyst';
  readonly toc=[
    {id:'evolution',label:'01 · Seventy years of AI, in five eras'},
    {id:'today',label:'02 · Where we stand today'},
    {id:'coworker',label:'03 · Tool or super coworker?'},
    {id:'day',label:'04 · A working day with your AI coworker'},
    {id:'future',label:'05 · The next ten years: three horizons'},
    {id:'human',label:'06 · What your AI coworker cannot do'},
    {id:'playbook',label:'Playbook · 10 moves to start this quarter'},
    {id:'risks',label:'07 · Guardrails and references'}
  ];
  readonly stats:Stat[]=[
    {value:'88%',label:'of organizations use AI regularly in at least one business function',source:'McKinsey, 2025',ref:3},
    {value:'62%',label:'are already experimenting with AI agents; 23% are scaling them',source:'McKinsey, 2025',ref:3},
    {value:'~7 mo',label:'doubling time for the length of tasks AI can complete on its own',source:'METR, 2025',ref:2},
    {value:'40%',label:'of enterprise apps expected to include task-specific AI agents by the end of 2026, up from under 5%',source:'Gartner, 2025',ref:8},
    {value:'39%',label:'of organizations report any profit (EBIT) impact from AI so far: the value gap is a delivery problem',source:'McKinsey, 2025',ref:3},
    {value:'39%',label:'of workers’ core skills expected to change by 2030',source:'World Economic Forum, 2025',ref:11}
  ];
  readonly eras:Era[]=[
    {years:'1956 – 1990s',name:'The calculator era',role:'AI as logic',detail:'Researchers coined “artificial intelligence” at the 1956 Dartmouth workshop. Early systems followed hand-written rules: brilliant inside narrow boundaries, helpless outside them. For project managers, “automation” meant spreadsheets and the first scheduling software that calculated a critical path.',milestone:'1997: IBM’s Deep Blue defeats world chess champion Garry Kasparov, showing that machines can out-calculate experts in a closed world.'},
    {years:'2000s – 2016',name:'The pattern era',role:'AI as prediction',detail:'Machine learning replaced hand-written rules with patterns learned from data. Deep neural networks began to recognize images and speech. Inside organizations, AI quietly powered forecasting, fraud detection and recommendations, but rarely touched project work directly.',milestone:'2012: the AlexNet neural network wins the ImageNet competition by a wide margin, kicking off the deep-learning boom.'},
    {years:'2017 – 2022',name:'The language era',role:'AI as assistant',detail:'The Transformer architecture let models learn from vast amounts of text. Language models could now summarize, draft and translate. The interface changed from code and dashboards to plain conversation.',milestone:'November 2022: ChatGPT launches and reaches an estimated 100 million users in two months [1].'},
    {years:'2023 – 2025',name:'The copilot era',role:'AI as helper',detail:'AI moved inside the tools we already use: meeting summaries, document drafting, and assistants embedded in project platforms (PMI launched its own GPT-powered assistant, PMI Infinity [5]). Powerful, but still reactive: the human asks, the AI answers.',milestone:'2025: Gartner reports most enterprise applications now embed AI assistants. Agents that act on their own are still under 5% [8].'},
    {years:'2026 →',name:'The coworker era',role:'AI as teammate',detail:'Agents plan multi-step work, use tools, remember context and report back. They update the risk register, chase approvals and prepare the steering-committee pack. Humans move from operating software to directing a blended team of people and agents.',milestone:'2026: up to 40% of enterprise apps expected to include task-specific agents [8]; 62% of organizations already experimenting with them [3].'}
  ];
  readonly pmiBars=[
    {label:'Productivity',hi:93,lo:58},
    {label:'Quality management',hi:91,lo:40},
    {label:'Problem-solving',hi:89,lo:46},
    {label:'Project scope',hi:87,lo:34},
    {label:'Scheduling',hi:85,lo:46},
    {label:'Collaboration',hi:83,lo:32}
  ];
  readonly compare=[
    {dim:'Initiative',tool:'Waits for a prompt or a click.',coworker:'Notices that a supplier date slipped and proposes a recovery plan.'},
    {dim:'Memory',tool:'Forgets everything when the window closes.',coworker:'Remembers decisions, assumptions and stakeholder preferences across the project.'},
    {dim:'Scope of work',tool:'One task at a time: “summarize this”.',coworker:'Owns a workflow end to end: “keep the RAID log current and alert me on threshold breaches”.'},
    {dim:'Collaboration',tool:'Works for one user in one app.',coworker:'Coordinates with other agents and people across tools, inside agreed permissions.'},
    {dim:'Output',tool:'A draft you must finish.',coworker:'A reviewed, evidence-linked result ready for your decision.'},
    {dim:'Management model',tool:'You operate it.',coworker:'You delegate, set guardrails, review and stay accountable, like leading a team member.'}
  ];
  readonly pmDay=[
    'Morning brief: the agent consolidates status from Jira, email and finance into a one-page view with earned value, burn-up trend and the three issues that need you today.',
    'Risk radar: it scans meeting notes and chat for new risks, scores them, suggests owners and drafts responses for your approval.',
    'Scenario planning: “What happens if we lose two developers in March?” It runs schedule and cost simulations in minutes, not days.',
    'Governance pack: the steering-committee deck, decision log and change requests are prepared and cross-checked against the baseline.',
    'Your time goes back to people: coaching the team, negotiating with the sponsor and unblocking decisions.'
  ];
  readonly baDay=[
    'Elicitation partner: it transcribes the workshop, extracts candidate requirements, groups them by theme and flags contradictions between stakeholders.',
    'Traceability on autopilot: every user story links to a business objective, acceptance criteria and test case, and the agent warns when a change breaks the chain.',
    'Process and data insight: it mines event logs to map the as-is process and locate bottlenecks before you draw a single diagram.',
    'Rapid prototyping: draft screens, data models and BPMN diagrams in an afternoon, so stakeholders react to something concrete.',
    'Your time goes to the hard questions: what problem are we really solving, and is it worth solving?'
  ];
  readonly horizons:Horizon[]=[
    {id:'h1',years:'Horizon 1 · 2026 – 2028',title:'Agents join the team',tagline:'From assistants to accountable helpers.',predictions:[
      {title:'Agent-ready PM tools become standard.',detail:'Scheduling, RAID logs, status reporting and meeting follow-up are largely run by embedded agents under human review.'},
      {title:'Autonomous micro-decisions begin.',detail:'Gartner expects at least 15% of day-to-day work decisions to be made autonomously by agentic AI by 2028, up from zero in 2024 [6].'},
      {title:'“AI-enabled project” becomes a governance category.',detail:'PMOs add model risk, data rights and human-in-the-loop checkpoints to stage gates.'},
      {title:'The hype corrects.',detail:'Many poorly scoped agent projects are cancelled [6], which rewards teams with strong business cases and benefits tracking.'}
    ],evidence:'Gartner predicts 33% of enterprise software will include agentic AI by 2028 [6], and networks of agents will collaborate across applications [8].'},
    {id:'h2',years:'Horizon 2 · 2029 – 2031',title:'The blended team',tagline:'Every PM and BA leads people and agents.',predictions:[
      {title:'Agent orchestration becomes a core competency.',detail:'Gartner expects at least half of knowledge workers to be building skills to work with, govern or create AI agents by 2029 [8].'},
      {title:'Week- to month-long tasks are delegated.',detail:'If METR’s trend holds, AI systems will be able to complete tasks lasting weeks to a month by around the end of the decade [2]: a full requirements baseline or a vendor-evaluation package.'},
      {title:'Living project digital twins.',detail:'Plans continuously re-forecast from real-time data, so “status” is always current and the monthly report disappears.'},
      {title:'New roles appear.',detail:'Agent operations lead, AI product owner, human–AI workflow designer and AI assurance analyst.'}
    ],evidence:'If the 7-month doubling continues, today’s hour-scale tasks become month-scale tasks within about 5–6 years [2]. That is a forecast that depends on the trend holding.'},
    {id:'h3',years:'Horizon 3 · 2032 – 2036',title:'Self-steering portfolios',tagline:'Humans set intent; systems keep delivery on course.',predictions:[
      {title:'Portfolios that rebalance themselves.',detail:'AI continuously re-prioritizes investments against strategy and capacity, and executives approve the trade-offs rather than compile them.'},
      {title:'Self-healing schedules and compliance-by-design.',detail:'Plans re-sequence themselves within agreed constraints, and regulatory evidence is generated as work happens.'},
      {title:'The PM becomes a value and change leader.',detail:'The role centres on outcomes, adoption and ethics: the “why” and “whether”, not the “when”.'},
      {title:'Agentic software is mainstream.',detail:'Gartner’s best case sees agentic AI driving about 30% of enterprise application software revenue, over $450 billion, by 2035 [8].'}
    ],evidence:'Longest horizon, lowest certainty. Watch for agent reliability, regulation and the cost of computing; any of them could slow or speed this path.'}
  ];
  readonly edges=[
    {title:'Own accountability',detail:'Someone must stand in front of the sponsor and say “I decided, and here is why.”'},
    {title:'Build trust',detail:'Stakeholders commit to people they trust, not to dashboards.'},
    {title:'Negotiate trade-offs',detail:'Reading the room, finding the compromise, knowing when to push.'},
    {title:'Frame the right problem',detail:'AI answers questions brilliantly; choosing the right question is still human work.'},
    {title:'Apply ethics and care',detail:'Weighing fairness, safety and impact on real people, beyond what the data shows.'}
  ];
  readonly playbook=[
    {title:'Map your work.',detail:'List your weekly tasks and mark each as automate, augment or keep human.'},
    {title:'Start with reporting.',detail:'Let AI draft status reports and meeting minutes first; it is low-risk and saves hours immediately.'},
    {title:'Write a “job description” for your agent.',detail:'Scope, inputs, permissions, quality bar and escalation rules, just as you would for a new hire.'},
    {title:'Keep a human in the loop.',detail:'Define which outputs need review and which decisions AI may never make.'},
    {title:'Protect your data.',detail:'Use approved, enterprise-grade tools; never paste confidential data into public chatbots.'},
    {title:'Measure the benefit.',detail:'Track hours saved, cycle time and error rates, then report AI value the way you report project benefits.'},
    {title:'Learn prompting and agent design.',detail:'Clear context, examples and constraints are the new requirements-writing skill.'},
    {title:'Invest in power skills.',detail:'Communication, negotiation, facilitation and change leadership grow in value as AI absorbs routine work.'},
    {title:'Upskill formally.',detail:'Consider AI-focused credentials such as PMI’s CPMAI, along with data literacy and governance training.'},
    {title:'Share what works.',detail:'Build a team prompt and agent library, and run retrospectives on how AI helped or hurt.'}
  ];
  readonly risks=[
    {title:'Hallucination and over-trust',detail:'AI can sound confident and still be wrong. Verify facts, figures and citations before they reach a decision-maker.'},
    {title:'Data privacy and IP',detail:'Know where data goes, who can see it and whether it trains models. Align with legal and security early.'},
    {title:'Bias and fairness',detail:'Models can amplify bias in resourcing, vendor scoring or prioritization. Test outputs and keep humans accountable.'},
    {title:'Automation without adoption',detail:'An agent nobody trusts is shelfware. Treat AI rollout as organizational change, with training and feedback loops.'},
    {title:'Skill erosion',detail:'If AI writes every requirement, juniors may never learn how. Design deliberate learning into the work.'},
    {title:'“Agent washing”',detail:'Gartner estimates only about 130 of thousands of “agentic” vendors are real [6]. Ask vendors for evidence, not demos.'}
  ];
  readonly refs:Ref[]=[
    {n:1,text:'Reuters (via Inquirer), “ChatGPT sets record for fastest-growing user base – analyst note,” February 2023',url:'https://business.inquirer.net/384799/chatgpt-sets-record-for-fastest-growing-user-base-analyst-note'},
    {n:2,text:'METR, “Measuring AI Ability to Complete Long Tasks,” March 2025',url:'https://www.lesswrong.com/posts/deesrjitvXM4xYGZd/metr-measuring-ai-ability-to-complete-long-tasks'},
    {n:3,text:'McKinsey & Company, “The state of AI in 2025: Agents, innovation, and transformation,” November 2025',url:'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-2025'},
    {n:4,text:'Stanford HAI, The 2026 AI Index Report, April 2026',url:'https://hai.stanford.edu/ai-index/2026-ai-index-report'},
    {n:5,text:'Project Management Institute, “PMI leads transformation of the profession” (Pushing the Limits GenAI research, PMI Infinity, CPMAI), September 2024',url:'https://www.pmi.org/about/press-media/press-releases/pmi-leads-transformation-of-profession'},
    {n:6,text:'Gartner, “Gartner Predicts Over 40% of Agentic AI Projects Will Be Canceled by End of 2027,” June 25, 2025',url:'https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027.'},
    {n:7,text:'Project Management Institute, “First Movers’ Advantage: The Immediate Benefits of Adopting Generative AI for Project Management,” July 2024',url:'https://www.pmi.org/about/press-media/press-releases/genai-adoption-research'},
    {n:8,text:'Gartner, “Gartner Predicts 40% of Enterprise Apps Will Feature Task-Specific AI Agents by 2026, Up from Less Than 5% in 2025,” August 26, 2025',url:'https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025.'},
    {n:9,text:'Microsoft Work Trend Index 2025, “The Year the Frontier Firm Is Born” (summary), April 2025',url:'https://theneuron.ai/explainer-articles/microsofts-latest-report-says-2025-is-the-year-of-the-frontier-firm---heres-what-that-actually-means'},
    {n:10,text:'ITPro, “Gartner predicts AI will consume 80% of project management tasks,” March 2019',url:'https://itpro.com/technology/33278/gartner-predicts-ai-will-consume-80-of-project-management-tasks'},
    {n:11,text:'World Economic Forum, Future of Jobs Report 2025 (summary via AI Magazine), January 2025',url:'https://aimagazine.com/articles/wef-report-the-impact-of-ai-driving-170m-new-jobs-by-2030'}
  ];
}
