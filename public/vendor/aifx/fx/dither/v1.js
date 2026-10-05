"use strict";(()=>{var I=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;function T(a){let o=a.replace("#","");(o.length===3||o.length===4)&&(o=o.split("").map(e=>e+e).join("")),o.length===8&&(o=o.slice(0,6));let t=parseInt(o,16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function w(a,o){let t={};for(let[e,s]of Object.entries(a)){let c=o[e];if(s.type==="number"){let u=c==null?NaN:parseFloat(c);t[e]=Number.isFinite(u)?Math.min(s.max,Math.max(s.min,u)):s.default}else if(s.type==="colors"){let u=(c!=null?c:"").split(",").map(f=>f.trim()).filter(f=>I.test(f));t[e]=u.length>=s.min?u.slice(0,s.max):s.default.slice()}else s.type==="enum"?t[e]=c!=null&&s.values.includes(c)?c:s.default:t[e]=c!=null&&/^https:\/\/[^\s"'<>]+$/i.test(c)?c:s.default}return t}var P="attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.,1.);}";function M(){let a=typeof window!="undefined"?window.__AIFX_MAX_DPR__:void 0;return typeof a=="number"&&a>0?a:1.5}function X(a){try{let o=new URL(a);return o.protocol!=="https:"||o.hostname!=="cdn.aidesigner.ai"?null:`https://api.aidesigner.ai/api/v1/effects/image-proxy?url=${encodeURIComponent(a)}`}catch{return null}}function U(a,o){var E;let t=document.createElement("canvas");t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;";let e=(E=t.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1}))!=null?E:t.getContext("experimental-webgl");if(!e)return null;function s(n,i){let r=e.createShader(n);return r?(e.shaderSource(r,i),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn("[aifx] shader compile failed:",e.getShaderInfoLog(r)),null)):null}let c=s(e.VERTEX_SHADER,P),u=s(e.FRAGMENT_SHADER,o),f=e.createProgram();if(!c||!u||!f)return null;if(e.attachShader(f,c),e.attachShader(f,u),e.linkProgram(f),!e.getProgramParameter(f,e.LINK_STATUS))return console.warn("[aifx] program link failed:",e.getProgramInfoLog(f)),null;e.useProgram(f),t.addEventListener("webglcontextlost",n=>{n.preventDefault(),a.dispatchEvent(new CustomEvent("aifx:contextlost"))});let _=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,_),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let b=e.getAttribLocation(f,"a_pos");e.enableVertexAttribArray(b),e.vertexAttribPointer(b,2,e.FLOAT,!1,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let v=new Map;function g(n){var i;return v.has(n)||v.set(n,e.getUniformLocation(f,n)),(i=v.get(n))!=null?i:null}a.appendChild(t);let h=null,x=0,y=null,p={gl:e,canvas:t,setUniform1f:(n,i)=>{let r=g(n);r&&e.uniform1f(r,i)},setUniform2f:(n,i,r)=>{let m=g(n);m&&e.uniform2f(m,i,r)},setUniform3f:(n,i,r,m)=>{let l=g(n);l&&e.uniform3f(l,i,r,m)},setColor:(n,i)=>{let[r,m,l]=T(i);p.setUniform3f(n,r,m,l)},setImage:n=>{if(n===y)return;y=n;let i=++x;if(!n){p.setUniform1f("u_hasImage",0);return}let r=(m,l)=>{let d=new Image;d.crossOrigin="anonymous";let R=()=>{if(i!==x)return;let A=l?null:X(n);if(A){r(A,!0);return}y=null,p.setUniform1f("u_hasImage",0)};d.onload=()=>{if(i!==x)return;h||(h=e.createTexture()),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,h),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,d)}catch{R();return}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let A=g("u_image");A&&e.uniform1i(A,0),p.setUniform2f("u_imageRes",d.naturalWidth,d.naturalHeight),p.setUniform1f("u_hasImage",1)},d.onerror=R,d.src=m};r(n,!1)},draw:n=>{p.setUniform1f("u_time",n),e.drawArrays(e.TRIANGLES,0,3)},resize:()=>{let n=Math.min(window.devicePixelRatio||1,M()),i=Math.max(1,Math.round(a.clientWidth*n)),r=Math.max(1,Math.round(a.clientHeight*n));(t.width!==i||t.height!==r)&&(t.width=i,t.height=r,e.viewport(0,0,i,r),p.setUniform2f("u_res",i,r))},destroy:()=>{var n;t.remove();try{(n=e.getExtension("WEBGL_lose_context"))==null||n.loseContext()}catch{}}};return p.resize(),p}function S(a,o,t){let e=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,s=0,c=!0,u=performance.now(),f=.5,_=.5,b=.5,v=.5,g=0,h=-1e9,x=m=>{let l=a.getBoundingClientRect();l.width<1||l.height<1||(f=(m.clientX-l.left)/l.width,_=(m.clientY-l.top)/l.height,h=performance.now())};window.addEventListener("pointermove",x,{passive:!0});let y=typeof window.__AIFX_FPS_CAP__=="number"&&window.__AIFX_FPS_CAP__>0?window.__AIFX_FPS_CAP__:0,p=y>0?1e3/y-1:0,E=-1e9,n=()=>{!e&&c&&(s=requestAnimationFrame(n));let m=performance.now();if(m-E<p)return;E=m;let l=(m-u)/1e3;b+=(f-b)*.07,v+=(_-v)*.07,g+=((m-h<2500?1:0)-g)*.045;let d=a.clientWidth/Math.max(a.clientHeight,1);o.setUniform2f("u_mouse",b*d,1-v),o.setUniform1f("u_mouseAct",g),t(l),o.draw(l)},i=typeof IntersectionObserver=="function"?new IntersectionObserver(m=>{let l=m.some(d=>d.isIntersecting);l&&!c?(c=!0,s=requestAnimationFrame(n)):!l&&c&&(c=!1,cancelAnimationFrame(s))}):null;i==null||i.observe(a);let r=typeof ResizeObserver=="function"?new ResizeObserver(()=>o.resize()):null;return r==null||r.observe(a),s=requestAnimationFrame(n),()=>{cancelAnimationFrame(s),window.removeEventListener("pointermove",x),i==null||i.disconnect(),r==null||r.disconnect()}}function F(a,o){let t=document.createElement("div");return t.style.cssText=`position:absolute;inset:0;background:linear-gradient(135deg, ${o.join(", ")});opacity:.85;`,a.appendChild(t),()=>t.remove()}var L={colors:{type:"colors",default:["#2c41c4","#8b5cf6","#ff7ab6","#ffe3c2"],min:1,max:6},bg:{type:"colors",default:["#0a0e23"],min:1,max:1},"bg-alpha":{type:"number",default:1,min:0,max:1},speed:{type:"number",default:.3,min:.02,max:2},"pixel-size":{type:"number",default:4,min:1,max:16},levels:{type:"number",default:6,min:2,max:16},scale:{type:"number",default:1.5,min:.3,max:5},contrast:{type:"number",default:1.2,min:.4,max:2.5},"flow-angle":{type:"number",default:30,min:0,max:360},detail:{type:"number",default:.4,min:0,max:1},glow:{type:"number",default:.5,min:0,max:1},matrix:{type:"enum",default:"8",values:["2","4","8"]},image:{type:"url",default:""}},D=`
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time,u_speed,u_px,u_levels,u_scale,u_contrast,u_angle,u_detail,u_matrix,u_glow,u_bgalpha,u_colorCount;
uniform vec3 u_bg,u_c0,u_c1,u_c2,u_c3,u_c4,u_c5;
uniform sampler2D u_image;
uniform float u_hasImage;
uniform vec2 u_imageRes;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.13+vec2(11.3,7.7);a*=0.5;}return v;}

float bayer2(vec2 a){a=floor(a);return fract(a.x*0.5+a.y*a.y*0.75);}
float bayer4(vec2 a){return bayer2(0.5*a)*0.25+bayer2(a);}
float bayer8(vec2 a){return bayer4(0.5*a)*0.25+bayer2(a);}

vec3 pick(float i){
  float k=clamp(i,0.0,u_colorCount-1.0);
  if(k<0.5)return u_c0; if(k<1.5)return u_c1; if(k<2.5)return u_c2;
  if(k<3.5)return u_c3; if(k<4.5)return u_c4; return u_c5;
}
// gradient ramp through bg -> c0..cN, mixed in gamma-2 space so colors stay vivid
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
  float px=max(u_px,1.0);
  vec2 cell=floor(gl_FragCoord.xy/px);
  vec2 suv=(cell+0.5)*px/u_res;
  float aspect=u_res.x/max(u_res.y,1.0);
  vec2 uvA=vec2(suv.x*aspect,suv.y);
  float tt=u_time*u_speed;

  vec2 dir=vec2(cos(u_angle),sin(u_angle));
  // rotate into flow space and stretch along flow -> long wind-swept ribbons
  vec2 rp=vec2(dot(uvA,dir),dot(uvA,vec2(-dir.y,dir.x)));
  vec2 p=vec2(rp.x*0.62,rp.y*1.45)*u_scale;
  p.x-=tt*0.24;

  // layered field: domain-warped fbm + finer detail layer
  vec2 q=vec2(fbm(p+vec2(0.0,tt*0.07)), fbm(p+vec2(4.7,2.3)-tt*0.05));
  float v=fbm(p+(q-0.5)*1.6+vec2(tt*0.03,0.0));
  float d=fbm(p*2.6+vec2(-tt*0.17,0.0)+(q-0.5)*1.4);
  v+=(d-0.5)*u_detail*0.5;

  // drifting hotspot with exponential falloff (compositional focus)
  vec2 sun=vec2(aspect*0.5,0.5)+vec2(0.32*aspect*sin(tt*0.4+1.7),0.25*cos(tt*0.31));
  v+=exp(-3.0*length(uvA-sun))*u_glow*0.55;

  // subtle vignette pushing corners toward bg
  vec2 ctr=(uvA-vec2(aspect*0.5,0.5))/vec2(max(aspect,1.0)*0.62,0.62);
  v-=smoothstep(0.45,1.5,length(ctr))*0.34;

  // s-curve contrast biased dark: calm bg with luminous forms emerging
  v=(v-0.58)*u_contrast+0.40;
  v=clamp(v,0.0,1.0);
  v=mix(v,v*v*(3.0-2.0*v),0.6);

  // image mode: halftone the photo's luminance through the same screen \u2014
  // the classic dithered-print portrait. Slow drift keeps it alive.
  if(u_hasImage>0.5){
    float ia=u_imageRes.x/max(u_imageRes.y,1.0);
    vec2 sc=(ia>aspect)?vec2(aspect/ia,1.0):vec2(1.0,ia/aspect);
    vec2 iuv=clamp((suv-0.5)*sc+0.5,0.001,0.999);
    vec3 ic=texture2D(u_image,iuv).rgb;
    v=dot(ic,vec3(0.299,0.587,0.114));
    v=(v-0.5)*u_contrast+0.5+0.04*sin(tt*0.8+suv.y*6.0);
    v=clamp(v,0.0,1.0);
  }

  // ordered dithering quantization (Bayer threshold per chunky cell)
  float bay;
  if(u_matrix<3.0)bay=bayer2(cell);
  else if(u_matrix<6.0)bay=bayer4(cell);
  else bay=bayer8(cell);

  float L=max(u_levels,2.0)-1.0;
  float vq=clamp(floor(v*L+bay)/L,0.0,1.0);

  vec3 col=ramp(vq);
  col*=1.0+(hash(cell*0.37+7.1)-0.5)*0.04;

  float alpha=max(u_bgalpha,clamp(vq*L,0.0,1.0));
  gl_FragColor=vec4(col,alpha);
}`,C;(C=window.AIFX)==null||C.register("dither",{mount(a,o){let t=w(L,o),e=U(a,D);if(!e){let u=F(a,t.colors);return{update(){},destroy:u}}let s=()=>{let u=t.colors;e.setUniform1f("u_colorCount",u.length),["u_c0","u_c1","u_c2","u_c3","u_c4","u_c5"].forEach((f,_)=>e.setColor(f,u[Math.min(_,u.length-1)])),e.setColor("u_bg",t.bg[0]),e.setUniform1f("u_bgalpha",t["bg-alpha"]),e.setUniform1f("u_speed",t.speed),e.setUniform1f("u_px",Math.max(1,Math.round(t["pixel-size"]))),e.setUniform1f("u_levels",Math.round(t.levels)),e.setUniform1f("u_scale",t.scale),e.setUniform1f("u_contrast",t.contrast),e.setImage(t.image),e.setUniform1f("u_angle",t["flow-angle"]*Math.PI/180),e.setUniform1f("u_detail",t.detail),e.setUniform1f("u_glow",t.glow),e.setUniform1f("u_matrix",parseFloat(t.matrix))};s();let c=S(a,e,()=>{});return{update(u){t=w(L,u),s()},destroy(){c(),e.destroy()}}}});})();
