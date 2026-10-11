import {Component,DestroyRef,inject,NgZone,OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ContentService} from '../../core/services/content.service';
import {MediaVideo} from '../../core/models/portfolio.models';

@Component({
  standalone:true,
  selector:'app-media',
  template:`
    <section class="page">
      <header class="page-header"><p class="eyebrow">Media</p><h1>PMPortLive</h1><p class="lead">Select a video manually, or let the featured display move to the next video every 30 seconds. While a video is playing it stays on screen until it finishes.</p></header>
      @if(selected){
        <div class="player card">
          @if(selected.youtubeVideoId){<iframe #player (load)="listen(player)" [src]="embed(selected.youtubeVideoId)" [title]="selected.title" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>}
          @else{<div class="empty-frame"><strong>YouTube video placeholder</strong><span>Add a video ID to public/data/media.json</span></div>}
          <nav class="video-controls" aria-label="Video navigation"><button type="button" class="button secondary" (click)="step(-1)" [disabled]="videos.length<2" aria-label="Previous video">‹ Previous</button><button type="button" class="button secondary" (click)="step(1)" [disabled]="videos.length<2" aria-label="Next video">Next ›</button></nav>
          <div class="player-title"><div><h2>{{selected.title}}</h2><p class="muted">{{selected.description}}</p></div></div>
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
    .video-controls{display:flex;justify-content:space-between;gap:1rem;margin-top:1rem}.video-controls button:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
    .player-title{display:flex;justify-content:space-between;align-items:start;gap:1rem}.player h2{font-size:clamp(1.5rem,3vw,2.6rem);margin-top:1.4rem}
    .video-list{max-height:390px;margin-top:1.2rem;display:grid;gap:.6rem}.video-list button{display:flex;gap:1rem;text-align:left;background:#09213b;color:#fff;border:1px solid var(--line);border-radius:12px;padding:1rem;cursor:pointer}.video-list button.active{border-color:var(--accent)}.video-list small{display:block;color:var(--muted);margin-top:.3rem}
    @media(max-width:600px){.player-title{display:block}}
  `]
})
export class MediaComponent implements OnInit {
  private content=inject(ContentService);private sanitizer=inject(DomSanitizer);private destroyRef=inject(DestroyRef);private zone=inject(NgZone);
  videos:MediaVideo[]=[];selected?:MediaVideo;private playing=false;private timer?:ReturnType<typeof setInterval>;

  ngOnInit():void{
    this.content.load<MediaVideo[]>('media.json').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(items=>{
      this.videos=items.filter(item=>item.published).sort((a,b)=>a.priority-b.priority);
      this.selected=this.videos[0];this.restartRotation();
    });
    const onMessage=(event:MessageEvent)=>this.onPlayerMessage(event);
    window.addEventListener('message',onMessage);
    this.destroyRef.onDestroy(()=>{this.stopRotation();window.removeEventListener('message',onMessage);});
  }
  /** Ask the YouTube player to report play/pause/end so rotation can wait for the video. */
  listen(frame:HTMLIFrameElement):void{
    this.playing=false;
    // The player may not be ready on load, so repeat the handshake a few times (harmless if repeated).
    const hello=JSON.stringify({event:'listening',id:1,channel:'widget'});
    for(const delay of [0,500,1500,3000])setTimeout(()=>frame.contentWindow?.postMessage(hello,'https://www.youtube-nocookie.com'),delay);
  }
  /** Player states: 1 playing, 3 buffering, 2 paused, 0 ended. */
  private onPlayerMessage(event:MessageEvent):void{
    if(!/^https:\/\/www\.youtube(-nocookie)?\.com$/.test(event.origin)||typeof event.data!=='string')return;
    let data:{event?:string;info?:unknown};try{data=JSON.parse(event.data)}catch{return}
    const info=data.info as {playerState?:number}|number|undefined;
    const state=data.event==='onStateChange'?info:typeof info==='object'&&info?info.playerState:undefined;
    if(typeof state!=='number')return;
    this.zone.run(()=>{
      if(state===1||state===3){this.playing=true;this.stopRotation();}
      else if(state===0){this.playing=false;this.restartRotation();}
      else if(state===2){this.playing=true;}
    });
  }
  /** A manual choice restarts the full 30-second viewing period. */
  selectManually(video:MediaVideo):void{this.selected=video;this.playing=false;this.restartRotation();}
  step(direction:number):void{
    if(this.videos.length<2)return;
    const current=Math.max(0,this.videos.findIndex(video=>video.id===this.selected?.id));
    this.selectManually(this.videos[(current+direction+this.videos.length)%this.videos.length]);
  }
  private restartRotation():void{
    this.stopRotation();if(this.videos.length<2||this.playing)return;
    this.timer=setInterval(()=>{const current=Math.max(0,this.videos.findIndex(video=>video.id===this.selected?.id));this.selected=this.videos[(current+1)%this.videos.length];},30000);
  }
  private stopRotation():void{if(this.timer){clearInterval(this.timer);this.timer=undefined;}}
  private embedUrls=new Map<string,ReturnType<DomSanitizer['bypassSecurityTrustResourceUrl']>>();
  embed(id:string){
    if(!this.embedUrls.has(id))this.embedUrls.set(id,this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&origin=${encodeURIComponent(location.origin)}`));
    return this.embedUrls.get(id)!;
  }
}
