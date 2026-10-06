import {AsyncPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component,inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {RouterLink} from '@angular/router';
import {finalize,map} from 'rxjs';

interface AboutVideo {title:string;description:string;youtubeVideoId:string}

@Component({
  standalone:true,
  selector:'app-about',
  imports:[AsyncPipe,FormsModule,RouterLink],
  template:`
    <section class="page about-page">
      <header class="page-header"><p class="eyebrow">Portfolio · About Alamgir</p><h1>Md Alamgir Hossain</h1><img src="my_profile_pic.png" alt="Md Alamgir Hossain" style="width:160px;height:180px;object-fit:cover;border-radius:18px;margin-top:24px"><p class="lead">I am a project management and business information systems professional in Regina, Saskatchewan. My work sits where project leadership, systems analysis and data-informed decision making meet.</p></header>

      <div class="grid two">
        <article class="card"><h2>How I work</h2><p class="muted">I translate complex requirements into practical plans, make progress visible, and help multidisciplinary teams stay aligned around value. My approach combines structured delivery with curiosity and continuous learning.</p></article>
        <article class="card"><h2>What I bring</h2><ul class="values"><li>Project and program leadership</li><li>Business and systems analysis</li><li>Stakeholder facilitation</li><li>Data storytelling and dashboards</li><li>Web and information systems</li></ul></article>
      </div>
<section class="section-block"><div class="grid three"><article class="card"><h3>15+ years</h3><p class="muted">Leadership experience</p></article><article class="card"><h3>3 programs</h3><p class="muted">BBA · MBA · BIS</p></article><article class="card"><h3>PMP® · CSM®</h3><p class="muted">Professional practice</p></article></div></section>
      <div class="actions"><a class="button primary" routerLink="/education">View education</a><a class="button secondary" routerLink="/credentials">View credentials</a></div>

      <!-- Change the live or recorded YouTube video in public/data/about-video.json. -->
      <section class="about-video section-block">
        <p class="eyebrow">Live & featured</p>
        @if(video$|async;as video){
          <article class="card video-card">
            @if(video.youtubeVideoId){<iframe [src]="embed(video.youtubeVideoId)" [title]="video.title" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>}
            @else{<div class="video-placeholder">Featured video coming soon</div>}
            <h2>{{video.title}}</h2><p class="muted">{{video.description}}</p>
          </article>
        }
      </section>

      <!-- Contact was moved here from its former standalone page. The API behaviour is unchanged. -->
      <section id="contact" class="contact-section section-block">
        <header class="page-header"><p class="eyebrow">Contact</p><h2>Let’s make the next step clear.</h2><p class="lead">Send a message about a project, collaboration, training request or professional opportunity.</p></header>
        <div class="contact-grid">
          <form class="card form-grid" #form="ngForm" (ngSubmit)="send(form.valid)">
            <div class="field"><label for="name">Name</label><input id="name" name="name" [(ngModel)]="model.name" required></div>
            <div class="field"><label for="email">Email</label><input id="email" name="email" [(ngModel)]="model.email" type="email" required></div>
            <div class="field"><label for="subject">Subject</label><input id="subject" name="subject" [(ngModel)]="model.subject" required></div>
            <div class="field"><label for="message">Message</label><textarea id="message" name="message" [(ngModel)]="model.message" required></textarea></div>
            <input class="honey" name="company" [(ngModel)]="model.company" tabindex="-1" autocomplete="off" aria-hidden="true">
            <button class="button primary" [disabled]="sending||!form.valid">{{sending?'Sending…':'Send message'}}</button>
            @if(status){<p class="status" [class.error]="failed">{{status}}</p>}
          </form>
          <aside>
            <div class="card"><span class="eyebrow">Direct</span><a class="email" href="mailto:alamgircanb@gmail.com">alamgircanb&#64;gmail.com</a><p class="muted">Regina, Saskatchewan, Canada</p></div>
            <div class="card availability"><span class="dot"></span><div><strong>Open to conversation</strong><p class="muted">Project leadership · Business systems · Training</p></div></div>
          </aside>
        </div>
      </section>
    </section>
  `,
  styles:[`
    .values{padding-left:1.2rem;line-height:2;color:#c8d8e8}.video-card{padding:clamp(1rem,3vw,1.7rem)}
    .video-card iframe,.video-placeholder{width:100%;aspect-ratio:16/9;border:0;border-radius:14px;background:#03101f}
    .video-placeholder{display:grid;place-items:center;color:var(--muted)}.video-card h2{font-size:clamp(1.5rem,3vw,2.5rem);margin-top:1.3rem}
    .contact-section{scroll-margin-top:90px}.contact-grid{display:grid;grid-template-columns:1.3fr .7fr;gap:1rem}.contact-grid aside{display:grid;align-content:start;gap:1rem}
    .email{font-size:clamp(1rem,2vw,1.35rem);color:var(--accent)}.availability{display:flex;align-items:center;gap:1rem}.dot{width:12px;height:12px;border-radius:50%;background:#61e298;box-shadow:0 0 0 6px rgba(97,226,152,.12)}
    .availability p{margin:.3rem 0}.honey{position:absolute;left:-10000px}@media(max-width:800px){.contact-grid{grid-template-columns:1fr}}
  `]
})
export class AboutComponent {
  private http=inject(HttpClient);
  private sanitizer=inject(DomSanitizer);
  video$=this.http.get<AboutVideo>('data/about-video.json').pipe(map(video=>video));
  model={name:'',email:'',subject:'',message:'',company:''};
  sending=false;status='';failed=false;

  embed(id:string){return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${id}`);}

  send(valid:boolean|null){
    if(!valid)return;
    this.sending=true;this.status='';
    this.http.post<{ok:boolean;message?:string}>('/api/contact',this.model).pipe(finalize(()=>this.sending=false)).subscribe({
      next:()=>{this.failed=false;this.status='Thank you — your message has been sent.';this.model={name:'',email:'',subject:'',message:'',company:''}},
      error:error=>{this.failed=true;this.status=error?.error?.message||'The form could not send. Email alamgircanb@gmail.com directly.'}
    });
  }
}
