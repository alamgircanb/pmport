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
  'resources/21-causes-of-project-failure':'src/app/pages/project-failure-article/project-failure-article.component.ts',
  'resources/pmp-study-guide-8-week-plan':'src/app/pages/pmp-guides/pmp-study-guide.component.ts',
  'resources/best-free-pmp-practice-exams':'src/app/pages/pmp-guides/free-pmp-exams.component.ts',
  'pm-calculators/earned-value-calculator':'src/app/pages/calculators/evm-calculator.component.ts',
  'pm-calculators/pert-three-point-estimate-calculator':'src/app/pages/calculators/pert-calculator.component.ts',
  'pm-calculators/risk-emv-calculator':'src/app/pages/calculators/emv-calculator.component.ts',
  'pm-calculators/npv-roi-payback-calculator':'src/app/pages/calculators/npv-calculator.component.ts',
  'pm-calculators/monte-carlo-schedule-simulator':'src/app/pages/calculators/monte-carlo.component.ts',
  'pm-calculators/sprint-capacity-velocity-calculator':'src/app/pages/calculators/sprint-capacity.component.ts',
  'pm-calculators/communication-channels-calculator':'src/app/pages/calculators/channels-calculator.component.ts'
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
  const term=path.startsWith('pm-glossary/')&&termBySlug.get(path.slice(12));
  if(term)items.push({name:term.term,url:`${SITE}/${path}`});
  return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((it,i)=>({'@type':'ListItem',position:i+1,name:it.name,item:it.url}))};
}
const ldScript=(id,data)=>`  <script type="application/ld+json" id="${id}">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>\n  </head>`;

// Glossary: one generated page per term (src/app/pages/glossary/glossary-data.json), plus lists for the hub pages.
const glossary=JSON.parse(readFileSync(join(root,'src/app/pages/glossary/glossary-data.json'),'utf8'));
const termBySlug=new Map(glossary.map(t=>[t.slug,t]));
// Same rules as termSeo() in src/app/pages/glossary/glossary.ts.
function termSeo(t){
  const short=t.term.replace(/\s*\([^)]*\)\s*$/,'');
  const title=`What Is ${t.term}? Definition & Example | PMPORT`;
  const desc=`${short}: ${t.definition}`.replace(/\s+/g,' ');
  return {title:title.length<=70?title:`${t.term}: Definition | PMPORT`,description:desc.length<=158?desc:desc.slice(0,desc.lastIndexOf(' ',154))+'…'};
}
const customHtml={};const extraHead={};
for(const [i,t] of glossary.entries()){
  const path=`pm-glossary/${t.slug}`;
  const rel=t.related.map(s=>termBySlug.get(s)).filter(Boolean).map(r=>`<li><a href="/pm-glossary/${r.slug}">${escText(r.term)}</a></li>`).join('');
  const prev=glossary[i-1],next=glossary[i+1];
  customHtml[path]=`<p class="seo-eyebrow">${escText(t.category)} · PM Glossary</p><h1>${escText(t.term)}</h1><p>${escText(t.definition)}</p><h2>Example</h2><p>${escText(t.example)}</p>`+
    (rel?`<h2>Related terms</h2><ul>${rel}</ul>`:'')+`<p>${prev?`<a href="/pm-glossary/${prev.slug}">‹ ${escText(prev.term)}</a> · `:''}<a href="/pm-glossary">All glossary terms</a>${next?` · <a href="/pm-glossary/${next.slug}">${escText(next.term)} ›</a>`:''}</p>`;
  extraHead[path]={'@context':'https://schema.org','@type':'DefinedTerm',name:t.term,description:t.definition,url:`${SITE}/${path}`,inDefinedTermSet:{'@type':'DefinedTermSet',name:'PMPORT Project Management Glossary',url:`${SITE}/pm-glossary`}};
}
const byLetter={};for(const t of glossary){(byLetter[t.term[0].toUpperCase()]??=[]).push(t);}
customHtml['pm-glossary']=`<p class="seo-eyebrow">PM Glossary</p><h1>Project management glossary</h1><p>${glossary.length} project management, agile, risk, cost and business analysis terms explained in plain English, each with a real-world example.</p>`+
  Object.entries(byLetter).map(([l,ts])=>`<h2>${l}</h2><ul>${ts.map(t=>`<li><a href="/pm-glossary/${t.slug}">${escText(t.term)}</a>: ${escText(t.definition.split(/(?<=\.)\s/)[0])}</li>`).join('')}</ul>`).join('');
customHtml['pm-calculators']=`<p class="seo-eyebrow">PM Calculators</p><h1>Free project management calculators</h1><p>${escText(pages['pm-calculators'].description)}</p><ul>`+
  Object.entries(pages).filter(([p])=>p.startsWith('pm-calculators/')).map(([p,pg])=>`<li><a href="/${p}">${escText(pg.title.replace(/ \| PMPORT$/,''))}</a>: ${escText(pg.description)}</li>`).join('')+'</ul>';
function escText(v){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// Main sections, linked (with a one-line summary) from every generated page so crawlers can find them.
const sections=[
  ['pm-faciliter/pmp-exam-simulator','Free PMP Exam Simulator','Five full-length PMP practice exams with 900 original questions, case studies, timed sections and results by domain.'],
  ['pm-faciliter','PMP Exam Preparation','PMP exam preparation and project management training: video lessons, quizzes, project math practice and a question bank.'],
  ['resources','PM Knowledge Lake','Articles on the PMP mindset, why projects fail, AI for project managers and business analysts, and project management in Canada.'],
  ['pm-tools','PM Artifacts Lab','Free browser tools: project charter, risk and stakeholder registers, earned value, process diagrams and PERT/CPM critical path.'],
  ['pm-learninglink','PM LearningLink','200 popular free YouTube channels and websites for project management, business analysis, data analytics and coding.'],
  ['pm-datalab','PM DataLab','Free graded practice in SQL, Excel, Power BI DAX, Python and status reporting, all on one sample project dataset.'],
  ['pm-calculators','PM Calculators','Free earned value, PERT, risk EMV, NPV/ROI, Monte Carlo and sprint capacity calculators, each with formulas and a worked example.'],
  ['pm-glossary','PM Glossary','More than 200 project management, agile and business analysis terms explained in plain English with examples.'],
  ['media','PMPortLive Videos','Short videos that explain one project management or business analysis concept at a time.'],
  ['pm-jobs-prep','PM JOBS Prep','Practical guidance and practice questions for project manager, PMO analyst and business analyst job interviews.'],
  ['pm-handaid','PM HandAid','A quick reference for everyday project management tasks, terms and techniques.'],
  ['events','PM Events & Gallery','Community events, PMI South Saskatchewan activities and posts from LinkedIn and Facebook.'],
  ['about','About Md Alamgir Hossain','PMP-certified project and program management professional in Regina, Saskatchewan.'],
  ['about-pmport','About PMPORT','Why PMPORT exists: project management, business analysis, technology and data in one place to learn and practise.']
];

// Extra introduction for the home page, which is otherwise only a menu of sections.
const homeIntro=`<p>PMPORT is a free learning and practice hub for project managers, business analysts and data professionals. It was built by Md Alamgir Hossain, PMP, in Regina, Saskatchewan, Canada. Everything on the site is free. No sign-up is needed.</p>
<h2>Prepare for the PMP exam</h2><p>Practise with five full-length PMP exam simulators. They hold 900 original scenario questions in the style of the real exam. Questions cover the People, Process and Business Environment domains. Each answer has an explanation, and you see your results by domain.</p><p>The PMP preparation section adds video lessons, quizzes and project math practice. The article on 111 essential PMP mindsets explains how the exam expects a project manager to think. The exam itself is run by the <a href="https://www.pmi.org/certifications/project-management-pmp" rel="noopener">Project Management Institute (PMI)</a>. New to the exam? Start with the <a href="/resources/pmp-study-guide-8-week-plan">free PMP study guide and 8-week plan</a>, or compare the <a href="/resources/best-free-pmp-practice-exams">best free PMP practice exams</a>.</p>
<h2>Learn project management, business analysis and data analytics</h2><p>Read practical articles on why projects fail and how AI is becoming a coworker for project managers. Other articles look at where project management in Canada is heading. Free tools cover project charters, risk registers, stakeholder registers, earned value and critical path analysis.</p><p>PM LearningLink lists 200 hand-picked YouTube channels and websites. They cover project management, business analysis, data analysis (Excel, SQL, Power BI) and coding. You can also watch short PMPortLive videos on <a href="https://www.youtube.com/@pmportlive" rel="noopener">YouTube</a> and follow updates on <a href="https://www.linkedin.com/in/alamgircanb" rel="noopener">LinkedIn</a>.</p>
<h2>Practise data skills in PM DataLab</h2><p>PM DataLab is a free practice lab for analysts and project managers. It uses one sample project portfolio with projects, tasks, people and risks. You write real SQL queries and Excel formulas, and each answer is checked at once. You can also answer Power BI DAX questions and run Python pandas code in your browser. The last module walks you through a full portfolio status report, from KPIs to an executive summary.</p>
<h2>Build project documents in PM Artifacts Lab</h2><p>PM Artifacts Lab has 22 free templates you fill in online. They include a project charter, business case, scope statement, WBS, Gantt chart and RACI matrix. You will also find a RAID log, stakeholder register, budget, change request log and status report. Agile teams can use the backlog and user story templates. Diagram Studio draws process maps and data flow diagrams. The PERT/CPM calculator finds the critical path of a schedule. Your work stays in your browser, and you can export a copy.</p>
<h2>Watch, prepare and connect</h2><p>PMPortLive has 25 short videos. Each one explains a single idea, such as risk versus issue or scope creep versus gold plating. PM JOBS Prep helps you get ready for project manager, PMO analyst and business analyst interviews. PM HandAid is a quick reference for terms and techniques you use every day. PM Events &amp; Gallery shares community events and posts, including PMI South Saskatchewan activities.</p>
<h2>Who is behind PMPORT?</h2><p>Md Alamgir Hossain is a PMP-certified project and program management professional with more than 12 years of experience. He also holds CSM and ITIL certifications and works where project leadership, systems and data meet. He volunteers with the PMI South Saskatchewan Chapter. PMPORT shares the tools and lessons he uses in real projects.</p>
<h2>Frequently asked questions</h2>
<h3>Is PMPORT free?</h3><p>Yes. Every simulator, template, lab and article is free. You do not need an account.</p>
<h3>Are the PMP practice questions like the real exam?</h3><p>The questions are original and written in the scenario style of the current PMP exam. They follow the People, Process and Business Environment domains. They are practice material and are not official PMI questions.</p>
<h3>Where is my progress saved?</h3><p>Progress and saved templates stay in your own browser on your device. Nothing is sent to a server, so clearing your browser data will remove it.</p>`;

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
  // Home page FAQ as structured data (matches the visible FAQ in the page text).
  if(path===''){
    const faq=[...homeIntro.matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p>/g)].map(m=>({'@type':'Question',name:m[1],acceptedAnswer:{'@type':'Answer',text:m[2]}}));
    if(faq.length)html=html.replace('</head>',ldScript('seo-faq',{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq}));
  }
  const crumbs=breadcrumbs(path);
  if(crumbs)html=html.replace('</head>',ldScript('seo-breadcrumb',crumbs));
  if(extraHead[path])html=html.replace('</head>',ldScript('seo-term',extraHead[path]));
  const heading=page.title.replace(/ \| PMPORT$/,'').replace(/^PMPORT \| /,'');
  const links=sections.filter(([p])=>p!==path).map(([p,l,d])=>`<li><a href="/${p}">${esc(l)}</a>. ${esc(d)}</li>`).join('');
  const article=staticArticleHtml(path)||customHtml[path]||'';
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
for(const t of glossary){
  const path=`pm-glossary/${t.slug}`;const file=join(out,path,'index.html');
  mkdirSync(dirname(file),{recursive:true});writeFileSync(file,render(path,termSeo(t)));count++;
  urls.push(`  <url><loc>${SITE}/${path}</loc></url>`);
}
// The digital business card is a separate static page (public/card), so it is listed here by hand.
urls.push(`  <url><loc>${SITE}/card</loc></url>`);
writeFileSync(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
if(!existsSync(join(out,'robots.txt')))throw new Error('robots.txt missing from build output');
console.log(`seo-pages: wrote ${count} page heads and a sitemap with ${urls.length} URLs`);
