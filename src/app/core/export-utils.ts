import {trackDownload} from './analytics';
export function downloadBlob(blob:Blob,name:string){trackDownload(name);const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}

/** Loads the PDF and Excel libraries early, so exports still work if the site is updated while the page is open. */
export function preloadExportLibraries(){import('jspdf').catch(()=>{});import('xlsx').catch(()=>{});}

/** A clear message for export errors, including the common case where the site was updated after the page was opened. */
export function exportErrorMessage(e:unknown,what:string){
  const m=String((e as Error)?.message??e);
  if(/dynamically imported module|Importing a module script failed|Loading chunk|ChunkLoadError|MIME type|Failed to fetch/i.test(m))
    return `${what} failed because PMPORT was updated while this page was open. Select "Save on this device", reload the page, then try again. Your saved work stays.`;
  return `${what} failed. Please try again.`;
}

export async function exportWorkbook(title:string,headers:string[],rows:(string|number)[][],name:string){const XLSX=await import('xlsx');const ws=XLSX.utils.aoa_to_sheet([[title],[],headers,...rows]);ws['!cols']=headers.map(()=>({wch:28}));const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Project');XLSX.writeFile(wb,name+'.xlsx');trackDownload(name+'.xlsx')}

/** jsPDF's built-in fonts only cover Western European characters, so common typographic symbols are replaced. */
function pdfText(v:unknown){return String(v??'').replace(/[—–]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/…/g,'...').replace(/[•·]/g,'-').replace(/Σ/g,'Sum ').replace(/[✓✔]/g,'Yes').replace(/[^\x00-\xFF]/g,'?');}

/** Table export to PDF. When a diagram is given, it is added on its own page after the table. */
export async function exportTablePdf(title:string,headers:string[],rows:(string|number)[][],name:string,diagram?:SVGSVGElement){
 const {jsPDF}=await import('jspdf');const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a3',compress:true});const width=doc.internal.pageSize.getWidth(),height=doc.internal.pageSize.getHeight();const margin=12,col=(width-2*margin)/Math.max(headers.length,1);let y=30;doc.setFontSize(15);doc.text(doc.splitTextToSize(pdfText(title),width-24),margin,16);doc.setFontSize(8);
 const maxRowH=height-30;
 const row=(cells:(string|number)[],header=false)=>{let lines=cells.map(c=>doc.splitTextToSize(pdfText(c),col-5) as string[]);
  // A very long cell is cut to fit one page rather than overflowing.
  const maxLines=Math.floor((maxRowH-5)/4);lines=lines.map(l=>l.length>maxLines?[...l.slice(0,maxLines-1),'...']:l);
  const h=Math.max(10,...lines.map(l=>l.length*4+5));if(y+h>height-12){doc.addPage();y=15;if(!header)row(headers,true)}doc.setFont('helvetica',header?'bold':'normal');cells.forEach((_,i)=>{doc.setDrawColor(170,185,195);doc.rect(margin+i*col,y,col,h);doc.text(lines[i],margin+i*col+2,y+5)});y+=h};
 row(headers,true);rows.forEach(r=>row(r));
 if(diagram){
  const img=await svgToPng(diagram);doc.addPage();doc.setFontSize(13);doc.setFont('helvetica','bold');doc.text(pdfText(title+' - preview'),margin,14);
  const scale=Math.min((width-2*margin)/img.w,(height-30)/img.h);doc.addImage(img.dataUrl,'PNG',margin,20,img.w*scale,img.h*scale);
 }
 doc.save(name+'.pdf');trackDownload(name+'.pdf')}

/** Renders an SVG element to a PNG data URL (white background, 2× resolution). */
export async function svgToPng(svg:SVGSVGElement):Promise<{dataUrl:string;w:number;h:number;canvas:HTMLCanvasElement}>{
 const clone=svg.cloneNode(true) as SVGSVGElement;clone.querySelectorAll('[data-editor-only]').forEach(n=>n.remove());clone.setAttribute('xmlns','http://www.w3.org/2000/svg');const box=svg.viewBox.baseVal;const w=box&&box.width||Number(svg.getAttribute('width'))||1200,h=box&&box.height||Number(svg.getAttribute('height'))||800;clone.setAttribute('width',String(w));clone.setAttribute('height',String(h));const source=new XMLSerializer().serializeToString(clone);const url=URL.createObjectURL(new Blob([source],{type:'image/svg+xml'}));
 try{const img=new Image();await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=()=>reject(new Error('Image conversion failed'));img.src=url});const canvas=document.createElement('canvas');canvas.width=w*2;canvas.height=h*2;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
  return {dataUrl:canvas.toDataURL('image/png'),w,h,canvas};}
 finally{URL.revokeObjectURL(url)}
}

export async function exportSvg(svg:SVGSVGElement,name:string,format:'png'|'jpg'|'pdf'){
 const {canvas,w,h,dataUrl}=await svgToPng(svg);
 if(format==='pdf'){const {jsPDF}=await import('jspdf');const pdf=new jsPDF({orientation:w>=h?'landscape':'portrait',unit:'px',format:[w,h],hotfixes:['px_scaling'],compress:true});pdf.addImage(dataUrl,'PNG',0,0,w,h);pdf.save(name+'.pdf');trackDownload(name+'.pdf')}
 else{const blob=await new Promise<Blob>((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error('Export failed')),format==='jpg'?'image/jpeg':'image/png',.94));downloadBlob(blob,name+'.'+format)}
}
