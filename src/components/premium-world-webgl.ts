/** GPU 3D renderer for ProofMatch AI Career Experience.
 * Native WebGL; no heavyweight engine download, database or external assets.
 * The existing Canvas2D renderer is retained as a fallback for unsupported devices.
 */
import type {WorldCamera,WorldFace,Vertex3} from '../lib/career-world-geometry';
import type {WorldKind} from '../lib/career-worlds';

const VERTEX_SHADER=`
precision highp float;
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
attribute float aEmission;
attribute float aMaterial;
uniform vec2 uCamera;
uniform float uYaw;
uniform float uPitch;
uniform float uAspect;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vColor;
varying float vEmission;
varying float vMaterial;
varying float vDepth;
void main(){
 vec3 p=aPosition-vec3(uCamera.x,0.0,uCamera.y);
 float fwd=p.x*sin(uYaw)+p.z*cos(uYaw);
 float side=p.x*cos(uYaw)-p.z*sin(uYaw);
 float h=(p.y-1.66)*cos(uPitch)-fwd*sin(uPitch);
 float depth=(p.y-1.66)*sin(uPitch)+fwd*cos(uPitch);
 gl_Position=vec4(side*1.35/uAspect,h*1.35,depth*1.008-0.30,depth);
 vWorld=aPosition;
 vNormal=aNormal;
 vColor=aColor;
 vEmission=aEmission;
 vMaterial=aMaterial;
 vDepth=depth;
}
`;
const FRAGMENT_SHADER=`
precision highp float;
uniform float uTime;
uniform float uTheme;
uniform float uDetail;
uniform vec2 uViewport;
uniform vec3 uFog;
uniform vec3 uAccent;
uniform vec3 uEye;
uniform vec2 uStations[8];
uniform float uStationCount;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vColor;
varying float vEmission;
varying float vMaterial;
varying float vDepth;
float sat(float v){return clamp(v,0.0,1.0);}
void main(){
 vec3 N=normalize(vNormal);
 vec3 V=normalize(uEye-vWorld);
 vec3 L=normalize(vec3(-0.48,0.88,0.26));
 // Hemisphere sky bounce and smooth, view-dependent ambient shading.
 float hemi=.39+.32*(N.y*.5+.5);
 float sun=.46*max(dot(N,L),0.0);
 // The FAST preset bypasses expensive per-pixel reflections, scan lines and grain.
 // This branch is uniform for the entire draw, so the GPU does not diverge within triangles.
 if(uDetail<.5){
   vec3 quick=vColor*(.48+.48*max(dot(N,L),0.0)+.18*(N.y*.5+.5));
   quick+=uAccent*(vEmission>.5?.34:.022);
   quick=mix(quick,uFog,sat((vDepth-13.0)/29.0)*.59);
   quick=quick/(vec3(1.0)+quick*.34);
   gl_FragColor=vec4(pow(max(quick,vec3(0.0)),vec3(.92)),1.0);
   return;
 }
 // Two inexpensive broad fill lights give faces rounded depth without shadow maps.
 vec3 key1=vec3(-4.4,4.2,-1.9)-vWorld;
 vec3 key2=vec3(5.5,3.9,4.0)-vWorld;
 float keyAtten=1.0/(1.0+.085*dot(key1,key1));
 float fillAtten=1.0/(1.0+.09*dot(key2,key2));
 float keyDiffuse=max(dot(N,normalize(key1)),0.0)*keyAtten;
 float fillDiffuse=max(dot(N,normalize(key2)),0.0)*fillAtten;
 float spot1=1.65/(1.0+.13*distance(vWorld,vec3(-4.0,4.12,-3.0))*distance(vWorld,vec3(-4.0,4.12,-3.0)));
 float spot2=1.35/(1.0+.12*distance(vWorld,vec3(4.0,4.12,3.0))*distance(vWorld,vec3(4.0,4.12,3.0)));
 float ambient=hemi+sun+spot1*.24+spot2*.20;
 // Neutral daylight for the company tour; warmer bounce lighting for the HR workday.
 ambient*=uTheme<.5?1.08:1.02;
 // Material-directed ambient fill and subtle distance-based temperature.
 vec3 rgb=vColor*ambient;
 // Gentle warm/cool bounced light makes the scene less flat without shadow maps.
 float warmBounce=max(0.0,1.0-distance(vWorld,vec3(-2.8,3.8,-4.0))/11.0);
 float coolBounce=max(0.0,1.0-distance(vWorld,vec3(3.8,3.5,3.5))/12.0);
 rgb+=vec3(.16,.095,.035)*warmBounce*.19+uAccent*coolBounce*.095;
 rgb+=vColor*(vec3(.35,.30,.23)*keyDiffuse*.34+vec3(.17,.30,.37)*fillDiffuse*.29);
 // Very subtle procedural material breakup avoids the flat untextured-toy appearance.
 float detailNoise=sin(dot(vWorld.xz,vec2(17.39,29.13)))*sin(vWorld.y*19.81+vWorld.z*11.73);
 rgb*=.985+.015*detailNoise;
 
 rgb+=uAccent*.033*(.5+.5*N.y);
 float ndv=max(dot(N,V),0.0);
 vec3 halfVector=normalize(L+V);
 float ndh=max(dot(N,halfVector),0.0);
 float spec=pow(max(dot(reflect(-L,N),V),0.0),20.0);
 // Soft microfacet highlights vary by material instead of using the same hard light for skin and furniture.
 float roughness=vMaterial>7.5&&vMaterial<8.5?.64:vMaterial>8.5&&vMaterial<9.5?.86:vMaterial>9.5&&vMaterial<10.5?.34:vMaterial>2.5&&vMaterial<3.5?.22:.54;
 float shininess=mix(70.0,9.0,roughness);
 float fresnel=pow(1.0-ndv,5.0);
 float specular=pow(ndh,shininess)*(1.0-roughness*.7);
 rgb+=mix(vec3(.14),vec3(.48,.6,.65),vMaterial>2.5&&vMaterial<3.5?.7:.05)*(specular*.20+fresnel*.016);
 if(vMaterial>2.5&&vMaterial<4.0){
   // Fine brushed-metal grain, soft specular reflection and directional highlight.
   float brush=.94+.06*sin(vWorld.y*185.0+vWorld.x*8.0);
   rgb*=brush;
   rgb+=vec3(.48,.64,.72)*spec*.42;
 }

 if(vMaterial>1.5&&vMaterial<2.5){
   float fresnel=pow(1.0-max(dot(N,V),0.0),2.3);
   float sheen=pow(max(dot(reflect(-normalize(vec3(.23,.6,.6)),N),V),0.0),9.0);
   float mullion=1.0-smoothstep(.015,.09,abs(fract(vWorld.z*1.32)-.5));
   float reflected=pow(max(0.0,sin(vWorld.z*2.7+vWorld.y*.36)),9.0);
   rgb=mix(rgb,vec3(.12,.32,.43)+vColor*.26,.38)+fresnel*vec3(.17,.37,.40)+sheen*vec3(.27,.48,.50);
   // Angular skylight/reflection bands change naturally as the character walks past glass.
   float glassSweep=pow(max(dot(reflect(-normalize(key1),N),V),0.0),16.0);
   rgb+=vec3(.09,.15,.18)*glassSweep;
   rgb+=(mullion*.08+reflected*.06)*uAccent;
 }
 if(vMaterial>.5&&vMaterial<1.5){
   float edge=max(abs(fract(vWorld.x*.5)-.5),abs(fract(vWorld.z*.5)-.5));
   float grout=smoothstep(.468,.498,edge);
   float polished=pow(max(dot(reflect(-L,N),V),0.0),19.0);
   float softReflections=exp(-15.0*abs(fract(vWorld.x*.263)-.5))*.10;
   rgb*=1.0-grout*.17;
   float tileNoise=.012*sin(vWorld.x*15.0)*sin(vWorld.z*13.0);
   // Architectural soft contact shade along room edges, without costly shadow buffers.
   float wallShade=1.0-.12*exp(-2.1*(8.0-abs(vWorld.x)))-.10*exp(-1.6*(10.0-abs(vWorld.z)));
   // Inexpensive approximate contact shadows anchor desks, displays and people to the floor.
   // Geometry-independent and view-stable; intentionally no texture/shadow-map allocation.
   float stationShade=0.0;
   for(int i=0;i<8;i++){
     if(float(i)<uStationCount){
       vec2 separation=vWorld.xz-uStations[i];
       float d=dot(separation,separation);
       stationShade=max(stationShade,.21/(1.0+d*1.65));
     }
   }
   rgb*=clamp(wallShade-stationShade,.60,1.0);
   float floorGrain=.012*sin(vWorld.x*38.0+vWorld.z*9.0)*sin(vWorld.z*31.0);
   rgb+=vec3(floorGrain);
   rgb+=vec3(.13,.19,.21)*polished+uAccent*softReflections+vec3(tileNoise);

 }
 if(vMaterial>3.5&&vMaterial<4.5){
   // Procedural interfaces: scanlines, graph traces and pulse highlights.
   float scan=.035*sin(vWorld.y*45.0+uTime*2.8);
   float chart=sin(vWorld.x*8.5+uTime*.7)*sin(vWorld.y*12.0-uTime*.4)*.12;
   float trace=exp(-95.0*abs(fract(vWorld.y*.86+sin(vWorld.x*2.1+uTime*.4)*.095)-.5));
   float grid=(exp(-95.0*abs(fract(vWorld.x*.9)-.5))+exp(-85.0*abs(fract(vWorld.y*.83)-.5)))*.08;
   float pulse=.88+.12*sin(uTime*1.5+vWorld.x*1.7);
   rgb=vColor*(.81+scan+chart)*pulse+uAccent*(.09+trace*.22+grid);
   rgb+=vColor*.13;
 }
 if(vMaterial>4.5&&vMaterial<5.5){
   // Quiet timber grain and a soft polished-surface finish.
   float grain=sin(vWorld.x*39.0+2.0*sin(vWorld.z*6.0));
   float fiber=sin(vWorld.x*7.0+vWorld.z*3.1);
   rgb*=.94+.032*grain+.023*fiber;
   rgb+=vec3(.034,.022,.011)*pow(max(dot(reflect(-L,N),V),0.0),24.0);
 }

 if(vMaterial>5.5&&vMaterial<6.5){
   rgb*=.94+.10*sin(vWorld.z*9.0+vWorld.y*8.0);
   rgb+=vec3(.012,.04,.016)*max(N.y,0.0);
 }
 // Character materials: warm skin response, fine suit fabric, soft leather shoes.
 if(vMaterial>7.5&&vMaterial<8.5){
   float skinGrain=sin(vWorld.x*76.3+vWorld.z*39.1)*sin(vWorld.y*91.5+vWorld.x*26.9);
   rgb*=.995+.005*skinGrain;
   rgb+=vec3(.06,.026,.013)*pow(ndh,7.0)*.30;
 }
 if(vMaterial>8.5&&vMaterial<9.5){
   float weave=sin(vWorld.x*64.0)*sin(vWorld.y*57.0+vWorld.z*28.0);
   rgb*=.986+.014*weave;
 }
 if(vMaterial>9.5&&vMaterial<10.5){
   rgb*=.97+.02*sin(vWorld.z*52.0);
   rgb+=vec3(.15,.18,.20)*pow(ndh,25.0)*.13;
 }

 if(vMaterial>6.5&&vMaterial<7.5){
  float stripe=1.0-smoothstep(.91,.98,abs(sin(vWorld.x*3.5)));
  rgb*=.90+.10*stripe;
 }
 if(vEmission>.5){
   float flicker=.95+.05*sin(uTime*(uTheme>1.5?5.0:1.15)+vWorld.z*2.0);
   rgb+=vColor*(.69*flicker)+uAccent*.055;
 }
 if(uTheme>1.5){rgb+=vec3(.10,.005,.0)*(.5+.5*sin(uTime*2.2))*max(0.0,1.0-distance(vWorld,vec3(0.0,3.5,-7.0))/14.0);}
 // HIGH preset: physically suggest soft area-light pools from desk displays.
 // Eight tiny fixed-size calculations, no textures or shadow-map allocations.
 if(uDetail>1.5){
   float screenPool=0.0;
   for(int j=0;j<8;j++){
     if(float(j)<uStationCount){
       vec2 offset=vWorld.xz-uStations[j];
       screenPool+=exp(-dot(offset,offset)*.38)*(.33+.67*max(N.y,0.0));
     }
   }
   rgb+=uAccent*min(screenPool,.95)*.075;
   // Gentle peripheral falloff keeps depth and attention near the player.
   vec2 normalized=gl_FragCoord.xy/max(uViewport,vec2(1.0));
   float vignette=dot((normalized-.5)*vec2(1.05,1.0),(normalized-.5)*vec2(1.05,1.0));
   rgb*=1.0-smoothstep(.15,.62,vignette)*.095;
   // Subtle high-end material highlight for glass and coated metal.
   if(vMaterial>1.5&&vMaterial<4.0){
     float edge=pow(1.0-max(dot(N,V),0.0),3.0);
     rgb+=vec3(.06,.095,.11)*edge;
   }
 }
 float fog=sat((vDepth-12.0)/29.0);
 rgb=mix(rgb,uFog,fog*.63);
 // Soft filmic tonemap avoids clipped neon while preserving detail in bright interiors.
 rgb=max(rgb,vec3(0.0));
 // Filmic shoulder retains highlights without flattening white desks and window strips.
 rgb=rgb/(vec3(1.0)+rgb*.37);
 rgb=pow(rgb,vec3(.91));
 rgb=mix(rgb,vec3(dot(rgb,vec3(.2126,.7152,.0722))),.015);
 gl_FragColor=vec4(rgb,1.0);
}
`;
const parseHex=(s:string):[number,number,number]=>{
 const m=/^#([0-9a-f]{6})$/i.exec(s);if(!m)return [.56,.74,.8];
 const n=parseInt(m[1],16);return [((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255];
};
const cross=(a:Vertex3,b:Vertex3,c:Vertex3):Vertex3=>{
 const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
 const n:Vertex3=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
 const d=Math.hypot(...n)||1;return [n[0]/d,n[1]/d,n[2]/d];
};
export function packWorldFaces(faces:WorldFace[]):Float32Array{
 const data:number[]=[];
 for(const face of faces){if(face.vertices.length<3)continue;
  const v=face.vertices,n=cross(v[0],v[1],v[2]),rgb=parseHex(face.color);
  const col=rgb.map(c=>Math.min(1,c*(face.light??1)));
  for(let i=1;i<v.length-1;i++)for(const corner of [0,i,i+1]){
   const vertex=v[corner],normal=face.normals?.[corner]??n;
   data.push(vertex[0],vertex[1],vertex[2],normal[0],normal[1],normal[2],col[0],col[1],col[2],face.glow?1:0,face.material??0);
  }
 }
 return new Float32Array(data);
}
// Cached CPU-side triangle buffers eliminate redundant tessellation when revisiting floors.
// Geometry arrays are immutable once authored; animated avatars use a separate dynamic buffer.
const staticMeshCache=new WeakMap<WorldFace[],Float32Array>();
export function getCachedWorldMesh(faces:WorldFace[]):Float32Array{
 let packed=staticMeshCache.get(faces);
 if(!packed){packed=packWorldFaces(faces);staticMeshCache.set(faces,packed);}
 return packed;
}
function shader(gl:WebGLRenderingContext,type:number,source:string){
 const object=gl.createShader(type);if(!object)throw Error('Unable to create GPU shader');
 gl.shaderSource(object,source);gl.compileShader(object);
 if(!gl.getShaderParameter(object,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(object);gl.deleteShader(object);throw Error(`3D shader compilation: ${error}`)}
 return object;
}
export class PremiumWorldRenderer{
 private canvas:HTMLCanvasElement;
 private gl:WebGLRenderingContext;
 private program:WebGLProgram;
 private buffer!:WebGLBuffer;
 // Keep each floor in GPU memory after its first visit: no repeated shader compilation
 // and no bufferData uploads when judges switch between previously visited floors.
 private readonly floorBuffers=new WeakMap<WorldFace[],{buffer:WebGLBuffer;count:number}>();
 private readonly ownedFloorBuffers=new Set<WebGLBuffer>();
 private avatarBuffer:WebGLBuffer;
 private count=0;
 private previousAvatar:WorldFace[]|undefined;
 private avatarCount=0;
 private attribs:Record<string,number>={};
 private uniforms:Record<string,WebGLUniformLocation|null>={};
 private accent:[number,number,number]=[.5,.75,.7];
 private fog:[number,number,number]=[.15,.29,.34];
 private theme=0;
 private stations=new Float32Array(16);
 private stationCount=0;
 constructor(canvas:HTMLCanvasElement,kind:WorldKind,accentHex:string,geometry:WorldFace[],stationPoints:ReadonlyArray<{x:number;z:number}>=[]){
  this.canvas=canvas;
  const gl=canvas.getContext('webgl',{alpha:false,antialias:true,depth:true,stencil:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
  if(!gl)throw Error('WebGL unavailable');this.gl=gl;
  const vs=shader(gl,gl.VERTEX_SHADER,VERTEX_SHADER),fs=shader(gl,gl.FRAGMENT_SHADER,FRAGMENT_SHADER);
  const program=gl.createProgram();if(!program)throw Error('3D shader program unavailable');
  gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(`3D renderer linking: ${gl.getProgramInfoLog(program)}`);
  this.program=program;gl.useProgram(program);
  const avatarBuffer=gl.createBuffer();if(!avatarBuffer)throw Error('3D avatar buffer unavailable');this.avatarBuffer=avatarBuffer;
  for(const name of ['aPosition','aNormal','aColor','aEmission','aMaterial'])this.attribs[name]=gl.getAttribLocation(program,name);
  for(const name of ['uCamera','uYaw','uPitch','uAspect','uTime','uTheme','uDetail','uViewport','uFog','uAccent','uEye','uStationCount'])this.uniforms[name]=gl.getUniformLocation(program,name);
  this.uniforms.uStations=gl.getUniformLocation(program,'uStations[0]');
  this.setScene(kind,accentHex,geometry,stationPoints);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  gl.disable(gl.CULL_FACE);
  gl.clearColor(.025,.055,.11,1);
 }
 /** Update the active floor without destroying the WebGL program or its cached meshes. */
 setScene(kind:WorldKind,accentHex:string,geometry:WorldFace[],stationPoints:ReadonlyArray<{x:number;z:number}>=[]){
  this.theme=kind==='company'?0:kind==='simulator'?1:2;
  this.accent=parseHex(accentHex);
  this.fog=kind==='company'?[.15,.29,.34]:kind==='simulator'?[.055,.13,.24]:[.12,.095,.16];
  this.stationCount=Math.min(8,stationPoints.length);
  this.stations.fill(0);
  for(let i=0;i<this.stationCount;i++){
   this.stations[i*2]=stationPoints[i].x;this.stations[i*2+1]=stationPoints[i].z;
  }
  this.setGeometry(geometry);
  this.previousAvatar=undefined;
 }
 setGeometry(geometry:WorldFace[]){
  const gl=this.gl;
  let existing=this.floorBuffers.get(geometry);
  if(!existing){
   const buffer=gl.createBuffer();if(!buffer)throw Error('3D floor buffer unavailable');
   const packed=getCachedWorldMesh(geometry);
   gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,packed,gl.STATIC_DRAW);
   existing={buffer,count:packed.length/11};
   this.floorBuffers.set(geometry,existing);this.ownedFloorBuffers.add(buffer);
  }
  this.buffer=existing.buffer;this.count=existing.count;
  this.bindLayout(this.buffer);
 }
 private bindLayout(buffer:WebGLBuffer){
  const gl=this.gl;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  const stride=44;
  for(const [name,offset,size] of [['aPosition',0,3],['aNormal',12,3],['aColor',24,3],['aEmission',36,1],['aMaterial',40,1]] as const){
   const loc=this.attribs[name];if(loc<0)continue;
   gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,stride,offset);
  }
 }
 render(camera:WorldCamera,time:number,width:number,height:number,dpr:number,avatar?:WorldFace[],graphicsMode:'auto'|'quality'|'performance'='auto'){
  const gl=this.gl;
  const cw=Math.max(1,Math.floor(width*dpr)),ch=Math.max(1,Math.floor(height*dpr));
  if(this.canvas.width!==cw||this.canvas.height!==ch){this.canvas.width=cw;this.canvas.height=ch;gl.viewport(0,0,cw,ch);}
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);this.bindLayout(this.buffer);
  gl.uniform2f(this.uniforms.uCamera,camera.x,camera.z);gl.uniform1f(this.uniforms.uYaw,camera.yaw);gl.uniform1f(this.uniforms.uPitch,camera.pitch);
  gl.uniform1f(this.uniforms.uAspect,width/Math.max(height,1));gl.uniform1f(this.uniforms.uTime,time*.001);gl.uniform1f(this.uniforms.uTheme,this.theme);gl.uniform1f(this.uniforms.uDetail,graphicsMode==='quality'?2:graphicsMode==='performance'?0:1);gl.uniform2f(this.uniforms.uViewport,cw,ch);
  gl.uniform3fv(this.uniforms.uFog,this.fog);gl.uniform3fv(this.uniforms.uAccent,this.accent);gl.uniform3f(this.uniforms.uEye,camera.x,1.66,camera.z);
  gl.uniform2fv(this.uniforms.uStations,this.stations);gl.uniform1f(this.uniforms.uStationCount,this.stationCount);
  gl.drawArrays(gl.TRIANGLES,0,this.count);
  if(avatar?.length){
   if(this.previousAvatar!==avatar){
    const packed=packWorldFaces(avatar);
    gl.bindBuffer(gl.ARRAY_BUFFER,this.avatarBuffer);gl.bufferData(gl.ARRAY_BUFFER,packed,gl.DYNAMIC_DRAW);
    this.avatarCount=packed.length/11;
    this.previousAvatar=avatar;
   }
   this.bindLayout(this.avatarBuffer);gl.drawArrays(gl.TRIANGLES,0,this.avatarCount);
  }else this.previousAvatar=undefined;
 }
 dispose(){this.gl.deleteBuffer(this.avatarBuffer);for(const buffer of this.ownedFloorBuffers)this.gl.deleteBuffer(buffer);this.ownedFloorBuffers.clear();this.gl.deleteProgram(this.program);}
}
