"use strict";(()=>{var P=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;function T(o){let a=o.replace("#","");(a.length===3||a.length===4)&&(a=a.split("").map(e=>e+e).join("")),a.length===8&&(a=a.slice(0,6));let t=parseInt(a,16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function R(o,a){let t={};for(let[e,s]of Object.entries(o)){let l=a[e];if(s.type==="number"){let f=l==null?NaN:parseFloat(l);t[e]=Number.isFinite(f)?Math.min(s.max,Math.max(s.min,f)):s.default}else if(s.type==="colors"){let f=(l!=null?l:"").split(",").map(u=>u.trim()).filter(u=>P.test(u));t[e]=f.length>=s.min?f.slice(0,s.max):s.default.slice()}else s.type==="enum"?t[e]=l!=null&&s.values.includes(l)?l:s.default:t[e]=l!=null&&/^https:\/\/[^\s"'<>]+$/i.test(l)?l:s.default}return t}var I="attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.,1.);}";function M(){let o=typeof window!="undefined"?window.__AIFX_MAX_DPR__:void 0;return typeof o=="number"&&o>0?o:1.5}function k(o){try{let a=new URL(o);return a.protocol!=="https:"||a.hostname!=="cdn.aidesigner.ai"?null:`https://api.aidesigner.ai/api/v1/effects/image-proxy?url=${encodeURIComponent(o)}`}catch{return null}}function U(o,a){var y;let t=document.createElement("canvas");t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;";let e=(y=t.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1}))!=null?y:t.getContext("experimental-webgl");if(!e)return null;function s(n,i){let r=e.createShader(n);return r?(e.shaderSource(r,i),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn("[aifx] shader compile failed:",e.getShaderInfoLog(r)),null)):null}let l=s(e.VERTEX_SHADER,I),f=s(e.FRAGMENT_SHADER,a),u=e.createProgram();if(!l||!f||!u)return null;if(e.attachShader(u,l),e.attachShader(u,f),e.linkProgram(u),!e.getProgramParameter(u,e.LINK_STATUS))return console.warn("[aifx] program link failed:",e.getProgramInfoLog(u)),null;e.useProgram(u),t.addEventListener("webglcontextlost",n=>{n.preventDefault(),o.dispatchEvent(new CustomEvent("aifx:contextlost"))});let v=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,v),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let h=e.getAttribLocation(u,"a_pos");e.enableVertexAttribArray(h),e.vertexAttribPointer(h,2,e.FLOAT,!1,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let _=new Map;function g(n){var i;return _.has(n)||_.set(n,e.getUniformLocation(u,n)),(i=_.get(n))!=null?i:null}o.appendChild(t);let b=null,x=0,E=null,d={gl:e,canvas:t,setUniform1f:(n,i)=>{let r=g(n);r&&e.uniform1f(r,i)},setUniform2f:(n,i,r)=>{let m=g(n);m&&e.uniform2f(m,i,r)},setUniform3f:(n,i,r,m)=>{let c=g(n);c&&e.uniform3f(c,i,r,m)},setColor:(n,i)=>{let[r,m,c]=T(i);d.setUniform3f(n,r,m,c)},setImage:n=>{if(n===E)return;E=n;let i=++x;if(!n){d.setUniform1f("u_hasImage",0);return}let r=(m,c)=>{let p=new Image;p.crossOrigin="anonymous";let w=()=>{if(i!==x)return;let A=c?null:k(n);if(A){r(A,!0);return}E=null,d.setUniform1f("u_hasImage",0)};p.onload=()=>{if(i!==x)return;b||(b=e.createTexture()),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,b),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,p)}catch{w();return}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let A=g("u_image");A&&e.uniform1i(A,0),d.setUniform2f("u_imageRes",p.naturalWidth,p.naturalHeight),d.setUniform1f("u_hasImage",1)},p.onerror=w,p.src=m};r(n,!1)},draw:n=>{d.setUniform1f("u_time",n),e.drawArrays(e.TRIANGLES,0,3)},resize:()=>{let n=Math.min(window.devicePixelRatio||1,M()),i=Math.max(1,Math.round(o.clientWidth*n)),r=Math.max(1,Math.round(o.clientHeight*n));(t.width!==i||t.height!==r)&&(t.width=i,t.height=r,e.viewport(0,0,i,r),d.setUniform2f("u_res",i,r))},destroy:()=>{var n;t.remove();try{(n=e.getExtension("WEBGL_lose_context"))==null||n.loseContext()}catch{}}};return d.resize(),d}function S(o,a,t){let e=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,s=0,l=!0,f=performance.now(),u=.5,v=.5,h=.5,_=.5,g=0,b=-1e9,x=m=>{let c=o.getBoundingClientRect();c.width<1||c.height<1||(u=(m.clientX-c.left)/c.width,v=(m.clientY-c.top)/c.height,b=performance.now())};window.addEventListener("pointermove",x,{passive:!0});let E=typeof window.__AIFX_FPS_CAP__=="number"&&window.__AIFX_FPS_CAP__>0?window.__AIFX_FPS_CAP__:0,d=E>0?1e3/E-1:0,y=-1e9,n=()=>{!e&&l&&(s=requestAnimationFrame(n));let m=performance.now();if(m-y<d)return;y=m;let c=(m-f)/1e3;h+=(u-h)*.07,_+=(v-_)*.07,g+=((m-b<2500?1:0)-g)*.045;let p=o.clientWidth/Math.max(o.clientHeight,1);a.setUniform2f("u_mouse",h*p,1-_),a.setUniform1f("u_mouseAct",g),t(c),a.draw(c)},i=typeof IntersectionObserver=="function"?new IntersectionObserver(m=>{let c=m.some(p=>p.isIntersecting);c&&!l?(l=!0,s=requestAnimationFrame(n)):!c&&l&&(l=!1,cancelAnimationFrame(s))}):null;i==null||i.observe(o);let r=typeof ResizeObserver=="function"?new ResizeObserver(()=>a.resize()):null;return r==null||r.observe(o),s=requestAnimationFrame(n),()=>{cancelAnimationFrame(s),window.removeEventListener("pointermove",x),i==null||i.disconnect(),r==null||r.disconnect()}}function F(o,a){let t=document.createElement("div");return t.style.cssText=`position:absolute;inset:0;background:linear-gradient(135deg, ${a.join(", ")});opacity:.85;`,o.appendChild(t),()=>t.remove()}var C={colors:{type:"colors",default:["#e9e3ff","#c4b3fe","#9a78fb","#6726f5"],min:1,max:6},bg:{type:"colors",default:["#ffffff"],min:1,max:1},"bg-alpha":{type:"number",default:1,min:0,max:1},speed:{type:"number",default:.5,min:.05,max:2},"block-size":{type:"number",default:56,min:16,max:120},levels:{type:"number",default:7,min:3,max:14},scale:{type:"number",default:1,min:.3,max:3},"drift-angle":{type:"number",default:30,min:0,max:360},glint:{type:"number",default:.35,min:0,max:1},contrast:{type:"number",default:1.1,min:.4,max:2.5}},X=`
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time,u_speed,u_block,u_levels,u_scale,u_angle,u_glint,u_contrast,u_bgalpha,u_colorCount;
uniform vec3 u_bg,u_c0,u_c1,u_c2,u_c3,u_c4,u_c5;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.13+vec2(11.3,7.7);a*=0.5;}return v;}

vec3 pick(float i){
  float k=clamp(i,0.0,u_colorCount-1.0);
  if(k<0.5)return u_c0; if(k<1.5)return u_c1; if(k<2.5)return u_c2;
  if(k<3.5)return u_c3; if(k<4.5)return u_c4; return u_c5;
}
// ramp from the page tone (bg) through the inks, faint -> strong
vec3 ramp(float x){
  float n=u_colorCount;
  float f=clamp(x,0.0,1.0)*n;
  float i=floor(min(f,n-0.001));
  float fr=f-i;
  vec3 a=(i<0.5)?u_bg:pick(i-1.0);
  vec3 b=pick(i);
  return sqrt(mix(a*a,b*b,fr));
}

void main(){
  float px=max(u_block,4.0);
  vec2 cell=floor(gl_FragCoord.xy/px);
  vec2 cc=(cell+0.5)*px/u_res;
  float aspect=u_res.x/max(u_res.y,1.0);
  vec2 ca=vec2(cc.x*aspect,cc.y);
  float t=u_time*u_speed;

  // smooth macro gradient along the drift axis (the Fireworks corner sweep)
  float dirr=radians(u_angle);
  vec2 dirv=vec2(cos(dirr),sin(dirr));
  float along=dot(ca-vec2(aspect*0.5,0.5),dirv);
  float macro=smoothstep(-0.55,0.75,along+0.16*sin(t*0.20));

  // slow flowing field drifting through the grid for organic variation
  float fl=fbm(ca*1.7*u_scale+dirv*t*0.16);
  float v=macro*0.78+(fl-0.45)*0.55;
  v=(v-0.5)*u_contrast+0.52;
  // per-cell gentle breathing, phase-offset so waves ripple across the grid
  v+=0.05*sin(t*0.9+hash(cell)*6.2831+cell.y*0.35+cell.x*0.21);
  v=clamp(v,0.0,1.0);

  // quantize into the intensity staircase \u2014 whole cells step together
  float L=max(u_levels,2.0)-1.0;
  float vq=floor(v*L+0.5)/L;

  // rare saturated accent cells that blink in, hold, and hand off elsewhere
  float seed=hash(cell+vec2(31.7*floor(t*0.45),17.3));
  float acc=smoothstep(1.0-0.025*u_glint,1.0,seed);
  float pulse=0.5+0.5*sin(t*2.2+seed*40.0);
  vq=max(vq,acc*(0.85+0.15*pulse));

  vec3 col=ramp(vq);
  float alpha=max(u_bgalpha,vq);
  gl_FragColor=vec4(col,alpha);
}`,L;(L=window.AIFX)==null||L.register("blocky",{mount(o,a){let t=R(C,a),e=U(o,X);if(!e){let f=F(o,t.colors);return{update(){},destroy:f}}let s=()=>{let f=t.colors;e.setUniform1f("u_colorCount",f.length),["u_c0","u_c1","u_c2","u_c3","u_c4","u_c5"].forEach((u,v)=>e.setColor(u,f[Math.min(v,f.length-1)])),e.setColor("u_bg",t.bg[0]),e.setUniform1f("u_bgalpha",t["bg-alpha"]),e.setUniform1f("u_speed",t.speed),e.setUniform1f("u_block",t["block-size"]),e.setUniform1f("u_levels",Math.round(t.levels)),e.setUniform1f("u_scale",t.scale),e.setUniform1f("u_angle",t["drift-angle"]),e.setUniform1f("u_glint",t.glint),e.setUniform1f("u_contrast",t.contrast)};s();let l=S(o,e,()=>{});return{update(f){t=R(C,f),s()},destroy(){l(),e.destroy()}}}});})();
