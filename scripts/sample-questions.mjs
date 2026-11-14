// Picks a few sample questions from each exam simulator and writes them to
// src/app/pages/pm-faciliter/sample-questions.json. seo-pages.mjs shows them as readable text
// (with Quiz structured data) on each simulator page, so search engines and AI assistants can see
// what the questions are like. Re-run after changing the question banks:  node scripts/sample-questions.mjs
import {build} from 'esbuild';
import {writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const programs={pmp:'PMP_PROGRAM',capm:'CAPM_PROGRAM',ecba:'ECBA_PROGRAM',cbap:'CBAP_PROGRAM',itil:'ITIL_PROGRAM'};
const PER_EXAM={pmp:8,capm:6,ecba:6,cbap:6,itil:6};

const dir=mkdtempSync(join(tmpdir(),'pmport-samples-'));
try{
  const entry=join(dir,'entry.ts');
  writeFileSync(entry,Object.entries(programs).map(([id,name])=>`export {${name}} from ${JSON.stringify(join(root,`src/app/pages/pmp-exam/programs/${id}-program`))};`).join('\n'));
  const outfile=join(dir,'out.mjs');
  await build({entryPoints:[entry],bundle:true,platform:'node',format:'esm',outfile,logLevel:'warning'});
  const mod=await import(pathToFileURL(outfile).href);
  const out={};
  for(const [id,name] of Object.entries(programs)){
    const qs=mod[name].exams[0].questions.filter(q=>q.type==='single'&&q.answer?.length===1&&q.explanation);
    // Spread the picks across the exam's domains: take questions round-robin from each domain in turn.
    const byDomain={};for(const q of qs)(byDomain[q.domain]??=[]).push(q);
    const lists=Object.values(byDomain);const picks=[];
    for(let i=0;picks.length<PER_EXAM[id]&&i<50;i++)for(const l of lists){const step=Math.max(1,Math.floor(l.length/4));const q=l[i*step];if(q&&picks.length<PER_EXAM[id])picks.push(q);}
    out[id]=picks.map(q=>({domain:q.domain,question:q.stem,options:q.options,answer:q.answer[0],explanation:q.explanation}));
  }
  writeFileSync(join(root,'src/app/pages/pm-faciliter/sample-questions.json'),JSON.stringify(out,null,1)+'\n');
  console.log('sample-questions: '+Object.entries(out).map(([k,v])=>`${k} ${v.length}`).join(', '));
}finally{rmSync(dir,{recursive:true,force:true});}
