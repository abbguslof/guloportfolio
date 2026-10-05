"use strict";(()=>{var L=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;function T(o){let i=o.replace("#","");(i.length===3||i.length===4)&&(i=i.split("").map(e=>e+e).join("")),i.length===8&&(i=i.slice(0,6));let t=parseInt(i,16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function y(o,i){let t={};for(let[e,s]of Object.entries(o)){let l=i[e];if(s.type==="number"){let c=l==null?NaN:parseFloat(l);t[e]=Number.isFinite(c)?Math.min(s.max,Math.max(s.min,c)):s.default}else if(s.type==="colors"){let c=(l!=null?l:"").split(",").map(f=>f.trim()).filter(f=>L.test(f));t[e]=c.length>=s.min?c.slice(0,s.max):s.default.slice()}else s.type==="enum"?t[e]=l!=null&&s.values.includes(l)?l:s.default:t[e]=l!=null&&/^https:\/\/[^\s"'<>]+$/i.test(l)?l:s.default}return t}var I="attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.,1.);}";function M(){let o=typeof window!="undefined"?window.__AIFX_MAX_DPR__:void 0;return typeof o=="number"&&o>0?o:1.5}function X(o){try{let i=new URL(o);return i.protocol!=="https:"||i.hostname!=="cdn.aidesigner.ai"?null:`https://api.aidesigner.ai/api/v1/effects/image-proxy?url=${encodeURIComponent(o)}`}catch{return null}}function U(o,i){var E;let t=document.createElement("canvas");t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;";let e=(E=t.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1}))!=null?E:t.getContext("experimental-webgl");if(!e)return null;function s(n,a){let r=e.createShader(n);return r?(e.shaderSource(r,a),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn("[aifx] shader compile failed:",e.getShaderInfoLog(r)),null)):null}let l=s(e.VERTEX_SHADER,I),c=s(e.FRAGMENT_SHADER,i),f=e.createProgram();if(!l||!c||!f)return null;if(e.attachShader(f,l),e.attachShader(f,c),e.linkProgram(f),!e.getProgramParameter(f,e.LINK_STATUS))return console.warn("[aifx] program link failed:",e.getProgramInfoLog(f)),null;e.useProgram(f),t.addEventListener("webglcontextlost",n=>{n.preventDefault(),o.dispatchEvent(new CustomEvent("aifx:contextlost"))});let v=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,v),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let b=e.getAttribLocation(f,"a_pos");e.enableVertexAttribArray(b),e.vertexAttribPointer(b,2,e.FLOAT,!1,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let _=new Map;function g(n){var a;return _.has(n)||_.set(n,e.getUniformLocation(f,n)),(a=_.get(n))!=null?a:null}o.appendChild(t);let h=null,x=0,w=null,d={gl:e,canvas:t,setUniform1f:(n,a)=>{let r=g(n);r&&e.uniform1f(r,a)},setUniform2f:(n,a,r)=>{let m=g(n);m&&e.uniform2f(m,a,r)},setUniform3f:(n,a,r,m)=>{let u=g(n);u&&e.uniform3f(u,a,r,m)},setColor:(n,a)=>{let[r,m,u]=T(a);d.setUniform3f(n,r,m,u)},setImage:n=>{if(n===w)return;w=n;let a=++x;if(!n){d.setUniform1f("u_hasImage",0);return}let r=(m,u)=>{let p=new Image;p.crossOrigin="anonymous";let R=()=>{if(a!==x)return;let A=u?null:X(n);if(A){r(A,!0);return}w=null,d.setUniform1f("u_hasImage",0)};p.onload=()=>{if(a!==x)return;h||(h=e.createTexture()),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,h),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,p)}catch{R();return}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let A=g("u_image");A&&e.uniform1i(A,0),d.setUniform2f("u_imageRes",p.naturalWidth,p.naturalHeight),d.setUniform1f("u_hasImage",1)},p.onerror=R,p.src=m};r(n,!1)},draw:n=>{d.setUniform1f("u_time",n),e.drawArrays(e.TRIANGLES,0,3)},resize:()=>{let n=Math.min(window.devicePixelRatio||1,M()),a=Math.max(1,Math.round(o.clientWidth*n)),r=Math.max(1,Math.round(o.clientHeight*n));(t.width!==a||t.height!==r)&&(t.width=a,t.height=r,e.viewport(0,0,a,r),d.setUniform2f("u_res",a,r))},destroy:()=>{var n;t.remove();try{(n=e.getExtension("WEBGL_lose_context"))==null||n.loseContext()}catch{}}};return d.resize(),d}function S(o,i,t){let e=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,s=0,l=!0,c=performance.now(),f=.5,v=.5,b=.5,_=.5,g=0,h=-1e9,x=m=>{let u=o.getBoundingClientRect();u.width<1||u.height<1||(f=(m.clientX-u.left)/u.width,v=(m.clientY-u.top)/u.height,h=performance.now())};window.addEventListener("pointermove",x,{passive:!0});let w=typeof window.__AIFX_FPS_CAP__=="number"&&window.__AIFX_FPS_CAP__>0?window.__AIFX_FPS_CAP__:0,d=w>0?1e3/w-1:0,E=-1e9,n=()=>{!e&&l&&(s=requestAnimationFrame(n));let m=performance.now();if(m-E<d)return;E=m;let u=(m-c)/1e3;b+=(f-b)*.07,_+=(v-_)*.07,g+=((m-h<2500?1:0)-g)*.045;let p=o.clientWidth/Math.max(o.clientHeight,1);i.setUniform2f("u_mouse",b*p,1-_),i.setUniform1f("u_mouseAct",g),t(u),i.draw(u)},a=typeof IntersectionObserver=="function"?new IntersectionObserver(m=>{let u=m.some(p=>p.isIntersecting);u&&!l?(l=!0,s=requestAnimationFrame(n)):!u&&l&&(l=!1,cancelAnimationFrame(s))}):null;a==null||a.observe(o);let r=typeof ResizeObserver=="function"?new ResizeObserver(()=>i.resize()):null;return r==null||r.observe(o),s=requestAnimationFrame(n),()=>{cancelAnimationFrame(s),window.removeEventListener("pointermove",x),a==null||a.disconnect(),r==null||r.disconnect()}}function C(o,i){let t=document.createElement("div");return t.style.cssText=`position:absolute;inset:0;background:linear-gradient(135deg, ${i.join(", ")});opacity:.85;`,o.appendChild(t),()=>t.remove()}var F={colors:{type:"colors",default:["#38bdf8","#818cf8"],min:1,max:4},bg:{type:"colors",default:["#0b1020"],min:1,max:1},"bg-alpha":{type:"number",default:1,min:0,max:1},spacing:{type:"number",default:.5,min:.2,max:1},"dot-size":{type:"number",default:.35,min:.1,max:.8},"wave-scale":{type:"number",default:1.2,min:.4,max:3},"wave-speed":{type:"number",default:.5,min:.05,max:2},angle:{type:"number",default:35,min:0,max:360},falloff:{type:"number",default:.5,min:.1,max:1},mouse:{type:"number",default:.7,min:0,max:1}},G=`
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time,u_spacing,u_dotsize,u_wavescale,u_wavespeed,u_angle,u_falloff,u_bgalpha,u_colorCount;
uniform vec2 u_mouse;
uniform float u_mouseAct,u_mouseStr;
uniform vec3 u_bg,u_c0,u_c1,u_c2,u_c3;

vec3 pick(float i){
  float k=mod(i,u_colorCount);
  if(k<0.5)return u_c0; if(k<1.5)return u_c1; if(k<2.5)return u_c2; return u_c3;
}
void main(){
  float aspect=u_res.x/max(u_res.y,1.0);
  vec2 uv=vec2(v_uv.x*aspect,v_uv.y);
  float cells=mix(48.0,16.0,u_spacing);
  vec2 g=uv*cells;
  vec2 cell=floor(g),f=fract(g);
  vec2 cellCenterUv=(cell+0.5)/cells;
  float rad=radians(u_angle);
  vec2 dir=vec2(cos(rad),sin(rad));
  float phase=dot(cellCenterUv,dir)*6.28318*u_wavescale - u_time*u_wavespeed*2.0;
  float wave=0.5+0.5*sin(phase);
  wave=pow(wave,1.0/max(u_falloff,0.1));

  // magnetic lens: gaussian presence around the smoothed cursor, sampled at
  // the dot center so each dot swells/brightens as a whole (closest dots
  // strongest). Everything is gated by u_mouseStr*u_mouseAct, so mouse=0 or
  // an idle pointer renders the exact ambient look.
  float gate=u_mouseStr*u_mouseAct;
  float md=distance(cellCenterUv,u_mouse);
  float lens=exp(-md*md*14.0)*gate;
  // faint ring-wave drifting outward from the cursor while it moves
  float ripple=(0.5+0.5*sin(md*26.0-u_time*5.0))*exp(-md*4.5)*gate*0.30;
  float lift=min(lens+ripple,1.0);

  float r=u_dotsize*0.5*(0.35+0.65*wave);
  r*=1.0+0.85*lens+0.25*ripple; // dots scale up under the lens
  float d=distance(f,vec2(0.5));
  float dot_=smoothstep(r,r*0.55,d);
  vec3 c=mix(pick(0.0),pick(1.0),wave);
  float bright=0.25+0.75*wave;
  bright+=0.95*lift*(1.0-0.35*wave); // brighten, strongest where ambient wave is dim
  vec3 col=u_bg+c*dot_*bright;
  col+=dot_*lens*lens*0.28*mix(c,vec3(1.0),0.55); // warm-white core nearest the cursor
  float alpha=clamp(max(u_bgalpha,dot_*min(wave+lift,1.0)),0.0,1.0);
  gl_FragColor=vec4(col,alpha);
}`,P;(P=window.AIFX)==null||P.register("dot-grid-wave",{mount(o,i){let t=y(F,i),e=U(o,G);if(!e){let c=C(o,t.colors);return{update(){},destroy:c}}let s=()=>{let c=t.colors;e.setUniform1f("u_colorCount",c.length),["u_c0","u_c1","u_c2","u_c3"].forEach((f,v)=>e.setColor(f,c[Math.min(v,c.length-1)])),e.setColor("u_bg",t.bg[0]),e.setUniform1f("u_bgalpha",t["bg-alpha"]),e.setUniform1f("u_spacing",t.spacing),e.setUniform1f("u_dotsize",t["dot-size"]),e.setUniform1f("u_wavescale",t["wave-scale"]),e.setUniform1f("u_wavespeed",t["wave-speed"]),e.setUniform1f("u_angle",t.angle),e.setUniform1f("u_falloff",t.falloff),e.setUniform1f("u_mouseStr",t.mouse)};s();let l=S(o,e,()=>{});return{update(c){t=y(F,c),s()},destroy(){l(),e.destroy()}}}});})();
