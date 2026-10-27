/**
 * Site navigation: plain-language groups shown in the sidebar and used for the
 * "you are here" breadcrumb. Page addresses never change here — only labels and grouping.
 */
export interface NavLink{label:string;path:string;/** Highlight only on this exact address (for paths that prefix other menu items). */exact?:boolean}
export interface NavGroup{id:string;label:string;links:NavLink[]}

export const NAV_GROUPS:NavGroup[]=[
  {id:'exam',label:'Exam Prep',links:[
    {label:'All exam simulators',path:'/pm-faciliter',exact:true},
    {label:'PMP',path:'/pm-faciliter/pmp-exam-simulator'},
    {label:'CAPM',path:'/pm-faciliter/capm-exam-simulator'},
    {label:'ECBA',path:'/pm-faciliter/ecba-exam-simulator'},
    {label:'CBAP',path:'/pm-faciliter/cbap-exam-simulator'},
    {label:'ITIL 5 Foundation',path:'/pm-faciliter/itil-foundation-exam-simulator'},
    {label:'PMP study plan',path:'/resources/pmp-study-guide-8-week-plan'},
    {label:'Free PMP practice exams',path:'/resources/best-free-pmp-practice-exams'},
    {label:'111 PMP mindsets',path:'/resources/111-essential-pmp-mindsets'}]},
  {id:'learn',label:'Learn',links:[
    {label:'Learning journeys',path:'/journeys'},
    {label:'Articles',path:'/resources'},
    {label:'Videos',path:'/media'},
    {label:'Glossary',path:'/pm-glossary'},
    {label:'Free courses & channels',path:'/pm-learninglink'}]},
  {id:'practice',label:'Practice',links:[
    {label:'Daily practice (5 min)',path:'/daily-practice'},
    {label:'My progress & badges',path:'/my-progress'},
    {label:'Project simulations',path:'/pm-playground',exact:true},
    {label:'Chart Lab (data storytelling)',path:'/pm-playground/chart-lab'},
    {label:'Data skills (SQL, Excel, Power BI, Python)',path:'/pm-datalab'}]},
  {id:'tools',label:'Tools',links:[
    {label:'PM templates',path:'/pm-tools',exact:true},
    {label:'BA templates',path:'/pm-tools/ba'},
    {label:'Team & developer templates',path:'/pm-tools/teams'},
    {label:'Calculators',path:'/pm-calculators'},
    {label:'PERT / CPM critical path',path:'/pm-tools/pert-cpm'},
    {label:'Diagram Studio',path:'/pm-tools/diagram-studio'},
    {label:'Notes',path:'/pm-handaid'}]},
  {id:'career',label:'Career',links:[
    {label:'Job prep',path:'/pm-jobs-prep'},
    {label:'Events & gallery',path:'/events'}]},
];

/** Shown at the bottom of the sidebar, after the main groups. */
export const ABOUT_GROUP:NavGroup={id:'alamgir',label:'About Alamgir',links:[
  {label:'Profile',path:'/about'},
  {label:'All selected work',path:'/portfolio',exact:true},
  {label:'Course work',path:'/portfolio/course-work'},
  {label:'Professional work',path:'/portfolio/professional-work'},
  {label:'Education',path:'/education'},
  {label:'Credentials',path:'/credentials'}]};

const ALL:{group?:NavGroup;link:NavLink}[]=[
  ...[...NAV_GROUPS,ABOUT_GROUP].flatMap(group=>group.links.map(link=>({group,link}))),
  {link:{label:'About PMPORT',path:'/about-pmport'}},
];

const under=(url:string,path:string)=>url===path||url.startsWith(path+'/');

/** The menu entry a page belongs to: the longest menu address that the page address starts with. */
export function navMatch(url:string){
  const clean=url.split(/[?#]/)[0].replace(/\/$/,'')||'/';
  let best:{group?:NavGroup;link:NavLink}|undefined;
  for(const m of ALL)if(under(clean,m.link.path)&&(!best||m.link.path.length>best.link.path.length))best=m;
  return best?{...best,url:clean}:undefined;
}
