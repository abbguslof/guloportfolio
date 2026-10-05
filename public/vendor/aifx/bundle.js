"use strict";(()=>{function y(a){let i={};for(let c of Array.from(a.attributes))c.name.startsWith("data-aifx-")&&(i[c.name.slice(10)]=c.value);return i}var U=["/editor","/preview","/backgrounds","/debug/effects"],I="aidesigner.ai",X=new Set(["localhost","127.0.0.1"]);function $(a){if(!a)return!1;let i=a.toLowerCase();return X.has(i)?!0:i===I||i.endsWith("."+I)}function j(a){return a?U.some(i=>a===i||a.startsWith(i+"/")):!1}function L(a){if(!a)return!1;try{let i=new URL(a);return $(i.hostname)&&j(i.pathname)}catch{return!1}}(()=>{var k;if(typeof window=="undefined"||window.AIFX)return;let a=document.currentScript,i=(k=a==null?void 0:a.src)!=null?k:"/vendor/aifx/bundle.js",c="/vendor/aifx",w=i.indexOf("?"),S=w===-1?"":i.slice(w),R=(a==null?void 0:a.getAttribute("data-aifx-key"))||new URLSearchParams(S).get("key")||"",W="https://api.aidesigner.ai/api/v1/effects/license";function v(e){try{return e.location.href}catch{return""}}function F(){return[location.href,document.referrer,window.parent&&window.parent!==window?v(window.parent):"",window.top&&window.top!==window?v(window.top):""].some(L)}let M=!1;function N(){if(M||!document.body)return;M=!0;let e=document.createElement("div");e.setAttribute("data-aifx-wm","");let n=e.attachShadow({mode:"closed"});n.innerHTML='<a href="https://aidesigner.ai/?ref=effect-badge" target="_blank" rel="noopener nofollow ugc" style="position:fixed;bottom:16px;right:16px;z-index:2147483647;display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:8px;background:#fff;color:#111;font:500 13px/1 system-ui,sans-serif;text-decoration:none;box-shadow:0 2px 10px rgba(0,0,0,.15);border:1px solid #e5e5e5;">\u2728 Made in AIDesigner</a>',document.body.appendChild(e)}let T=!1;function H(){}let g=new Map,l=new Set,s=new WeakMap,m=new Set,h=new WeakMap;function P(e){if(g.has(e)||l.has(e)||!/^[a-z0-9-]{1,64}$/.test(e))return;l.add(e);let n=document.createElement("script");n.src=`${c}/fx/${e}/v1.js${S}`,n.async=!0,n.onerror=()=>l.delete(e),document.head.appendChild(n)}function O(e){try{if(!(parseFloat(getComputedStyle(e).zIndex)<0))return;for(let r=e.parentElement;r&&r!==document.documentElement;r=r.parentElement){let o=getComputedStyle(r);if(o.isolation==="isolate"||o.position!=="static"&&o.zIndex!=="auto"||o.transform!=="none"||o.filter!=="none"||parseFloat(o.opacity)<1||o.mixBlendMode!=="normal")return}let t=e.parentElement;t&&(t.style.isolation="isolate",console.info("[aifx] isolated the host section of a negative z-index effect so body/html backgrounds cannot paint over it"))}catch{}}function d(e){var f,u;if(!e||e.nodeType!==1||s.has(e))return;let n=e.getAttribute("data-aifx");if(!n)return;let t=e,r=g.get(n);if(!r){m.add(e),P(n);return}m.delete(e),((u=(f=t.ownerDocument)==null?void 0:f.defaultView)!=null?u:window).getComputedStyle(t).position==="static"&&(t.style.position="absolute"),t.style.overflow="hidden",O(t);try{s.set(e,{slug:n,instance:r.mount(t,y(t))}),H();let b=setTimeout(()=>{s.has(e)&&h.delete(e)},3e4);e.addEventListener("aifx:contextlost",()=>{var C;clearTimeout(b);let E=(C=h.get(e))!=null?C:0;if(p(e),E>=10)return;h.set(e,E+1);requestAnimationFrame(()=>{e.isConnected&&!document.hidden&&d(e)})},{once:!0})}catch(b){console.warn("[aifx] mount failed:",n,b)}}function p(e){let n=s.get(e);if(n){try{n.instance.destroy()}catch{}s.delete(e)}m.delete(e)}function x(e){var t;e.nodeType===1&&e.hasAttribute("data-aifx")&&d(e),(t=e.querySelectorAll)==null||t.call(e,"[data-aifx]").forEach(d)}window.AIFX={register(e,n){g.set(e,n),l.delete(e),m.forEach(t=>{t.isConnected&&t.getAttribute("data-aifx")===e&&d(t)})},rescan:()=>x(document)};let _=new MutationObserver(e=>{var n;for(let t of e){if(t.type==="attributes"&&t.target.nodeType===1){if(!((n=t.attributeName)!=null&&n.startsWith("data-aifx")))continue;let r=t.target;if(t.attributeName==="data-aifx")p(r),d(r);else{let o=s.get(r);if(o)try{o.instance.update(y(r))}catch{}}continue}t.addedNodes.forEach(r=>{r.nodeType===1&&x(r)}),t.removedNodes.forEach(r=>{var f,u;if(r.nodeType!==1)return;let o=r;(f=o.hasAttribute)!=null&&f.call(o,"data-aifx")&&p(o),(u=o.querySelectorAll)==null||u.call(o,"[data-aifx]").forEach(p)})}}),A=()=>{x(document),_.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0})};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",A,{once:!0}):A()})();})();
"use strict";(()=>{var P=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;function w(a){let o=a.replace("#","");(o.length===3||o.length===4)&&(o=o.split("").map(e=>e+e).join("")),o.length===8&&(o=o.slice(0,6));let t=parseInt(o,16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function R(a,o){let t={};for(let[e,s]of Object.entries(a)){let l=o[e];if(s.type==="number"){let m=l==null?NaN:parseFloat(l);t[e]=Number.isFinite(m)?Math.min(s.max,Math.max(s.min,m)):s.default}else if(s.type==="colors"){let m=(l!=null?l:"").split(",").map(f=>f.trim()).filter(f=>P.test(f));t[e]=m.length>=s.min?m.slice(0,s.max):s.default.slice()}else s.type==="enum"?t[e]=l!=null&&s.values.includes(l)?l:s.default:t[e]=l!=null&&/^https:\/\/[^\s"'<>]+$/i.test(l)?l:s.default}return t}var k="attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.,1.);}";function L(){let a=typeof window!="undefined"?window.__AIFX_MAX_DPR__:void 0;return typeof a=="number"&&a>0?a:1.5}function M(a){try{let o=new URL(a);return o.protocol!=="https:"||o.hostname!=="cdn.aidesigner.ai"?null:`https://api.aidesigner.ai/api/v1/effects/image-proxy?url=${encodeURIComponent(a)}`}catch{return null}}function T(a,o){var A;let t=document.createElement("canvas");t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;";let e=(A=t.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1}))!=null?A:t.getContext("experimental-webgl");if(!e)return null;function s(n,i){let r=e.createShader(n);return r?(e.shaderSource(r,i),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn("[aifx] shader compile failed:",e.getShaderInfoLog(r)),null)):null}let l=s(e.VERTEX_SHADER,k),m=s(e.FRAGMENT_SHADER,o),f=e.createProgram();if(!l||!m||!f)return null;if(e.attachShader(f,l),e.attachShader(f,m),e.linkProgram(f),!e.getProgramParameter(f,e.LINK_STATUS))return console.warn("[aifx] program link failed:",e.getProgramInfoLog(f)),null;e.useProgram(f),t.addEventListener("webglcontextlost",n=>{n.preventDefault(),a.dispatchEvent(new CustomEvent("aifx:contextlost"))});let v=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,v),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let h=e.getAttribLocation(f,"a_pos");e.enableVertexAttribArray(h),e.vertexAttribPointer(h,2,e.FLOAT,!1,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let d=new Map;function g(n){var i;return d.has(n)||d.set(n,e.getUniformLocation(f,n)),(i=d.get(n))!=null?i:null}a.appendChild(t);let x=null,b=0,y=null,p={gl:e,canvas:t,setUniform1f:(n,i)=>{let r=g(n);r&&e.uniform1f(r,i)},setUniform2f:(n,i,r)=>{let c=g(n);c&&e.uniform2f(c,i,r)},setUniform3f:(n,i,r,c)=>{let u=g(n);u&&e.uniform3f(u,i,r,c)},setColor:(n,i)=>{let[r,c,u]=w(i);p.setUniform3f(n,r,c,u)},setImage:n=>{if(n===y)return;y=n;let i=++b;if(!n){p.setUniform1f("u_hasImage",0);return}let r=(c,u)=>{let _=new Image;_.crossOrigin="anonymous";let U=()=>{if(i!==b)return;let E=u?null:M(n);if(E){r(E,!0);return}y=null,p.setUniform1f("u_hasImage",0)};_.onload=()=>{if(i!==b)return;x||(x=e.createTexture()),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,x),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,_)}catch{U();return}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let E=g("u_image");E&&e.uniform1i(E,0),p.setUniform2f("u_imageRes",_.naturalWidth,_.naturalHeight),p.setUniform1f("u_hasImage",1)},_.onerror=U,_.src=c};r(n,!1)},draw:n=>{p.setUniform1f("u_time",n),e.drawArrays(e.TRIANGLES,0,3)},resize:()=>{let n=Math.min(window.devicePixelRatio||1,L()),i=Math.max(1,Math.round(a.clientWidth*n)),r=Math.max(1,Math.round(a.clientHeight*n));(t.width!==i||t.height!==r)&&(t.width=i,t.height=r,e.viewport(0,0,i,r),p.setUniform2f("u_res",i,r))},destroy:()=>{t.remove();}};return p.resize(),p}function C(a,o,t){let e=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,s=0,l=!0,m=performance.now(),f=.5,v=.5,h=.5,d=.5,g=0,x=-1e9,b=c=>{let u=a.getBoundingClientRect();u.width<1||u.height<1||(f=(c.clientX-u.left)/u.width,v=(c.clientY-u.top)/u.height,x=performance.now())};window.addEventListener("pointermove",b,{passive:!0});let y=typeof window.__AIFX_FPS_CAP__=="number"&&window.__AIFX_FPS_CAP__>0?window.__AIFX_FPS_CAP__:0,p=y>0?1e3/y-1:0,A=-1e9,n=()=>{!e&&l&&(s=requestAnimationFrame(n));let c=performance.now();if(c-A<p)return;A=c;let u=(c-m)/1e3;h+=(f-h)*.07,d+=(v-d)*.07,g+=((c-x<2500?1:0)-g)*.045;let _=a.clientWidth/Math.max(a.clientHeight,1);o.setUniform2f("u_mouse",h*_,1-d),o.setUniform1f("u_mouseAct",g),t(u),o.draw(u)},i=typeof IntersectionObserver=="function"?new IntersectionObserver(c=>{let u=c.some(_=>_.isIntersecting);u&&!l?(l=!0,s=requestAnimationFrame(n)):!u&&l&&(l=!1,cancelAnimationFrame(s))}):null;i==null||i.observe(a);let r=typeof ResizeObserver=="function"?new ResizeObserver(()=>o.resize()):null;return r==null||r.observe(a),s=requestAnimationFrame(n),()=>{cancelAnimationFrame(s),window.removeEventListener("pointermove",b),i==null||i.disconnect(),r==null||r.disconnect()}}function S(a,o){let t=document.createElement("div");return t.style.cssText=`position:absolute;inset:0;background:linear-gradient(135deg, ${o.join(", ")});opacity:.85;`,a.appendChild(t),()=>t.remove()}var F={colors:{type:"colors",default:["#f1e7cf","#e6d2a8","#d4b384","#b98a5e"],min:2,max:5},ink:{type:"colors",default:["#6a543b","#3e3226"],min:1,max:2},bg:{type:"colors",default:["#f5efe3"],min:1,max:1},"bg-alpha":{type:"number",default:1,min:0,max:1},speed:{type:"number",default:.3,min:.02,max:2},density:{type:"number",default:24,min:6,max:60},"index-every":{type:"number",default:5,min:0,max:10},"index-weight":{type:"number",default:1,min:0,max:2},"line-weight":{type:"number",default:1,min:.4,max:2.5},tint:{type:"number",default:.55,min:0,max:1},relief:{type:"number",default:.45,min:0,max:1},scale:{type:"number",default:1.4,min:.4,max:4},warp:{type:"number",default:.55,min:0,max:1.5},paper:{type:"number",default:.5,min:0,max:1},mouse:{type:"number",default:.7,min:0,max:1}},N=`
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time,u_speed,u_density,u_scale,u_warp,u_lineW,u_idxEvery,u_idxWeight,u_tint,u_relief,u_paper,u_bgalpha,u_colorCount;
uniform vec2 u_mouse;
uniform float u_mouseAct,u_mouseStr;
uniform vec3 u_bg,u_ink0,u_ink1,u_c0,u_c1,u_c2,u_c3,u_c4;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}

// drifting fbm: every octave slides along its own rotated direction so the
// landforms morph organically instead of panning across the frame
float fbm2(vec2 p,float t){
  float v=0.0,a=0.56;mat2 m=mat2(0.80,0.60,-0.60,0.80);
  vec2 sh=vec2(t*0.11,t*0.07);
  for(int i=0;i<2;i++){v+=a*noise(p+sh);p=m*p*2.02+vec2(7.3,3.1);sh=m*sh*1.35;a*=0.52;}
  return v*1.18;
}
float fbm3(vec2 p,float t){
  float v=0.0,a=0.54;mat2 m=mat2(0.80,0.60,-0.60,0.80);
  vec2 sh=vec2(t*0.10,t*0.06);
  for(int i=0;i<3;i++){v+=a*noise(p+sh);p=m*p*2.02+vec2(7.3,3.1);sh=m*sh*1.35;a*=0.52;}
  return v*1.04;
}
float fbm4(vec2 p,float t){
  float v=0.0,a=0.52;mat2 m=mat2(0.80,0.60,-0.60,0.80);
  vec2 sh=vec2(t*0.085,t*0.055);
  for(int i=0;i<4;i++){v+=a*noise(p+sh);p=m*p*2.03+vec2(7.3,3.1);sh=m*sh*1.35;a*=0.52;}
  return v*1.02;
}

// landform: broad massifs (low octave) carry the composition; ridge detail
// only appears on the highlands so plains keep open, calm paper
float terrain(vec2 p,float t){
  p=mat2(1.02,0.20,-0.14,0.92)*p;        // gentle diagonal grain in the ranges
  float base=fbm3(p*0.5,t*0.7);
  base=(base-0.5)*1.7+0.5;               // stretch: deep plains, tall massifs
  float hi=smoothstep(0.35,0.85,base);
  float d=fbm4(p*1.75+vec2(13.7,5.2),t);
  return base+(d-0.50)*(0.30+0.50*hi);
}

// full height field: terrain + the cursor hill (in screen space, so it sits
// under the pointer). Sampled 3x for a numeric gradient -> screen-space AA.
float height(vec2 uv,vec2 wOff,float t,float mAmp,float mR2){
  float h=terrain(uv*u_scale+wOff,t);
  vec2 mr=uv-u_mouse;
  h+=mAmp*exp(-dot(mr,mr)/mR2);
  return h;
}

vec3 pick(float k){if(k<0.5)return u_c0;if(k<1.5)return u_c1;if(k<2.5)return u_c2;if(k<3.5)return u_c3;return u_c4;}
// gamma-aware elevation ramp through the user palette (low -> high)
vec3 ramp(float x){
  float f=clamp(x,0.0,1.0)*(u_colorCount-1.0);
  float fr=fract(f);fr=fr*fr*(3.0-2.0*fr);
  vec3 a=pick(floor(f)),b=pick(min(floor(f)+1.0,u_colorCount-1.0));
  return sqrt(mix(a*a,b*b,fr));
}

void main(){
  float aspect=u_res.x/max(u_res.y,1.0);
  vec2 uv=vec2(v_uv.x*aspect,v_uv.y);
  float t=u_time*u_speed;
  float e=1.0/max(u_res.y,1.0); // one pixel in uv units

  // cursor hill: grows under the pointer, contour rings bloom outward as the
  // activity envelope rises. Fully gated: idle or mouse=0 -> exact ambient.
  float mAct=u_mouseStr*u_mouseAct;
  float mAmp=mAct*7.5/max(u_density,4.0);
  float mR=0.085+0.050*mAct;
  float mR2=mR*mR;

  // slow domain warp shared across taps (low-freq: gradient error negligible)
  vec2 q=vec2(fbm2(uv*0.8+vec2(2.3,9.1),t*0.55),fbm2(uv*0.8+vec2(8.7,3.9),t*0.50));
  vec2 wOff=(q-0.5)*u_warp;

  float h0=height(uv,wOff,t,mAmp,mR2);
  float hx=height(uv+vec2(e,0.0),wOff,t,mAmp,mR2);
  float hy=height(uv+vec2(0.0,e),wOff,t,mAmp,mR2);
  vec2 slope=vec2(hx-h0,hy-h0)/e; // dh per uv unit

  float N=u_density;
  float H=h0*N;
  float gradPx=length(vec2(hx-h0,hy-h0))*N; // contour-units per pixel
  float spacing=1.0/max(gradPx,1e-4);       // px between adjacent contours
  float dInt=0.5-abs(fract(H)-0.5);         // distance to nearest level
  float dPx=dInt/max(gradPx,1e-4);          // ...converted to screen pixels

  // index contours: every Nth line heavier, like a survey map
  float ie=max(u_idxEvery,2.0);
  float idx=floor(H+0.5);
  float hasIdx=(u_idxEvery>1.5)?1.0:0.0;
  float isIdx=hasIdx*(1.0-step(0.5,mod(idx,ie)));

  float aa=0.65;
  float halfW=u_lineW*mix(0.50,0.50+0.62*u_idxWeight,isIdx);
  float line=1.0-smoothstep(halfW-aa,halfW+aa,dPx);
  // moire guard: dissolve lines as spacing approaches the pixel grid
  line*=smoothstep(2.1,4.6,spacing);
  float inkA=line*mix(0.55,1.0,isIdx);
  // surveyor's focus: ink darkens a touch around the cursor hill
  vec2 mrel=uv-u_mouse;
  inkA=min(inkA*(1.0+0.30*mAct*exp(-dot(mrel,mrel)/(mR2*5.0))),1.0);

  // hypsometric tint, quantized at index-contour intervals so the elevation
  // zones read as distinct layered-paper bands (AA'd ~1.5px at each edge)
  float bandN=mix(1.0,ie,hasIdx);
  float Hi=H/bandN;
  float fi=fract(Hi);
  float stepAA=clamp(fi*bandN/max(gradPx*1.5,1e-4),0.0,1.0);
  float lev=clamp(((floor(Hi)+stepAA)*bandN/N+0.18)*0.78,0.0,1.0);
  vec3 fill=mix(u_bg,ramp(lev),u_tint);

  // soft hillshade: light from the upper-left, embossed-paper relief
  float shade=dot(slope,vec2(-0.51,0.86));
  fill*=1.0+u_relief*clamp(shade*0.13,-0.20,0.24);

  // paper: two-scale fibre mottle + static grain
  float mot=noise(gl_FragCoord.xy*0.055)*0.65+noise(gl_FragCoord.xy*0.21+7.3)*0.35;
  fill*=1.0+u_paper*(mot-0.5)*0.075;
  fill+=u_paper*(hash(gl_FragCoord.xy)-0.5)*0.024;

  // gentle vignette keeps the sheet feeling bound
  float vig=smoothstep(0.42,0.85,length((v_uv-0.5)*vec2(1.15,1.0)));
  fill*=1.0-0.05*vig;

  vec3 inkCol=mix(u_ink0,u_ink1,isIdx);
  vec3 col=mix(fill,inkCol,inkA);

  // banding-free temporal dither
  col+=(hash(gl_FragCoord.xy+fract(t*3.7)*vec2(31.7,17.3))-0.5)*0.007;
  col=clamp(col,0.0,1.0);

  float alpha=max(u_bgalpha,clamp(inkA+u_tint*0.4*smoothstep(0.05,0.6,lev),0.0,1.0));
  gl_FragColor=vec4(col,alpha);
}`,I;(I=window.AIFX)==null||I.register("topo-lines",{mount(a,o){let t=R(F,o),e=T(a,N);if(!e){let m=S(a,[...t.bg,...t.colors]);return{update(){},destroy:m}}let s=()=>{let m=t.colors;e.setUniform1f("u_colorCount",m.length),["u_c0","u_c1","u_c2","u_c3","u_c4"].forEach((h,d)=>e.setColor(h,m[Math.min(d,m.length-1)]));let f=t.bg[0];e.setColor("u_bg",f);let v=t.ink;if(e.setColor("u_ink0",v[0]),v.length>1)e.setColor("u_ink1",v[1]);else{let[h,d,g]=w(v[0]),[x,b,y]=w(f),p=.299*h+.587*d+.114*g,A=.299*x+.587*b+.114*y,n=p>A?1.3:.55;e.setUniform3f("u_ink1",Math.min(h*n,1),Math.min(d*n,1),Math.min(g*n,1))}e.setUniform1f("u_bgalpha",t["bg-alpha"]),e.setUniform1f("u_speed",t.speed),e.setUniform1f("u_density",Math.round(t.density)),e.setUniform1f("u_idxEvery",Math.round(t["index-every"])),e.setUniform1f("u_idxWeight",t["index-weight"]),e.setUniform1f("u_lineW",t["line-weight"]),e.setUniform1f("u_tint",t.tint),e.setUniform1f("u_relief",t.relief),e.setUniform1f("u_scale",t.scale),e.setUniform1f("u_warp",t.warp),e.setUniform1f("u_paper",t.paper),e.setUniform1f("u_mouseStr",t.mouse)};s();let l=C(a,e,()=>{});return{update(m){t=R(F,m),s()},destroy(){l(),e.destroy()}}}});})();
"use strict";(()=>{var I=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;function T(a){let o=a.replace("#","");(o.length===3||o.length===4)&&(o=o.split("").map(e=>e+e).join("")),o.length===8&&(o=o.slice(0,6));let t=parseInt(o,16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function w(a,o){let t={};for(let[e,s]of Object.entries(a)){let c=o[e];if(s.type==="number"){let u=c==null?NaN:parseFloat(c);t[e]=Number.isFinite(u)?Math.min(s.max,Math.max(s.min,u)):s.default}else if(s.type==="colors"){let u=(c!=null?c:"").split(",").map(f=>f.trim()).filter(f=>I.test(f));t[e]=u.length>=s.min?u.slice(0,s.max):s.default.slice()}else s.type==="enum"?t[e]=c!=null&&s.values.includes(c)?c:s.default:t[e]=c!=null&&/^https:\/\/[^\s"'<>]+$/i.test(c)?c:s.default}return t}var P="attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.,1.);}";function M(){let a=typeof window!="undefined"?window.__AIFX_MAX_DPR__:void 0;return typeof a=="number"&&a>0?a:1.5}function X(a){try{let o=new URL(a);return o.protocol!=="https:"||o.hostname!=="cdn.aidesigner.ai"?null:`https://api.aidesigner.ai/api/v1/effects/image-proxy?url=${encodeURIComponent(a)}`}catch{return null}}function U(a,o){var E;let t=document.createElement("canvas");t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;";let e=(E=t.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1}))!=null?E:t.getContext("experimental-webgl");if(!e)return null;function s(n,i){let r=e.createShader(n);return r?(e.shaderSource(r,i),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn("[aifx] shader compile failed:",e.getShaderInfoLog(r)),null)):null}let c=s(e.VERTEX_SHADER,P),u=s(e.FRAGMENT_SHADER,o),f=e.createProgram();if(!c||!u||!f)return null;if(e.attachShader(f,c),e.attachShader(f,u),e.linkProgram(f),!e.getProgramParameter(f,e.LINK_STATUS))return console.warn("[aifx] program link failed:",e.getProgramInfoLog(f)),null;e.useProgram(f),t.addEventListener("webglcontextlost",n=>{n.preventDefault(),a.dispatchEvent(new CustomEvent("aifx:contextlost"))});let _=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,_),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let b=e.getAttribLocation(f,"a_pos");e.enableVertexAttribArray(b),e.vertexAttribPointer(b,2,e.FLOAT,!1,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let v=new Map;function g(n){var i;return v.has(n)||v.set(n,e.getUniformLocation(f,n)),(i=v.get(n))!=null?i:null}a.appendChild(t);let h=null,x=0,y=null,p={gl:e,canvas:t,setUniform1f:(n,i)=>{let r=g(n);r&&e.uniform1f(r,i)},setUniform2f:(n,i,r)=>{let m=g(n);m&&e.uniform2f(m,i,r)},setUniform3f:(n,i,r,m)=>{let l=g(n);l&&e.uniform3f(l,i,r,m)},setColor:(n,i)=>{let[r,m,l]=T(i);p.setUniform3f(n,r,m,l)},setImage:n=>{if(n===y)return;y=n;let i=++x;if(!n){p.setUniform1f("u_hasImage",0);return}let r=(m,l)=>{let d=new Image;d.crossOrigin="anonymous";let R=()=>{if(i!==x)return;let A=l?null:X(n);if(A){r(A,!0);return}y=null,p.setUniform1f("u_hasImage",0)};d.onload=()=>{if(i!==x)return;h||(h=e.createTexture()),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,h),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,d)}catch{R();return}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let A=g("u_image");A&&e.uniform1i(A,0),p.setUniform2f("u_imageRes",d.naturalWidth,d.naturalHeight),p.setUniform1f("u_hasImage",1)},d.onerror=R,d.src=m};r(n,!1)},draw:n=>{p.setUniform1f("u_time",n),e.drawArrays(e.TRIANGLES,0,3)},resize:()=>{let n=Math.min(window.devicePixelRatio||1,M()),i=Math.max(1,Math.round(a.clientWidth*n)),r=Math.max(1,Math.round(a.clientHeight*n));(t.width!==i||t.height!==r)&&(t.width=i,t.height=r,e.viewport(0,0,i,r),p.setUniform2f("u_res",i,r))},destroy:()=>{t.remove();}};return p.resize(),p}function S(a,o,t){let e=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,s=0,c=!0,u=performance.now(),f=.5,_=.5,b=.5,v=.5,g=0,h=-1e9,x=m=>{let l=a.getBoundingClientRect();l.width<1||l.height<1||(f=(m.clientX-l.left)/l.width,_=(m.clientY-l.top)/l.height,h=performance.now())};window.addEventListener("pointermove",x,{passive:!0});let y=typeof window.__AIFX_FPS_CAP__=="number"&&window.__AIFX_FPS_CAP__>0?window.__AIFX_FPS_CAP__:0,p=y>0?1e3/y-1:0,E=-1e9,n=()=>{!e&&c&&(s=requestAnimationFrame(n));let m=performance.now();if(m-E<p)return;E=m;let l=(m-u)/1e3;b+=(f-b)*.07,v+=(_-v)*.07,g+=((m-h<2500?1:0)-g)*.045;let d=a.clientWidth/Math.max(a.clientHeight,1);o.setUniform2f("u_mouse",b*d,1-v),o.setUniform1f("u_mouseAct",g),t(l),o.draw(l)},i=typeof IntersectionObserver=="function"?new IntersectionObserver(m=>{let l=m.some(d=>d.isIntersecting);l&&!c?(c=!0,s=requestAnimationFrame(n)):!l&&c&&(c=!1,cancelAnimationFrame(s))}):null;i==null||i.observe(a);let r=typeof ResizeObserver=="function"?new ResizeObserver(()=>o.resize()):null;return r==null||r.observe(a),s=requestAnimationFrame(n),()=>{cancelAnimationFrame(s),window.removeEventListener("pointermove",x),i==null||i.disconnect(),r==null||r.disconnect()}}function F(a,o){let t=document.createElement("div");return t.style.cssText=`position:absolute;inset:0;background:linear-gradient(135deg, ${o.join(", ")});opacity:.85;`,a.appendChild(t),()=>t.remove()}var L={colors:{type:"colors",default:["#2c41c4","#8b5cf6","#ff7ab6","#ffe3c2"],min:1,max:6},bg:{type:"colors",default:["#0a0e23"],min:1,max:1},"bg-alpha":{type:"number",default:1,min:0,max:1},speed:{type:"number",default:.3,min:.02,max:2},"pixel-size":{type:"number",default:4,min:1,max:16},levels:{type:"number",default:6,min:2,max:16},scale:{type:"number",default:1.5,min:.3,max:5},contrast:{type:"number",default:1.2,min:.4,max:2.5},"flow-angle":{type:"number",default:30,min:0,max:360},detail:{type:"number",default:.4,min:0,max:1},glow:{type:"number",default:.5,min:0,max:1},matrix:{type:"enum",default:"8",values:["2","4","8"]},image:{type:"url",default:""}},D=`
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
"use strict";(()=>{var P=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;function T(o){let i=o.replace("#","");(i.length===3||i.length===4)&&(i=i.split("").map(e=>e+e).join("")),i.length===8&&(i=i.slice(0,6));let t=parseInt(i,16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function A(o,i){let t={};for(let[e,l]of Object.entries(o)){let s=i[e];if(l.type==="number"){let f=s==null?NaN:parseFloat(s);t[e]=Number.isFinite(f)?Math.min(l.max,Math.max(l.min,f)):l.default}else if(l.type==="colors"){let f=(s!=null?s:"").split(",").map(u=>u.trim()).filter(u=>P.test(u));t[e]=f.length>=l.min?f.slice(0,l.max):l.default.slice()}else l.type==="enum"?t[e]=s!=null&&l.values.includes(s)?s:l.default:t[e]=s!=null&&/^https:\/\/[^\s"'<>]+$/i.test(s)?s:l.default}return t}var L="attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.,1.);}";function q(){let o=typeof window!="undefined"?window.__AIFX_MAX_DPR__:void 0;return typeof o=="number"&&o>0?o:1.5}function M(o){try{let i=new URL(o);return i.protocol!=="https:"||i.hostname!=="cdn.aidesigner.ai"?null:`https://api.aidesigner.ai/api/v1/effects/image-proxy?url=${encodeURIComponent(o)}`}catch{return null}}function S(o,i){var y;let t=document.createElement("canvas");t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;";let e=(y=t.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1}))!=null?y:t.getContext("experimental-webgl");if(!e)return null;function l(n,a){let r=e.createShader(n);return r?(e.shaderSource(r,a),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn("[aifx] shader compile failed:",e.getShaderInfoLog(r)),null)):null}let s=l(e.VERTEX_SHADER,L),f=l(e.FRAGMENT_SHADER,i),u=e.createProgram();if(!s||!f||!u)return null;if(e.attachShader(u,s),e.attachShader(u,f),e.linkProgram(u),!e.getProgramParameter(u,e.LINK_STATUS))return console.warn("[aifx] program link failed:",e.getProgramInfoLog(u)),null;e.useProgram(u),t.addEventListener("webglcontextlost",n=>{n.preventDefault(),o.dispatchEvent(new CustomEvent("aifx:contextlost"))});let _=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,_),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let h=e.getAttribLocation(u,"a_pos");e.enableVertexAttribArray(h),e.vertexAttribPointer(h,2,e.FLOAT,!1,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let g=new Map;function v(n){var a;return g.has(n)||g.set(n,e.getUniformLocation(u,n)),(a=g.get(n))!=null?a:null}o.appendChild(t);let x=null,b=0,w=null,p={gl:e,canvas:t,setUniform1f:(n,a)=>{let r=v(n);r&&e.uniform1f(r,a)},setUniform2f:(n,a,r)=>{let m=v(n);m&&e.uniform2f(m,a,r)},setUniform3f:(n,a,r,m)=>{let c=v(n);c&&e.uniform3f(c,a,r,m)},setColor:(n,a)=>{let[r,m,c]=T(a);p.setUniform3f(n,r,m,c)},setImage:n=>{if(n===w)return;w=n;let a=++b;if(!n){p.setUniform1f("u_hasImage",0);return}let r=(m,c)=>{let d=new Image;d.crossOrigin="anonymous";let R=()=>{if(a!==b)return;let E=c?null:M(n);if(E){r(E,!0);return}w=null,p.setUniform1f("u_hasImage",0)};d.onload=()=>{if(a!==b)return;x||(x=e.createTexture()),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,x),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,d)}catch{R();return}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let E=v("u_image");E&&e.uniform1i(E,0),p.setUniform2f("u_imageRes",d.naturalWidth,d.naturalHeight),p.setUniform1f("u_hasImage",1)},d.onerror=R,d.src=m};r(n,!1)},draw:n=>{p.setUniform1f("u_time",n),e.drawArrays(e.TRIANGLES,0,3)},resize:()=>{let n=Math.min(window.devicePixelRatio||1,q()),a=Math.max(1,Math.round(o.clientWidth*n)),r=Math.max(1,Math.round(o.clientHeight*n));(t.width!==a||t.height!==r)&&(t.width=a,t.height=r,e.viewport(0,0,a,r),p.setUniform2f("u_res",a,r))},destroy:()=>{t.remove();}};return p.resize(),p}function U(o,i,t){let e=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,l=0,s=!0,f=performance.now(),u=.5,_=.5,h=.5,g=.5,v=0,x=-1e9,b=m=>{let c=o.getBoundingClientRect();c.width<1||c.height<1||(u=(m.clientX-c.left)/c.width,_=(m.clientY-c.top)/c.height,x=performance.now())};window.addEventListener("pointermove",b,{passive:!0});let w=typeof window.__AIFX_FPS_CAP__=="number"&&window.__AIFX_FPS_CAP__>0?window.__AIFX_FPS_CAP__:0,p=w>0?1e3/w-1:0,y=-1e9,n=()=>{!e&&s&&(l=requestAnimationFrame(n));let m=performance.now();if(m-y<p)return;y=m;let c=(m-f)/1e3;h+=(u-h)*.07,g+=(_-g)*.07,v+=((m-x<2500?1:0)-v)*.045;let d=o.clientWidth/Math.max(o.clientHeight,1);i.setUniform2f("u_mouse",h*d,1-g),i.setUniform1f("u_mouseAct",v),t(c),i.draw(c)},a=typeof IntersectionObserver=="function"?new IntersectionObserver(m=>{let c=m.some(d=>d.isIntersecting);c&&!s?(s=!0,l=requestAnimationFrame(n)):!c&&s&&(s=!1,cancelAnimationFrame(l))}):null;a==null||a.observe(o);let r=typeof ResizeObserver=="function"?new ResizeObserver(()=>i.resize()):null;return r==null||r.observe(o),l=requestAnimationFrame(n),()=>{cancelAnimationFrame(l),window.removeEventListener("pointermove",b),a==null||a.disconnect(),r==null||r.disconnect()}}function C(o,i){let t=document.createElement("div");return t.style.cssText=`position:absolute;inset:0;background:linear-gradient(135deg, ${i.join(", ")});opacity:.85;`,o.appendChild(t),()=>t.remove()}var F={colors:{type:"colors",default:["#0e4a30","#2fd97c","#c9ffe0"],min:1,max:4},bg:{type:"colors",default:["#04130c"],min:1,max:1},"bg-alpha":{type:"number",default:1,min:0,max:1},speed:{type:"number",default:.3,min:.05,max:2},"cell-size":{type:"number",default:18,min:8,max:36},levels:{type:"number",default:9,min:3,max:10},scale:{type:"number",default:1.6,min:.5,max:4},glow:{type:"number",default:.55,min:0,max:1},flicker:{type:"number",default:.3,min:0,max:1},contrast:{type:"number",default:1.15,min:.5,max:2.5},scanlines:{type:"number",default:.3,min:0,max:1}},X=`
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time,u_speed,u_cell,u_levels,u_scale,u_glow,u_flicker,u_contrast,u_scan,u_bgalpha,u_dpr,u_colorCount;
uniform vec3 u_bg,u_c0,u_c1,u_c2,u_c3;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.07;a*=0.5;}return v;}

vec3 ramp(float t){
  t=clamp(t,0.0,1.0)*(u_colorCount-1.0);
  if(t<1.0)return mix(u_c0,u_c1,t);
  if(t<2.0)return mix(u_c1,u_c2,t-1.0);
  return mix(u_c2,u_c3,t-2.0);
}

float sdBox(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.0))+min(max(d.x,d.y),0.0);}
float sdSeg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return length(pa-ba*h);}

// procedural glyph SDF ramp:  (space) . : - = + * # @
float glyph(float gi,vec2 q){
  if(gi<0.5)return 1.0;
  if(gi<1.5)return length(q-vec2(0.0,-0.30))-0.16;
  if(gi<2.5)return min(length(q-vec2(0.0,0.28)),length(q-vec2(0.0,-0.28)))-0.15;
  if(gi<3.5)return sdBox(q,vec2(0.30,0.09));
  if(gi<4.5)return min(sdBox(q-vec2(0.0,0.19),vec2(0.30,0.085)),sdBox(q+vec2(0.0,0.19),vec2(0.30,0.085)));
  if(gi<5.5)return min(sdBox(q,vec2(0.32,0.09)),sdBox(q,vec2(0.09,0.32)));
  if(gi<6.5){
    float d=sdSeg(q,vec2(0.0,-0.32),vec2(0.0,0.32));
    d=min(d,sdSeg(q,vec2(-0.28,-0.16),vec2(0.28,0.16)));
    d=min(d,sdSeg(q,vec2(-0.28,0.16),vec2(0.28,-0.16)));
    return d-0.09;
  }
  if(gi<7.5){
    float d=min(sdBox(q-vec2(0.0,0.17),vec2(0.34,0.075)),sdBox(q+vec2(0.0,0.17),vec2(0.34,0.075)));
    return min(d,min(sdBox(q-vec2(0.15,0.0),vec2(0.075,0.36)),sdBox(q+vec2(0.15,0.0),vec2(0.075,0.36))));
  }
  float d=abs(length(q)-0.31)-0.08;
  return min(d,length(q)-0.13);
}

// cheap sin-interference plasma with orbiting sources (no noise) \u2014 reused for the glow wash
float plasma(vec2 p,float t){
  vec2 o1=vec2(0.55+0.4*sin(t*0.31),0.32*cos(t*0.23));
  vec2 o2=vec2(-0.5+0.35*cos(t*0.27),0.36*sin(t*0.19)-0.08);
  float v=sin(p.x*2.3-t*0.7)+sin(p.y*3.1+t*0.5)+sin((p.x+p.y)*1.9+t*0.6);
  v+=1.7*sin(length(p-o1)*3.6-t*0.9);
  v+=1.5*sin(length(p-o2)*3.1+t*0.8);
  v*=0.16;
  return v/(1.0+abs(v)*0.4); // gentle soft clip, stays in linear range for smooth gradation
}

void main(){
  float aspect=u_res.x/max(u_res.y,1.0);
  float t=u_time*u_speed;
  float cellH=max(u_cell*u_dpr,4.0);
  vec2 cellSz=vec2(cellH*0.62,cellH);
  vec2 px=v_uv*u_res;
  vec2 cellId=floor(px/cellSz);
  vec2 cellC=(cellId+0.5)*cellSz;
  vec2 q=(px-cellC)/cellH*2.0;          // physical cell-local coords, y in [-1,1]
  vec2 qn=(px-cellC)/cellSz*2.0;        // normalized cell-local coords for halo

  // --- field at cell center (crisp per-cell brightness) ---
  vec2 fp=(cellC/u_res.y-vec2(0.5*aspect,0.5))*u_scale;
  float pv=plasma(fp,t);
  float w=fbm(fp*2.1+vec2(t*0.10,-t*0.07)+pv*0.8);
  float vc=clamp(0.5+pv*0.95+(w-0.5)*0.45,0.0,1.0);
  vc=clamp(0.5+(vc-0.5)*u_contrast*1.25,0.0,1.0);
  vc=pow(vc,1.3); // deepen darks so forms float in negative space
  vc-=smoothstep(0.72,1.0,vc)*(0.02+0.20*(1.0-w)); // erode bright cores with fbm so they break into # * + textures

  // per-cell flicker (stepped time) + static dither to break level banding
  float fl=hash(cellId+floor(u_time*9.0));
  vc+=(fl-0.5)*u_flicker*0.10;
  vc+=(hash(cellId*1.7+11.3)-0.5)*(0.30/u_levels);
  // sparse blinking dots in the void \u2014 idle-terminal noise
  float spark=smoothstep(0.972,1.0,hash(cellId*2.3+floor(u_time*2.5)));
  vc=max(vc,spark*(0.35+0.5*u_flicker)/u_levels);
  vc=clamp(vc,0.0,1.0);

  // --- quantize to glyph ramp ---
  float lv=clamp(floor(vc*u_levels),0.0,u_levels-1.0);
  float den=max(u_levels-1.0,1.0);
  float gi=floor(lv/den*8.0+0.5);
  float vq=lv/den;

  float d=glyph(gi,q/1.4)*1.4; // glyphs fill ~70% of the cell like real terminal chars
  float aa=2.4/cellH;
  float cov=smoothstep(aa,-aa,d);

  // --- smooth phosphor wash (fragment-resolution, cheap plasma only) ---
  float pw=clamp(plasma((px/u_res.y-vec2(0.5*aspect,0.5))*u_scale,t)+0.5,0.0,1.0);
  pw=pw*pw;
  vec3 wash=ramp(pw*0.85)*pw*u_glow*0.16;

  // --- per-cell halo with exponential falloff ---
  float halo=exp(-dot(qn,qn)*1.1)*pow(vq,2.0)*u_glow*0.35;

  // --- glyph color ---
  vec3 gcol=ramp(mix(vq,vc,0.35));
  gcol*=0.62+0.6*vc;
  gcol=mix(gcol,vec3(1.0),smoothstep(0.86,1.0,vc)*0.3);

  // --- compose ---
  vec2 vctr=(v_uv-0.5)*vec2(aspect,1.0);
  float vig=1.0-0.28*smoothstep(0.3,1.1,length(vctr));
  vec3 col=u_bg*vig*u_bgalpha+wash+ramp(vq)*halo;
  col+=ramp(vc)*vc*0.05; // faint per-cell ambient tint for depth in empty cells
  col=mix(col,gcol,cov);

  // CRT scanlines (2 CSS px period) + slow refresh sweep
  float scan=1.0-u_scan*0.16*(0.5+0.5*sin(px.y/u_dpr*3.14159));
  col*=scan;
  float sp=fract(u_time*0.05);
  float dsw=(v_uv.y-(1.0-sp))*9.0;
  col*=1.0+exp(-dsw*dsw)*u_flicker*0.10;

  // film grain + dither
  col+=(hash(px*0.7+fract(u_time)*13.1)-0.5)*0.02;
  col+=(hash(px+0.5)-0.5)*0.008;

  float alpha=clamp(max(u_bgalpha,cov+halo*0.6+pw*u_glow*0.3),0.0,1.0);
  gl_FragColor=vec4(col,alpha);
}`,I;(I=window.AIFX)==null||I.register("ascii",{mount(o,i){let t=A(F,i),e=S(o,X);if(!e){let f=C(o,t.colors);return{update(){},destroy:f}}let l=()=>{let f=t.colors;e.setUniform1f("u_colorCount",f.length),["u_c0","u_c1","u_c2","u_c3"].forEach((u,_)=>e.setColor(u,f[Math.min(_,f.length-1)])),e.setColor("u_bg",t.bg[0]),e.setUniform1f("u_bgalpha",t["bg-alpha"]),e.setUniform1f("u_speed",t.speed),e.setUniform1f("u_cell",t["cell-size"]),e.setUniform1f("u_levels",t.levels),e.setUniform1f("u_scale",t.scale),e.setUniform1f("u_glow",t.glow),e.setUniform1f("u_flicker",t.flicker),e.setUniform1f("u_contrast",t.contrast),e.setUniform1f("u_scan",t.scanlines),e.setUniform1f("u_dpr",Math.min(window.devicePixelRatio||1,1.5))};l();let s=U(o,e,()=>{});return{update(f){t=A(F,f),l()},destroy(){s(),e.destroy()}}}});})();
"use strict";(()=>{var L=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;function T(o){let i=o.replace("#","");(i.length===3||i.length===4)&&(i=i.split("").map(e=>e+e).join("")),i.length===8&&(i=i.slice(0,6));let t=parseInt(i,16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function y(o,i){let t={};for(let[e,s]of Object.entries(o)){let l=i[e];if(s.type==="number"){let c=l==null?NaN:parseFloat(l);t[e]=Number.isFinite(c)?Math.min(s.max,Math.max(s.min,c)):s.default}else if(s.type==="colors"){let c=(l!=null?l:"").split(",").map(f=>f.trim()).filter(f=>L.test(f));t[e]=c.length>=s.min?c.slice(0,s.max):s.default.slice()}else s.type==="enum"?t[e]=l!=null&&s.values.includes(l)?l:s.default:t[e]=l!=null&&/^https:\/\/[^\s"'<>]+$/i.test(l)?l:s.default}return t}var I="attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.,1.);}";function M(){let o=typeof window!="undefined"?window.__AIFX_MAX_DPR__:void 0;return typeof o=="number"&&o>0?o:1.5}function X(o){try{let i=new URL(o);return i.protocol!=="https:"||i.hostname!=="cdn.aidesigner.ai"?null:`https://api.aidesigner.ai/api/v1/effects/image-proxy?url=${encodeURIComponent(o)}`}catch{return null}}function U(o,i){var E;let t=document.createElement("canvas");t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;";let e=(E=t.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1}))!=null?E:t.getContext("experimental-webgl");if(!e)return null;function s(n,a){let r=e.createShader(n);return r?(e.shaderSource(r,a),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn("[aifx] shader compile failed:",e.getShaderInfoLog(r)),null)):null}let l=s(e.VERTEX_SHADER,I),c=s(e.FRAGMENT_SHADER,i),f=e.createProgram();if(!l||!c||!f)return null;if(e.attachShader(f,l),e.attachShader(f,c),e.linkProgram(f),!e.getProgramParameter(f,e.LINK_STATUS))return console.warn("[aifx] program link failed:",e.getProgramInfoLog(f)),null;e.useProgram(f),t.addEventListener("webglcontextlost",n=>{n.preventDefault(),o.dispatchEvent(new CustomEvent("aifx:contextlost"))});let v=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,v),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let b=e.getAttribLocation(f,"a_pos");e.enableVertexAttribArray(b),e.vertexAttribPointer(b,2,e.FLOAT,!1,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let _=new Map;function g(n){var a;return _.has(n)||_.set(n,e.getUniformLocation(f,n)),(a=_.get(n))!=null?a:null}o.appendChild(t);let h=null,x=0,w=null,d={gl:e,canvas:t,setUniform1f:(n,a)=>{let r=g(n);r&&e.uniform1f(r,a)},setUniform2f:(n,a,r)=>{let m=g(n);m&&e.uniform2f(m,a,r)},setUniform3f:(n,a,r,m)=>{let u=g(n);u&&e.uniform3f(u,a,r,m)},setColor:(n,a)=>{let[r,m,u]=T(a);d.setUniform3f(n,r,m,u)},setImage:n=>{if(n===w)return;w=n;let a=++x;if(!n){d.setUniform1f("u_hasImage",0);return}let r=(m,u)=>{let p=new Image;p.crossOrigin="anonymous";let R=()=>{if(a!==x)return;let A=u?null:X(n);if(A){r(A,!0);return}w=null,d.setUniform1f("u_hasImage",0)};p.onload=()=>{if(a!==x)return;h||(h=e.createTexture()),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,h),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,p)}catch{R();return}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let A=g("u_image");A&&e.uniform1i(A,0),d.setUniform2f("u_imageRes",p.naturalWidth,p.naturalHeight),d.setUniform1f("u_hasImage",1)},p.onerror=R,p.src=m};r(n,!1)},draw:n=>{d.setUniform1f("u_time",n),e.drawArrays(e.TRIANGLES,0,3)},resize:()=>{let n=Math.min(window.devicePixelRatio||1,M()),a=Math.max(1,Math.round(o.clientWidth*n)),r=Math.max(1,Math.round(o.clientHeight*n));(t.width!==a||t.height!==r)&&(t.width=a,t.height=r,e.viewport(0,0,a,r),d.setUniform2f("u_res",a,r))},destroy:()=>{t.remove();}};return d.resize(),d}function S(o,i,t){let e=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,s=0,l=!0,c=performance.now(),f=.5,v=.5,b=.5,_=.5,g=0,h=-1e9,x=m=>{let u=o.getBoundingClientRect();u.width<1||u.height<1||(f=(m.clientX-u.left)/u.width,v=(m.clientY-u.top)/u.height,h=performance.now())};window.addEventListener("pointermove",x,{passive:!0});let w=typeof window.__AIFX_FPS_CAP__=="number"&&window.__AIFX_FPS_CAP__>0?window.__AIFX_FPS_CAP__:0,d=w>0?1e3/w-1:0,E=-1e9,n=()=>{!e&&l&&(s=requestAnimationFrame(n));let m=performance.now();if(m-E<d)return;E=m;let u=(m-c)/1e3;b+=(f-b)*.07,_+=(v-_)*.07,g+=((m-h<2500?1:0)-g)*.045;let p=o.clientWidth/Math.max(o.clientHeight,1);i.setUniform2f("u_mouse",b*p,1-_),i.setUniform1f("u_mouseAct",g),t(u),i.draw(u)},a=typeof IntersectionObserver=="function"?new IntersectionObserver(m=>{let u=m.some(p=>p.isIntersecting);u&&!l?(l=!0,s=requestAnimationFrame(n)):!u&&l&&(l=!1,cancelAnimationFrame(s))}):null;a==null||a.observe(o);let r=typeof ResizeObserver=="function"?new ResizeObserver(()=>i.resize()):null;return r==null||r.observe(o),s=requestAnimationFrame(n),()=>{cancelAnimationFrame(s),window.removeEventListener("pointermove",x),a==null||a.disconnect(),r==null||r.disconnect()}}function C(o,i){let t=document.createElement("div");return t.style.cssText=`position:absolute;inset:0;background:linear-gradient(135deg, ${i.join(", ")});opacity:.85;`,o.appendChild(t),()=>t.remove()}var F={colors:{type:"colors",default:["#38bdf8","#818cf8"],min:1,max:4},bg:{type:"colors",default:["#0b1020"],min:1,max:1},"bg-alpha":{type:"number",default:1,min:0,max:1},spacing:{type:"number",default:.5,min:.2,max:1},"dot-size":{type:"number",default:.35,min:.1,max:.8},"wave-scale":{type:"number",default:1.2,min:.4,max:3},"wave-speed":{type:"number",default:.5,min:.05,max:2},angle:{type:"number",default:35,min:0,max:360},falloff:{type:"number",default:.5,min:.1,max:1},mouse:{type:"number",default:.7,min:0,max:1}},G=`
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
"use strict";(()=>{var P=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;function T(o){let a=o.replace("#","");(a.length===3||a.length===4)&&(a=a.split("").map(e=>e+e).join("")),a.length===8&&(a=a.slice(0,6));let t=parseInt(a,16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function R(o,a){let t={};for(let[e,s]of Object.entries(o)){let l=a[e];if(s.type==="number"){let f=l==null?NaN:parseFloat(l);t[e]=Number.isFinite(f)?Math.min(s.max,Math.max(s.min,f)):s.default}else if(s.type==="colors"){let f=(l!=null?l:"").split(",").map(u=>u.trim()).filter(u=>P.test(u));t[e]=f.length>=s.min?f.slice(0,s.max):s.default.slice()}else s.type==="enum"?t[e]=l!=null&&s.values.includes(l)?l:s.default:t[e]=l!=null&&/^https:\/\/[^\s"'<>]+$/i.test(l)?l:s.default}return t}var I="attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.,1.);}";function M(){let o=typeof window!="undefined"?window.__AIFX_MAX_DPR__:void 0;return typeof o=="number"&&o>0?o:1.5}function k(o){try{let a=new URL(o);return a.protocol!=="https:"||a.hostname!=="cdn.aidesigner.ai"?null:`https://api.aidesigner.ai/api/v1/effects/image-proxy?url=${encodeURIComponent(o)}`}catch{return null}}function U(o,a){var y;let t=document.createElement("canvas");t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;";let e=(y=t.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1}))!=null?y:t.getContext("experimental-webgl");if(!e)return null;function s(n,i){let r=e.createShader(n);return r?(e.shaderSource(r,i),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn("[aifx] shader compile failed:",e.getShaderInfoLog(r)),null)):null}let l=s(e.VERTEX_SHADER,I),f=s(e.FRAGMENT_SHADER,a),u=e.createProgram();if(!l||!f||!u)return null;if(e.attachShader(u,l),e.attachShader(u,f),e.linkProgram(u),!e.getProgramParameter(u,e.LINK_STATUS))return console.warn("[aifx] program link failed:",e.getProgramInfoLog(u)),null;e.useProgram(u),t.addEventListener("webglcontextlost",n=>{n.preventDefault(),o.dispatchEvent(new CustomEvent("aifx:contextlost"))});let v=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,v),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let h=e.getAttribLocation(u,"a_pos");e.enableVertexAttribArray(h),e.vertexAttribPointer(h,2,e.FLOAT,!1,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let _=new Map;function g(n){var i;return _.has(n)||_.set(n,e.getUniformLocation(u,n)),(i=_.get(n))!=null?i:null}o.appendChild(t);let b=null,x=0,E=null,d={gl:e,canvas:t,setUniform1f:(n,i)=>{let r=g(n);r&&e.uniform1f(r,i)},setUniform2f:(n,i,r)=>{let m=g(n);m&&e.uniform2f(m,i,r)},setUniform3f:(n,i,r,m)=>{let c=g(n);c&&e.uniform3f(c,i,r,m)},setColor:(n,i)=>{let[r,m,c]=T(i);d.setUniform3f(n,r,m,c)},setImage:n=>{if(n===E)return;E=n;let i=++x;if(!n){d.setUniform1f("u_hasImage",0);return}let r=(m,c)=>{let p=new Image;p.crossOrigin="anonymous";let w=()=>{if(i!==x)return;let A=c?null:k(n);if(A){r(A,!0);return}E=null,d.setUniform1f("u_hasImage",0)};p.onload=()=>{if(i!==x)return;b||(b=e.createTexture()),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,b),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,p)}catch{w();return}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let A=g("u_image");A&&e.uniform1i(A,0),d.setUniform2f("u_imageRes",p.naturalWidth,p.naturalHeight),d.setUniform1f("u_hasImage",1)},p.onerror=w,p.src=m};r(n,!1)},draw:n=>{d.setUniform1f("u_time",n),e.drawArrays(e.TRIANGLES,0,3)},resize:()=>{let n=Math.min(window.devicePixelRatio||1,M()),i=Math.max(1,Math.round(o.clientWidth*n)),r=Math.max(1,Math.round(o.clientHeight*n));(t.width!==i||t.height!==r)&&(t.width=i,t.height=r,e.viewport(0,0,i,r),d.setUniform2f("u_res",i,r))},destroy:()=>{t.remove();}};return d.resize(),d}function S(o,a,t){let e=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,s=0,l=!0,f=performance.now(),u=.5,v=.5,h=.5,_=.5,g=0,b=-1e9,x=m=>{let c=o.getBoundingClientRect();c.width<1||c.height<1||(u=(m.clientX-c.left)/c.width,v=(m.clientY-c.top)/c.height,b=performance.now())};window.addEventListener("pointermove",x,{passive:!0});let E=typeof window.__AIFX_FPS_CAP__=="number"&&window.__AIFX_FPS_CAP__>0?window.__AIFX_FPS_CAP__:0,d=E>0?1e3/E-1:0,y=-1e9,n=()=>{!e&&l&&(s=requestAnimationFrame(n));let m=performance.now();if(m-y<d)return;y=m;let c=(m-f)/1e3;h+=(u-h)*.07,_+=(v-_)*.07,g+=((m-b<2500?1:0)-g)*.045;let p=o.clientWidth/Math.max(o.clientHeight,1);a.setUniform2f("u_mouse",h*p,1-_),a.setUniform1f("u_mouseAct",g),t(c),a.draw(c)},i=typeof IntersectionObserver=="function"?new IntersectionObserver(m=>{let c=m.some(p=>p.isIntersecting);c&&!l?(l=!0,s=requestAnimationFrame(n)):!c&&l&&(l=!1,cancelAnimationFrame(s))}):null;i==null||i.observe(o);let r=typeof ResizeObserver=="function"?new ResizeObserver(()=>a.resize()):null;return r==null||r.observe(o),s=requestAnimationFrame(n),()=>{cancelAnimationFrame(s),window.removeEventListener("pointermove",x),i==null||i.disconnect(),r==null||r.disconnect()}}function F(o,a){let t=document.createElement("div");return t.style.cssText=`position:absolute;inset:0;background:linear-gradient(135deg, ${a.join(", ")});opacity:.85;`,o.appendChild(t),()=>t.remove()}var C={colors:{type:"colors",default:["#e9e3ff","#c4b3fe","#9a78fb","#6726f5"],min:1,max:6},bg:{type:"colors",default:["#ffffff"],min:1,max:1},"bg-alpha":{type:"number",default:1,min:0,max:1},speed:{type:"number",default:.5,min:.05,max:2},"block-size":{type:"number",default:56,min:16,max:120},levels:{type:"number",default:7,min:3,max:14},scale:{type:"number",default:1,min:.3,max:3},"drift-angle":{type:"number",default:30,min:0,max:360},glint:{type:"number",default:.35,min:0,max:1},contrast:{type:"number",default:1.1,min:.4,max:2.5}},X=`
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
"use strict";(()=>{var L=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;function T(a){let o=a.replace("#","");(o.length===3||o.length===4)&&(o=o.split("").map(e=>e+e).join("")),o.length===8&&(o=o.slice(0,6));let t=parseInt(o,16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function A(a,o){let t={};for(let[e,s]of Object.entries(a)){let c=o[e];if(s.type==="number"){let f=c==null?NaN:parseFloat(c);t[e]=Number.isFinite(f)?Math.min(s.max,Math.max(s.min,f)):s.default}else if(s.type==="colors"){let f=(c!=null?c:"").split(",").map(u=>u.trim()).filter(u=>L.test(u));t[e]=f.length>=s.min?f.slice(0,s.max):s.default.slice()}else s.type==="enum"?t[e]=c!=null&&s.values.includes(c)?c:s.default:t[e]=c!=null&&/^https:\/\/[^\s"'<>]+$/i.test(c)?c:s.default}return t}var P="attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.,1.);}";function M(){let a=typeof window!="undefined"?window.__AIFX_MAX_DPR__:void 0;return typeof a=="number"&&a>0?a:1.5}function X(a){try{let o=new URL(a);return o.protocol!=="https:"||o.hostname!=="cdn.aidesigner.ai"?null:`https://api.aidesigner.ai/api/v1/effects/image-proxy?url=${encodeURIComponent(a)}`}catch{return null}}function U(a,o){var E;let t=document.createElement("canvas");t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;";let e=(E=t.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1}))!=null?E:t.getContext("experimental-webgl");if(!e)return null;function s(n,i){let r=e.createShader(n);return r?(e.shaderSource(r,i),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn("[aifx] shader compile failed:",e.getShaderInfoLog(r)),null)):null}let c=s(e.VERTEX_SHADER,P),f=s(e.FRAGMENT_SHADER,o),u=e.createProgram();if(!c||!f||!u)return null;if(e.attachShader(u,c),e.attachShader(u,f),e.linkProgram(u),!e.getProgramParameter(u,e.LINK_STATUS))return console.warn("[aifx] program link failed:",e.getProgramInfoLog(u)),null;e.useProgram(u),t.addEventListener("webglcontextlost",n=>{n.preventDefault(),a.dispatchEvent(new CustomEvent("aifx:contextlost"))});let h=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,h),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let v=e.getAttribLocation(u,"a_pos");e.enableVertexAttribArray(v),e.vertexAttribPointer(v,2,e.FLOAT,!1,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let _=new Map;function g(n){var i;return _.has(n)||_.set(n,e.getUniformLocation(u,n)),(i=_.get(n))!=null?i:null}a.appendChild(t);let b=null,x=0,y=null,p={gl:e,canvas:t,setUniform1f:(n,i)=>{let r=g(n);r&&e.uniform1f(r,i)},setUniform2f:(n,i,r)=>{let m=g(n);m&&e.uniform2f(m,i,r)},setUniform3f:(n,i,r,m)=>{let l=g(n);l&&e.uniform3f(l,i,r,m)},setColor:(n,i)=>{let[r,m,l]=T(i);p.setUniform3f(n,r,m,l)},setImage:n=>{if(n===y)return;y=n;let i=++x;if(!n){p.setUniform1f("u_hasImage",0);return}let r=(m,l)=>{let d=new Image;d.crossOrigin="anonymous";let R=()=>{if(i!==x)return;let w=l?null:X(n);if(w){r(w,!0);return}y=null,p.setUniform1f("u_hasImage",0)};d.onload=()=>{if(i!==x)return;b||(b=e.createTexture()),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,b),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,d)}catch{R();return}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let w=g("u_image");w&&e.uniform1i(w,0),p.setUniform2f("u_imageRes",d.naturalWidth,d.naturalHeight),p.setUniform1f("u_hasImage",1)},d.onerror=R,d.src=m};r(n,!1)},draw:n=>{p.setUniform1f("u_time",n),e.drawArrays(e.TRIANGLES,0,3)},resize:()=>{let n=Math.min(window.devicePixelRatio||1,M()),i=Math.max(1,Math.round(a.clientWidth*n)),r=Math.max(1,Math.round(a.clientHeight*n));(t.width!==i||t.height!==r)&&(t.width=i,t.height=r,e.viewport(0,0,i,r),p.setUniform2f("u_res",i,r))},destroy:()=>{t.remove();}};return p.resize(),p}function C(a,o,t){let e=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,s=0,c=!0,f=performance.now(),u=.5,h=.5,v=.5,_=.5,g=0,b=-1e9,x=m=>{let l=a.getBoundingClientRect();l.width<1||l.height<1||(u=(m.clientX-l.left)/l.width,h=(m.clientY-l.top)/l.height,b=performance.now())};window.addEventListener("pointermove",x,{passive:!0});let y=typeof window.__AIFX_FPS_CAP__=="number"&&window.__AIFX_FPS_CAP__>0?window.__AIFX_FPS_CAP__:0,p=y>0?1e3/y-1:0,E=-1e9,n=()=>{!e&&c&&(s=requestAnimationFrame(n));let m=performance.now();if(m-E<p)return;E=m;let l=(m-f)/1e3;v+=(u-v)*.07,_+=(h-_)*.07,g+=((m-b<2500?1:0)-g)*.045;let d=a.clientWidth/Math.max(a.clientHeight,1);o.setUniform2f("u_mouse",v*d,1-_),o.setUniform1f("u_mouseAct",g),t(l),o.draw(l)},i=typeof IntersectionObserver=="function"?new IntersectionObserver(m=>{let l=m.some(d=>d.isIntersecting);l&&!c?(c=!0,s=requestAnimationFrame(n)):!l&&c&&(c=!1,cancelAnimationFrame(s))}):null;i==null||i.observe(a);let r=typeof ResizeObserver=="function"?new ResizeObserver(()=>o.resize()):null;return r==null||r.observe(a),s=requestAnimationFrame(n),()=>{cancelAnimationFrame(s),window.removeEventListener("pointermove",x),i==null||i.disconnect(),r==null||r.disconnect()}}function S(a,o){let t=document.createElement("div");return t.style.cssText=`position:absolute;inset:0;background:linear-gradient(135deg, ${o.join(", ")});opacity:.85;`,a.appendChild(t),()=>t.remove()}var F={colors:{type:"colors",default:["#93c5fd","#c4b5fd","#f9a8d4"],min:1,max:3},bg:{type:"colors",default:["#0a0a0f"],min:1,max:1},"bg-alpha":{type:"number",default:1,min:0,max:1},scale:{type:"number",default:1,min:.3,max:3},shimmer:{type:"number",default:.6,min:0,max:1},intensity:{type:"number",default:.45,min:.05,max:1},contrast:{type:"number",default:1.1,min:.5,max:2.5},speed:{type:"number",default:.4,min:.05,max:2},image:{type:"url",default:""}},D=`
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time,u_scale,u_shimmer,u_intensity,u_contrast,u_speed,u_bgalpha,u_colorCount;
uniform vec3 u_bg,u_c0,u_c1,u_c2;
uniform sampler2D u_image;
uniform float u_hasImage;
uniform vec2 u_imageRes;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=0.55;for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.13+vec2(1.7,-2.1);a*=0.5;}return v;}
vec3 pick(float i){
  float k=mod(i,u_colorCount);
  if(k<0.5)return u_c0; if(k<1.5)return u_c1; return u_c2;
}
// gamma-aware palette ramp: blend in squared space so hues never mush to grey
vec3 palette(float t){
  float x=clamp(t,0.0,1.0)*(u_colorCount-1.0);
  float f=fract(x); f=f*f*(3.0-2.0*f);
  vec3 a=pick(floor(x)), b=pick(min(floor(x)+1.0,u_colorCount-1.0));
  return sqrt(mix(a*a,b*b,f));
}
void main(){
  float aspect=u_res.x/max(u_res.y,1.0);
  vec2 uv=vec2(v_uv.x*aspect,v_uv.y);
  float t=u_time*u_speed;

  // strongly anisotropic rotated coords: long diagonal ribbons
  float ca=cos(-0.5),sa=sin(-0.5);
  vec2 dp=mat2(ca,-sa,sa,ca)*uv;
  vec2 ap=vec2(dp.x*0.34,dp.y*1.25);

  // film-thickness field: broad fbm, lightly warped so ribbons stay coherent
  vec2 p1=ap*1.4*u_scale+vec2(t*0.04,-t*0.025);
  float w=fbm(p1*0.55+vec2(3.1,7.7)+t*0.018);
  float film=fbm(p1+0.6*vec2(w,-w));
  float film2=fbm(ap*3.2*u_scale+vec2(-t*0.03,t*0.02)+vec2(11.2,4.7));
  float d=film+0.26*(film2-0.48);

  // thin-film interference phase
  float cyc=1.6+u_shimmer*1.8;
  float ph=6.2831*d*cyc+t*0.3;
  // hue travels along the user palette with the fringes (never off-palette mud)
  float idx=smoothstep(0.26,0.74,d+0.06*sin(t*0.2))+0.35*u_shimmer*sin(ph+1.6);
  vec3 tint=palette(idx);
  // micro per-channel split: faint authentic soap-film edge colouring
  // (max() guards pow against tiny negative cos round-off -> NaN black pixels)
  vec3 fringe=pow(max(0.5+0.5*cos(ph+vec3(-1.0,0.0,1.0)*0.16),0.0),vec3(1.0+u_contrast));
  vec3 sheenCol=tint*fringe;
  float lum=dot(fringe,vec3(0.299,0.587,0.114));

  // soft ambient wash keeps valleys coloured instead of dead black
  vec3 amb=palette(smoothstep(0.2,0.8,film2))*(0.08+0.11*u_intensity);

  // fine animated film grain: two temporal taps cross-faded for softness
  // (coords wrapped so sin-hash stays precise on low-end GPUs)
  vec2 gp=mod(v_uv*u_res,512.0);
  float fr=mod(floor(u_time*16.0),64.0);
  float g=mix(hash(gp+fr*vec2(1.13,7.01)),hash(gp+(fr+1.0)*vec2(1.13,7.01)),fract(u_time*16.0))-0.5;

  // aspect-aware soft vignette
  vec2 vc=v_uv-0.5; vc.x*=aspect;
  float vig=1.0-0.26*smoothstep(0.3,1.05,length(vc));

  float amp=u_intensity*1.7*(0.92+0.08*sin(t*0.18+1.0)); // slow breathing
  // luminous filament: the bright meandering edge of the film
  float spec=exp(-24.0*abs(d-0.6))*amp*0.45;
  vec3 fx=(sheenCol*amp+amb+mix(tint,vec3(1.0),0.4)*spec)*vig;
  // photo-grade mode: the image sits under the treatment \u2014 grain, sheen and
  // vignette become a finishing grade over the artwork (subtler sheen so the
  // photo stays the subject)
  vec3 baseCol=u_bg;
  float fxScale=1.0;
  if(u_hasImage>0.5){
    float iaspect=u_imageRes.x/max(u_imageRes.y,1.0);
    vec2 sc=(iaspect>aspect)?vec2(aspect/iaspect,1.0):vec2(1.0,iaspect/aspect);
    vec3 art=texture2D(u_image,clamp((v_uv-0.5)*sc+0.5,0.001,0.999)).rgb;
    baseCol=art*(0.82+0.18*vig);
    fxScale=0.5;
  }
  vec3 col=baseCol+fx*fxScale*(1.0-baseCol*0.8); // screen-ish blend, avoids blowout
  col+=g*(0.035+0.10*lum*amp);                // grain rides the lit areas
  col+=(hash(gp+vec2(0.5,17.0))-0.5)*0.01;    // dither kills banding

  float effLum=dot(fx,vec3(0.333));
  float alpha=clamp(max(max(u_bgalpha,u_hasImage),effLum*1.6+abs(g)*0.08),0.0,1.0);
  gl_FragColor=vec4(col,alpha);
}`,I;(I=window.AIFX)==null||I.register("noise-shimmer",{mount(a,o){let t=A(F,o),e=U(a,D);if(!e){let f=S(a,t.colors);return{update(){},destroy:f}}let s=()=>{let f=t.colors;e.setUniform1f("u_colorCount",f.length),["u_c0","u_c1","u_c2"].forEach((u,h)=>e.setColor(u,f[Math.min(h,f.length-1)])),e.setColor("u_bg",t.bg[0]),e.setUniform1f("u_bgalpha",t["bg-alpha"]),e.setUniform1f("u_scale",t.scale),e.setUniform1f("u_shimmer",t.shimmer),e.setUniform1f("u_intensity",t.intensity),e.setUniform1f("u_contrast",t.contrast),e.setUniform1f("u_speed",t.speed),e.setImage(t.image)};s();let c=C(a,e,()=>{});return{update(f){t=A(F,f),s()},destroy(){c(),e.destroy()}}}});})();
