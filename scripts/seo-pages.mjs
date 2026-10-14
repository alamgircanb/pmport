// Runs after `ng build`. For every page in src/app/core/seo/seo-pages.json it writes
// <page>/index.html with that page's own title, description, canonical URL, social-preview
// tags, structured data and a short readable summary, so search engines and LinkedIn see
// page-specific content before the Angular app loads. It also regenerates sitemap.xml.
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const out=join(root,'dist/portfolio/browser');
const SITE='https://pmport.ca';
const pages=JSON.parse(readFileSync(join(root,'src/app/core/seo/seo-pages.json'),'utf8'));
const template=readFileSync(join(out,'index.html'),'utf8');
// Article pages: their component files. The static part of each article's text (headings, paragraphs,
// references) is copied into the generated HTML, so crawlers that do not run JavaScript still read the article.
const articleSources={
  'resources/future-project-management-canada':'src/app/pages/article/article.component.ts',
  'resources/111-essential-pmp-mindsets':'src/app/pages/pmp-mindsets-article/pmp-mindsets-article.component.ts',
  'resources/claude-for-project-management-business-analysis':'src/app/pages/claude-pm-ba-article/claude-pm-ba-article.component.ts',
  'resources/ai-super-coworker-project-manager-business-analyst':'src/app/pages/ai-coworker-article/ai-coworker-article.component.ts',
  'resources/21-causes-of-project-failure':'src/app/pages/project-failure-article/project-failure-article.component.ts'
};

// Removes Angular-only syntax (@for/@if blocks, {{ }} bindings, [prop]/(event) attributes) and keeps plain HTML.
function staticArticleHtml(path){
  const file=articleSources[path];
  if(!file)return '';
  try{
    const src=readFileSync(join(root,file),'utf8');
    const start=src.indexOf('template:`');
    if(start<0)return '';
    const end=src.indexOf('`',start+10);
    let t=src.slice(start+10,end);
    const blockRe=/(^|[^\w.])@(for|if|else if|else|switch|case|default|defer|placeholder|loading|empty)\b/g;
    let m;
    while((m=blockRe.exec(t))){
      const at=m.index+m[1].length;let i=at+1,paren=0;
      while(i<t.length&&!(t[i]==='{'&&paren===0)){if(t[i]==='(')paren++;else if(t[i]===')')paren--;i++;}
      let depth=0,j=i;
      for(;j<t.length;j++){if(t[j]==='{')depth++;else if(t[j]==='}'&&--depth===0)break;}
      t=t.slice(0,at)+t.slice(j+1);blockRe.lastIndex=at;
    }
    t=t.replace(/\{\{[\s\S]*?\}\}/g,'')
      .replace(/\srouterLink="([^"]*)"/g,' href="$1"')
      .replace(/\s(\[[^\]]+\]|\([^)]+\)|\*\w+)="[^"]*"/g,'')
      .replace(/\s#\w+(?=[\s>])/g,'')
      .replace(/\sfragment="[^"]*"/g,'');
    return /<h1[\s>]/.test(t)?t.trim():'';
  }catch(e){console.warn(`seo-pages: could not read article text for ${path}: ${e.message}`);return '';}
}

const pageName=path=>pages[path]?.label??(pages[path]?pages[path].title.replace(/ \| PMPORT$/,'').replace(/^PMPORT \| /,''):path);
function breadcrumbs(path){
  if(!path)return null;
  const parts=path.split('/');const items=[{name:'Home',url:`${SITE}/`}];
  parts.forEach((_,i)=>{const p=parts.slice(0,i+1).join('/');if(pages[p])items.push({name:pageName(p),url:`${SITE}/${p}`});});
  return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((it,i)=>({'@type':'ListItem',position:i+1,name:it.name,item:it.url}))};
}
const ldScript=(id,data)=>`  <script type="application/ld+json" id="${id}">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>\n  </head>`;

const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// Main sections, linked from every generated page so crawlers can find them.
const sections=[
  ['pm-faciliter/pmp-exam-simulator','Free PMP Exam Simulator'],['pm-faciliter','PMP Exam Preparation'],['resources','PM Knowledge Lake'],
  ['pm-tools','PM Tools & Templates'],['pm-learninglink','PM LearningLink'],['media','PMPortLive Videos'],['pm-jobs-prep','PM JOBS Prep'],
  ['pm-handaid','PM HandAid'],['events','PM Events & Gallery'],['about','About Md Alamgir Hossain'],['about-pmport','About PMPORT']
];

function render(path,page){
  const url=`${SITE}/${path}`;
  const image=`${SITE}/${page.image||'og/default.jpg'}`;
  const robots=page.noindex?'noindex, follow':'index, follow';
  let html=template
    .replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${esc(page.description)}">\n    <meta name="robots" content="${robots}">`)
    .replace(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${url}">`)
    .replace(/<meta property="og:type" content="[^"]*">/,`<meta property="og:type" content="${page.type||'website'}">`)
    .replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${esc(page.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${esc(page.description)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/,`<meta property="og:url" content="${url}">`)
    .replace(/<meta property="og:image" content="[^"]*">/,`<meta property="og:image" content="${image}">`)
    .replace(/<meta name="twitter:card" content="[^"]*">/,`<meta name="twitter:card" content="summary_large_image">\n    <meta name="twitter:title" content="${esc(page.title)}">\n    <meta name="twitter:description" content="${esc(page.description)}">\n    <meta name="twitter:image" content="${image}">`);
  // Let the browser start downloading the page's main picture straight away (faster Largest Contentful Paint).
  if(page.hero)html=html.replace('</head>',`  <link rel="preload" as="image" href="/${page.hero}" fetchpriority="high">\n  </head>`);
  if(page.type==='article'){
    const ld={'@context':'https://schema.org','@type':'Article',headline:page.title.replace(/ \| PMPORT$/,''),description:page.description,image,url,mainEntityOfPage:url,datePublished:page.published,dateModified:page.published,inLanguage:'en-CA',
      author:{'@type':'Person',name:'Md Alamgir Hossain',url:`${SITE}/about`},publisher:{'@type':'Organization',name:'PMPORT',url:SITE,logo:{'@type':'ImageObject',url:`${SITE}/pmporticon.jpg`}}};
    html=html.replace('</head>',ldScript('seo-article',ld));
  }
  const crumbs=breadcrumbs(path);
  if(crumbs)html=html.replace('</head>',ldScript('seo-breadcrumb',crumbs));
  const heading=page.title.replace(/ \| PMPORT$/,'').replace(/^PMPORT \| /,'');
  const links=sections.filter(([p])=>p!==path).map(([p,l])=>`<li><a href="/${p}" style="color:#8fe8f5">${esc(l)}</a></li>`).join('');
  const article=staticArticleHtml(path);
  const intro=article||`<p style="color:#49cce1;letter-spacing:.15em;font-weight:800;font-size:.75rem">PMPORT</p><h1>${esc(heading)}</h1><p style="color:#b1c3d7;line-height:1.7">${esc(page.description)}</p>`;
  const summary=`<app-root><main style="max-width:900px;margin:auto;padding:3rem 1.25rem;font-family:Inter,Arial,sans-serif;color:#eaf3fc">${intro}<nav aria-label="PMPORT sections"><ul style="line-height:1.9">${links}</ul></nav></main></app-root>`;
  return html.replace('<app-root></app-root>',()=>summary);
}

let count=0;const urls=[];
for(const [path,page] of Object.entries(pages)){
  const file=path===''?join(out,'index.html'):join(out,path,'index.html');
  mkdirSync(dirname(file),{recursive:true});
  writeFileSync(file,render(path,page));count++;
  if(!page.noindex)urls.push(`  <url><loc>${SITE}/${path}</loc><lastmod>${page.published||new Date().toISOString().slice(0,10)}</lastmod></url>`);
}
// The digital business card is a separate static page (public/card), so it is listed here by hand.
urls.push(`  <url><loc>${SITE}/card</loc></url>`);
writeFileSync(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
if(!existsSync(join(out,'robots.txt')))throw new Error('robots.txt missing from build output');
console.log(`seo-pages: wrote ${count} page heads and a sitemap with ${urls.length} URLs`);
