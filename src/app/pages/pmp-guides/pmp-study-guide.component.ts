import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {PMP_GUIDE_STYLES} from './pmp-guide-styles';

/** Evidence-based PMP study guide with an 8-week plan. Text is static so it is also in the pre-built HTML for search engines. */
@Component({
  standalone:true,selector:'app-pmp-study-guide',imports:[RouterLink],
  template:`
  <article class="page guide">
    <a routerLink="/resources" class="back">← PM Knowledge Lake</a>
    <header class="article-hero">
      <img src="pmp-study-guide.webp" alt="A glowing eight-step study path leading to an exam-day flag, with a domain progress card and a readiness gauge" width="1600" height="900" fetchpriority="high">
      <div class="hero-overlay">
        <p class="eyebrow">PMP exam prep · Study plan</p>
        <h1>Free PMP Study Guide and 8-Week Study Plan</h1>
        <p class="hero-lead">What the PMP exam looks like from July 2026, how to study for it week by week, and the free practice that gets you ready.</p>
        <p class="byline">Md Alamgir Hossain, PMP®, CSM®, ITIL® · October 14, 2026 · 15-minute read</p>
      </div>
    </header>

    <section class="card">
      <p>Most people who fail the PMP exam do not fail because they studied too little. They fail because they studied the wrong way: too much reading, too little practice, and not enough time spent learning how PMI expects a project manager to think.</p>
      <p>This guide gives you a clear, free path. First, you will see the current exam format and what changed in July 2026. Then you will get an 8-week plan with daily practice, the core PMP mindset, a method for reviewing mock exams and tips for exam day. Every step links to free tools on PMPORT, including five full-length practice exams.</p>
    </section>

    <nav class="toc card" aria-label="Guide contents"><p class="eyebrow">In this guide</p>
      <ol>
        <li><a routerLink="/resources/pmp-study-guide-8-week-plan" fragment="exam">The PMP exam at a glance</a></li>
        <li><a routerLink="/resources/pmp-study-guide-8-week-plan" fragment="eligibility">Are you eligible?</a></li>
        <li><a routerLink="/resources/pmp-study-guide-8-week-plan" fragment="plan">The 8-week study plan</a></li>
        <li><a routerLink="/resources/pmp-study-guide-8-week-plan" fragment="mindset">The PMP mindset in 12 rules</a></li>
        <li><a routerLink="/resources/pmp-study-guide-8-week-plan" fragment="review">How to review a mock exam</a></li>
        <li><a routerLink="/resources/pmp-study-guide-8-week-plan" fragment="exam-day">Exam-day tips</a></li>
        <li><a routerLink="/resources/pmp-study-guide-8-week-plan" fragment="faq">Frequently asked questions</a></li>
        <li><a routerLink="/resources/pmp-study-guide-8-week-plan" fragment="sources">Sources</a></li>
      </ol>
    </nav>

    <section id="exam">
      <p class="eyebrow">01 · Know the target</p>
      <h2>The PMP exam at a glance (from July 9, 2026)</h2>
      <p>PMI launched a new version of the PMP exam on July 9, 2026, based on a new Exam Content Outline (ECO). If you sit the exam today, this is the version you will take.</p>
      <div class="facts">
        <div class="fact"><strong>180</strong><span>questions: 170 scored and 10 unscored pretest questions</span></div>
        <div class="fact"><strong>240 min</strong><span>4 hours, with two optional 10-minute breaks</span></div>
        <div class="fact"><strong>3</strong><span>domains: People, Process and Business Environment</span></div>
        <div class="fact"><strong>~60%</strong><span>agile and hybrid approaches; about 40% predictive</span></div>
      </div>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Domain</th><th>Share of the exam</th><th>Before July 2026</th><th>What it covers</th></tr></thead>
        <tbody>
          <tr><td>People</td><td>33%</td><td>42%</td><td>Leading and building teams, conflict, collaboration with stakeholders, coaching and empowerment.</td></tr>
          <tr><td>Process</td><td>41%</td><td>50%</td><td>Planning and managing scope, schedule, cost, quality, risk, resources, procurement and change, in predictive, agile and hybrid settings.</td></tr>
          <tr><td>Business Environment</td><td>26%</td><td>8%</td><td>Strategy and value, benefits, governance, compliance, organizational change and the wider context of the project.</td></tr>
        </tbody>
      </table></div>
      <div class="callout"><p><strong>What changed and why it matters:</strong> Business Environment more than tripled, from 8% to 26%. You now need to explain how a project creates value and fits the organization's strategy, not only how to run it. The exam also adds case-study and graphic-based questions, and agile and hybrid questions now make up about 60% of the exam.</p></div>
      <p>Expect several question types: single-answer multiple choice, multiple response, matching, hotspot (point and click), drop-down lists, case studies and graphic-based questions. The exam is built from the ECO, not from one book. The PMBOK® Guide is one of several references.</p>
    </section>

    <section id="eligibility">
      <p class="eyebrow">02 · Before you start</p>
      <h2>Are you eligible for the PMP?</h2>
      <p>You need <strong>35 hours of project management training</strong> (an active CAPM® also counts) and project experience within the last 10 years. The experience depends on your education:</p>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Your education</th><th>Project management experience needed</th></tr></thead>
        <tbody>
          <tr><td>High school diploma or equivalent</td><td>5 years</td></tr>
          <tr><td>Associate's degree or vocational trade diploma</td><td>4 years</td></tr>
          <tr><td>Bachelor's degree or higher</td><td>3 years</td></tr>
          <tr><td>Degree from a PMI GAC-accredited program</td><td>2 years</td></tr>
        </tbody>
      </table></div>
      <p>Check the current rules and fees on <a href="https://www.pmi.org/certifications/project-management-pmp" target="_blank" rel="noopener">PMI's PMP certification page</a> before you apply. PMI is changing how instructor-led training counts from December 2026. A practical tip: write your experience summaries in your application as you study. They use the same language as the exam, so the two tasks reinforce each other.</p>
    </section>

    <section id="plan">
      <p class="eyebrow">03 · Week by week</p>
      <h2>The 8-week PMP study plan</h2>
      <p>This plan assumes about <strong>10 to 12 hours a week</strong>: one hour on weekdays and three to four hours on weekends. If you have less time, stretch it to 12 weeks by repeating weeks 2 to 5. The rule is simple: <strong>practise every week</strong>. Reading without questions does not prepare you for a scenario-based exam.</p>
      <div class="weeks">
        <div class="week"><span class="tag">Week 1</span><h3>Map the exam and find your baseline</h3><ul>
          <li>Read the ECO's 26 tasks once, quickly, to see the full scope.</li>
          <li>Answer 60 questions in the <a routerLink="/pm-faciliter/pmp-exam-simulator">PMP simulator's</a> practice mode. Don't worry about the score.</li>
          <li>Start an error log (see section 5) and note your weakest domain.</li></ul></div>
        <div class="week"><span class="tag">Week 2</span><h3>People domain</h3><ul>
          <li>Servant leadership, team charters, conflict resolution, coaching and motivation.</li>
          <li>Emotional intelligence and stakeholder engagement in practice.</li>
          <li>Practise 60 People questions and log every mistake with the reason.</li></ul></div>
        <div class="week"><span class="tag">Week 3</span><h3>Process: predictive planning</h3><ul>
          <li>Scope, WBS, schedule, critical path, cost and earned value (CPI, SPI, EAC).</li>
          <li>Try the free <a routerLink="/pm-tools/pert-cpm">PERT/CPM calculator</a> and the earned value exercises in <a routerLink="/pm-datalab/excel">PM DataLab</a>.</li>
          <li>Practise 60 Process questions.</li></ul></div>
        <div class="week"><span class="tag">Week 4</span><h3>Process: agile and hybrid</h3><ul>
          <li>Scrum roles and events, Kanban, backlogs, user stories, velocity and burn charts.</li>
          <li>When to choose predictive, agile or hybrid, and how to tailor.</li>
          <li>Practise 60 agile-heavy questions. This is now about 60% of the exam.</li></ul></div>
        <div class="week"><span class="tag">Week 5</span><h3>Business Environment</h3><ul>
          <li>Benefits and value, business cases, governance, compliance and organizational change.</li>
          <li>Read <a routerLink="/resources/111-essential-pmp-mindsets">111 Essential PMP Mindsets</a>.</li>
          <li>Practise 60 questions, focusing on strategy and value.</li></ul></div>
        <div class="week"><span class="tag">Week 6</span><h3>First full mock exam</h3><ul>
          <li>Take <a routerLink="/pm-faciliter/pmp-exam-simulator">Practice Exam 2</a> timed: 180 questions in 240 minutes, with breaks.</li>
          <li>Spend twice as long reviewing as you did answering.</li>
          <li>Re-study the two weakest areas in your error log.</li></ul></div>
        <div class="week"><span class="tag">Week 7</span><h3>Close the gaps</h3><ul>
          <li>Take Practice Exams 3 and 4, a few days apart.</li>
          <li>Aim for 70% or higher, consistently, before booking (or keeping) your date.</li>
          <li>Watch short concept videos on <a routerLink="/media">PMPortLive</a> for topics you keep missing.</li></ul></div>
        <div class="week"><span class="tag">Week 8</span><h3>Final mock and rest</h3><ul>
          <li>Take Practice Exam 5 early in the week, then review it.</li>
          <li>Re-read your error log and the mindset rules. Stop heavy study 48 hours before the exam.</li>
          <li>Confirm ID, test centre or online setup, and sleep well.</li></ul></div>
      </div>
      <p class="note">Your pass/fail result is reported with performance ratings for each domain. PMI does not publish a fixed passing percentage, so treat 70% on realistic mock exams as a readiness signal, not a guarantee.</p>
    </section>

    <section id="mindset">
      <p class="eyebrow">04 · Think like PMI</p>
      <h2>The PMP mindset in 12 rules</h2>
      <p>Many PMP questions have two "good" answers. The mindset tells you which one PMI considers best. These rules come up again and again:</p>
      <ol>
        <li><strong>Assess before you act.</strong> Understand the situation, and its root cause, before choosing a response.</li>
        <li><strong>Talk to people directly.</strong> Prefer a conversation with the person involved over escalating or sending an email.</li>
        <li><strong>Lead as a servant leader.</strong> Remove impediments, coach and protect the team instead of commanding.</li>
        <li><strong>Empower the team.</strong> Let self-organizing teams make their own decisions about how to do the work.</li>
        <li><strong>Deliver value early and often.</strong> Prioritize work by business value and get feedback quickly.</li>
        <li><strong>Use the process for changes.</strong> In predictive projects, changes go through change control. In agile projects, they go to the product backlog.</li>
        <li><strong>The product owner owns priorities.</strong> The project manager or Scrum Master does not reprioritize the backlog.</li>
        <li><strong>Manage risk proactively.</strong> Identify and respond to risks before they become issues, and keep the register current.</li>
        <li><strong>Tailor the approach.</strong> Choose predictive, agile or hybrid based on the project, not on habit.</li>
        <li><strong>Engage stakeholders continuously.</strong> Not just at the start and the end.</li>
        <li><strong>Act ethically.</strong> Follow PMI's Code of Ethics: honesty, responsibility, respect and fairness.</li>
        <li><strong>Escalate last.</strong> Escalate only when it is beyond your authority, after you have tried to solve it.</li>
      </ol>
      <p>For the full list with examples, read <a routerLink="/resources/111-essential-pmp-mindsets">111 Essential PMP Mindsets</a>.</p>
    </section>

    <section id="review">
      <p class="eyebrow">05 · Learn from every mistake</p>
      <h2>How to review a mock exam</h2>
      <p>The score is the least useful part of a mock exam. The review is where you improve. For every question you got wrong, or guessed, write one line in an error log:</p>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Question</th><th>Domain / topic</th><th>Why I chose the wrong answer</th><th>Rule to remember</th></tr></thead>
        <tbody><tr><td>Exam 2, Q47</td><td>People · conflict</td><td>I escalated to the sponsor too early.</td><td>Talk to the team members first; escalate last.</td></tr>
        <tr><td>Exam 2, Q103</td><td>Process · agile change</td><td>I used a change request in a Scrum project.</td><td>New work in agile goes to the product owner and the backlog.</td></tr></tbody>
      </table></div>
      <p>Group the reasons. Most candidates find that 70% of their errors come from three or four repeat patterns. Fixing those patterns raises your score faster than re-reading a whole book.</p>
    </section>

    <section id="exam-day">
      <p class="eyebrow">06 · On the day</p>
      <h2>Exam-day tips</h2>
      <ul>
        <li><strong>Pace yourself.</strong> 240 minutes for 180 questions is about 1 minute 20 seconds per question. Check your progress at each break.</li>
        <li><strong>Read the last sentence first.</strong> It tells you what is being asked: the first step, the best response or what to do next.</li>
        <li><strong>Eliminate two answers.</strong> Usually two options break a mindset rule. Choose between the remaining two.</li>
        <li><strong>Flag and move on.</strong> Don't spend five minutes on one question. Answer, flag it and come back if you have time.</li>
        <li><strong>Take the breaks.</strong> A short break helps you focus on the next section.</li>
        <li><strong>Answer every question.</strong> There is no penalty for a wrong answer.</li>
      </ul>
    </section>

    <section id="faq" class="faq">
      <p class="eyebrow">07 · FAQ</p>
      <h2>Frequently asked questions</h2>
      <h3>How long does it take to study for the PMP?</h3>
      <p>Most working professionals need 8 to 12 weeks of steady study, about 80 to 120 hours in total. Your experience matters: someone who already works in agile and predictive projects usually needs less time.</p>
      <h3>How many practice questions should I do?</h3>
      <p>Aim for at least 800 to 1,000 questions, including three to five full timed mock exams. Five full PMPORT exams give you 900 questions for free.</p>
      <h3>Is the PMBOK Guide enough to pass?</h3>
      <p>No. The exam is based on the Exam Content Outline, which draws on several references, and around 60% of it covers agile and hybrid approaches. Combine a 35-hour course, practice questions and the mindset.</p>
      <h3>What score do I need to pass?</h3>
      <p>PMI does not publish a passing score. Results show pass or fail, with a rating for each domain. Consistently scoring 70% or more on realistic mock exams is a good sign you are ready.</p>
      <h3>Can I prepare for the PMP for free?</h3>
      <p>You can do most of your preparation for free: the ECO, practice exams, videos and articles. You still need 35 hours of qualifying training and the exam fee. See <a routerLink="/resources/best-free-pmp-practice-exams">the best free PMP practice exams</a>.</p>
    </section>

    <section class="card">
      <h2>Start practising now</h2>
      <p>The fastest way to know where you stand is to answer real exam-style questions today.</p>
      <div class="cta"><a class="button primary" routerLink="/pm-faciliter/pmp-exam-simulator">Open the free PMP exam simulator</a><a class="button secondary" routerLink="/resources/best-free-pmp-practice-exams">Compare free practice exams</a><a class="button secondary" routerLink="/pm-faciliter">PMP preparation hub</a></div>
    </section>

    <section id="sources" class="sources">
      <h2>Sources</h2>
      <ol>
        <li><a href="https://www.pmi.org/certifications/project-management-pmp" target="_blank" rel="noopener">PMI: Project Management Professional (PMP)® certification</a>. Eligibility, training and exam length.</li>
        <li><a href="https://prepsolution.com/blog/pmp-exam-changes-2026" target="_blank" rel="noopener">PrepSolution: PMP exam changes 2026, what changed on July 9</a>. Domains, tasks and question types.</li>
        <li><a href="https://www.velociteach.com/resources/pmp-exam-change/" target="_blank" rel="noopener">Velociteach: PMI PMP exam change announcements</a>. Scored questions, time and the predictive vs agile split.</li>
      </ol>
      <p class="note">PMP®, CAPM®, PMBOK® and PMI® are registered marks of Project Management Institute, Inc. PMPORT is not affiliated with PMI. Exam details were checked in October 2026. Always confirm current rules with PMI.</p>
    </section>
  </article>`,
  styles:[PMP_GUIDE_STYLES]
})
export class PmpStudyGuideComponent{}
