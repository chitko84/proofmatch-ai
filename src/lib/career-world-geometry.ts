/** Shared authored geometry for all three navigable 3D worlds.
 * Geometry and palette data are deterministic and need no external assets or backend.
 */
import type {WorldKind,WorldMission,WorldPoint} from './career-worlds';
import {companyEmployeeFor} from './company-people.ts';
export type Vertex3=[number,number,number];
export type WorldFace={vertices:Vertex3[];color:string;light?:number;glow?:boolean;material?:number;normals?:Vertex3[]};
export type WorldCamera={x:number;z:number;yaw:number;pitch:number};
export const MATERIAL={matte:0,floor:1,glass:2,metal:3,display:4,wood:5,foliage:6,ceiling:7,skin:8,fabric:9,leather:10} as const;
const faceIndices:[number,number,number,number,number][]=[
 [0,1,2,3,.78],[4,5,6,7,.86],[0,3,7,4,.72],[1,2,6,5,.85],[3,2,6,7,1.04],[0,1,5,4,.67]
];
export function addBox(out:WorldFace[],x:number,y:number,z:number,w:number,h:number,d:number,color:string,material:number=MATERIAL.matte,glow=false){
 const a=w/2,b=d/2,v:Vertex3[]=[
  [x-a,y,z-b],[x+a,y,z-b],[x+a,y+h,z-b],[x-a,y+h,z-b],
  [x-a,y,z+b],[x+a,y,z+b],[x+a,y+h,z+b],[x-a,y+h,z+b]
 ];
 for(const [i,j,k,l,light] of faceIndices){out.push({vertices:[v[i],v[j],v[k],v[l]],color,light,glow,material});}
}
function plane(out:WorldFace[],vertices:Vertex3[],color:string,material:number=MATERIAL.matte,glow=false){out.push({vertices,color,material,glow,light:1});}

/** Low-poly curved primitives create readable, less boxy characters while staying dependency-free. */
export function addTaperedCylinder(out:WorldFace[],x:number,y:number,z:number,bottom:number,top:number,height:number,color:string,material:number=MATERIAL.matte,segments=10){
 const n=Math.max(5,Math.min(24,Math.floor(segments))),twoPi=Math.PI*2;
 for(let i=0;i<n;i++){
  const a=i*twoPi/n,b=(i+1)*twoPi/n;
  const v:Vertex3[]=[[x+bottom*Math.cos(a),y,z+bottom*Math.sin(a)],[x+bottom*Math.cos(b),y,z+bottom*Math.sin(b)],
   [x+top*Math.cos(b),y+height,z+top*Math.sin(b)],[x+top*Math.cos(a),y+height,z+top*Math.sin(a)]];
  // Smooth radial normals produce a round silhouette under moving lights.
  const slope=(bottom-top)/Math.max(height,.0001);
  const radial=(angle:number):Vertex3=>{const d=Math.hypot(Math.cos(angle),slope,Math.sin(angle))||1;return [Math.cos(angle)/d,slope/d,Math.sin(angle)/d]};
  out.push({vertices:[v[0],v[3],v[2],v[1]],normals:[radial(a),radial(a),radial(b),radial(b)],color,material,light:1});
 }
 const base:Vertex3[]=Array.from({length:n},(_,i)=>[x+bottom*Math.cos(i*twoPi/n),y,z+bottom*Math.sin(i*twoPi/n)]);
 const cap:Vertex3[]=Array.from({length:n},(_,i)=>[x+top*Math.cos(i*twoPi/n),y+height,z+top*Math.sin(i*twoPi/n)]);
 plane(out,base.reverse(),color,material);plane(out,cap,color,material);
}
export function addEllipsoid(out:WorldFace[],x:number,y:number,z:number,rx:number,ry:number,rz:number,color:string,material:number=MATERIAL.matte,sides=10,rings=5){
 const n=Math.max(6,Math.min(20,Math.floor(sides))),m=Math.max(3,Math.min(12,Math.floor(rings)));
 for(let j=0;j<m;j++){
  const a=Math.PI*j/m,b=Math.PI*(j+1)/m;
  for(let i=0;i<n;i++){
   const c=Math.PI*2*i/n,d=Math.PI*2*(i+1)/n;
   const pt=(phi:number,theta:number):Vertex3=>[x+rx*Math.sin(phi)*Math.cos(theta),y+ry*Math.cos(phi),z+rz*Math.sin(phi)*Math.sin(theta)];
   const vertices=[pt(a,c),pt(b,c),pt(b,d),pt(a,d)];
   const ellipticalNormal=(v:Vertex3):Vertex3=>{
    const nx=(v[0]-x)/Math.max(rx*rx,.00001),ny=(v[1]-y)/Math.max(ry*ry,.00001),nz=(v[2]-z)/Math.max(rz*rz,.00001);
    const len=Math.hypot(nx,ny,nz)||1;return [nx/len,ny/len,nz/len];
   };
   const smoothVertices=j===0||j===m-1?[vertices[0],vertices[2],vertices[1]]:[vertices[0],vertices[3],vertices[2],vertices[1]];
   out.push({vertices:smoothVertices,normals:smoothVertices.map(ellipticalNormal),color,material,light:1});
  }
 }
}

function desk(out:WorldFace[],p:WorldPoint,kind:WorldKind){
 const c=kind==='company'?'#b3a088':kind==='simulator'?'#6c91a6':'#698096';
 // Thin beveled desk, legs, metal frame, mechanical keyboard, luminous display and chair.
 addBox(out,p.x,.72,p.z,2.02,.115,1.20,c,MATERIAL.wood);
 addBox(out,p.x-.84,0,p.z,.105,.72,.9,'#43566b',MATERIAL.metal);
 addBox(out,p.x+.84,0,p.z,.105,.72,.9,'#43566b',MATERIAL.metal);
 addBox(out,p.x,.87,p.z-.23,.94,.67,.095,'#132c45',MATERIAL.metal);
 addBox(out,p.x,.94,p.z-.16,.82,.48,.028,p.accent,MATERIAL.display,true);
 addBox(out,p.x,1.52,p.z-.25,.12,.20,.11,'#617c8c',MATERIAL.metal);
 addBox(out,p.x,.845,p.z+.30,.70,.025,.21,'#213f52',MATERIAL.metal);
 for(let i=0;i<6;i++)addBox(out,p.x-.28+i*.11,.874,p.z+.31,.067,.008,.065,'#91b9bc',MATERIAL.metal);
 addBox(out,p.x+.54,.84,p.z+.33,.115,.026,.2,'#a7ced3',MATERIAL.metal);
 addBox(out,p.x,.43,p.z+1.22,.69,.14,.53,'#244459',MATERIAL.metal);
 addBox(out,p.x,.43,p.z+1.50,.70,.80,.105,'#3b667a',MATERIAL.metal);
 addBox(out,p.x,0,p.z+1.22,.08,.4,.08,'#6b91a0',MATERIAL.metal);
 addBox(out,p.x-.45,.835,p.z-.1,.07,.48,.07,'#d5bc8c',MATERIAL.metal);
 addBox(out,p.x-.45,1.30,p.z-.1,.3,.07,.28,'#d7ebcf',MATERIAL.matte);
}
function screen(out:WorldFace[],p:WorldPoint,kind:WorldKind){
 const body=kind==='crisis'?'#303b50':'#35556a';
 addBox(out,p.x,0,p.z,1.94,2.54,.72,body,MATERIAL.metal);
 addBox(out,p.x,1.02,p.z+.40,1.66,1.16,.05,'#112842',MATERIAL.metal);
 addBox(out,p.x,1.07,p.z+.44,1.48,.94,.016,p.accent,MATERIAL.display,true);
 addBox(out,p.x,2.36,p.z+.42,1.59,.045,.07,'#a5c8d7',MATERIAL.metal);
 for(let r=0;r<3;r++)for(let c=0;c<4;c++){
  addBox(out,p.x-.57+c*.38,1.36-r*.25,p.z+.468,.23,.035,.01,c%3===0?'#a5f5df':'#91c5e0',MATERIAL.display,true);
 }
 for(let i=0;i<5;i++)addBox(out,p.x-.7+i*.34,.33,p.z+.4,.09,.11,.02,i%2?'#c0a169':'#76d6e6',MATERIAL.display,true);
}
function foliage(out:WorldFace[],p:WorldPoint){
 addBox(out,p.x,0,p.z,.56,.62,.56,'#9c8c75',MATERIAL.wood);
 addBox(out,p.x,.62,p.z,.12,1.2,.12,'#547c60',MATERIAL.foliage);
 const leafColor=['#447e69','#3e9d81','#6cac84','#2a796d'];
 for(let i=0;i<10;i++){
  const a=i*2.399963;const h=1.00+(i%4)*.2,r=.27+(i%3)*.17;
  addBox(out,p.x+Math.sin(a)*r*.56,h,p.z+Math.cos(a)*r*.56,.26,.43,.70,leafColor[i%leafColor.length],MATERIAL.foliage);
 }
}
function entrance(out:WorldFace[],p:WorldPoint){
 const lift=p.id.startsWith('tower-elevator-');
 addBox(out,p.x-.80,0,p.z,.14,3.05,.24,'#78c3bf',MATERIAL.metal);
 addBox(out,p.x+.80,0,p.z,.14,3.05,.24,'#78c3bf',MATERIAL.metal);
 addBox(out,p.x,2.93,p.z,1.74,.15,.24,p.accent,MATERIAL.display,true);
 if(lift){
  // Distinct double sliding lift doors, floor indicator, control panel and light strips.
  addBox(out,p.x-.365,.12,p.z,.70,2.65,.08,'#416c81',MATERIAL.metal);
  addBox(out,p.x+.365,.12,p.z,.70,2.65,.08,'#4e7b8c',MATERIAL.metal);
  addBox(out,p.x,1.46,p.z+.048,.025,2.56,.018,'#9de7dd',MATERIAL.display,true);
  addBox(out,p.x,2.66,p.z+.08,.36,.17,.025,'#0d253d',MATERIAL.metal);
  addBox(out,p.x,2.72,p.z+.11,.18,.045,.015,'#80f7dd',MATERIAL.display,true);
  addBox(out,p.x+.93,1.34,p.z+.17,.21,.71,.07,'#17384c',MATERIAL.metal);
  addBox(out,p.x+.93,1.68,p.z+.24,.08,.09,.015,p.accent,MATERIAL.display,true);
  addBox(out,p.x+.93,1.42,p.z+.24,.08,.09,.015,'#b0dcef',MATERIAL.display,true);
 }else{
  plane(out,[[p.x-.72,.1,p.z],[p.x+.72,.1,p.z],[p.x+.72,2.88,p.z],[p.x-.72,2.88,p.z]],'#2c5a6f',MATERIAL.glass);
  addBox(out,p.x+.48,1.34,p.z+.09,.1,.11,.05,'#f6e9c9',MATERIAL.metal);
 }
}
/** Distinct palettes make the six floors feel like departments of one designed building. */
export function worldVisualProfile(mission:WorldMission,kind:WorldKind){
 const id=mission.id;
 if(kind==='crisis')return {wall:'#34465a',floor:'#1c2d44',ceiling:'#27394d',trim:'#ff947e',warm:'#f5ae7f',dark:'#12263b',theme:'incident-control'} as const;
 if(kind==='simulator')return {wall:'#e3d7c6',floor:'#6b6662',ceiling:'#eee7de',trim:'#f5b879',warm:'#fff1d6',dark:'#4c454a',theme:'hr-office'} as const;
 if(id==='company-lobby')return {wall:'#c5d8da',floor:'#667d81',ceiling:'#e3e8e3',trim:'#72dfc0',warm:'#ffdea5',dark:'#204b5b',theme:'atrium'} as const;
 if(id==='company-level-2')return {wall:'#b1cbd5',floor:'#435d70',ceiling:'#d3e1e6',trim:'#87d4ff',warm:'#d9f3ff',dark:'#193e57',theme:'technology'} as const;
 if(id==='company-level-3')return {wall:'#d2c9b9',floor:'#696c70',ceiling:'#e5deda',trim:'#f1c586',warm:'#ffead4',dark:'#493f46',theme:'business'} as const;
 if(id==='company-level-4')return {wall:'#d1cce2',floor:'#656579',ceiling:'#e2dfee',trim:'#c9b5ff',warm:'#f1e7ff',dark:'#423b67',theme:'people'} as const;
 if(id==='company-level-5')return {wall:'#bed5cb',floor:'#4a716c',ceiling:'#dce8e1',trim:'#89edba',warm:'#dbffed',dark:'#204c44',theme:'innovation'} as const;
 return {wall:'#b7cbd7',floor:'#455e73',ceiling:'#d6e2ec',trim:'#9bbaff',warm:'#fff0ce',dark:'#213d61',theme:'leadership'} as const;
}
function floorHalo(out:WorldFace[],x:number,z:number,r:number,color:string){
 // Segmented light ring and a subtle centered floor motif, without a physical obstacle.
 for(let i=0;i<18;i++){
  const a=i*Math.PI/9,b=(i+1)*Math.PI/9,ri=r-.045;
  plane(out,[[x+r*Math.cos(a),.036,z+r*Math.sin(a)],[x+r*Math.cos(b),.036,z+r*Math.sin(b)],
   [x+ri*Math.cos(b),.036,z+ri*Math.sin(b)],[x+ri*Math.cos(a),.036,z+ri*Math.sin(a)]],color,MATERIAL.display,true);
 }
}
function sofa(out:WorldFace[],x:number,z:number,accent:string){
 addBox(out,x,.22,z,1.42,.30,.72,'#467287',MATERIAL.matte);
 addBox(out,x,.48,z-.31,1.42,.56,.13,'#294b5b',MATERIAL.matte);
 for(const sx of [-.64,.64])addBox(out,x+sx,.36,z,.12,.36,.72,'#31546a',MATERIAL.matte);
 addBox(out,x,.53,z-.27,1.15,.07,.08,accent,MATERIAL.wood);
 addBox(out,x,.09,z,1.5,.045,.79,'#243b47',MATERIAL.metal);
}
function addWorldBrandWall(out:WorldFace[],trim:string,dark:string){
 // A back-wall installation with raised geometric logo, chrome rails and lightbox panels.
 addBox(out,0,2.48,-9.70,6.0,1.38,.14,dark,MATERIAL.metal);
 addBox(out,0,3.70,-9.60,6.2,.055,.07,trim,MATERIAL.display,true);
 addBox(out,-1.70,2.88,-9.57,.58,.58,.07,trim,MATERIAL.display,true);
 addBox(out,-1.69,2.90,-9.49,.31,.31,.03,dark,MATERIAL.metal);
 for(let i=0;i<4;i++)addBox(out,-.66+i*.83,3.08,-9.56,.63,.085,.03,i===0?trim:'#b2d5d8',MATERIAL.display,true);
 for(let i=0;i<3;i++)addBox(out,-.66+i*1.05,2.69,-9.55,.76,.045,.026,'#91b8bf',MATERIAL.metal);
}
/** Venue-specific scenography: four career-tour departments are bright and social,
 * while the HR workday uses private interview pods, briefing boards, and management furniture.
 * All additions stay near the perimeter and outside the central walking route. */
export function addPremiumVenueDetails(out:WorldFace[],mission:WorldMission,kind:WorldKind){
 const p=worldVisualProfile(mission,kind);
 if(kind==='company'){
  // Rounded lobby/office pendant lighting creates identifiable interior silhouettes.
  for(const x of [-3.2,3.2])for(const z of [-6.9,5.9]){
   addTaperedCylinder(out,x,3.86,z,.43,.22,.08,'#c6ddde',MATERIAL.metal,10);
   addEllipsoid(out,x,3.84,z,.35,.035,.35,p.warm,MATERIAL.display,10,3);
   addBox(out,x,3.92,z,.038,.38,.038,'#7f9ca7',MATERIAL.metal);
  }
  // Café/lounge corners, glass screens, and nearby planter islands.
  for(const side of [-1,1]){
   const x=side*6.65;
   addTaperedCylinder(out,x,0,1.55,.18,.18,.63,'#77929f',MATERIAL.metal,8);
   addTaperedCylinder(out,x,.64,1.55,.58,.58,.07,p.dark,MATERIAL.wood,12);
   addTaperedCylinder(out,x+side*.65,.1,1.55,.3,.3,.44,p.trim,MATERIAL.matte,9);
   addEllipsoid(out,x+side*.65,.62,1.55,.35,.12,.35,'#cbdadd',MATERIAL.matte,9,3);
   // Translucent wall-height room divider with metal mullions; physically thin.
   addBox(out,x,0,-1.05,.052,2.65,2.35,'#6faeb3',MATERIAL.glass);
   addBox(out,x,0,-2.28,.075,2.65,.055,p.dark,MATERIAL.metal);
   addBox(out,x,0,.14,.075,2.65,.055,p.dark,MATERIAL.metal);
   addBox(out,x,2.62,-1.05,.075,.055,2.5,p.trim,MATERIAL.display,true);
  }
  // Each department receives a distinctive wall installation, without adding another navigation.
  if(p.theme==='atrium'){
   for(let i=0;i<3;i++)addTaperedCylinder(out,-6.75,.15,-4.1+i*.6,.13,.13,.26,i%2?'#d2bb95':'#98bba9',MATERIAL.wood,7);
  }else if(p.theme==='technology'){
   for(let i=0;i<5;i++)addBox(out,-6.79,1.0+i*.3,-5.55,.11,.09,.95,i%2?'#88c9f1':'#9cf3d4',MATERIAL.display,true);
  }else if(p.theme==='business'){
   for(let i=0;i<4;i++)addBox(out,-6.78,.65+i*.38,-5.45,.1,.21,.76,i%2?'#f0cea3':'#afd8d5',MATERIAL.display,i===2);
  }else{
   for(let i=0;i<5;i++)addBox(out,-6.79,.9+i*.39,-5.8,.1,.18,.68,i%2?'#d4c2f1':'#a4e0ca',MATERIAL.display,true);
  }
 } else if(kind==='simulator'){
  // HR manager workday: open-world office flavour with reception, award zone, lounge, interview pods and corridor details.
  for(const side of [-1,1]){
   const x=side*6.35;
   // visitor lounge chairs near the front of the office
   addEllipsoid(out,x,.41,6.15,.48,.15,.43,'#b7afaa',MATERIAL.matte,9,3);
   addBox(out,x,.50,6.53,.91,.77,.12,'#655d61',MATERIAL.matte);
   addTaperedCylinder(out,x,.04,6.15,.09,.12,.38,'#53555a',MATERIAL.metal,8);
   // filing cabinets and storage wall at the back
   for(let i=0;i<3;i++){
    addBox(out,x,.18+i*.67,-7.5,.90,.54,.44,'#84736e',MATERIAL.wood);
    addBox(out,x,.50+i*.67,-7.26,.6,.035,.02,'#efe0d0',MATERIAL.metal);
   }
   // glass interview pod wall lines
   addBox(out,x*0.82,0,-1.55,.05,2.55,3.8,'#9ddad4',MATERIAL.glass);
   addBox(out,x*0.82,2.54,-1.55,.06,.04,3.8,'#f1c089',MATERIAL.display,true);
  }
  // reception backdrop and planning screen
  addBox(out,0,1.54,-9.48,3.5,1.45,.045,'#ede8df',MATERIAL.matte);
  addBox(out,0,1.54,-9.43,3.16,1.17,.02,'#5f8584',MATERIAL.display);
  for(let i=0;i<5;i++)addBox(out,-1.24+i*.61,2.13-(i%3)*.20,-9.40,.42,.19,.024,i%2?'#e8c77e':'#e2a9ac',MATERIAL.matte);
  for(let i=0;i<3;i++)addBox(out,-.9+i*.90,1.61,-9.40,.54,.32,.018,'#eff1e8',MATERIAL.matte);
  // central HR reception counter
  addBox(out,0,.24,8.55,3.4,.92,.9,'#8f7a6b',MATERIAL.wood);
  addBox(out,0,1.05,8.22,2.8,.18,.18,'#d6c5b6',MATERIAL.wood);
  addBox(out,0,1.28,8.18,1.2,.38,.03,'#8ee9db',MATERIAL.display,true);
  // ceiling light strips across the office to make it feel larger
  for(let i=-2;i<=2;i++)addBox(out,0,4.02,i*3.0,9.8,.05,.12,i%2===0?'#fff1d6':'#f5b879',MATERIAL.display,true);
  // award stage and feature wall
  addBox(out,5.65,.14,6.05,1.9,.18,1.35,'#7d6a60',MATERIAL.wood);
  addBox(out,5.65,.34,6.05,1.35,.42,.8,'#f4e7c5',MATERIAL.matte);
  addBox(out,5.65,1.32,7.05,2.2,1.0,.06,'#f3cc7f',MATERIAL.display,true);
  for(let i=0;i<4;i++)addTaperedCylinder(out,5.0+i*.42,.82,5.75,.07,.05,.22,i%2===0?'#f0d784':'#cfd8f1',MATERIAL.metal,8);
  // wellness/plant cluster
  for(let i=0;i<3;i++)addBox(out,-5.9+i*.45,.08,7.0,.28,.42,.28,'#9a866f',MATERIAL.wood);
  for(let i=0;i<3;i++)addEllipsoid(out,-5.9+i*.45,.7,7.0,.22,.28,.22,i%2===0?'#7eb892':'#5f9f81',MATERIAL.foliage,8,4);
  // meeting table near the analytics area
  addTaperedCylinder(out,3.8,.56,-6.6,.82,.72,.1,'#9a8574',MATERIAL.wood,14);
  addTaperedCylinder(out,3.8,.06,-6.6,.10,.16,.58,'#5f6872',MATERIAL.metal,10);
  for(const dx of [-.95,.95]){addEllipsoid(out,3.8+dx,.44,-6.1,.38,.12,.34,'#bdb5b0',MATERIAL.matte,8,3);addBox(out,3.8+dx,.52,-5.72,.72,.62,.12,'#696168',MATERIAL.matte)}
 }
}
function addArchitecturalFurniture(out:WorldFace[],mission:WorldMission,kind:WorldKind){
 const visual=worldVisualProfile(mission,kind);
 const isCompany=kind==='company';
 // Floor perimeter, cove lighting, and long illuminated trim lines.
 for(const x of [-7.66,7.66]){
  addBox(out,x,.09,0,.07,.095,19.1,visual.dark,MATERIAL.metal);
  addBox(out,x,4.16,0,.06,.055,18.8,visual.trim,MATERIAL.display,true);
 }
 for(const z of [-9.70,9.70]){
  addBox(out,0,.12,z,15.1,.11,.08,visual.dark,MATERIAL.metal);
  addBox(out,0,4.16,z,15.1,.045,.045,visual.trim,MATERIAL.display,true);
 }
 // Floor rugs are inlaid patterns, not solid collision volumes.
 for(let i=-2;i<=2;i++){
  addBox(out,i*.38,.015,4.65,.10,.018,2.45,i%2?visual.trim:'#839daa',MATERIAL.floor);
 }
 addWorldBrandWall(out,visual.trim,visual.dark);
 // Architectural bay framing plus a layered, readable side-window skyline.
 for(const sx of [-1,1])for(const z of [-6,-2,2,6]){
  addBox(out,sx*7.45,.8,z,.08,2.92,.08,'#92b6b7',MATERIAL.metal);
  for(let j=0;j<3;j++){
   const h=1.1+.36*((j+Math.round(z))%3);
   addBox(out,sx*7.62,.76,z-.65+j*.64,.034,h,.27,j===1?visual.dark:'#456b80',MATERIAL.glass);
   addBox(out,sx*7.60,2.64,z-.65+j*.64,.015,.016,.30,visual.warm,MATERIAL.display,true);
  }
 }
 // Sitting areas and small occasional tables stay close to the perimeter.
 if(isCompany){
  sofa(out,-6.7,5.0,visual.trim);
  sofa(out,6.7,5.0,visual.trim);
  addBox(out,-5.25,.27,5.15,.66,.07,.64,'#b1a18f',MATERIAL.wood);
  addBox(out,5.25,.27,5.15,.66,.07,.64,'#b1a18f',MATERIAL.wood);
 }
 // High-level floor identity. Objects near the wall do not block the accessible aisle.
 if(visual.theme==='atrium'){
  addBox(out,-2.6,2.00,-8.80,.30,2.4,.25,'#c7b8a3',MATERIAL.wood);
  addBox(out,2.6,2.00,-8.80,.30,2.4,.25,'#c7b8a3',MATERIAL.wood);
  for(let i=0;i<4;i++)addBox(out,-3.9+i*2.6,4.0,-.15,.11,.45,.11,visual.warm,MATERIAL.display,true);
 }else if(visual.theme==='hr-office'){
  // HR-specific office: interview portraits, staff lounge and event-planning display.
  addBox(out,-6.6,1.5,-7.1,.11,1.8,1.45,'#cba18c',MATERIAL.wood);
  addBox(out,6.55,1.4,-7.1,.11,1.8,1.45,'#c6dbd0',MATERIAL.display,true);
  for(let i=0;i<4;i++)addBox(out,-5.9+i*.55,2.9,-9.48,.31,.15,.035,i%2?visual.trim:visual.warm,MATERIAL.display,true);
 }else if(visual.theme==='technology'){
  for(let i=0;i<5;i++)addBox(out,-5.4+i*.52,1.4,-9.5,.35,.12,.08,i%2?visual.trim:'#77bdce',MATERIAL.display,true);
  for(let i=0;i<4;i++)addBox(out,6.6,1.1+i*.37,-5.2,.65,.10,.35,visual.trim,MATERIAL.display,true);
 }else if(visual.theme==='business'){
  for(let i=0;i<3;i++)addBox(out,-6.75,.6+i*.68,-5.5,.48,.4,.9,'#c4ab8d',MATERIAL.wood);
  addBox(out,6.5,1.6,-6.2,1.5,1.1,.12,visual.warm,MATERIAL.display,true);
 }else if(visual.theme==='people'){
  for(let i=0;i<5;i++)addBox(out,-6.8,1.35,-6.7+i*.42,.16,.48,.31,['#dfb3dd','#b4c5e0','#d3cab2'][i%3],MATERIAL.matte);
  addBox(out,6.5,1.1,-6.2,1.5,1.8,.10,visual.trim,MATERIAL.glass);
 }else if(visual.theme==='innovation'){
  for(let i=0;i<4;i++)addBox(out,6.7,.54+i*.45,-6.4,.34,.19,.74,i%2?'#b2efbe':visual.trim,MATERIAL.display,true);
  for(let i=0;i<3;i++)addBox(out,-6.75,.70+i*.7,-5.4,.44,.20,.25,'#81af94',MATERIAL.foliage);
 }else if(visual.theme==='leadership'){
  for(let i=0;i<3;i++)addBox(out,-6.75,1.1+i*.7,-5.8,.64,.14,1.2,i===1?visual.trim:visual.warm,MATERIAL.display,true);
  addBox(out,6.6,2.1,-5.9,1.5,1.25,.1,'#aac9d6',MATERIAL.glass);
 }else if(kind==='crisis'){
  addBox(out,-6.5,2.1,-6.4,1.7,1.15,.12,'#d25761',MATERIAL.display,true);
  for(let i=0;i<5;i++)addBox(out,6.6,.65+i*.43,-5.4,.30,.16,.5,i%2?'#ff8d66':'#56acc9',MATERIAL.display,true);
 }else{
  for(let i=0;i<4;i++)addBox(out,-6.7,.80+i*.45,-5.4,.4,.16,.7,i%2?visual.trim:visual.warm,MATERIAL.display,true);
 }
 // Every point has a readable floor ring and small task-zone accent.
 for(const p of mission.points){
  floorHalo(out,p.x,p.z,1.04,p.accent);
  addBox(out,p.x,.013,p.z,1.35,.017,1.35,visual.dark,MATERIAL.floor);
 }
}
function scenery(out:WorldFace[],mission:WorldMission,kind:WorldKind){
 const accent=mission.accent;const visual=worldVisualProfile(mission,kind);
 const company=kind==='company',crisis=kind==='crisis';
 const wall=visual.wall;
 const floor=visual.floor;
 const ceiling=visual.ceiling;
 // Floor and ceiling meshes with inset seams; windowless cells avoid transparent sorting artifacts.
 for(let x=-8;x<8;x+=2)for(let z=-10;z<10;z+=2){
  plane(out,[[x,0,z],[x+2,0,z],[x+2,0,z+2],[x,0,z+2]],(x+z)%4===0?floor:visual.dark,MATERIAL.floor);
  plane(out,[[x,4.5,z+2],[x+2,4.5,z+2],[x+2,4.5,z],[x,4.5,z]],ceiling,MATERIAL.ceiling);
 }
 for(let z=-10;z<10;z+=2){addBox(out,-8,0,z,.18,4.5,2,wall);addBox(out,8,0,z,.18,4.5,2,wall);}
 for(let x=-8;x<8;x+=2){addBox(out,x,0,-10,2,4.5,.18,wall);addBox(out,x,0,10,2,4.5,.18,wall);}
 // Glass walls, exterior city-light strips and structural pillars.
 for(let z=-7.5;z<=7.5;z+=3){
  for(const side of [-1,1]){
   addBox(out,side*7.84,.9,z,.055,2.55,2.35,company?'#2e7288':'#1f526d',MATERIAL.glass);
   addBox(out,side*7.76,.9,z-1.19,.085,2.55,.07,'#87a7ad',MATERIAL.metal);
   addBox(out,side*7.76,.9,z+1.19,.085,2.55,.07,'#87a7ad',MATERIAL.metal);
   addBox(out,side*7.74,3.14,z,.055,.075,2.39,accent,MATERIAL.display,true);
   addBox(out,side*7.76,.95,z,.06,.85,.05,company?'#426983':'#1f789a',MATERIAL.glass);
  }
 }
 for(let z=-9;z<=9;z+=4.5){addBox(out,-7.62,0,z,.31,4.48,.31,'#547283',MATERIAL.metal);addBox(out,7.62,0,z,.31,4.48,.31,'#547283',MATERIAL.metal);}
 // Warm ceiling panels create architectural rhythm and local visual pools.
 for(let x=-5.7;x<=5.7;x+=3.8)for(let z=-8;z<=8;z+=4){
  addBox(out,x,4.36,z,2.10,.08,.92,'#2f5263',MATERIAL.metal);
  addBox(out,x,4.26,z,1.82,.025,.12,visual.warm,MATERIAL.display,true);
  addBox(out,x,4.26,z-.29,1.82,.025,.08,visual.trim,MATERIAL.display,true);
 }
 // Wall-mounted information panels with unmistakable active display surfaces.
 for(const z of [-8.4,-4.8,4.8,8.4]){
  addBox(out,-7.61,1.55,z,.13,1.18,1.57,'#314d66',MATERIAL.metal);
  addBox(out,-7.51,1.72,z,.05,.84,1.23,company?'#79c1c2':accent,MATERIAL.display,true);
 }
 // Architectural center meeting table and neat chairs.
 addBox(out,0,.64,0,2.37,.15,1.55,company?'#ae9278':'#657e92',MATERIAL.wood);
 addBox(out,0,0,0,.45,.65,.55,'#42566b',MATERIAL.metal);
 for(const x of [-1.65,1.65]){addBox(out,x,.41,0,.59,.15,.62,'#4b6d7d',MATERIAL.metal);addBox(out,x,.52,.37,.6,.72,.12,'#4b6d7d',MATERIAL.metal);}
 // Ambient props set the theme without changing collision areas.
 for(const [x,z] of [[-6.5,6.9],[6.5,6.9],[-6.5,-7.8],[6.5,-7.8]]){
  if(company){foliage(out,{id:'prop',name:'Plant',subtitle:'',x,z,kind:'plant',accent:'#89dfb4',details:''});}
  else{addBox(out,x,0,z,.77,2.55,.73,crisis?'#34445b':'#405e79',MATERIAL.metal);for(let i=0;i<7;i++)addBox(out,x, .3+i*.28,z+.38,.53,.075,.025,i%3===0?'#ffba88':'#80cdda',MATERIAL.display,true);}
 }
 // Dramatic warning lane for a crisis mission, subtle inlaid guide strips elsewhere.
 for(const x of [-6.2,6.2]){
  addBox(out,x,.015,0,.045,.024,17,crisis?'#ff765b':accent,MATERIAL.display,true);
 }
 for(let z=-8;z<9;z+=2){addBox(out,0,.01,z,1.45,.019,.025,company?'#91b9ac':crisis?'#8b5f5d':'#638ba5',MATERIAL.metal);}
}
/** Finishing details drawn as actual geometry, not expensive image textures.
 * The curated perimeter placement leaves navigation routes unobstructed.
 * Small emissive accents supply depth cues even on low-end GPUs. */
export function addStudioFinish(out:WorldFace[],mission:WorldMission,kind:WorldKind){
 const palette=worldVisualProfile(mission,kind);
 const workplace=kind==='company';
 // Suspended acoustic baffles and luminous fins create an architectural ceiling.
 // These are physically separated from the player/interaction hit zones.
 for(const z of [-6.9,-2.7,1.5,5.7]){
  for(const x of [-4.8,4.8]){
   addBox(out,x,4.12,z,.055,.29,2.48,palette.dark,MATERIAL.wood);
   addBox(out,x,3.88,z,.045,.043,2.26,palette.warm,MATERIAL.display,true);
  }
 }
 // Realistic metallic wall-base trims and frosted glazing between bay frames.
 for(const side of [-1,1]){
  const x=side*7.39;
  for(const z of [-5.4,-1.8,1.8,5.4]){
   addBox(out,x,.22,z,.058,.18,3.20,palette.dark,MATERIAL.metal);
   addBox(out,x,3.05,z,.058,.05,3.15,palette.trim,MATERIAL.metal);
   addBox(out,x,1.30,z,.021,1.40,1.90,'#8bb6bf',MATERIAL.glass);
  }
 }
 // Subtle light ribbons and a matte floor runner provide visual orientation.
 for(const z of [-7.2,7.1]){
  addBox(out,-2.6,.018,z,2.05,.012,.065,palette.trim,MATERIAL.display,true);
  addBox(out,2.6,.018,z,2.05,.012,.065,palette.trim,MATERIAL.display,true);
 }
 if(workplace){
  // A meeting-zone installation and modern shelving with varied height and color.
  for(const side of [-1,1]){
   const x=side*7.05;
   for(let level=0;level<3;level++){
    const y=.75+level*.74;
    addBox(out,x,y,-6.55,.41,.055,2.0,palette.dark,MATERIAL.wood);
    for(let j=0;j<4;j++){
     const z=-7.28+j*.46;
     addBox(out,x,y+.05,z,.25,.20+(j%3)*.065,.14,j%2?palette.warm:palette.trim,MATERIAL.matte);
    }
   }
  }
  // Lounge lamp pools; each station remains visible and selectable.
  for(const x of [-5.95,5.95]){
   addTaperedCylinder(out,x,.01,6.6,.1,.10,1.16,'#536e7b',MATERIAL.metal,8);
   addTaperedCylinder(out,x,1.16,6.6,.33,.18,.21,'#f6e4c0',MATERIAL.matte,10);
   addEllipsoid(out,x,1.18,6.6,.15,.045,.15,palette.warm,MATERIAL.display,10,3);
  }
 } else if(kind==='simulator'){
  // HR Manager is a distinct, warm professional office with framed certificates,
  // recruiter briefing lights and personal interview pods (not another tech floor).
  for(const x of [-4.6,4.6]){
   for(const y of [1.14,1.88]){
    addBox(out,x,y,-9.49,1.10,.62,.075,'#9b8976',MATERIAL.wood);
    addBox(out,x,y,-9.39,.91,.43,.02,'#f0e9d8',MATERIAL.matte);
    addBox(out,x,y+.08,-9.36,.62,.025,.01,palette.dark,MATERIAL.metal);
   }
  }
  for(const x of [-5.9,5.9]){
   addTaperedCylinder(out,x,.01,-3.1,.12,.12,1.32,'#746e70',MATERIAL.metal,8);
   addEllipsoid(out,x,1.34,-3.1,.28,.10,.28,'#f4dcb3',MATERIAL.display,9,3);
  }
 }
 // Fine highlights are bounded and remain static: no per-frame CPU cost.
}

/** Employees use a distance-appropriate mesh so architectural detail can be richer.
 * The player uses the full articulated avatar; stationary staff remain smoothly shaded
 * and identifiable while using far fewer GPU vertices. */
export function makeOfficeEmployeeGeometry(x:number,z:number,shirt:string):WorldFace[]{
 const out:WorldFace[]=[];
 addEllipsoid(out,x,.016,z,.38,.014,.25,'#2a4249',MATERIAL.floor,7,3);
 for(const side of [-1,1]){
  const sx=x+side*.15;
  addTaperedCylinder(out,sx,.20,z,.11,.13,.63,'#2a4050',MATERIAL.fabric,7);
  addEllipsoid(out,sx,.105,z+.08,.14,.08,.20,'#22313a',MATERIAL.leather,7,3);
  addTaperedCylinder(out,x+side*.37,.99,z,.10,.14,.52,shirt,MATERIAL.fabric,7);
  addEllipsoid(out,x+side*.37,.93,z,.10,.10,.11,'#c99478',MATERIAL.skin,7,3);
 }
 addTaperedCylinder(out,x,.85,z,.25,.34,.66,shirt,MATERIAL.fabric,9);
 addTaperedCylinder(out,x,1.50,z,.10,.11,.12,'#c99478',MATERIAL.skin,7);
 addEllipsoid(out,x,1.82,z-.016,.23,.29,.23,'#c99478',MATERIAL.skin,9,4);
 addEllipsoid(out,x,2.05,z-.005,.25,.10,.24,'#28313e',MATERIAL.fabric,8,3);
 for(const side of [-1,1])addEllipsoid(out,x+side*.08,1.85,z-.21,.030,.02,.012,'#21333b',MATERIAL.matte,6,3);
 addBox(out,x+.14,1.29,z-.286,.13,.17,.015,'#e2f7ee',MATERIAL.matte);
 return out;
}

/** Floor-specific focal installations, authored as bounded physical geometry.
 * These details distinguish the playful company tour from the warm HR workday.
 * All objects sit at the walls/ceiling so the walkable central circulation is free.
 * A few broad shapes and fine emissive accents are cheaper than texture requests. */
export function addSignatureInteriors(out:WorldFace[],mission:WorldMission,kind:WorldKind){
 const v=worldVisualProfile(mission,kind);
 const glow=(x:number,y:number,z:number,w:number,h:number,color:string)=>addBox(out,x,y,z,w,h,.022,color,MATERIAL.display,true);
 if(kind==='company'){
  // Floor identity: the company has a consistent architectural language, but each
  // department has its own signature installation and wayfinding silhouette.
  for(const side of [-1,1]){
   const x=side*6.95;
   // Slim linear pendants and paneled acoustic ceiling, never blocking the camera.
   for(const z of [-4.6,.4,5.4]){
    addTaperedCylinder(out,x,3.78,z,.24,.24,.10,'#9eb7bc',MATERIAL.metal,8);
    addEllipsoid(out,x,3.76,z,.19,.025,.19,v.warm,MATERIAL.display,8,3);
   }
  }
  if(v.theme==='atrium'){
   // Reception's sculptural wood veneer, softly glowing wall and premium concierge desk.
   addBox(out,0,.1,-8.98,3.45,.91,.62,'#b7a38c',MATERIAL.wood);
   addBox(out,0,1.03,-8.95,3.57,.11,.68,'#f0ddc4',MATERIAL.wood);
   for(let i=-3;i<=3;i++)addBox(out,i*.39,1.62,-9.36,.10,1.02,.085,i%2?'#d1b99b':'#ebd1ae',MATERIAL.wood);
   glow(0,2.86,-9.28,1.75,.09,v.trim);
   addEllipsoid(out,5.9,1.64,-7.8,.43,1.42,.43,'#487966',MATERIAL.foliage,9,5);
  }else if(v.theme==='technology'){
   // Product/engineering: a modular development wall with changing screen rhythms.
   addBox(out,0,1.22,-9.32,4.65,2.25,.12,'#203c53',MATERIAL.metal);
   for(let x=0;x<4;x++)for(let y=0;y<2;y++){
    const cx=-1.63+x*1.09,cy=.82+y*.91;
    glow(cx,cy,-9.23,.94,.69,(x+y)%3===0?'#7bf1cf':'#7ed1ed');
    for(let j=0;j<4;j++)glow(cx-.26+j*.17,cy+.11-(j%3)*.11,-9.20,.08,.015,'#d8fbf8');
   }
  }else if(v.theme==='business'){
   // Finance & operations: stone presentation wall with boardroom-style skyline.
   addBox(out,0,1.43,-9.36,4.35,2.11,.12,'#66575b',MATERIAL.wood);
   for(let i=0;i<9;i++){
    const x=-1.84+i*.46;
    addBox(out,x,.72,-9.25,.27,.24+(i*3%5)*.19,.03,i%2?'#acd5bc':'#ecd19f',MATERIAL.display,true);
   }
   glow(0,2.57,-9.22,3.70,.07,'#f2debf');
  }else if(v.theme==='people'){
   // Learning & culture: warm gallery, community displays, colored lounge wall.
   for(let i=0;i<5;i++){
    const x=-2.65+i*1.32;
    addBox(out,x,1.45,-9.36,.91,1.30,.08,i%2?'#c5b8d8':'#b0d1c7',MATERIAL.wood);
    addBox(out,x,1.51,-9.25,.63,.85,.026,i%2?'#e7dcfa':'#ddf2ea',MATERIAL.matte);
    glow(x,1.89,-9.21,.38,.05,v.trim);
   }
   for(let side of [-1,1])addEllipsoid(out,side*6.2,.35,6.4,.64,.24,.52,'#b3a5c5',MATERIAL.fabric,8,3);
  }
 }else if(kind==='simulator'){
  // Intentionally NOT an identical company-floor skin: private interview suites,
  // warm wood cabinetry and a calm HR briefing wall define a different workplace.
  addBox(out,0,1.52,-9.34,4.65,2.16,.11,'#aa947f',MATERIAL.wood);
  addBox(out,0,1.51,-9.24,4.35,1.93,.04,'#f6eee0',MATERIAL.matte);
  for(let i=0;i<5;i++){
   const x=-1.73+i*.86;
   addBox(out,x,1.26,-9.18,.65,.80,.035,i%2?'#d1ddd6':'#e7d8c8',MATERIAL.matte);
   glow(x,1.78,-9.14,.46,.07,i%2?'#88b9ad':'#d9b588');
  }
  // Interview room acoustic detailing with wall washers and timber reveals.
  for(const side of [-1,1])for(let i=0;i<4;i++){
   const x=side*7.53,z=-5.8+i*1.86;
   addBox(out,x,.59,z,.05,2.15,.22,'#ae9382',MATERIAL.wood);
   addBox(out,x,2.92,z,.09,.045,1.10,'#ecce99',MATERIAL.display,true);
  }
  for(const z of [-2.7,2.5]){
   addEllipsoid(out,0,3.96,z,.65,.09,.42,'#e7d2b4',MATERIAL.matte,10,3);
   addEllipsoid(out,0,3.87,z,.47,.03,.31,'#fff0c9',MATERIAL.display,10,3);
  }
 }
}

/** HR story colleagues: intentionally compact person meshes keep 11 encounters within the existing laptop GPU budget. */
export function makeHrStoryPersonGeometry(x:number,z:number,shirt:string):WorldFace[]{
 const out:WorldFace[]=[];
 for(const side of [-1,1]){
  addBox(out,x+side*.15,.24,z,.16,.64,.17,'#344454',MATERIAL.fabric);
  addBox(out,x+side*.15,.02,z+.09,.19,.16,.27,'#24313e',MATERIAL.leather);
  addBox(out,x+side*.31,.98,z,.16,.52,.18,shirt,MATERIAL.fabric);
 }
 addTaperedCylinder(out,x,.87,z,.25,.32,.64,shirt,MATERIAL.fabric,6);
 addBox(out,x,1.50,z,.18,.14,.17,'#c9957b',MATERIAL.skin);
 addEllipsoid(out,x,1.82,z-.01,.23,.26,.23,'#c9957b',MATERIAL.skin,8,3);
 addBox(out,x,2.06,z,.36,.09,.31,'#293946',MATERIAL.fabric);
 addBox(out,x+.14,1.27,z-.269,.12,.16,.016,'#ebf1f3',MATERIAL.matte);
 return out;
}

/** Deterministic, richer world geometry. Shared by all missions and renderer backends. */
export function buildCareerWorldGeometry(mission:WorldMission,kind:WorldKind):WorldFace[]{
 const out:WorldFace[]=[];
 scenery(out,mission,kind);
 addArchitecturalFurniture(out,mission,kind);
 addPremiumVenueDetails(out,mission,kind);
 addStudioFinish(out,mission,kind);
 addSignatureInteriors(out,mission,kind);
 for(const p of mission.points){
  if(p.kind==='desk'||p.kind==='table'||p.kind==='station')desk(out,p,kind);
  else if(p.kind==='screen'||p.kind==='server')screen(out,p,kind);
  else if(p.kind==='door')entrance(out,p);
  else if(p.kind==='plant')foliage(out,p);
  addBox(out,p.x,.025,p.z,1.72,.025,1.72,p.accent,MATERIAL.display,true);
  if(kind==='company'){
   const employee=companyEmployeeFor(p,mission);
   if(employee)out.push(...makeOfficeEmployeeGeometry(p.x+.96,p.z+1.13,employee.accent));
  } else if(kind==='simulator'){
   // The HR story characters stand beside their own workstation, independently of the player.
   // Compact meshes are generated once with the scene, not on each animation frame.
   const shirts=['#607b91','#a47e78','#557f76','#8b7895','#bc9068'];
   const i=mission.points.findIndex(point=>point.id===p.id);
   out.push(...makeHrStoryPersonGeometry(p.x+(p.x>4?-.9:.92),p.z+(p.z>5?-1:.95),shirts[i%shirts.length]));
  }
 }
 return out;
}

/** An original articulated, rounded character assembled from lightweight procedurally generated meshes.
 * No external models, textures, tracking, or loading requests are required during a live demo.
 * Head, hands, jacket, trouser legs and shoes remain visible in both third- and first-person views. */
export function makePersonGeometry(x:number,z:number,yaw:number,colors:{shirt:string;skin?:string;trousers?:string;hair?:string},stride=0):WorldFace[]{
 const faces:WorldFace[]=[];
 const skin=colors.skin??'#c79276',pants=colors.trousers??'#293e4b';
 const walk=Math.sin(stride)*.11,armSwing=walk*.72,shirt=colors.shirt,hair=colors.hair??'#273039';
 // Subtle floor contact shadow; dark matte octagonal disk drawn as physical geometry.
 addEllipsoid(faces,x,.018,z,.47,.015,.29,'#283f44',MATERIAL.floor,9,3);
 // Leather shoes, articulated lower legs, and tapered trousers.
 for(const side of [-1,1]){
  const sx=x+side*.155,step=(side===1?walk:-walk);
  addEllipsoid(faces,sx,.12+Math.max(0,step),z+.085,.145,.09,.245,'#24303a',MATERIAL.leather,8,3);
  addTaperedCylinder(faces,sx,.21+Math.max(0,step),z, .115,.132,.67,pants,MATERIAL.fabric,8);
 }
 // Tailored jacket with shaped shoulders and narrow waist.
 addTaperedCylinder(faces,x,.87,z,.26,.365,.68,shirt,MATERIAL.fabric,10);
 addBox(faces,x,1.10,z-.277,.15,.40,.012,'#e2eae4',MATERIAL.matte);
 addBox(faces,x,1.12,z-.300,.058,.32,.014,'#25445c',MATERIAL.matte);
 addBox(faces,x,1.34,z-.328,.07,.06,.02,'#d5c4a7',MATERIAL.metal);
 // Shirt collar, jacket lapels and belt shape the silhouette at ordinary viewing distances.
 for(const side of [-1,1]){
  addBox(faces,x+side*.115,1.39,z-.283,.13,.13,.035,'#d6ded8',MATERIAL.matte);
  addBox(faces,x+side*.14,1.19,z-.302,.063,.28,.028,shirt,MATERIAL.fabric);
 }
 addBox(faces,x,.88,z-.248,.43,.045,.035,'#192b38',MATERIAL.leather);
 addBox(faces,x,.89,z-.276,.085,.065,.018,'#d1bea1',MATERIAL.metal);
 for(const side of [-1,1]){
  const sx=x+side*.37;
  addEllipsoid(faces,sx,1.47,z,.18,.16,.19,shirt,MATERIAL.fabric,8,3);
  addTaperedCylinder(faces,sx,.94+(side===1?armSwing:-armSwing),z,.105,.135,.50,shirt,MATERIAL.fabric,8);
  addEllipsoid(faces,sx,.92+(side===1?armSwing:-armSwing),z,.101,.115,.11,skin,MATERIAL.skin,8,3);
  addTaperedCylinder(faces,sx,.99+(side===1?armSwing:-armSwing),z,.116,.114,.055,'#e0e6e2',MATERIAL.matte,8);
 }
 addTaperedCylinder(faces,x,1.51,z,.11,.10,.13,skin,MATERIAL.skin,8);
 // Head, ears, fringe and a soft cap-shaped haircut are rounded rather than cuboids.
 addEllipsoid(faces,x,1.82,z-.018,.244,.305,.232,skin,MATERIAL.skin,10,5);
 for(const side of [-1,1])addEllipsoid(faces,x+side*.236,1.83,z-.017,.063,.11,.066,skin,MATERIAL.skin,7,3);
 addEllipsoid(faces,x,2.057,z-.004,.258,.111,.242,hair,MATERIAL.fabric,9,3);
 addEllipsoid(faces,x,2.00,z-.126,.224,.069,.124,hair,MATERIAL.fabric,8,3);
 for(const side of [-1,1]){
  addEllipsoid(faces,x+side*.088,1.854,z-.217,.032,.022,.010,'#24333d',MATERIAL.matte,7,3);
  addEllipsoid(faces,x+side*.088,1.905,z-.198,.073,.020,.021,hair,MATERIAL.fabric,8,3);
 }
 addEllipsoid(faces,x,1.756,z-.220,.053,.016,.016,'#9b645c',MATERIAL.skin,8,3);
 // Visible ID badge connects the figure to a professional office, not a generic toy avatar.
 addBox(faces,x+.15,1.27,z-.321,.118,.16,.020,'#e1f8f2',MATERIAL.matte);
 addBox(faces,x+.15,1.33,z-.335,.074,.026,.008,'#3b9d8b',MATERIAL.display);
 // Rotate the authored shape as one body about the model pivot.
 const sin=Math.sin(yaw-Math.PI),cos=Math.cos(yaw-Math.PI);
 for(const f of faces){
  for(const v of f.vertices){const dx=v[0]-x,dz=v[2]-z;v[0]=x+dx*cos-dz*sin;v[2]=z+dx*sin+dz*cos;}
  // Per-vertex normals must follow the body rotation for lighting to stay correct.
  if(f.normals)for(const n of f.normals){const nx=n[0],nz=n[2];n[0]=nx*cos-nz*sin;n[2]=nx*sin+nz*cos;}
 }
 return faces;
}
