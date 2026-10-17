import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {PMP_GUIDE_STYLES} from '../pmp-guides/pmp-guide-styles';

/** Article: why adding people to a late project often makes it later (Brooks's law), with evidence and better recovery options.
 * The text is static so it is also copied into the pre-built HTML for search engines. */
@Component({
  standalone:true,selector:'app-brooks-law-article',imports:[RouterLink],
  template:`
  <article class="page guide">
    <a routerLink="/resources" class="back">← Knowledge Lake</a>
    <header class="article-hero">
      <img src="nine-women-one-month.webp" alt="A team leans against a giant hourglass to push the sand through faster while a calendar beside it reads nine months; lines between the people show how communication channels multiply" width="1600" height="900" fetchpriority="high">
      <div class="hero-overlay">
        <p class="eyebrow">Project delivery · Evidence-based</p>
        <h1>You Can't Add Nine Women to Deliver a Baby in One Month</h1>
        <p class="hero-lead">Why adding people to a late project so often makes it later, what fifty years of evidence says, when more people really do help, and what to do instead.</p>
        <p class="byline">Md Alamgir Hossain, PMP® · October 17, 2026 · 10-minute read</p>
      </div>
    </header>

    <section class="card">
      <h2>The most tempting fix in project management</h2>
      <p>A project is slipping. The sponsor is anxious, the deadline is public, and someone in the steering meeting says what everyone is thinking: "Let's put more people on it." It sounds responsible. It feels like action. And on many projects it is exactly the wrong move.</p>
      <p>In 1975, Fred Brooks, who had managed IBM's huge OS/360 software project, summed up the lesson in one line that became known as <strong>Brooks's law</strong>: "Adding manpower to a late software project makes it later." To explain why, he used an image that has outlived the rest of the book: <em>the bearing of a child takes nine months, no matter how many women are assigned</em> [1][2].</p>
      <div class="callout"><p><strong>The core idea:</strong> some work can be split among more people, and some cannot. When the work is sequential, complex or already late, extra people add training, coordination and rework faster than they add output.</p></div>
    </section>

    <nav class="card toc" aria-label="In this article">
      <p class="eyebrow">In this article</p>
      <ol>
        <li><a routerLink="/resources/nine-women-one-month-brooks-law" fragment="why">Why more people can make a project later</a></li>
        <li><a routerLink="/resources/nine-women-one-month-brooks-law" fragment="evidence">What the evidence says</a></li>
        <li><a routerLink="/resources/nine-women-one-month-brooks-law" fragment="nuance">It is not an iron law</a></li>
        <li><a routerLink="/resources/nine-women-one-month-brooks-law" fragment="example">A worked example</a></li>
        <li><a routerLink="/resources/nine-women-one-month-brooks-law" fragment="instead">Ten better ways to recover a late project</a></li>
        <li><a routerLink="/resources/nine-women-one-month-brooks-law" fragment="checklist">Questions to ask before adding people</a></li>
        <li><a routerLink="/resources/nine-women-one-month-brooks-law" fragment="sources">Sources</a></li>
      </ol>
    </nav>

    <section id="why">
      <p class="eyebrow">The mechanics</p>
      <h2>Why more people can make a project later</h2>
      <p>Brooks gave three reasons, and later research added a fourth. Together they explain why a person-month is not a unit you can freely trade for calendar time [1][2].</p>
      <div class="weeks">
        <div class="week"><h3>1. Ramp-up takes time from your best people</h3><p>New people need to learn the product, the codebase, the business rules and the team's ways of working. The people who teach them are usually the most experienced members of the team, the same people the late project depends on. For weeks, total output can go down before it goes up.</p></div>
        <div class="week"><h3>2. Communication grows faster than the team</h3><p>Every pair of people is a possible communication channel. With <em>n</em> people there are <strong>n(n−1)/2</strong> channels. Going from 5 to 10 people doubles the team but more than quadruples the channels, from 10 to 45 [3]. More meetings, more hand-offs and more chances to misunderstand.</p></div>
        <div class="week"><h3>3. Some work cannot be divided</h3><p>Painting a fence or cleaning hotel rooms scales with people. Designing an architecture, making a key decision or finding a subtle defect does not. When tasks depend on each other in sequence, the critical path sets the pace, not the headcount.</p></div>
        <div class="week"><h3>4. Effort per person drops in bigger groups</h3><p>As early as 1913, the French engineer Max Ringelmann found that people pulling a rope in a group each pulled less hard than when they pulled alone. Later experiments with fake team-mates showed this was not only poor coordination but a loss of motivation, now called social loafing [4].</p></div>
      </div>
      <div class="table-wrap"><table class="data">
        <caption class="sr-only">Communication channels by team size</caption>
        <thead><tr><th>Team size</th><th>Communication channels n(n−1)/2</th><th>Change</th></tr></thead>
        <tbody>
          <tr><td>3 people</td><td>3</td><td>—</td></tr>
          <tr><td>5 people</td><td>10</td><td>+7</td></tr>
          <tr><td>7 people</td><td>21</td><td>+11</td></tr>
          <tr><td>10 people</td><td>45</td><td>+24</td></tr>
          <tr><td>15 people</td><td>105</td><td>+60</td></tr>
          <tr><td>20 people</td><td>190</td><td>+85</td></tr>
        </tbody>
      </table></div>
      <p>Try it yourself with the free <a routerLink="/pm-calculators/communication-channels-calculator">communication channels calculator</a>.</p>
    </section>

    <section id="evidence">
      <p class="eyebrow">The data</p>
      <h2>What the evidence says</h2>
      <p>Brooks wrote from experience. Since then, researchers have tested the idea against thousands of real projects. The pattern is consistent: bigger teams buy a little time at a high price.</p>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Study</th><th>What was compared</th><th>Key finding</th></tr></thead>
        <tbody>
          <tr><td>Putnam, QSM (1997)</td><td>491 completed software projects</td><td>For medium-sized systems, teams of about 3–7 people were the most efficient [5].</td></tr>
          <tr><td>Putnam, QSM (2005)</td><td>564 business systems projects: teams under 5 vs teams over 20</td><td>For the same size of system, large teams finished in 8.92 months and small teams in 9.12 months: about one week faster for four or more times the people [6].</td></tr>
          <tr><td>Beckett, QSM (2006)</td><td>Nearly 600 IT projects: best vs worst in class</td><td>Best-in-class projects used teams over 4 times smaller, delivered about 5 times faster and used about 15 times less effort [5][6].</td></tr>
          <tr><td>Armel, QSM (2012)</td><td>About 1,060 IT projects: 4 or fewer people vs 5 or more</td><td>Larger teams gained only a small schedule advantage but cost 3–4 times more and produced 2–3 times as many defects [5].</td></tr>
          <tr><td>Putnam, QSM (about 2018)</td><td>390 projects of the same size: under 4 people vs 9 or more</td><td>Larger teams cut the schedule by about 30%, but cost rose about 350% and defects about 500% [5].</td></tr>
          <tr><td>Hackman and Vidmar (Harvard)</td><td>Team members rating whether their team was too small or too large</td><td>The ratings balanced at about 4.6 people [7]. Hackman's later rule of thumb for teams: "no double digits" [8].</td></tr>
          <tr><td>Scrum Guide (2020)</td><td>Guidance for agile teams</td><td>Scrum teams are "typically 10 or fewer people", because smaller teams communicate better and are more productive [9].</td></tr>
        </tbody>
      </table></div>
      <div class="facts">
        <div class="fact"><strong>~1 week</strong><span>Schedule gained by teams of 20+ over teams under 5 on the same size of system [6]</span></div>
        <div class="fact"><strong>3–4×</strong><span>Higher cost for larger teams across about 1,060 IT projects [5]</span></div>
        <div class="fact"><strong>2–3×</strong><span>More defects from larger teams in the same study [5]</span></div>
        <div class="fact"><strong>No double digits</strong><span>J. Richard Hackman's rule of thumb for effective teams [8]</span></div>
      </div>
      <p>Most of this data comes from software and IT, where Brooks's law was first described. The same forces, ramp-up, coordination and sequential work, apply wherever work is knowledge-heavy: business analysis, design, policy, research and change management. Large engineering and construction projects show a related pattern: delays and rework often surface late, when adding resources is most expensive [10].</p>
    </section>

    <section id="nuance" class="card">
      <h2>It is not an iron law</h2>
      <p>Brooks himself introduced the law as an "outrageous" oversimplification [1][2]. Two well-known follow-ups refined it:</p>
      <ul>
        <li><strong>Timing matters.</strong> A 1999 simulation study by Hsia, Hsu and Kung found that adding people always raises cost, but does not always delay the project. If people are added early enough, and the work is not tightly sequential, the deadline can still be met [2].</li>
        <li><strong>Late projects are often underestimated projects.</strong> In "Brooks' Law Repealed" (1999), Steve McConnell argued that the law mainly applies in the final stages. Many projects that look "late" were simply under-planned, and adding staff early, with time to become productive, can help [2].</li>
      </ul>
      <p>So the better question is not "Does adding people ever work?" but "Will these people, added now, to this kind of work, produce more than they consume?"</p>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Adding people is more likely to help when…</th><th>Adding people is more likely to backfire when…</th></tr></thead>
        <tbody>
          <tr><td>It happens early, with time to ramp up</td><td>It happens in the last weeks before a deadline</td></tr>
          <tr><td>The work splits into independent packages</td><td>Tasks are sequential or tightly coupled</td></tr>
          <tr><td>Newcomers already know the product, tools or domain</td><td>Only a few experts understand the system</td></tr>
          <tr><td>The added work is off the critical path (testing, data entry, documentation)</td><td>The bottleneck is a decision, an approval or a specialist</td></tr>
          <tr><td>A new, separate team with a clear interface takes a whole stream</td><td>New people join the same team and the same backlog</td></tr>
          <tr><td>Onboarding is planned and led by someone not on the critical path</td><td>Your busiest experts must stop to train newcomers</td></tr>
        </tbody>
      </table></div>
    </section>

    <section id="example">
      <p class="eyebrow">An illustration</p>
      <h2>A worked example</h2>
      <p><em>The numbers below are illustrative, not from a real project.</em> A team of six is building a customer portal. With eight weeks to go, it is four weeks behind. The sponsor offers four more developers.</p>
      <div class="weeks">
        <div class="week"><h3>What the sponsor expects</h3><p>Six people become ten, so the team moves about 67% faster. Four weeks of delay disappear.</p></div>
        <div class="week"><h3>What often happens</h3><ul><li>Weeks 1–3: two senior developers spend about half their time onboarding the four newcomers.</li><li>Communication channels rise from 15 to 45; stand-ups and code reviews take longer.</li><li>Newcomers' first changes cause rework because they do not yet know the business rules.</li><li>The critical path, integration with the billing system, still depends on one specialist.</li></ul></div>
        <div class="week"><h3>The likely result</h3><p>Higher cost every week, a small or zero gain in the schedule, and more defects to fix before go-live.</p></div>
        <div class="week"><h3>A better option</h3><p>Cut two low-value features, move testing and data migration to a separate small team, protect the billing specialist from all other work, and agree a staged release with the sponsor.</p></div>
      </div>
    </section>

    <section id="instead">
      <p class="eyebrow">What to do instead</p>
      <h2>Ten better ways to recover a late project</h2>
      <ol class="steps">
        <li><strong>Re-estimate before you react.</strong> Find out how late the project really is, using actual performance and a forecast (for example earned value or a <a routerLink="/pm-calculators/monte-carlo-schedule-simulator">Monte Carlo schedule simulation</a>), not hope.</li>
        <li><strong>Find the true bottleneck.</strong> Look at the critical path and where work is waiting. If the constraint is one specialist, one approval or one vendor, more general staff will not help.</li>
        <li><strong>Reduce scope.</strong> Prioritize with the sponsor (for example MoSCoW) and deliver the must-haves first. Removing work is the fastest way to finish sooner.</li>
        <li><strong>Release in stages.</strong> A minimum viable release on the original date, followed by the rest, often meets the real business need.</li>
        <li><strong>Fast-track with care.</strong> Overlap tasks that were planned in sequence, knowing it adds risk and possible rework [11].</li>
        <li><strong>Crash selectively.</strong> If you add resources, add them to specific critical-path tasks where each day saved costs least, and check whether the critical path changes [11].</li>
        <li><strong>Add people early and as separate teams.</strong> If more people are truly needed, add them as early as possible, give them a whole, independent piece of work and a clear interface, and plan their onboarding [2][12].</li>
        <li><strong>Protect your experts' focus.</strong> Remove meetings, reports and side tasks from the people on the critical path. Their hours are your scarcest resource.</li>
        <li><strong>Limit work in progress.</strong> Finishing fewer things at once shortens cycle time and exposes blockers. See how this works in the <a routerLink="/pm-playground">Kanban flow simulator</a>.</li>
        <li><strong>Reset the plan openly.</strong> Present the options, the trade-offs and the data to the sponsor, and agree a new baseline through change control rather than a promise you cannot keep.</li>
      </ol>
      <div class="callout"><p><strong>Remember the PMBOK® view:</strong> schedule compression always has a price. Crashing adds cost, and fast-tracking adds risk [11]. The project manager's job is to make that price visible before the decision is made.</p></div>
    </section>

    <section id="checklist" class="card">
      <h2>Questions to ask before adding people</h2>
      <ol class="steps">
        <li>What is actually causing the delay, and will more people fix that cause?</li>
        <li>Is the remaining work divisible into independent pieces?</li>
        <li>How long will newcomers take to become productive, and who will train them?</li>
        <li>How many weeks are left, and is that longer than the ramp-up time?</li>
        <li>How will the team structure change: one bigger team, or a new, separate team?</li>
        <li>What will it cost, and what will it do to quality and defects?</li>
        <li>What cheaper options have we tried first: scope, staging, focus, removing blockers?</li>
      </ol>
      <p>If you cannot answer these clearly, the safer decision is usually to fix the plan before you grow the team.</p>
    </section>

    <section class="card">
      <h2>The bottom line</h2>
      <p>People are not interchangeable units of effort, and time is not something you can buy back by the head. A late project needs a diagnosis before it needs a bigger team. Sometimes more people are the right answer, early, on divisible work, in a separate team. Far more often, the faster route is less work in progress, a sharper scope and an honest plan. Nine months is nine months; good project managers plan for it rather than pushing on the hourglass.</p>
      <div class="cta"><a class="button primary" routerLink="/pm-playground">Try the project delivery simulator</a><a class="button secondary" routerLink="/resources/21-causes-of-project-failure">Read: Top 21 causes of project failure</a></div>
    </section>

    <section id="sources" class="card sources">
      <h2>Sources</h2>
      <ol>
        <li>Brooks, F. P., Jr. (1975; anniversary edition 1995). <em>The Mythical Man-Month: Essays on Software Engineering.</em> Addison-Wesley. <a href="https://openlibrary.org/works/OL3510570W/The_Mythical_Man-Month" target="_blank" rel="noopener">Open Library record</a></li>
        <li>"Brooks's law." Wikipedia, summarizing Brooks (1975, 1995); Hsia, P., Hsu, C. &amp; Kung, D. (1999), "Brooks' law revisited: a system dynamics approach"; and McConnell, S. (1999), "Brooks' Law Repealed," <em>IEEE Software</em>. <a href="https://en.wikipedia.org/wiki/Brooks%27s_law" target="_blank" rel="noopener">en.wikipedia.org/wiki/Brooks's_law</a></li>
        <li>Effectiviology. "Brooks' Law: Adding Manpower to a Late Project Makes It Later" (communication channels n(n−1)/2). <a href="https://effectiviology.com/brooks-law/" target="_blank" rel="noopener">effectiviology.com/brooks-law</a></li>
        <li>"Ringelmann effect." Wikipedia, summarizing Ringelmann (1913) and Ingham et al. (1974). <a href="https://en.wikipedia.org/wiki/Ringelmann_effect" target="_blank" rel="noopener">en.wikipedia.org/wiki/Ringelmann_effect</a></li>
        <li>QSM (2025). "4 Key Studies on Team Size" (Putnam 1997; Beckett 2006; Armel 2012; Putnam 2018–2019). <a href="https://qsm.com/blog/2025/4-key-studies-team-size" target="_blank" rel="noopener">qsm.com/blog/2025/4-key-studies-team-size</a></li>
        <li>QSM (2012). "Top Performing Projects Use Small Teams." <a href="https://qsm.com/blog/2012/top-performing-projects-use-small-teams" target="_blank" rel="noopener">qsm.com/blog/2012/top-performing-projects-use-small-teams</a></li>
        <li>Cohn, M. "The Just-Right Size for Agile Teams," Mountain Goat Software (Hackman and Vidmar's 4.6 finding). <a href="https://www.mountaingoatsoftware.com/blog/the-just-right-size-for-agile-teams" target="_blank" rel="noopener">mountaingoatsoftware.com</a></li>
        <li>Coutu, D. (2009). "Why Teams Don't Work" (interview with J. Richard Hackman). <em>Harvard Business Review</em>, May 2009. <a href="https://bu.edu/sph/files/2019/01/Why-Teams-Don%E2%80%99t-Work.pdf" target="_blank" rel="noopener">PDF copy</a></li>
        <li>Schwaber, K. &amp; Sutherland, J. (2020). <em>The Scrum Guide.</em> <a href="https://scrumguides.org/scrum-guide.html" target="_blank" rel="noopener">scrumguides.org/scrum-guide.html</a></li>
        <li>Sterman, J. D. (1992). "System Dynamics Modeling for Project Management." MIT Sloan School of Management. <a href="https://mitmgmtfaculty.mit.edu/jsterman/modelingforproject/" target="_blank" rel="noopener">mitmgmtfaculty.mit.edu</a></li>
        <li>University of Waterloo Project Management Office. "Schedule Compression" (crashing and fast-tracking). <a href="https://uwaterloo.ca/vpaf-project-management-office/methodology/project-management/planning/project-schedule/schedule-compression" target="_blank" rel="noopener">uwaterloo.ca</a></li>
        <li><em>Electronic Design.</em> "Is It Always a Bad Idea to Add Resources to a Late Project?" <a href="https://www.electronicdesign.com/archive/article/21760483/is-it-always-a-bad-idea-to-add-resources-to-a-late-project" target="_blank" rel="noopener">electronicdesign.com</a></li>
      </ol>
    </section>

    <footer class="disclaimer"><p>PMPORT is an independent project-management learning platform. PMP® and PMBOK® are registered marks of Project Management Institute, Inc. This article summarizes published research and practitioner guidance for education; the worked example is illustrative.</p></footer>
  </article>`,
  styles:[PMP_GUIDE_STYLES+`
    .steps{line-height:1.75;padding-left:1.3rem}.steps li{margin:.35rem 0;color:#d6e4f0}
    .guide .fact strong{font-size:1.45rem}
    .week ul{margin:.4rem 0 0;padding-left:1.1rem}
    caption.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
    .disclaimer p{font-size:.85rem;color:var(--muted);line-height:1.6}
  `]
})
export class BrooksLawArticleComponent{}
