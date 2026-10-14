/** Shared look for the PMP study guide and the free practice exams comparison. */
export const PMP_GUIDE_STYLES=`
  .guide{max-width:1180px}.back{display:inline-block;margin-bottom:1rem;color:var(--accent);font-weight:700}
  .article-hero{position:relative;min-height:560px;overflow:hidden;border-radius:24px;margin-bottom:2rem;background:#041223}
  .article-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:75% center}
  .hero-overlay{position:relative;z-index:1;display:flex;min-height:560px;width:58%;padding:clamp(2rem,6vw,5rem);flex-direction:column;justify-content:center;background:linear-gradient(90deg,rgba(4,18,35,.97),rgba(4,18,35,.82) 70%,transparent);color:#fff}
  .hero-overlay h1{font-size:clamp(2.3rem,4.6vw,4.2rem);line-height:1.04;margin:.7rem 0 1rem}
  .hero-lead{font-size:clamp(1.05rem,2vw,1.3rem);line-height:1.6;color:#d8e8f5}.byline{font-size:.88rem;color:#a9bfd2;line-height:1.6}
  .guide section{margin:0 0 3rem;scroll-margin-top:90px}
  .guide h2{font-size:clamp(1.7rem,3vw,2.4rem)!important;line-height:1.15!important;margin:0 0 1rem!important;letter-spacing:-.02em!important}
  .guide h3{font-size:1.2rem;margin:1.4rem 0 .5rem}
  .guide p,.guide li{line-height:1.8;color:#c9d9e7;font-size:1.02rem}
  .guide .card p{margin-top:0}
  .toc{margin-bottom:2.5rem}.toc ol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem 2rem;margin:0;padding-left:1.3rem}
  .toc a{color:#d9eef7}
  .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:.8rem;margin:1rem 0 1.5rem}
  .fact{background:#0b2340;border:1px solid var(--line);border-radius:14px;padding:1rem}
  .fact strong{display:block;font-size:1.8rem;color:#fff;font-family:Manrope,Inter,sans-serif}.fact span{color:var(--muted);font-size:.9rem;line-height:1.4;display:block}
  .table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:14px;margin:1rem 0}
  table.data{border-collapse:collapse;width:100%;min-width:640px;font-size:.95rem}
  table.data th,table.data td{padding:.75rem .9rem;border-bottom:1px solid #1b3a5c;text-align:left;vertical-align:top;line-height:1.55;color:#d6e4f0}
  table.data th{background:#0e2d4e;color:#fff;font-size:.85rem;letter-spacing:.02em}
  table.data tr:last-child td{border-bottom:0}
  table.data td a{color:var(--accent)}
  .weeks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
  .week{background:#0b2340;border:1px solid var(--line);border-radius:16px;padding:1.3rem}
  .week h3{margin:0 0 .3rem}.week .tag{display:inline-block;margin-bottom:.6rem}
  .week ul{margin:.4rem 0 0;padding-left:1.1rem}.week li{font-size:.97rem;line-height:1.65}
  .week a,.guide p a,.guide li a{color:var(--accent)}
  .callout{padding:1.3rem 1.5rem;border-left:4px solid var(--accent);border-radius:10px;background:#0c2b49;margin:1.2rem 0}
  .callout p{margin:0}
  .faq h3{color:#fff}
  .cta{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1rem}
  .sources ol{padding-left:1.2rem}.sources li{font-size:.92rem;line-height:1.7;word-break:break-word}.sources a{color:var(--accent)}
  .note{font-size:.9rem;color:#91a8bc}
  @media(max-width:800px){.article-hero,.hero-overlay{min-height:600px}.hero-overlay{width:100%;justify-content:flex-end;background:linear-gradient(0deg,rgba(4,18,35,.99),rgba(4,18,35,.75) 60%,rgba(4,18,35,.08))}.toc ol,.weeks{grid-template-columns:1fr}}
`;
