export interface Activity{id:string;name:string;predecessors:string;duration:number;optimistic:number;likely:number;pessimistic:number}
export interface Scheduled extends Activity{pred:string[];successors:string[];expected:number;variance:number;es:number;ef:number;ls:number;lf:number;float:number;critical:boolean;level:number;x:number;y:number}
export interface Schedule{activities:Scheduled[];duration:number;paths:string[][];truncated:boolean}
export function calculateSchedule(input:Activity[],pert:boolean):Schedule{
 if(!input.length)throw new Error('Add at least one activity.');if(input.length>100)throw new Error('Use up to 100 activities per network.');
 const ids=new Set<string>();for(const a of input){if(!/^[A-Za-z0-9_-]+$/.test(a.id))throw new Error('Activity IDs must use letters, numbers, underscores or hyphens.');if(ids.has(a.id))throw new Error('Duplicate activity ID: '+a.id);ids.add(a.id)}
 const nodes:Scheduled[]=input.map(a=>{const pred=[...new Set(a.predecessors.split(',').map(s=>s.trim()).filter(Boolean))];for(const p of pred){if(!ids.has(p))throw new Error(`${a.id}: predecessor ${p} does not exist.`);if(p===a.id)throw new Error(`${a.id} cannot depend on itself.`)}
 const nums=pert?[a.optimistic,a.likely,a.pessimistic]:[a.duration];if(nums.some(n=>n===null||n===undefined||!Number.isFinite(Number(n))||Number(n)<0))throw new Error(`${a.id}: enter non-negative durations.`);
 const o=Number(a.optimistic),m=Number(a.likely),p=Number(a.pessimistic);if(pert&&(o>m||m>p))throw new Error(`${a.id}: optimistic ≤ most likely ≤ pessimistic is required.`);
 return {...a,pred,successors:[],expected:pert?(o+4*m+p)/6:Number(a.duration),variance:0,es:0,ef:0,ls:0,lf:0,float:0,critical:false,level:0,x:0,y:0} as Scheduled});
 const byId=new Map(nodes.map(n=>[n.id,n]));nodes.forEach(n=>{n.variance=pert?((Number(n.pessimistic)-Number(n.optimistic))/6)**2:0;n.pred.forEach(p=>byId.get(p)!.successors.push(n.id))});
 const degree=new Map(nodes.map(n=>[n.id,n.pred.length]));const queue=nodes.filter(n=>!n.pred.length);const order:Scheduled[]=[];
 while(queue.length){const n=queue.shift()!;n.es=Math.max(0,...n.pred.map(p=>byId.get(p)!.ef));n.ef=n.es+n.expected;n.level=n.pred.length?Math.max(...n.pred.map(p=>byId.get(p)!.level))+1:0;order.push(n);for(const s of n.successors){degree.set(s,degree.get(s)!-1);if(degree.get(s)===0)queue.push(byId.get(s)!)} }
 if(order.length!==nodes.length)throw new Error('Circular dependencies detected. Remove the cycle before calculating.');
 const duration=Math.max(...nodes.map(n=>n.ef));for(const n of [...order].reverse()){n.lf=n.successors.length?Math.min(...n.successors.map(s=>byId.get(s)!.ls)):duration;n.ls=n.lf-n.expected;n.float=n.ls-n.es;if(Math.abs(n.float)<1e-8)n.float=0;n.critical=n.float===0}
 const paths:string[][]=[];let truncated=false;const visit=(n:Scheduled,path:string[])=>{if(paths.length>=200){truncated=true;return}const next=n.successors.map(s=>byId.get(s)!).filter(s=>s.critical&&Math.abs(n.ef-s.es)<1e-8);if(!next.length){if(!n.successors.length&&Math.abs(n.ef-duration)<1e-8)paths.push([...path,n.id]);return}next.forEach(s=>visit(s,[...path,n.id]))};order.filter(n=>!n.pred.length&&n.critical).forEach(n=>visit(n,[]));
 const levels=new Map<number,number>();order.forEach(n=>{const i=levels.get(n.level)||0;n.x=40+n.level*230;n.y=50+i*140;levels.set(n.level,i+1)});
 return {activities:order,duration,paths,truncated};
}
