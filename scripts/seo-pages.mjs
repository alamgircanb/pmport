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

// Main sections, linked (with a one-line summary) from every generated page so crawlers can find them.
const sections=[
  ['pm-faciliter/pmp-exam-simulator','Free PMP Exam Simulator','Five full-length PMP practice exams with 900 original questions, case studies, timed sections and results by domain.'],
  ['pm-faciliter','PMP Exam Preparation','PMP exam preparation and project management training: video lessons, quizzes, project math practice and a question bank.'],
  ['resources','PM Knowledge Lake','Articles on the PMP mindset, why projects fail, AI for project managers and business analysts, and project management in Canada.'],
  ['pm-tools','PM Artifacts Lab','Free browser tools: project charter, risk and stakeholder registers, earned value, process diagrams and PERT/CPM critical path.'],
  ['pm-learninglink','PM LearningLink','200 popular free YouTube channels and websites for project management, business analysis, data analytics and coding.'],
  ['pm-datalab','PM DataLab','Free graded practice in SQL, Excel, Power BI DAX, Python and status reporting, all on one sample project dataset.'],
  ['media','PMPortLive Videos','Short videos that explain one project management or business analysis concept at a time.'],
  ['pm-jobs-prep','PM JOBS Prep','Practical guidance and practice questions for project manager, PMO analyst and business analyst job interviews.'],
  ['pm-handaid','PM HandAid','A quick reference for everyday project management tasks, terms and techniques.'],
  ['events','PM Events & Gallery','Community events, PMI South Saskatchewan activities and posts from LinkedIn and Facebook.'],
  ['about','About Md Alamgir Hossain','PMP-certified project and program management professional in Regina, Saskatchewan.'],
  ['about-pmport','About PMPORT','Why PMPORT exists: project management, business analysis, technology and data in one place to learn and practise.']
];

// Extra introduction for the home page, which is otherwise only a menu of sections.
const homeIntro=`<p>PMPORT is a free learning and practice hub for project managers, business analysts and data professionals. It was built by Md Alamgir Hossain, PMP, in Regina, Saskatchewan, Canada. Everything on the site is free. No sign-up is needed.</p>
<h2>Prepare for the PMP exam</h2><p>Practise with five full-length PMP exam simulators. They hold 900 original scenario questions in the style of the real exam. Questions cover the People, Process and Business Environment domains. Each answer has an explanation, and you see your results by domain.</p><p>The PMP preparation section adds video lessons, quizzes and project math practice. The article on 111 essential PMP mindsets explains how the exam expects a project manager to think. The exam itself is run by the <a href="https://www.pmi.org/certifications/project-management-pmp" rel="noopener">Project Management Institute (PMI)</a>.</p>
<h2>Learn project management, business analysis and data analytics</h2><p>Read practical articles on why projects fail and how AI is becoming a coworker for project managers. Other articles look at where project management in Canada is heading. Free tools cover project charters, risk registers, stakeholder registers, earned value and critical path analysis.</p><p>PM LearningLink lists 200 hand-picked YouTube channels and websites. They cover project management, business analysis, data analysis (Excel, SQL, Power BI) and coding. You can also watch short PMPortLive videos on <a href="https://www.youtube.com/@pmportlive" rel="noopener">YouTube</a> and follow updates on <a href="https://www.linkedin.com/in/alamgircanb" rel="noopener">LinkedIn</a>.</p>`;

// Share links for the page (LinkedIn, Facebook, X).
const share=url=>{const u=encodeURIComponent(url);return `<p>Share this page: <a href="https://www.linkedin.com/sharing/share-offsite/?url=${u}" rel="noopener">LinkedIn</a> · <a href="https://www.facebook.com/sharer/sharer.php?u=${u}" rel="noopener">Facebook</a> · <a href="https://twitter.com/intent/tweet?url=${u}" rel="noopener">X</a></p>`;};

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
  const links=sections.filter(([p])=>p!==path).map(([p,l,d])=>`<li><a href="/${p}">${esc(l)}</a>. ${esc(d)}</li>`).join('');
  const article=staticArticleHtml(path);
  const intro=article||`<p class="seo-eyebrow">PMPORT</p><h1>${esc(heading)}</h1><p>${esc(page.description)}</p>${path===''?homeIntro:''}`;
  // Styles live in one <style> block (not inline attributes); the Angular app replaces this content once it starts.
  html=html.replace('</head>',`  <style>.seo-summary{max-width:900px;margin:auto;padding:3rem 1.25rem;font-family:Inter,Arial,sans-serif;color:#eaf3fc;line-height:1.7}.seo-summary p{color:#b1c3d7}.seo-summary .seo-eyebrow{color:#49cce1;letter-spacing:.15em;font-weight:800;font-size:.75rem}.seo-summary a{color:#8fe8f5}</style>\n  </head>`);
  const summary=`<app-root><main class="seo-summary">${intro}<nav aria-label="PMPORT sections"><h2>Explore PMPORT</h2><ul>${links}</ul></nav>${share(url)}</main></app-root>`;
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
