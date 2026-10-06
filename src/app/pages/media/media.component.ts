import {Component,DestroyRef,inject,OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ContentService} from '../../core/services/content.service';
import {MediaVideo} from '../../core/models/portfolio.models';

@Component({
  standalone:true,
  selector:'app-media',
  template:`
    <section class="page">
      <header class="page-header"><p class="eyebrow">Media</p><h1>PMPortLive</h1><p class="lead">Select a video manually, or let the featured display move to the next video every 10 seconds.</p></header>
      @if(selected){
        <div class="player card">
          @if(selected.youtubeVideoId){<iframe [src]="embed(selected.youtubeVideoId)" [title]="selected.title" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>}
          @else{<div class="empty-frame"><strong>YouTube video placeholder</strong><span>Add a video ID to public/data/media.json</span></div>}
          <div class="player-title"><div><h2>{{selected.title}}</h2><p class="muted">{{selected.description}}</p></div><span class="countdown">Next in {{secondsLeft}}s</span></div>
        </div>
      }
      <div class="video-list scroll-list" tabindex="0">
        @for(video of videos;track video.id){<button type="button" [class.active]="selected?.id===video.id" (click)="selectManually(video)"><span>▶</span><div><strong>{{video.title}}</strong><small>{{video.description}}</small></div></button>}
      </div>
      <div class="actions"><a class="button secondary" href="https://www.youtube.com/@pmportlive" target="_blank" rel="noreferrer">Visit YouTube channel ↗</a></div>
    </section>
  `,
  styles:[`
    .player iframe,.empty-frame{width:100%;aspect-ratio:16/9;border:0;border-radius:12px;background:#03101f}.empty-frame{display:grid;place-content:center;text-align:center;gap:.5rem;color:var(--muted)}
    .player-title{display:flex;justify-content:space-between;align-items:start;gap:1rem}.player h2{font-size:clamp(1.5rem,3vw,2.6rem);margin-top:1.4rem}.countdown{white-space:nowrap;margin-top:1.5rem;color:var(--accent);font-size:.78rem}
    .video-list{max-height:390px;margin-top:1.2rem;display:grid;gap:.6rem}.video-list button{display:flex;gap:1rem;text-align:left;background:#09213b;color:#fff;border:1px solid var(--line);border-radius:12px;padding:1rem;cursor:pointer}.video-list button.active{border-color:var(--accent)}.video-list small{display:block;color:var(--muted);margin-top:.3rem}
    @media(max-width:600px){.player-title{display:block}.countdown{display:block;margin-top:.5rem}}
  `]
})
export class MediaComponent implements OnInit {
  private content=inject(ContentService);private sanitizer=inject(DomSanitizer);private destroyRef=inject(DestroyRef);
  videos:MediaVideo[]=[];selected?:MediaVideo;secondsLeft=10;private timer?:ReturnType<typeof setInterval>;

  ngOnInit():void{
    this.content.load<MediaVideo[]>('media.json').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(items=>{
      this.videos=items.filter(item=>item.published).sort((a,b)=>a.priority-b.priority);
      this.selected=this.videos[0];this.restartRotation();
    });
    this.destroyRef.onDestroy(()=>this.stopRotation());
  }
  /** A manual choice restarts the full 10-second viewing period. */
  selectManually(video:MediaVideo):void{this.selected=video;this.restartRotation();}
  private restartRotation():void{
    this.stopRotation();this.secondsLeft=10;if(this.videos.length<2)return;
    this.timer=setInterval(()=>{this.secondsLeft--;if(this.secondsLeft<=0){const current=Math.max(0,this.videos.findIndex(video=>video.id===this.selected?.id));this.selected=this.videos[(current+1)%this.videos.length];this.secondsLeft=10;}},1000);
  }
  private stopRotation():void{if(this.timer){clearInterval(this.timer);this.timer=undefined;}}
  embed(id:string){return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${id}`);}
}
