import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {PMP_GUIDE_STYLES} from './pmp-guide-styles';

/** Honest comparison of free PMP practice exams and simulators. Static text so it is also in the pre-built HTML. */
@Component({
  standalone:true,selector:'app-free-pmp-exams',imports:[RouterLink],
  template:`
  <article class="page guide">
    <a routerLink="/resources" class="back">← Knowledge Lake</a>
    <header class="article-hero">
      <img src="free-pmp-practice-exams.webp" alt="A PMP practice exam question card with a correct answer, a four-hour exam timer and a results chart" width="1600" height="900" fetchpriority="high">
      <div class="hero-overlay">
        <p class="eyebrow">PMP exam prep · Comparison</p>
        <h1>Best Free PMP Practice Exams and Simulators (2026)</h1>
        <p class="hero-lead">Which free PMP practice tests are worth your time, what each one really gives you, and how to use them together.</p>
        <p class="byline">Md Alamgir Hossain, PMP® · Checked October 14, 2026 · 9-minute read</p>
      </div>
    </header>

    <section class="card">
      <p>Practice exams are the most important part of PMP preparation. They train you to read long scenarios, choose the best answer under time pressure and think the way PMI expects. You do not have to pay for most of them.</p>
      <p>We checked what each free option actually includes in October 2026: how many questions, whether you need an account, whether answers are explained and whether the questions match the exam that started on July 9, 2026. <strong>Full disclosure:</strong> PMPORT is our own site, and it is listed first. We describe every option, including ours, using the same facts.</p>
    </section>

    <section id="table">
      <p class="eyebrow">At a glance</p>
      <h2>Free PMP practice exams compared</h2>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Resource</th><th>Free questions</th><th>Sign-up</th><th>Explanations</th><th>Best for</th></tr></thead>
        <tbody>
          <tr><td><a routerLink="/pm-faciliter/pmp-exam-simulator"><strong>PMPORT PMP Exam Simulator</strong></a></td><td>900 in 5 full 180-question exams</td><td>None</td><td>Yes, for every question</td><td>Full-length timed practice and domain results, with no account</td></tr>
          <tr><td><a href="https://mpug.com/pmp-practice-exam" target="_blank" rel="noopener"><strong>MPUG PMP Practice Exam</strong></a></td><td>350+ in a bank; build exams of 20 to 180 questions</td><td>Free account</td><td>Yes</td><td>Custom-length tests aligned to the July 2026 outline</td></tr>
          <tr><td><a href="https://www.pm-exam-simulator.com/pmp-exam-simulator/free-pmp-exam-simulator" target="_blank" rel="noopener"><strong>PM PrepCast free simulator</strong></a></td><td>69 in 3 short exams</td><td>Registration; 7-day access</td><td>Yes, for each answer choice</td><td>A taste of a well-known paid simulator</td></tr>
          <tr><td><strong>Oliver Lehmann sample questions</strong></td><td>75-question online test plus 175 as a PDF</td><td>Not required for the PDF</td><td>Answer key</td><td>Hard situational questions (older exam versions)</td></tr>
          <tr><td><a href="https://www.pmi.org/shop/p-/digital-product/pmp-pmi-study-hall-essentials-subscription/dp080" target="_blank" rel="noopener"><strong>PMI Study Hall</strong></a> (paid)</td><td>None free; 2 to 3 full exams in the subscription</td><td>PMI account and subscription</td><td>Yes</td><td>Official PMI question style, if you can pay</td></tr>
        </tbody>
      </table></div>
      <p class="note">Question counts and access rules come from each provider's own page in October 2026 and can change. Check before you rely on them.</p>
    </section>

    <section id="reviews">
      <p class="eyebrow">In detail</p>
      <h2>What each option is good for</h2>

      <h3>1. PMPORT PMP Exam Simulator: 900 free questions, no account</h3>
      <p>PMPORT offers five full-length practice exams, each with 180 original scenario questions across the People, Process and Business Environment domains. You can take a full mock exam with timed sections, case studies and breaks, or use practice mode to drill one domain or task, with the explanation shown straight away. Results are shown by domain, so you can see where to focus. Your progress stays in your browser, and you don't need to sign up.</p>
      <p><strong>Good to know:</strong> the questions are original practice material written by a PMP-certified project manager, not official PMI questions. Pair them with the mindset in our <a routerLink="/resources/111-essential-pmp-mindsets">111 Essential PMP Mindsets</a> guide.</p>

      <h3>2. MPUG PMP Practice Exam: flexible length</h3>
      <p>MPUG lets you build practice exams from a bank of more than 350 questions, choosing 20, 40, 60, 80, 120 or 180 questions per exam. Every question has an explanation. The site says its content is aligned with the July 2026 Exam Content Outline. You need a free account to save progress, but no credit card.</p>

      <h3>3. PM PrepCast free simulator: a short trial</h3>
      <p>The PrepCast free version gives you three exams with 69 questions in total, with detailed explanations for each answer choice. Access lasts 7 days after registration. It's a good way to try the style of one of the best-known paid simulators before deciding whether to buy.</p>

      <h3>4. Oliver Lehmann's sample questions: hard, but older</h3>
      <p>Oliver Lehmann's free questions have been popular with PMP candidates for many years: a 75-question timed online test and 175 more as a PDF. They are known for being difficult and situational, which is useful practice for reasoning. They were written for earlier versions of the exam, so they contain fewer agile and hybrid questions than today's exam.</p>

      <h3>5. PMI Study Hall: official, but paid</h3>
      <p>Study Hall is PMI's own practice platform. It's not free: it's a subscription, with 3 months of access in each billing period. It includes full-length practice exams, mini exams, case studies, flashcards and lessons. If your budget allows one paid tool, many candidates choose this one because the questions come from PMI.</p>
    </section>

    <section id="how">
      <p class="eyebrow">Strategy</p>
      <h2>How to use free practice exams well</h2>
      <ol>
        <li><strong>Start with a short diagnostic.</strong> 40 to 60 questions in practice mode show your weakest domain.</li>
        <li><strong>Study by domain, then practise by domain.</strong> Follow the <a routerLink="/resources/pmp-study-guide-8-week-plan">8-week PMP study plan</a>.</li>
        <li><strong>Take at least three full timed exams.</strong> 180 questions in 240 minutes builds the stamina you need.</li>
        <li><strong>Review twice as long as you test.</strong> Keep an error log of why you chose each wrong answer.</li>
        <li><strong>Mix sources.</strong> Different writers phrase scenarios differently, which stops you memorizing one question bank.</li>
        <li><strong>Book when you score 70% or more consistently</strong> on realistic, full-length mocks.</li>
      </ol>
      <div class="callout"><p><strong>Beware of "real exam dumps".</strong> Sites that claim to sell actual PMP questions break PMI's rules and can cost you your certification. Use original practice questions only.</p></div>
    </section>

    <section id="faq" class="faq">
      <p class="eyebrow">FAQ</p>
      <h2>Frequently asked questions</h2>
      <h3>What is the best free PMP exam simulator?</h3>
      <p>For full-length timed practice with no sign-up, PMPORT gives 900 questions in five 180-question exams. For flexible custom-length tests, MPUG is a good free option. Using two sources is better than one.</p>
      <h3>Are free PMP practice questions as good as paid ones?</h3>
      <p>Some are. Check that the questions are scenario-based, explain every answer and reflect the July 2026 exam, with about 60% agile and hybrid content.</p>
      <h3>How many full mock exams should I take before the PMP?</h3>
      <p>At least three timed, full-length mock exams, with careful review after each one. Many successful candidates take four or five.</p>
    </section>

    <section class="card">
      <h2>Try a full free PMP exam now</h2>
      <p>No account, no payment. Take a full timed mock exam, or drill one domain in practice mode.</p>
      <div class="cta"><a class="button primary" routerLink="/pm-faciliter/pmp-exam-simulator">Start the PMPORT simulator</a><a class="button secondary" routerLink="/resources/pmp-study-guide-8-week-plan">Read the 8-week study plan</a></div>
    </section>

    <section id="sources" class="sources">
      <h2>Sources</h2>
      <ol>
        <li><a href="https://mpug.com/pmp-practice-exam" target="_blank" rel="noopener">MPUG: PMP Practice Exam</a></li>
        <li><a href="https://www.pm-exam-simulator.com/pmp-exam-simulator/free-pmp-exam-simulator" target="_blank" rel="noopener">PM PrepCast: Free PMP Exam Simulator</a></li>
        <li><a href="https://www.parallelprojecttraining.com/blog/free-pmp-exam-prep-websites/" target="_blank" rel="noopener">Parallel Project Training: Free PMP exam prep websites</a> (Oliver Lehmann question counts)</li>
        <li><a href="https://www.pmi.org/shop/p-/digital-product/pmp-pmi-study-hall-essentials-subscription/dp080" target="_blank" rel="noopener">PMI: Study Hall Essentials subscription</a></li>
        <li><a href="https://www.pmi.org/certifications/project-management-pmp" target="_blank" rel="noopener">PMI: PMP certification</a></li>
      </ol>
      <p class="note">PMP®, PMI® and PMBOK® are registered marks of Project Management Institute, Inc. PMPORT is not affiliated with PMI or with the other providers listed. Information was checked on October 14, 2026.</p>
    </section>
  </article>`,
  styles:[PMP_GUIDE_STYLES]
})
export class FreePmpExamsComponent{}
