'use client';
import { useEffect,useRef } from 'react';

type Mesh={buffer:WebGLBuffer,count:number};
function makeSphere():Float32Array{
 const verts:number[]=[];const lat=22,lon=32;
 const pos=(i:number,j:number)=>{const a=Math.PI*i/lat,b=Math.PI*2*j/lon;return [Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)]};
 const put=(v:number[])=>verts.push(...v,...v);
 for(let i=0;i<lat;i++)for(let j=0;j<lon;j++){
  const a=pos(i,j),b=pos(i+1,j),c=pos(i,j+1),d=pos(i+1,j+1);
  put(a);put(b);put(c);put(c);put(b);put(d);
 }
 return new Float32Array(verts);
}
function makeTorus():Float32Array{
 const verts:number[]=[];const m=60,n=8;
 function v(i:number,j:number){const a=i*2*Math.PI/m,b=j*2*Math.PI/n,r=1.16+Math.cos(b)*.045;return {p:[r*Math.cos(a),Math.sin(b)*.045,r*Math.sin(a)],n:[Math.cos(b)*Math.cos(a),Math.sin(b),Math.cos(b)*Math.sin(a)]}}
 const put=(q:{p:number[],n:number[]})=>verts.push(...q.p,...q.n);
 for(let i=0;i<m;i++)for(let j=0;j<n;j++){const a=v(i,j),b=v(i+1,j),c=v(i,j+1),d=v(i+1,j+1);put(a);put(b);put(c);put(c);put(b);put(d)}
 return new Float32Array(verts);
}
const VS=`attribute vec3 aPos;attribute vec3 aNormal;uniform vec3 uCenter;uniform vec3 uSize;uniform float uYaw;uniform float uTilt;varying vec3 vNormal;varying vec3 vPosition;
void main(){vec3 p=aPos*uSize;float c=cos(uTilt),s=sin(uTilt);p=vec3(p.x,p.y*c-p.z*s,p.y*s+p.z*c);p+=uCenter;float cy=cos(uYaw),sy=sin(uYaw);p=vec3(p.x*cy+p.z*sy,p.y,-p.x*sy+p.z*cy);vec3 n=aNormal;n=vec3(n.x,n.y*c-n.z*s,n.y*s+n.z*c);vNormal=normalize(vec3(n.x*cy+n.z*sy,n.y,-n.x*sy+n.z*cy));vPosition=p;gl_Position=vec4(p.x*3.2,p.y*3.2,-p.z,8.0-p.z);}`;
const FS=`precision mediump float;uniform vec3 uColor;uniform float uGlow;varying vec3 vNormal;varying vec3 vPosition;
void main(){vec3 n=normalize(vNormal);float light=.35+.62*max(0.0,dot(n,normalize(vec3(-.7,.9,1.5))));float edge=pow(1.0-max(dot(n,normalize(vec3(0.0,0.0,1.0))),0.0),2.0);vec3 col=uColor*light+vec3(.16,.88,.78)*edge*(.22+uGlow*.4);gl_FragColor=vec4(col,1.0);}`;
function shader(gl:WebGLRenderingContext,type:number,code:string){const sh=gl.createShader(type);if(!sh)return null;gl.shaderSource(sh,code);gl.compileShader(sh);return gl.getShaderParameter(sh,gl.COMPILE_STATUS)?sh:null;}

/** Dependency-free procedural WebGL character: actual shaded 3D geometry, not a static picture. */
export function MiraAvatar({speaking=false,listening=false}:{speaking?:boolean;listening?:boolean}){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;
  const gl=el.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true});if(!gl)return;
  const vertex=shader(gl,gl.VERTEX_SHADER,VS),fragment=shader(gl,gl.FRAGMENT_SHADER,FS);if(!vertex||!fragment)return;
  const program=gl.createProgram();if(!program)return;gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;gl.useProgram(program);
  const loc=(n:string)=>gl.getUniformLocation(program,n);
  const ap=gl.getAttribLocation(program,'aPos'),an=gl.getAttribLocation(program,'aNormal');
  function mesh(data:Float32Array):Mesh{const buffer=gl!.createBuffer()!;gl!.bindBuffer(gl!.ARRAY_BUFFER,buffer);gl!.bufferData(gl!.ARRAY_BUFFER,data,gl!.STATIC_DRAW);return{buffer,count:data.length/6}}
  const sphere=mesh(makeSphere()),torus=mesh(makeTorus());gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  type Part={center:[number,number,number],size:[number,number,number],color:[number,number,number],tilt?:number,ring?:boolean,glow?:number};
  const parts:Part[]=[
   {center:[0,-1.73,0],size:[1,1,1],color:[.16,.95,.76],ring:true,glow:1},
   {center:[0,-1.20,0],size:[.7,.83,.46],color:[.09,.43,.43]},
   {center:[-.72,-.95,0],size:[.31,.39,.36],color:[.09,.48,.51]},
   {center:[.72,-.95,0],size:[.31,.39,.36],color:[.09,.48,.51]},
   {center:[-.92,-1.42,0],size:[.24,.29,.25],color:[.93,.94,.91]},
   {center:[.92,-1.42,0],size:[.24,.29,.25],color:[.93,.94,.91]},
   {center:[0,-.24,0],size:[.20,.24,.22],color:[.77,.91,.85]},
   {center:[0,.56,0],size:[.68,.77,.57],color:[.92,.93,.89]},
   {center:[0,1.02,-.12],size:[.69,.38,.59],color:[.13,.25,.34]},
   {center:[-.62,.52,-.06],size:[.16,.45,.43],color:[.14,.30,.36]},
   {center:[.62,.52,-.06],size:[.16,.45,.43],color:[.14,.30,.36]},
   {center:[-.23,.66,.515],size:[.11,.14,.065],color:[.06,.20,.27]},
   {center:[.23,.66,.515],size:[.11,.14,.065],color:[.06,.20,.27]},
   {center:[-.23,.69,.571],size:[.048,.055,.026],color:[.27,1,.80],glow:1},
   {center:[.23,.69,.571],size:[.048,.055,.026],color:[.27,1,.80],glow:1},
   {center:[0,.4,.562],size:[.072,.1,.07],color:[.83,.80,.75]},
   {center:[0,.20,.56],size:[.17,.035,.046],color:[.35,.46,.46]},
   {center:[0,-1.01,.44],size:[.18,.18,.06],color:[.74,.63,.39],glow:1},
   {center:[0,-1.01,.49],size:[.09,.09,.025],color:[.18,.93,.77],glow:1},
   {center:[-1.35,.63,-.2],size:[.095,.095,.095],color:[.32,.89,.80],glow:1},
   {center:[1.35,1.19,-.3],size:[.065,.065,.065],color:[.98,.78,.48],glow:1},
  ];
  const uniforms={center:loc('uCenter'),size:loc('uSize'),color:loc('uColor'),yaw:loc('uYaw'),tilt:loc('uTilt'),glow:loc('uGlow')};
  let raf=0,frame=0,mounted=true;
  function draw(){if(!mounted)return;frame++;const scale=Math.min(window.devicePixelRatio||1,2);const w=Math.max(1,el!.clientWidth*scale|0),h=Math.max(1,el!.clientHeight*scale|0);if(el!.width!==w||el!.height!==h){el!.width=w;el!.height=h;gl!.viewport(0,0,w,h)}
   gl!.clearColor(0,0,0,0);gl!.clear(gl!.COLOR_BUFFER_BIT|gl!.DEPTH_BUFFER_BIT);
   const moving=(speaking||listening)?0.025:0.009;
   for(const part of parts){const {buffer,count}=part.ring?torus:sphere;gl!.bindBuffer(gl!.ARRAY_BUFFER,buffer);gl!.enableVertexAttribArray(ap);gl!.vertexAttribPointer(ap,3,gl!.FLOAT,false,24,0);gl!.enableVertexAttribArray(an);gl!.vertexAttribPointer(an,3,gl!.FLOAT,false,24,12);
    const bob=part.ring?0:Math.sin(frame*.045)*moving;const glow=(part.glow||0)*(.85+.15*Math.sin(frame*.08));
    gl!.uniform3f(uniforms.center,part.center[0],part.center[1]+bob,part.center[2]);gl!.uniform3fv(uniforms.size,part.size);gl!.uniform3fv(uniforms.color,part.color);gl!.uniform1f(uniforms.yaw,Math.sin(frame*.009)*.13);gl!.uniform1f(uniforms.tilt,part.tilt||0);gl!.uniform1f(uniforms.glow,glow);gl!.drawArrays(gl!.TRIANGLES,0,count);
   }
   raf=requestAnimationFrame(draw);
  }
  // Keep the animation affordable and respect reduced-motion settings.
  const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced){draw();cancelAnimationFrame(raf);mounted=false;}else draw();
  return()=>{mounted=false;cancelAnimationFrame(raf);gl.deleteBuffer(sphere.buffer);gl.deleteBuffer(torus.buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment)};
 },[speaking,listening]);
 return <div className={`mira-stage ${speaking?'mira-talking':''} ${listening?'mira-listening':''}`}><div className="mira-stage-halo"/><canvas aria-label="Interactive 3D Mira character" role="img" ref={canvas} className="mira-canvas"/><div className="mira-orbit-caption"><span className="online-dot"/> {speaking?'Mira is speaking':listening?'Mira is listening':'Mira is ready to help'}</div></div>;
}
