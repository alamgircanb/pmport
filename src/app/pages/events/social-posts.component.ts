import {AfterViewInit,Component,DestroyRef,ElementRef,NgZone,inject,Input,OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ContentService} from '../../core/services/content.service';
import {SocialPost} from '../../core/models/portfolio.models';

/**
 * Facebook and LinkedIn posts and events, shown like the Media player.
 * Add items to public/data/social-posts.json — only the post's link ("url") is needed.
 * Posts are embedded; events (and anything that can't be embedded) show as a link card.
 */
@Component({
  standalone:true,
  selector:'app-social-posts',
  imports:[RouterLink],
  template:`
    @if(posts.length){
      <section class="social" [class.section-block]="!compact" [class.compact]="compact">
        @if(compact){<div class="compact-head"><p class="eyebrow">Posts & events</p><a routerLink="/events" fragment="posts">See all posts</a></div>}
        @else{<p class="eyebrow" id="posts">Posts & events</p><h2>From LinkedIn and Facebook</h2>}
        <div class="social-layout">
          <div class="player card" (mouseenter)="hover=true" (mouseleave)="hover=false" (focusin)="hover=true" (focusout)="hover=false">
            @if(selected){
              @if(frame(selected);as src){
                <div class="frame-wrap">@if(inView){<iframe [src]="src" [title]="selected.title" [style.height.px]="compact?460:(selected.height||defaultHeight(selected))" loading="lazy" allowfullscreen></iframe>}@else{<div class="frame-placeholder" [style.height.px]="compact?460:(selected.height||defaultHeight(selected))"></div>}</div>
              }@else{
                <div class="link-card"><span class="badge" [class.fb]="selected.platform==='facebook'">{{label(selected)}}</span><strong>{{selected.title}}</strong>@if(selected.date){<small>{{selected.date}}</small>}<p class="muted">{{selected.description}}</p><a class="button primary" [href]="selected.url" target="_blank" rel="noreferrer">Open on {{label(selected)}} ↗</a></div>
              }
              <nav class="post-controls" aria-label="Post navigation"><button type="button" class="button secondary" (click)="step(-1)" [disabled]="posts.length<2" aria-label="Previous post">‹ Previous</button><a class="button small secondary" [href]="selected.url" target="_blank" rel="noreferrer">View on {{label(selected)}} ↗</a><button type="button" class="button secondary" (click)="step(1)" [disabled]="posts.length<2" aria-label="Next post">Next ›</button></nav>
            }
          </div>
          @if(!compact){<div class="post-list scroll-list" tabindex="0" aria-label="All posts and events">
            @for(p of posts;track p.id){<button type="button" [class.active]="selected?.id===p.id" (click)="choose(p)"><span class="badge" [class.fb]="p.platform==='facebook'">{{p.platform==='facebook'?'f':'in'}}</span><div><strong>{{p.title}}</strong>@if(p.date){<small>{{p.date}}</small>}@if(p.description){<small>{{p.description}}</small>}</div></button>}
          </div>}
        </div>
      </section>
    }
  `,
  styles:[`
    .social h2{margin-bottom:1.3rem}
    .social-layout{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:1rem;align-items:start}
    .frame-wrap{display:flex;justify-content:center;background:#fff;border-radius:12px;overflow:hidden}
    :host{display:block}
    .frame-placeholder{width:100%;max-width:552px;background:#fff}
    .frame-wrap iframe{width:100%;max-width:552px;border:0;display:block;background:#fff}
    .link-card{display:grid;gap:.7rem;justify-items:start;padding:2rem 1rem;min-height:260px;align-content:center}
    .link-card strong{font-size:1.5rem;line-height:1.2}
    .post-controls{display:flex;justify-content:space-between;align-items:center;gap:.6rem;margin-top:1rem;flex-wrap:wrap}
    .post-list{max-height:640px;display:grid;gap:.6rem;align-content:start}
    .post-list button{display:flex;gap:.9rem;text-align:left;background:#09213b;color:#fff;border:1px solid var(--line);border-radius:12px;padding:1rem;cursor:pointer}
    .post-list button.active{border-color:var(--accent)}
    .post-list small{display:block;color:var(--muted);margin-top:.3rem}
    .badge{flex:none;display:inline-grid;place-items:center;min-width:2rem;height:2rem;padding:0 .5rem;border-radius:8px;background:#0a66c2;color:#fff;font-weight:800;font-size:.8rem}
    .badge.fb{background:#1877f2}
    .compact .social-layout{grid-template-columns:1fr}
    .compact .player{padding:1rem}
    .compact-head{display:flex;justify-content:space-between;align-items:baseline;gap:1rem}
    .compact-head a{color:var(--accent)}
    .compact .post-controls .button{min-height:38px;padding:.5rem .8rem}
    @media(max-width:850px){.social-layout{grid-template-columns:1fr}.post-list{max-height:390px}}
  `]
})
export class SocialPostsComponent implements OnInit,AfterViewInit{
  private host=inject(ElementRef<HTMLElement>);private zone=inject(NgZone);
  /** The LinkedIn/Facebook embed is heavy, so it loads only when the section is about to scroll into view. */
  inView=typeof IntersectionObserver==='undefined';
  ngAfterViewInit():void{
    if(this.inView)return;
    const io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){io.disconnect();this.zone.run(()=>this.inView=true);}},{rootMargin:'300px'});
    io.observe(this.host.nativeElement);this.destroyRef.onDestroy(()=>io.disconnect());
  }
  private content=inject(ContentService);private sanitizer=inject(DomSanitizer);private destroyRef=inject(DestroyRef);
  /** Home-page version: player only, no list. */
  @Input() compact=false;
  posts:SocialPost[]=[];selected?:SocialPost;hover=false;private auto=true;private timer?:ReturnType<typeof setInterval>;
  private frames=new Map<string,SafeResourceUrl|null>();

  ngOnInit():void{
    this.content.load<SocialPost[]>('social-posts.json').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next:items=>{this.posts=items.filter(p=>p.published!==false&&p.url).sort((a,b)=>a.priority-b.priority);this.selected=this.posts[0];this.startRotation();
        if(!this.compact&&location.hash==='#posts')setTimeout(()=>document.getElementById('posts')?.scrollIntoView());},
      error:()=>{this.posts=[];}
    });
    this.destroyRef.onDestroy(()=>this.stopRotation());
  }
  /** A visitor who picks a post is reading it, so automatic rotation stops. */
  choose(post:SocialPost):void{this.selected=post;this.auto=false;this.stopRotation();}
  step(direction:number):void{
    if(this.posts.length<2)return;
    const i=Math.max(0,this.posts.findIndex(p=>p.id===this.selected?.id));
    this.choose(this.posts[(i+direction+this.posts.length)%this.posts.length]);
  }
  /** Moves to the next post every 30 seconds, but never while the pointer or keyboard focus is on the post. */
  private startRotation():void{
    this.stopRotation();if(!this.auto||this.posts.length<2)return;
    this.timer=setInterval(()=>{if(this.hover)return;const i=Math.max(0,this.posts.findIndex(p=>p.id===this.selected?.id));this.selected=this.posts[(i+1)%this.posts.length];},30000);
  }
  private stopRotation():void{if(this.timer){clearInterval(this.timer);this.timer=undefined;}}

  label(p:SocialPost):string{return p.platform==='facebook'?'Facebook':'LinkedIn'}
  defaultHeight(p:SocialPost):number{return p.platform==='facebook'?600:640}
  /** Embed address for a post, or null when it can only be shown as a link (events, profiles, unknown links). */
  frame(p:SocialPost):SafeResourceUrl|null{
    if(!this.frames.has(p.id))this.frames.set(p.id,this.buildFrame(p));
    return this.frames.get(p.id)!;
  }
  private buildFrame(p:SocialPost):SafeResourceUrl|null{
    let src:string|null=null;
    if(p.embedUrl){const m=p.embedUrl.match(/src="([^"]+)"/);src=(m?m[1]:p.embedUrl).replace(/&amp;/g,'&');}
    else if(p.platform==='linkedin'){
      const urn=p.url.match(/urn:li:(?:activity|share|ugcPost):\d{15,20}/)?.[0]??(p.url.match(/activity[-:](\d{15,20})/)?`urn:li:activity:${p.url.match(/activity[-:](\d{15,20})/)![1]}`:null);
      if(urn)src=`https://www.linkedin.com/embed/feed/update/${urn}`;
    }else if(p.platform==='facebook'&&!/\/events\//.test(p.url)){
      const video=/\/videos?\/|\/reel\/|\/watch|fb\.watch/.test(p.url);
      src=`https://www.facebook.com/plugins/${video?'video':'post'}.php?href=${encodeURIComponent(p.url)}&show_text=true&width=500`;
    }
    if(!src)return null;
    try{const host=new URL(src).hostname;if(host!=='www.linkedin.com'&&host!=='www.facebook.com')return null;}catch{return null;}
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }
}
