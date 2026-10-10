/**
 * Data for every exhibit used by the three exam simulators.
 * Questions reference these by id; the numbers here are what the explanations rely on.
 */
export type GraphicSpec=
  |{kind:'ev';label:string;months:number;status:number;bac:number;pv:number[];ev:number[];ac:number[]}
  |{kind:'burndown';label:string;days:number;total:number;actual:number[]}
  |{kind:'burnup';label:string;sprints:number;scope:number[];done:number[]}
  |{kind:'network';label:string;nodes:{id:string;d:number;x:number;y:number}[];edges:[string,string][]}
  |{kind:'risk';label:string;risks:{id:string;p:number;i:number}[]}
  |{kind:'grid';label:string;items:{label:string;x:number;y:number}[]}
  |{kind:'cfd';label:string;bands:{name:string;v:number[]}[]}
  |{kind:'control';label:string;unit:string;mean:number;ucl:number;lcl:number;values:number[]}
  |{kind:'pareto';label:string;bars:{label:string;v:number}[]}
  |{kind:'tornado';label:string;base:number;unit:string;bars:{label:string;low:number;high:number}[]}
  |{kind:'resource';label:string;unit:string;limit:number;values:number[]};

/** Grid coordinates: x 60–502 (interest low→high), y 20–322 (power high→low). */
const LEFT=170,RIGHT=392,TOP=88,BOTTOM=252;

export const GRAPHICS:Record<string,GraphicSpec>={
  // ---------------- Exam 1 ----------------
  'ev-curve':{kind:'ev',label:'Earned value at the end of month 6 ($000)',months:10,status:6,bac:1000,
    pv:[0,40,100,190,300,440,600,750,870,950,1000],ev:[0,35,85,160,250,360,480],ac:[0,40,95,180,280,400,540]},
  'burndown':{kind:'burndown',label:'Team 1 sprint burndown (story points remaining)',days:10,total:80,actual:[80,80,78,76,76,74,70,66]},
  'network':{kind:'network',label:'Network diagram (durations in days)',nodes:[
    {id:'Start',d:0,x:10,y:118},{id:'A',d:3,x:110,y:118},{id:'B',d:4,x:225,y:40},{id:'C',d:6,x:225,y:196},
    {id:'D',d:5,x:345,y:40},{id:'E',d:2,x:345,y:196},{id:'F',d:3,x:465,y:118},{id:'End',d:0,x:568,y:118}],
    edges:[['Start','A'],['A','B'],['A','C'],['B','D'],['B','E'],['C','E'],['D','F'],['E','F'],['F','End']]},
  'risk-matrix':{kind:'risk',label:'Probability and impact matrix',risks:[{id:'R1',p:4,i:5},{id:'R2',p:2,i:2},{id:'R3',p:5,i:2},{id:'R4',p:1,i:5},{id:'R5',p:3,i:4},{id:'R6',p:4,i:1}]},
  'stakeholder-grid':{kind:'grid',label:'Power–interest grid',items:[{label:'Regional VP',x:LEFT,y:TOP},{label:'Union representative',x:RIGHT,y:TOP},{label:'Call-centre agents',x:RIGHT,y:BOTTOM},{label:'Vendor account manager',x:LEFT,y:BOTTOM}]},
  'cfd':{kind:'cfd',label:'Cumulative flow diagram (work items)',bands:[
    {name:'Done',v:[0,2,4,5,6,7,8,9,10,11]},{name:'Testing',v:[2,4,6,9,12,15,18,21,24,27]},
    {name:'In progress',v:[6,6,7,6,6,7,6,6,7,6]},{name:'To do',v:[40,36,31,28,24,19,16,12,7,4]}]},
  'burnup':{kind:'burnup',label:'Release burnup (story points)',sprints:10,scope:[200,200,200,200,200,260,260,260,260,260,260],done:[0,25,50,75,100,125,150]},
  'control-chart':{kind:'control',label:'28-day concrete compressive strength',unit:'MPa',mean:35,ucl:38,lcl:32,values:[34.2,35.6,33.8,36.1,34.5,35.2,33.9,35.8,36.4,35.9,36.8,36.2,37.1,36.5,36.9]},

  // ---------------- Exam 2 ----------------
  'network-2':{kind:'network',label:'Network diagram (durations in days)',nodes:[
    {id:'Start',d:0,x:10,y:118},{id:'A',d:2,x:100,y:118},{id:'B',d:5,x:205,y:40},{id:'C',d:3,x:205,y:196},
    {id:'E',d:3,x:315,y:40},{id:'D',d:6,x:315,y:196},{id:'F',d:2,x:425,y:118},{id:'G',d:3,x:530,y:118},{id:'End',d:0,x:630,y:118}],
    edges:[['Start','A'],['A','B'],['A','C'],['B','E'],['C','D'],['E','F'],['D','F'],['F','G'],['G','End']]},
  'cfd-2':{kind:'cfd',label:'Patient-portal team cumulative flow (work items)',bands:[
    {name:'Done',v:[0,3,6,9,12,14,15,16,16,17]},{name:'Testing',v:[2,3,3,3,3,3,3,3,3,3]},
    {name:'In development',v:[4,5,7,9,12,15,18,21,24,26]},{name:'Ready',v:[44,39,34,29,23,18,14,10,7,4]}]},
  'ev-2':{kind:'ev',label:'Earned value at the end of month 8 ($000)',months:12,status:8,bac:2400,
    pv:[0,80,200,360,560,800,1050,1300,1550,1800,2050,2250,2400],ev:[0,80,210,380,600,850,1110,1380,1650],ac:[0,85,230,420,670,950,1240,1550,1870]},
  'pareto':{kind:'pareto',label:'Defects found in user acceptance testing, by category',bars:[{label:'Data entry',v:46},{label:'Integration',v:28},{label:'UI layout',v:12},{label:'Performance',v:8},{label:'Documentation',v:6}]},
  'control-2':{kind:'control',label:'Claim processing cycle time',unit:'hours',mean:20,ucl:26,lcl:14,values:[19.5,21,18.7,20.6,22,19.1,20.4,18.9,27.5,20.2,19.8,21.3,20.9,18.6,19.9]},
  'grid-2':{kind:'grid',label:'Power–interest grid',items:[{label:'Chief financial officer',x:RIGHT,y:TOP},{label:'Regulator liaison',x:LEFT,y:TOP},{label:'Front-line nurses',x:RIGHT,y:BOTTOM},{label:'IT help desk',x:LEFT,y:BOTTOM}]},
  'burnup-2':{kind:'burnup',label:'Release burnup (story points)',sprints:10,scope:[300,300,300,300,300,300,270,270,270,270,270],done:[0,30,60,90,120,150,180]},

  // ---------------- Exam 3 ----------------
  'tornado':{kind:'tornado',label:'Sensitivity of project NPV to key variables ($000)',base:600,unit:'$000',bars:[
    {label:'Commodity price',low:-420,high:380},{label:'Member adoption rate',low:-260,high:240},{label:'Implementation cost',low:-150,high:120},{label:'Interest rate',low:-60,high:50},{label:'Maintenance cost',low:-40,high:35}]},
  'burndown-2':{kind:'burndown',label:'Sprint burndown (story points remaining)',days:10,total:60,actual:[60,62,65,65,58,50,42,36]},
  'risk-2':{kind:'risk',label:'Probability and impact matrix',risks:[{id:'R1',p:2,i:3},{id:'R2',p:5,i:4},{id:'R3',p:3,i:5},{id:'R4',p:4,i:2},{id:'R5',p:1,i:4},{id:'R6',p:3,i:3}]},
  'resource':{kind:'resource',label:'Electricians required per week (6 available)',unit:'Electricians',limit:6,values:[4,5,6,8,9,7,5,4,3,2]},
  'network-3':{kind:'network',label:'Network diagram (durations in days)',nodes:[
    {id:'Start',d:0,x:10,y:118},{id:'A',d:4,x:110,y:118},{id:'B',d:3,x:225,y:40},{id:'C',d:5,x:225,y:196},
    {id:'D',d:2,x:345,y:40},{id:'E',d:4,x:345,y:196},{id:'F',d:1,x:465,y:118},{id:'End',d:0,x:568,y:118}],
    edges:[['Start','A'],['A','B'],['A','C'],['B','D'],['C','D'],['C','E'],['D','F'],['E','F'],['F','End']]},
  'grid-3':{kind:'grid',label:'Power–interest grid',items:[{label:'Provincial ministry',x:LEFT,y:TOP},{label:'Union local',x:RIGHT,y:TOP},{label:'Daily commuters',x:RIGHT,y:BOTTOM},{label:'Equipment supplier',x:LEFT,y:BOTTOM}]},

  // ---------------- Exam 4 ----------------
  'ev-4':{kind:'ev',label:'Earned value at the end of month 7 ($000)',months:12,status:7,bac:3600,
    pv:[0,100,250,450,720,1050,1500,2000,2500,2900,3250,3480,3600],ev:[0,95,235,420,660,960,1370,1800],ac:[0,90,220,390,600,870,1230,1600]},
  'burnup-4':{kind:'burnup',label:'Claims-automation release burnup (story points)',sprints:12,scope:[400,400,400,400,440,440,440,440,480,480,480,480,480],done:[0,40,80,120,160,200,240,280,320]},
  'network-4':{kind:'network',label:'Network diagram (durations in days)',nodes:[
    {id:'Start',d:0,x:10,y:118},{id:'A',d:5,x:100,y:118},{id:'B',d:3,x:205,y:30},{id:'C',d:4,x:205,y:183},
    {id:'D',d:6,x:315,y:30},{id:'E',d:2,x:315,y:140},{id:'F',d:5,x:315,y:226},{id:'G',d:3,x:425,y:85},{id:'H',d:2,x:535,y:118},{id:'End',d:0,x:640,y:118}],
    edges:[['Start','A'],['A','B'],['A','C'],['B','D'],['C','E'],['C','F'],['D','G'],['E','G'],['G','H'],['F','H'],['H','End']]},
  'grid-4':{kind:'grid',label:'Power–interest grid',items:[{label:'Airport authority board',x:LEFT,y:TOP},{label:'Airline station managers',x:RIGHT,y:TOP},{label:'Concession tenants',x:RIGHT,y:BOTTOM},{label:'Taxi dispatch',x:LEFT,y:BOTTOM}]},
  'pareto-2':{kind:'pareto',label:'Customer complaints about the claims portal, by category',bars:[{label:'Slow response',v:38},{label:'Unclear status',v:27},{label:'Login problems',v:15},{label:'Payment errors',v:12},{label:'Other',v:8}]},
  'control-4':{kind:'control',label:'Daily average pump vibration',unit:'mm/s',mean:50,ucl:56,lcl:44,values:[49,51,48.5,50.5,47.8,49.6,50.2,48.4,49,50.1,51.2,52,53.1,54,55.2]},

  // ---------------- Exam 5 ----------------
  'risk-5':{kind:'risk',label:'Probability and impact matrix',risks:[{id:'R1',p:3,i:4},{id:'R2',p:4,i:4},{id:'R3',p:5,i:3},{id:'R4',p:2,i:5},{id:'R5',p:4,i:1},{id:'R6',p:1,i:2}]},
  'cfd-5':{kind:'cfd',label:'Route-optimization team cumulative flow (work items)',bands:[
    {name:'Done',v:[0,4,8,12,16,20,24,28,32,36]},{name:'Testing',v:[3,3,3,3,3,3,3,3,3,3]},
    {name:'In progress',v:[6,6,6,6,6,6,6,6,6,6]},{name:'Backlog',v:[20,23,26,29,32,35,38,41,44,47]}]},
  'ev-5':{kind:'ev',label:'Earned value at the end of month 9 ($000)',months:12,status:9,bac:5000,
    pv:[0,150,380,700,1100,1600,2150,2700,3200,3600,4100,4600,5000],ev:[0,140,350,640,980,1400,1850,2300,2680,3000],ac:[0,150,380,700,1080,1540,2030,2520,2930,3300]},
  'resource-2':{kind:'resource',label:'Nurses required for transition shifts (8 available)',unit:'Nurses',limit:8,values:[6,7,8,10,11,9,8,6]},
  'tornado-2':{kind:'tornado',label:'Sensitivity of project NPV to key variables ($000)',base:1200,unit:'$000',bars:[
    {label:'Enrolment growth',low:-500,high:450},{label:'Staff productivity gain',low:-250,high:300},{label:'Licence cost',low:-300,high:150},{label:'Discount rate',low:-120,high:100},{label:'Hosting cost',low:-80,high:60}]},
  'grid-5':{kind:'grid',label:'Power–interest grid',items:[{label:'Board of governors',x:LEFT,y:TOP},{label:'Dean of Engineering',x:RIGHT,y:TOP},{label:'Students',x:RIGHT,y:BOTTOM},{label:'Alumni office',x:LEFT,y:BOTTOM}]},
  'burndown-5':{kind:'burndown',label:'Sprint burndown (story points remaining)',days:10,total:50,actual:[50,50,50,49,48,48,30,18]},
  'network-5':{kind:'network',label:'Network diagram (durations in days)',nodes:[
    {id:'Start',d:0,x:10,y:118},{id:'A',d:2,x:110,y:118},{id:'B',d:4,x:225,y:40},{id:'C',d:3,x:225,y:196},
    {id:'D',d:5,x:345,y:40},{id:'E',d:4,x:345,y:196},{id:'F',d:3,x:465,y:118},{id:'End',d:0,x:568,y:118}],
    edges:[['Start','A'],['A','B'],['A','C'],['B','D'],['C','E'],['D','F'],['E','F'],['F','End']]}
};
