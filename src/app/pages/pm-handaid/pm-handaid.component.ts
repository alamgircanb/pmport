import {AfterViewInit,Component,ElementRef,HostListener,ViewChild} from '@angular/core';
import {downloadBlob} from '../../core/export-utils';
import {encodeDocx,encodeGif,zipStored} from './handaid-export';
type Point={x:number;y:number};
type Stroke={points:Point[];color:string;width:number;tool:string};
type Page={strokes:Stroke[];text:string;color:string;fontSize:number};
type Snapshot={pages:Page[];index:number};
@Component({selector:'app-pm-handaid',standalone:true,templateUrl:'./pm-handaid.component.html',styleUrl:'./pm-handaid.component.css'})
export class PMHandAidComponent implements AfterViewInit{
 @ViewChild('paper') paper!:ElementRef<HTMLDivElement>;
 fullscreen=false;private fullscreenFallback=false;
 @HostListener('document:fullscreenchange') syncFullscreen(){this.fullscreen=this.fullscreenFallback||document.fullscreenElement===this.paper.nativeElement}
 @HostListener('document:keydown.escape') exitFallback(){if(this.fullscreenFallback){this.fullscreenFallback=false;this.fullscreen=false}}
 async toggleFullscreen(){const paper=this.paper.nativeElement;if(this.fullscreen){if(document.fullscreenElement===paper)await document.exitFullscreen();this.fullscreenFallback=false;this.fullscreen=false;return}try{if(!paper.requestFullscreen)throw new Error('Fullscreen unavailable');await paper.requestFullscreen();this.fullscreen=true}catch{this.fullscreenFallback=true;this.fullscreen=true}}
 @ViewChild('surface') surface!:ElementRef<HTMLCanvasElement>;
 mode:'write'|'draw'|'type'='write';tool='pen';color='#173349';size=3;fontSize=28;
 pages:Page[]=[this.blank()];index=0;past:Snapshot[]=[];future:Snapshot[]=[];active:Stroke|null=null;pointer:number|null=null;
 busy=false;status='';dirty=false;
 get page(){return this.pages[this.index]}
 blank():Page{return {strokes:[],text:'',color:'#173349',fontSize:28}}
 ngAfterViewInit(){this.render()}
 snapshot():Snapshot{return structuredClone({pages:this.pages,index:this.index})}
 remember(){this.past.push(this.snapshot());this.future=[];this.dirty=true}
 restore(state:Snapshot){this.pages=state.pages;this.index=state.index;this.render()}
 undo(){const state=this.past.pop();if(state){this.future.push(this.snapshot());this.restore(state);this.dirty=true}}
 redo(){const state=this.future.pop();if(state){this.past.push(this.snapshot());this.restore(state);this.dirty=true}}
 addPage(){this.remember();this.pages.push(this.blank());this.index=this.pages.length-1;this.render()}
 deletePage(){this.remember();this.pages.splice(this.index,1);if(!this.pages.length)this.pages.push(this.blank());this.index=Math.min(this.index,this.pages.length-1);this.render()}
 selectPage(i:number){this.index=i;this.render()}
 setMode(mode:'write'|'draw'|'type'){this.mode=mode;this.render()}
 updateText(event:Event){const input=event.target as HTMLTextAreaElement,text=input.value;if(text===this.page.text)return;const ctx=this.surface.nativeElement.getContext('2d')!;ctx.font=this.fontSize+'px Arial';let lines=0;for(const paragraph of text.split('\n')){let line='';for(const char of paragraph){if(ctx.measureText(line+char).width>1124&&line){lines++;line=''}line+=char}lines++}if(38+(lines-1)*this.fontSize*1.4+this.fontSize>762){input.value=this.page.text;this.status='This page is full. Add another page to continue typing.';return;}this.remember();this.page.text=text;this.page.color=this.color;this.page.fontSize=this.fontSize;this.render()}
 updateStyle(){if(this.mode==='type'){this.remember();this.page.color=this.color;this.page.fontSize=this.fontSize;this.render()}}
 point(e:PointerEvent):Point{const rect=this.surface.nativeElement.getBoundingClientRect();return {x:Math.max(0,Math.min(1200,(e.clientX-rect.left)*1200/rect.width)),y:Math.max(0,Math.min(800,(e.clientY-rect.top)*800/rect.height))}}
 start(e:PointerEvent){if(this.mode==='type'||this.pointer!==null||e.button>0)return;e.preventDefault();this.remember();this.pointer=e.pointerId;this.surface.nativeElement.setPointerCapture(e.pointerId);this.active={points:[this.point(e)],color:this.color,width:this.size,tool:this.mode==='write'?'pen':this.tool};this.render()}
 move(e:PointerEvent){if(!this.active||this.pointer!==e.pointerId)return;e.preventDefault();if(this.active.tool==='pen')this.active.points.push(this.point(e));else this.active.points[1]=this.point(e);this.render()}
 finish(e:PointerEvent){if(this.pointer!==e.pointerId||!this.active)return;this.page.strokes.push(this.active);this.active=null;this.pointer=null;this.render()}
 paint(ctx:CanvasRenderingContext2D,stroke:Stroke){const a=stroke.points[0],b=stroke.points.at(-1)!;ctx.strokeStyle=stroke.color;ctx.fillStyle=stroke.color;ctx.lineWidth=stroke.width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
 if(stroke.tool==='rectangle')ctx.rect(a.x,a.y,b.x-a.x,b.y-a.y);
 else if(stroke.tool==='ellipse')ctx.ellipse((a.x+b.x)/2,(a.y+b.y)/2,Math.abs(b.x-a.x)/2,Math.abs(b.y-a.y)/2,0,0,Math.PI*2);
 else if(stroke.tool==='line'){ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y)}
 else{ctx.moveTo(a.x,a.y);for(const p of stroke.points.slice(1))ctx.lineTo(p.x,p.y);if(stroke.points.length===1){ctx.arc(a.x,a.y,stroke.width/2,0,Math.PI*2);ctx.fill()}}
 ctx.stroke();}
 text(ctx:CanvasRenderingContext2D,page:Page){ctx.font=page.fontSize+'px Arial';ctx.fillStyle=page.color;ctx.textBaseline='top';let y=38;const step=page.fontSize*1.4;
 for(const paragraph of page.text.split('\n')){let line='';for(const char of paragraph){if(ctx.measureText(line+char).width>1124&&line){ctx.fillText(line,38,y);y+=step;line=''}line+=char}ctx.fillText(line,38,y);y+=step}}
 renderPage(canvas:HTMLCanvasElement,page:Page,showText=true){const ctx=canvas.getContext('2d')!;ctx.clearRect(0,0,1200,800);ctx.fillStyle='#faf7ef';ctx.fillRect(0,0,1200,800);for(const stroke of page.strokes)this.paint(ctx,stroke);if(showText)this.text(ctx,page);return ctx}
 render(){if(!this.surface)return;const ctx=this.renderPage(this.surface.nativeElement,this.page,this.mode!=='type');if(this.active)this.paint(ctx,this.active)}
 canvas(page:Page){const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=800;this.renderPage(canvas,page);return canvas}
 async bytes(canvas:HTMLCanvasElement,type:string){const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Export failed')),type,.94));return new Uint8Array(await blob.arrayBuffer())}
 async export(format:'docx'|'pdf'|'jpeg'|'gif'){
 this.busy=true;this.status='Preparing download…';try{
 const canvases=this.pages.map(page=>this.canvas(page));
 if(format==='pdf'){const {jsPDF}=await import('jspdf');const pdf=new jsPDF({orientation:'landscape',unit:'px',format:[1200,800],hotfixes:['px_scaling'],compress:true});canvases.forEach((canvas,i)=>{if(i)pdf.addPage([1200,800],'landscape');pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,0,1200,800)});pdf.save('PM-HandAid.pdf')}
 else if(format==='docx'){const entries=await Promise.all(canvases.map(async(canvas,i)=>({png:await this.bytes(canvas,'image/png'),text:this.pages[i].text})));downloadBlob(new Blob([encodeDocx(entries)],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}),'PM-HandAid.docx')}
 else{const files=await Promise.all(canvases.map(async(canvas,i)=>({name:'PM-HandAid-page-'+(i+1)+'.'+format,data:format==='gif'?encodeGif(canvas.getContext('2d')!.getImageData(0,0,1200,800)):await this.bytes(canvas,'image/jpeg')})));
 if(files.length===1)downloadBlob(new Blob([files[0].data],{type:format==='gif'?'image/gif':'image/jpeg'}),files[0].name);else downloadBlob(new Blob([zipStored(files)],{type:'application/zip'}),'PM-HandAid-'+format+'-pages.zip')}
 this.dirty=false;this.status='Download ready. Your pages are still available.';
 }catch(error){this.status='Could not export. Your work is still here; please try again.';console.error(error)}finally{this.busy=false}
 }
}
