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
    const ld={'@context':'https://schema.org','@type':'Article',headline:page.title.replace(/ \| PMPORT$/,''),description:page.description,image,url,mainEntityOfPage:url,datePublished:page.published,
      author:{'@type':'Person',name:'Md Alamgir Hossain',url:`${SITE}/about`},publisher:{'@type':'Organization',name:'PMPORT',url:SITE,logo:{'@type':'ImageObject',url:`${SITE}/pmporticon.jpg`}}};
    html=html.replace('</head>',`  <script type="application/ld+json" id="seo-article">${JSON.stringify(ld).replace(/</g,'\\u003c')}</script>\n  </head>`);
  }
  const heading=page.title.replace(/ \| PMPORT$/,'').replace(/^PMPORT \| /,'');
  const links=sections.filter(([p])=>p!==path).map(([p,l])=>`<li><a href="/${p}" style="color:#8fe8f5">${esc(l)}</a></li>`).join('');
  const summary=`<app-root><main style="max-width:900px;margin:auto;padding:3rem 1.25rem;font-family:Inter,Arial,sans-serif;color:#eaf3fc"><p style="color:#49cce1;letter-spacing:.15em;font-weight:800;font-size:.75rem">PMPORT</p><h1>${esc(heading)}</h1><p style="color:#b1c3d7;line-height:1.7">${esc(page.description)}</p><nav aria-label="PMPORT sections"><ul style="line-height:1.9">${links}</ul></nav></main></app-root>`;
  return html.replace('<app-root></app-root>',summary);
}

let count=0;const urls=[];
for(const [path,page] of Object.entries(pages)){
  const file=path===''?join(out,'index.html'):join(out,path,'index.html');
  mkdirSync(dirname(file),{recursive:true});
  writeFileSync(file,render(path,page));count++;
  if(!page.noindex)urls.push(`  <url><loc>${SITE}/${path}</loc><lastmod>${page.published||new Date().toISOString().slice(0,10)}</lastmod></url>`);
}
writeFileSync(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
if(!existsSync(join(out,'robots.txt')))throw new Error('robots.txt missing from build output');
console.log(`seo-pages: wrote ${count} page heads and a sitemap with ${urls.length} URLs`);
