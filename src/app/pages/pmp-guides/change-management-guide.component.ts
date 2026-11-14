import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {PMP_GUIDE_STYLES} from './pmp-guide-styles';

/**
 * Change management study guide: the ACMP process groups (CCMP), Prosci's ADKAR® model and the classic change models.
 * All explanations are original PMPORT text; each model is credited to its owner. Static text so it is also in the pre-built HTML.
 */
@Component({
  standalone:true,selector:'app-change-management-guide',imports:[RouterLink],
  template:`
  <article class="page guide">
    <a routerLink="/pm-faciliter/ccmp" class="back">← CCMP exam prep</a>
    <header class="article-hero">
      <img src="change-management-study-guide.webp" alt="Five rising steps labelled Awareness, Desire, Knowledge, Ability and Reinforcement" width="1600" height="900" fetchpriority="high">
      <div class="hero-overlay">
        <p class="eyebrow">Change management · Study guide</p>
        <h1>Change Management Study Guide</h1>
        <p class="hero-lead">ADKAR®, Kotter, Lewin and Bridges explained in plain English, plus the ACMP process groups behind the CCMP® exam and a 6-week study plan.</p>
        <p class="byline">Md Alamgir Hossain, PMP®, CSM®, ITIL® · November 14, 2026 · 14-minute read</p>
      </div>
    </header>

    <section class="card">
      <p>Projects deliver new systems, processes and structures. Change management makes sure people actually use them. A project can finish on time and on budget and still fail if nobody adopts what it built.</p>
      <p>This guide covers the three things most change practitioners study: the <strong>ACMP Standard for Change Management®</strong> process groups that the CCMP® exam is built on, <strong>Prosci's ADKAR® model</strong> for individual change, and the classic models by <strong>Kotter, Lewin and Bridges</strong>. Each section explains the idea in our own words and links to the owner's official material.</p>
    </section>

    <nav class="toc card" aria-label="Guide contents"><p class="eyebrow">In this guide</p>
      <ol>
        <li><a routerLink="/resources/change-management-study-guide" fragment="why">What change management is, and why it matters</a></li>
        <li><a routerLink="/resources/change-management-study-guide" fragment="acmp">The ACMP process groups (CCMP)</a></li>
        <li><a routerLink="/resources/change-management-study-guide" fragment="adkar">Prosci's ADKAR® model</a></li>
        <li><a routerLink="/resources/change-management-study-guide" fragment="models">Kotter, Lewin, Bridges and the change curve</a></li>
        <li><a routerLink="/resources/change-management-study-guide" fragment="compare">Which model to use when</a></li>
        <li><a routerLink="/resources/change-management-study-guide" fragment="roles">Roles and resistance</a></li>
        <li><a routerLink="/resources/change-management-study-guide" fragment="certs">CCMP or Prosci certification?</a></li>
        <li><a routerLink="/resources/change-management-study-guide" fragment="plan">A 6-week study plan</a></li>
        <li><a routerLink="/resources/change-management-study-guide" fragment="faq">Frequently asked questions</a></li>
        <li><a routerLink="/resources/change-management-study-guide" fragment="sources">Sources</a></li>
      </ol>
    </nav>

    <section id="why">
      <p class="eyebrow">01 · The basics</p>
      <h2>What change management is, and why it matters</h2>
      <p>Change management is a structured way to help people move from how they work today (the current state) to how they need to work tomorrow (the future state). It is not the same as project change control, which manages changes to scope, cost and schedule. Change management is about adoption: people understanding the change, choosing to take part, learning the new way and keeping it up.</p>
      <div class="callout"><p><strong>The key idea:</strong> benefits come from usage. If a new claims system is installed but staff keep using spreadsheets, the business case is not delivered. Change management protects the return on the project by making adoption part of the plan.</p></div>
      <p>Organizations change only when individuals change. That is why most models work on two levels: what the organization does (sponsorship, communication, training, reinforcement) and what each person goes through (awareness, motivation, skills, confidence).</p>
    </section>

    <section id="acmp">
      <p class="eyebrow">02 · The CCMP foundation</p>
      <h2>The ACMP process groups behind the CCMP® exam</h2>
      <p>The Association of Change Management Professionals (ACMP) publishes the <em>Standard for Change Management®</em>. Its process groups describe the work of a change practitioner from start to finish. The CCMP® exam is based on this Standard, so learning the process groups is the core of CCMP preparation. In summary:</p>
      <div class="table-wrap" tabindex="0" role="region" aria-label="Table: The change management process groups"><table class="data">
        <thead><tr><th>Process group</th><th>The question it answers</th><th>Typical work</th></tr></thead>
        <tbody>
          <tr><td>Evaluate change impact and organizational readiness</td><td>What is changing, for whom, and are we ready?</td><td>Define the change and its drivers, identify impacted groups and stakeholders, assess impact, readiness, culture and change history, and identify people-side risks.</td></tr>
          <tr><td>Formulate the change management strategy</td><td>How will we approach this change?</td><td>Sponsorship and governance, stakeholder engagement and communication, learning, resistance and risk mitigation, and how success will be measured and sustained.</td></tr>
          <tr><td>Develop the change management plan</td><td>Exactly what will we do, who does it and when?</td><td>Integrate with the project plan, and build sponsor roadmaps, communication, training, coaching, resistance, reinforcement and measurement plans.</td></tr>
          <tr><td>Execute the change management plan</td><td>Is it working, and what must we adjust?</td><td>Engage sponsors, equip managers and change agents, deliver communication and training, manage resistance, track adoption and adjust the plan.</td></tr>
          <tr><td>Complete the change management effort</td><td>Did it stick, and who owns it now?</td><td>Evaluate adoption and outcomes, transfer ownership to the business, sustain the change, capture lessons learned and close.</td></tr>
        </tbody>
      </table></div>
      <p>ACMP released a second edition of the Standard in 2025, and the CCMP exam moved to it in 2026. The process-group logic above still applies; check ACMP's current test specification for the exact wording and weights before you book.</p>
    </section>

    <section id="adkar">
      <p class="eyebrow">03 · Individual change</p>
      <h2>Prosci's ADKAR® model</h2>
      <p>ADKAR® is a model created by Prosci. It describes five outcomes a person needs to reach, in order, for a change to succeed for them. In our own words:</p>
      <div class="table-wrap" tabindex="0" role="region" aria-label="Table: The ADKAR model"><table class="data">
        <thead><tr><th>Outcome</th><th>What it means for the person</th><th>What usually helps</th></tr></thead>
        <tbody>
          <tr><td><strong>A</strong>wareness</td><td>I understand why this change is happening and what happens if we do not change.</td><td>Clear reasons from senior leaders; personal impact explained by the direct manager.</td></tr>
          <tr><td><strong>D</strong>esire</td><td>I choose to take part and support it.</td><td>Addressing concerns, involvement, showing what is in it for the person, visible sponsorship.</td></tr>
          <tr><td><strong>K</strong>nowledge</td><td>I know how to do things the new way.</td><td>Training, job aids, examples and demonstrations.</td></tr>
          <tr><td><strong>A</strong>bility</td><td>I can actually do it in my real work.</td><td>Practice, coaching, time to learn and help at the point of need.</td></tr>
          <tr><td><strong>R</strong>einforcement</td><td>I keep doing it, and I don't slip back.</td><td>Recognition, measurement, removing the old way, and leaders asking about it.</td></tr>
        </tbody>
      </table></div>
      <div class="callout"><p><strong>How practitioners use it:</strong> find the first outcome where a person or group is stuck (the "barrier point") and work on that before moving on. Training (Knowledge) will not help someone who still does not see why the change matters (Awareness).</p></div>
      <p>Prosci also describes a three-phase process for the organizational side: prepare the approach, manage the change, and sustain the outcomes. For the full model, tools and certification, see Prosci's own site in the sources below.</p>
    </section>

    <section id="models">
      <p class="eyebrow">04 · Classic models</p>
      <h2>Kotter, Lewin, Bridges and the change curve</h2>
      <h3>Lewin: unfreeze, change, refreeze</h3>
      <p>Psychologist Kurt Lewin described change in three stages. First, loosen the hold of the current way of working by showing why it has to change (unfreeze). Then move to the new way (change). Finally, make the new way stable through policies, systems and habits (refreeze). It is simple, and still a useful reminder that change needs preparation before and embedding after.</p>
      <h3>Kotter: eight steps for leading change</h3>
      <p>Harvard professor John Kotter set out eight steps for leaders, based on why large transformations fail. In short: create urgency; build a guiding coalition; form a strategic vision; enlist a large group of supporters; remove barriers so people can act; generate short-term wins; keep up the pace; and anchor the change in the culture. The model is strongest on leadership and momentum across the organization.</p>
      <h3>Bridges: change versus transition</h3>
      <p>William Bridges separated <em>change</em> (the external event, such as a new system going live) from <em>transition</em> (the inner process people go through to accept it). Transition has three phases: an ending, where people let go of the old way and what they lose; a neutral zone, a confusing in-between time that can also be creative; and a new beginning, where people commit to the new way. The model reminds leaders to acknowledge losses rather than only selling benefits.</p>
      <h3>The change curve</h3>
      <p>Many practitioners use a "change curve", adapted from Elisabeth Kübler-Ross's work on grief, to show how morale and performance often dip after a change is announced before they recover. The point for planning is that a temporary dip is normal, and support, coaching and patience make it shallower and shorter.</p>
    </section>

    <section id="compare">
      <p class="eyebrow">05 · Putting it together</p>
      <h2>Which model to use when</h2>
      <div class="table-wrap" tabindex="0" role="region" aria-label="Table: Which change model to use when"><table class="data">
        <thead><tr><th>Model</th><th>Focus</th><th>Best for</th></tr></thead>
        <tbody>
          <tr><td>ACMP process groups</td><td>The practitioner's end-to-end work</td><td>Structuring a change effort and preparing for the CCMP® exam</td></tr>
          <tr><td>Prosci ADKAR®</td><td>Each individual's journey</td><td>Diagnosing where people are stuck and choosing the right action</td></tr>
          <tr><td>Kotter's 8 steps</td><td>Leadership and momentum</td><td>Large transformations that need urgency and a strong coalition</td></tr>
          <tr><td>Lewin</td><td>Before, during and after</td><td>Explaining change simply to leaders and teams</td></tr>
          <tr><td>Bridges</td><td>Emotional transition and loss</td><td>Changes where people lose status, skills, routines or relationships</td></tr>
        </tbody>
      </table></div>
      <p>The models are not rivals. A practical approach: use the ACMP process groups to organize the work, ADKAR® to diagnose people, Kotter to coach leaders, and Bridges to remember the human side of loss.</p>
    </section>

    <section id="roles">
      <p class="eyebrow">06 · People and resistance</p>
      <h2>Roles and resistance</h2>
      <ul>
        <li><strong>Sponsor:</strong> authorizes and funds the change, explains why, builds a coalition of leaders and stays visible from start to finish.</li>
        <li><strong>People managers:</strong> explain what the change means for each person, coach, listen and reinforce. Employees look to them first.</li>
        <li><strong>Change practitioner:</strong> designs the approach, builds the plans and equips sponsors and managers to lead.</li>
        <li><strong>Change agents or champions:</strong> credible peers who spread messages locally and bring feedback back.</li>
        <li><strong>Impacted groups:</strong> the people whose work changes and who must adopt it.</li>
      </ul>
      <p>Resistance is a normal reaction, not a character flaw. Common root causes are not knowing why, fear of losing status or skills, lack of trust, too many changes at once and not having a say. Find the root cause first, then respond to it: explain the reasons for an awareness gap, involve people for a loss of control, and give practice and support for a confidence gap. Use consequences only as a last resort, fairly and consistently.</p>
    </section>

    <section id="certs">
      <p class="eyebrow">07 · Credentials</p>
      <h2>CCMP or Prosci certification?</h2>
      <div class="table-wrap" tabindex="0" role="region" aria-label="Table: CCMP and Prosci certification compared"><table class="data">
        <thead><tr><th></th><th>CCMP® (ACMP)</th><th>Prosci Certified Change Practitioner</th></tr></thead>
        <tbody>
          <tr><td>What it shows</td><td>Knowledge of the vendor-neutral Standard for Change Management®</td><td>Ability to apply Prosci's methodology and ADKAR® model</td></tr>
          <tr><td>How you earn it</td><td>Application with experience and essay, 21 hours of change management training, then a proctored exam</td><td>Complete Prosci's certification program (training plus applied work); there is no separate public exam</td></tr>
          <tr><td>Exam</td><td>150 multiple-choice questions in 3 hours, at a test centre or online</td><td>Assessed within the program</td></tr>
          <tr><td>Renewal</td><td>60 professional development units every 3 years</td><td>See Prosci's current terms</td></tr>
        </tbody>
      </table></div>
      <p>Many practitioners hold both: Prosci for a hands-on toolkit and CCMP for a broad, independent credential. PMPORT's free <a routerLink="/pm-faciliter/ccmp-exam-simulator">CCMP practice exams</a> help with the CCMP. Questions on ADKAR® and the classic models are included because they test the same thinking.</p>
    </section>

    <section id="plan">
      <p class="eyebrow">08 · Study plan</p>
      <h2>A 6-week CCMP study plan</h2>
      <ol>
        <li><strong>Week 1, foundations:</strong> read this guide, learn the roles, and study Lewin, Kotter, Bridges and ADKAR® until you can explain each one in two minutes.</li>
        <li><strong>Week 2, evaluate:</strong> impact assessments, stakeholder analysis, readiness, culture and change risks. Take 30 practice questions in practice mode.</li>
        <li><strong>Week 3, formulate:</strong> sponsorship, engagement, communication, learning, resistance and sustainment strategies.</li>
        <li><strong>Week 4, develop and execute:</strong> sponsor roadmaps, communication and training plans, manager coaching, resistance management and adoption tracking.</li>
        <li><strong>Week 5, complete and first mock:</strong> evaluation, ownership, sustainment and lessons learned. Take PMPORT's first full 150-question mock under time.</li>
        <li><strong>Week 6, review and second mock:</strong> review every wrong answer, drill weak process groups, then take the second mock. Aim for 75% or more before you book.</li>
      </ol>
    </section>

    <section id="faq">
      <p class="eyebrow">09 · FAQ</p>
      <h2>Frequently asked questions</h2>
      <h3>Is change management the same as change control?</h3>
      <p>No. Change control manages changes to a project's scope, schedule and cost. Change management helps people adopt the change so the benefits are realized.</p>
      <h3>Do I need to know ADKAR® for the CCMP exam?</h3>
      <p>The CCMP is based on ACMP's Standard, not on one vendor's model. Knowing ADKAR® and the classic models still helps, because they explain why the Standard's activities work.</p>
      <h3>Is change management on the PMP exam?</h3>
      <p>Yes. The PMP's Business Environment domain includes supporting organizational change, so this guide also helps PMP candidates.</p>
      <h3>Are PMPORT's practice questions official?</h3>
      <p>No. They are original questions written by PMPORT to the public process groups. They are not ACMP or Prosci questions.</p>
    </section>

    <section class="card">
      <h2>Start practising now</h2>
      <p>Test yourself on the process groups and models with two free, full-length mock exams.</p>
      <div class="cta"><a class="button primary" routerLink="/pm-faciliter/ccmp-exam-simulator">Open the free CCMP exam simulator</a><a class="button secondary" routerLink="/pm-faciliter/ccmp">CCMP exam overview</a><a class="button secondary" routerLink="/pm-playground">Try the change adoption playground</a></div>
    </section>

    <section id="sources" class="sources">
      <h2>Sources</h2>
      <ol>
        <li><a href="https://www.acmpglobal.org/page/faqs_ccmp" target="_blank" rel="noopener">ACMP: CCMP® frequently asked questions</a>. Training hours, fees, renewal and the second edition of the Standard.</li>
        <li><a href="https://www.acmpglobal.org/page/ccmp-preparing-to-take-the-exam" target="_blank" rel="noopener">ACMP: Preparing to take the CCMP® exam</a>. Number of questions, time and delivery.</li>
        <li><a href="https://www.prosci.com/methodology/adkar" target="_blank" rel="noopener">Prosci: The ADKAR® model</a>. The model's owner and official description.</li>
        <li><a href="https://www.kotterinc.com/methodology/8-steps/" target="_blank" rel="noopener">Kotter Inc.: The 8 steps for leading change</a>.</li>
        <li><a href="https://wmbridges.com/about/what-is-transition/" target="_blank" rel="noopener">William Bridges Associates: What is transition?</a></li>
      </ol>
      <p class="note">CCMP® and Standard for Change Management® are marks of the Association of Change Management Professionals (ACMP). ADKAR® and Prosci® are registered trademarks of Prosci, Inc. Kotter's 8 Steps belong to Kotter Inc. PMPORT is not affiliated with or endorsed by ACMP, Prosci or Kotter Inc. All explanations here are PMPORT's own summaries. Exam details were checked in November 2026; always confirm current rules with ACMP.</p>
    </section>
  </article>`,
  styles:[PMP_GUIDE_STYLES]
})
export class ChangeManagementGuideComponent{}
