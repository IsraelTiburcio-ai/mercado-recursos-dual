// Independent sensitivity: change only the selected RHS, from the reference.
export const models = [
  { id:'taller', name:'Taller de precisión', c:[5,4], b:[10,8], x:[4,2], z:28, shadow:[2,1], ranges:[[-6,6],[-3,12]] },
  { id:'fabrica', name:'Fábrica modular', c:[7,5], b:[12,9], x:[5,2], z:45, shadow:[3,1], ranges:[[-7.5,6],[-3,15]] },
  { id:'estudio', name:'Planta de ensamblaje', c:[4,5], b:[9,9], x:[3,3], z:27, shadow:[1,2], ranges:[[-4.5,9],[-4.5,9]] }
];
const specs = [
 [0,0,1,1.2],[0,1,1,1.5],[0,0,2,3],[0,1,3,2.4],
 [0,0,3,7.5],[0,1,2,3],[1,0,1,2],[1,1,2,2.8],
 [1,0,2,7],[1,1,3,1.8],[2,0,2,3],[2,1,2,3],
 [2,1,3,7.5],[2,0,3,2.1]
];
export const cases = specs.map(([m,resource,quantity,cost],i)=>({id:`offer-${i}`,type:'offer',model:models[m],resource,quantity,cost,benefit:models[m].shadow[resource]*quantity,net:models[m].shadow[resource]*quantity-cost,answer:models[m].shadow[resource]*quantity>cost?'buy':'skip'}));
cases.push(...models.map((model,i)=>({id:`limit-${i}`,type:'limit',model,resource:i%2,quantity:1,cost:0,benefit:model.shadow[i%2],net:0,answer:String(model.shadow[i%2])})));
cases.push(...models.map((model,i)=>({id:`compare-${i}`,type:'compare',model,quantity:1,costs:i===0?[1.8,.2]:i===1?[2.7,.1]:[.2,1.7],answer:i===2?'0':'1',net:i===0?.8:i===1?.9:.8})));
export function makeSession(random=Math.random){
 const shuffled=items=>items.map(v=>({v,r:random()})).sort((a,b)=>a.r-b.r).map(o=>o.v);
 return [...shuffled(cases.filter(c=>c.type==='offer'&&c.answer==='buy')).slice(0,2),...shuffled(cases.filter(c=>c.type==='offer'&&c.answer==='skip')).slice(0,2),shuffled(cases.filter(c=>c.type==='limit'))[0]].map(v=>({v,r:random()})).sort((a,b)=>a.r-b.r).map(o=>o.v).concat(shuffled(cases.filter(c=>c.type==='compare'))[0]);
}
