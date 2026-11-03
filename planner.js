'use strict';
/* Offline anvil planning engine. Bedrock estimates: enchantment weights, prior-work penalty,
   pairwise compatibility, left/right order and 39-level survival limit. */
window.AnvilPlanner=(()=>{
const weights={'ダメージ軽減':1,'火炎耐性':1,'爆発耐性':2,'飛び道具耐性':1,'落下耐性':2,'氷渡り':4,'水中歩行':2,'ソウルスピード':4,'耐久力':1,'修繕':2,'棘の鎧':4,'ダメージ増加':1,'アンデッド特効':1,'虫特効':1,'火属性':2,'ノックバック':1,'ドロップ増加':2,'効率強化':1,'幸運':2,'シルクタッチ':4,'射撃ダメージ増加':1,'フレイム':2,'パンチ':2,'無限':4,'高速装填':2,'拡散':2,'貫通':1,'密度':1,'ウィンドバースト':4,'突進':2,'忠誠':2,'激流':2,'水生特効':2,'召雷':4,'宝釣り':2,'入れ食い':2,'水中呼吸':2,'水中採掘':2,'高速スニーク':4};
const groups=[['ダメージ軽減','火炎耐性','爆発耐性','飛び道具耐性'],['水中歩行','氷渡り'],['幸運','シルクタッチ'],['無限','修繕'],['拡散','貫通'],['ダメージ増加','アンデッド特効','虫特効'],['激流','忠誠','召雷']];
const incompatible=(a,b)=>groups.some(g=>g.includes(a)&&g.includes(b)&&a!==b);
const sig=e=>Object.entries(e).sort((a,b)=>a[0].localeCompare(b[0])).map(([n,v])=>n+v).join('|');
const penalty=n=>Math.pow(2,n)-1;
function combine(left,right){
 if(right.gear)return null;
 const ench={...left.ench};let enchantCost=0;
 for(const [name,lv] of Object.entries(right.ench)){
  if(Object.keys(ench).some(x=>incompatible(x,name)))return null;
  const old=ench[name]||0;let next=lv;
  if(old===lv)next=lv+1;else if(old>lv)next=old;
  if(next>5)return null;
  if(next>old){ench[name]=next;enchantCost+=(weights[name]||2)*next;}
 }
 const cost=penalty(left.work)+penalty(right.work)+enchantCost;
 if(cost>=40)return null;
 return {gear:left.gear,ench,work:Math.max(left.work,right.work)+1,cost:left.cost+right.cost+cost,max:Math.max(left.max,right.max,cost),steps:[...left.steps,...right.steps,{left:left.label,right:right.label,cost,result:left.gear?'装備':'本'}],label:left.gear?'更新した装備':`合成本（${Object.entries(ench).map(([n,l])=>n+' '+['','I','II','III','IV','V'][l]).join('・')}）`};
}
function solve(books,target){
 if(books.length>10)return {error:'計算対象の本が10冊を超えています。所持レベルを上げて冊数を減らしてください。'};
 if(!books.length)return {error:'エンチャント本を選んでください。'};
 const goal=sig(target);const init=[{gear:true,ench:{},work:0,cost:0,max:0,steps:[],label:'新品の装備'},...books.map((b,i)=>({gear:false,ench:{[b.name]:b.level},work:0,cost:0,max:0,steps:[],label:`${b.name} ${['','I','II','III','IV','V'][b.level]} の本 ${i+1}`}))];
 let beam=[init];const seenGlobal=new Set();
 for(let round=0;round<books.length;round++){
  const next=new Map();
  for(const state of beam){for(let i=0;i<state.length;i++)for(let j=0;j<state.length;j++){
   if(i===j)continue;
   const merged=combine(state[i],state[j]);if(!merged)continue;
   const newState=state.filter((_,k)=>k!==i&&k!==j).concat(merged);
   const key=newState.map(x=>`${x.gear?'G':'B'}:${sig(x.ench)}:${x.work}`).sort().join('~');
   const sum=newState.reduce((a,x)=>a+x.cost,0);
   const prev=next.get(key);
   if(!prev||sum<prev.sum)next.set(key,{state:newState,sum});
  }}
  beam=[...next.values()].sort((a,b)=>a.sum-b.sum).slice(0,220).map(x=>x.state);
  if(!beam.length)return {error:'39レベル未満で完成する組み合わせが見つかりませんでした。'};
 }
 const results=beam.filter(s=>s.length===1&&s[0].gear&&sig(s[0].ench)===goal).map(s=>s[0]).sort((a,b)=>a.cost-b.cost||a.max-b.max);
 if(!results.length)return {error:'この条件では完成手順を見つけられませんでした。元の本や装備が未使用か確認してください。'};
 return {result:results[0],approximate:true};
}
return {solve,weights};
})();
