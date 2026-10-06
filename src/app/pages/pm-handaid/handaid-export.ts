// Small standards-based encoders keep this page independent of other tools.
export function encodeGif(image:ImageData):Uint8Array{
 const {width,height,data}=image,bytes:number[]=[];
 const byte=(n:number)=>bytes.push(n&255),word=(n:number)=>{byte(n);byte(n>>8)};
 for(const c of 'GIF89a')byte(c.charCodeAt(0));
 word(width);word(height);byte(0xf7);byte(0);byte(0);
 for(let i=0;i<256;i++){byte(Math.round(((i>>5)&7)*255/7));byte(Math.round(((i>>2)&7)*255/7));byte(Math.round((i&3)*255/3))}
 byte(0x2c);word(0);word(0);word(width);word(height);byte(0);byte(8);
 const packed:number[]=[];let buffer=0,bits=0,count=0;
 const code=(n:number)=>{buffer|=n<<bits;bits+=9;while(bits>=8){packed.push(buffer&255);buffer>>>=8;bits-=8}};
 code(256);
 for(let i=0;i<data.length;i+=4){
  // Reset before the dictionary would require ten-bit codes.
  if(count===200){code(256);count=0}
  code((Math.round(data[i]*7/255)<<5)|(Math.round(data[i+1]*7/255)<<2)|Math.round(data[i+2]*3/255));count++;
 }
 code(257);if(bits)packed.push(buffer&255);
 for(let i=0;i<packed.length;i+=255){const block=packed.slice(i,i+255);byte(block.length);bytes.push(...block)}
 byte(0);byte(0x3b);return new Uint8Array(bytes);
}
const xml=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function crc32(data:Uint8Array){let crc=0xffffffff;for(const b of data){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
export function zipStored(files:{name:string;data:Uint8Array}[]):Uint8Array{
 const out:number[]=[],central:number[]=[],encoder=new TextEncoder();
 const put=(target:number[],value:number,size:number)=>{for(let i=0;i<size;i++)target.push((value>>>(8*i))&255)};
 for(const file of files){const name=encoder.encode(file.name),crc=crc32(file.data),offset=out.length;
  put(out,0x04034b50,4);put(out,20,2);put(out,0,2);put(out,0,2);put(out,0,2);put(out,0x21,2);put(out,crc,4);put(out,file.data.length,4);put(out,file.data.length,4);put(out,name.length,2);put(out,0,2);
  out.push(...name);for(const b of file.data)out.push(b);
  put(central,0x02014b50,4);put(central,20,2);put(central,20,2);put(central,0,2);put(central,0,2);put(central,0,2);put(central,0x21,2);put(central,crc,4);put(central,file.data.length,4);put(central,file.data.length,4);put(central,name.length,2);put(central,0,2);put(central,0,2);put(central,0,2);put(central,0,2);put(central,0,4);put(central,offset,4);central.push(...name);
 }
 const start=out.length;out.push(...central);put(out,0x06054b50,4);put(out,0,2);put(out,0,2);put(out,files.length,2);put(out,files.length,2);put(out,central.length,4);put(out,start,4);put(out,0,2);
 return new Uint8Array(out);
}
export function encodeDocx(pages:{png:Uint8Array;text:string}[]):Uint8Array{
 const enc=new TextEncoder();
 const paragraphs=(text:string)=>text.split('\n').map(line=>'<w:p><w:r><w:t xml:space="preserve">'+xml(line)+'</w:t></w:r></w:p>').join('');
 const drawing='<w:p><w:r><w:drawing><wp:inline><wp:extent cx="9144000" cy="6096000"/><wp:docPr id="1" name="PM HandAid canvas"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="Canvas"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="9144000" cy="6096000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>';
 const body=pages.map((page,i)=> (i?'<w:p><w:r><w:br w:type="page"/></w:r></w:p>':'')+drawing.replace(/rId1/g,'rId'+(i+1)).replace('id="1"','id="'+(i+1)+'"')+paragraphs(page.text)).join('');
 const relationships='<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+pages.map((_,i)=>'<Relationship Id="rId'+(i+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/canvas'+i+'.png"/>').join('')+'</Relationships>';
 const files=[
 {name:'[Content_Types].xml',text:'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'},
 {name:'_rels/.rels',text:'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'},
 {name:'word/_rels/document.xml.rels',text:relationships},
 {name:'word/document.xml',text:'<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><w:body>'+body+'<w:sectPr><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/></w:sectPr></w:body></w:document>'}
 ];
 return zipStored([...files.map(f=>({name:f.name,data:enc.encode(f.text)})),...pages.map((page,i)=>({name:'word/media/canvas'+i+'.png',data:page.png}))]);
}
