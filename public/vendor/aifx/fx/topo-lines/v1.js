"use strict";(()=>{var P=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;function w(a){let o=a.replace("#","");(o.length===3||o.length===4)&&(o=o.split("").map(e=>e+e).join("")),o.length===8&&(o=o.slice(0,6));let t=parseInt(o,16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function R(a,o){let t={};for(let[e,s]of Object.entries(a)){let l=o[e];if(s.type==="number"){let m=l==null?NaN:parseFloat(l);t[e]=Number.isFinite(m)?Math.min(s.max,Math.max(s.min,m)):s.default}else if(s.type==="colors"){let m=(l!=null?l:"").split(",").map(f=>f.trim()).filter(f=>P.test(f));t[e]=m.length>=s.min?m.slice(0,s.max):s.default.slice()}else s.type==="enum"?t[e]=l!=null&&s.values.includes(l)?l:s.default:t[e]=l!=null&&/^https:\/\/[^\s"'<>]+$/i.test(l)?l:s.default}return t}var k="attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.,1.);}";function L(){let a=typeof window!="undefined"?window.__AIFX_MAX_DPR__:void 0;return typeof a=="number"&&a>0?a:1.5}function M(a){try{let o=new URL(a);return o.protocol!=="https:"||o.hostname!=="cdn.aidesigner.ai"?null:`https://api.aidesigner.ai/api/v1/effects/image-proxy?url=${encodeURIComponent(a)}`}catch{return null}}function T(a,o){var A;let t=document.createElement("canvas");t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;";let e=(A=t.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1}))!=null?A:t.getContext("experimental-webgl");if(!e)return null;function s(n,i){let r=e.createShader(n);return r?(e.shaderSource(r,i),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn("[aifx] shader compile failed:",e.getShaderInfoLog(r)),null)):null}let l=s(e.VERTEX_SHADER,k),m=s(e.FRAGMENT_SHADER,o),f=e.createProgram();if(!l||!m||!f)return null;if(e.attachShader(f,l),e.attachShader(f,m),e.linkProgram(f),!e.getProgramParameter(f,e.LINK_STATUS))return console.warn("[aifx] program link failed:",e.getProgramInfoLog(f)),null;e.useProgram(f),t.addEventListener("webglcontextlost",n=>{n.preventDefault(),a.dispatchEvent(new CustomEvent("aifx:contextlost"))});let v=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,v),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let h=e.getAttribLocation(f,"a_pos");e.enableVertexAttribArray(h),e.vertexAttribPointer(h,2,e.FLOAT,!1,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let d=new Map;function g(n){var i;return d.has(n)||d.set(n,e.getUniformLocation(f,n)),(i=d.get(n))!=null?i:null}a.appendChild(t);let x=null,b=0,y=null,p={gl:e,canvas:t,setUniform1f:(n,i)=>{let r=g(n);r&&e.uniform1f(r,i)},setUniform2f:(n,i,r)=>{let c=g(n);c&&e.uniform2f(c,i,r)},setUniform3f:(n,i,r,c)=>{let u=g(n);u&&e.uniform3f(u,i,r,c)},setColor:(n,i)=>{let[r,c,u]=w(i);p.setUniform3f(n,r,c,u)},setImage:n=>{if(n===y)return;y=n;let i=++b;if(!n){p.setUniform1f("u_hasImage",0);return}let r=(c,u)=>{let _=new Image;_.crossOrigin="anonymous";let U=()=>{if(i!==b)return;let E=u?null:M(n);if(E){r(E,!0);return}y=null,p.setUniform1f("u_hasImage",0)};_.onload=()=>{if(i!==b)return;x||(x=e.createTexture()),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,x),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,_)}catch{U();return}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let E=g("u_image");E&&e.uniform1i(E,0),p.setUniform2f("u_imageRes",_.naturalWidth,_.naturalHeight),p.setUniform1f("u_hasImage",1)},_.onerror=U,_.src=c};r(n,!1)},draw:n=>{p.setUniform1f("u_time",n),e.drawArrays(e.TRIANGLES,0,3)},resize:()=>{let n=Math.min(window.devicePixelRatio||1,L()),i=Math.max(1,Math.round(a.clientWidth*n)),r=Math.max(1,Math.round(a.clientHeight*n));(t.width!==i||t.height!==r)&&(t.width=i,t.height=r,e.viewport(0,0,i,r),p.setUniform2f("u_res",i,r))},destroy:()=>{var n;t.remove();try{(n=e.getExtension("WEBGL_lose_context"))==null||n.loseContext()}catch{}}};return p.resize(),p}function C(a,o,t){let e=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,s=0,l=!0,m=performance.now(),f=.5,v=.5,h=.5,d=.5,g=0,x=-1e9,b=c=>{let u=a.getBoundingClientRect();u.width<1||u.height<1||(f=(c.clientX-u.left)/u.width,v=(c.clientY-u.top)/u.height,x=performance.now())};window.addEventListener("pointermove",b,{passive:!0});let y=typeof window.__AIFX_FPS_CAP__=="number"&&window.__AIFX_FPS_CAP__>0?window.__AIFX_FPS_CAP__:0,p=y>0?1e3/y-1:0,A=-1e9,n=()=>{!e&&l&&(s=requestAnimationFrame(n));let c=performance.now();if(c-A<p)return;A=c;let u=(c-m)/1e3;h+=(f-h)*.07,d+=(v-d)*.07,g+=((c-x<2500?1:0)-g)*.045;let _=a.clientWidth/Math.max(a.clientHeight,1);o.setUniform2f("u_mouse",h*_,1-d),o.setUniform1f("u_mouseAct",g),t(u),o.draw(u)},i=typeof IntersectionObserver=="function"?new IntersectionObserver(c=>{let u=c.some(_=>_.isIntersecting);u&&!l?(l=!0,s=requestAnimationFrame(n)):!u&&l&&(l=!1,cancelAnimationFrame(s))}):null;i==null||i.observe(a);let r=typeof ResizeObserver=="function"?new ResizeObserver(()=>o.resize()):null;return r==null||r.observe(a),s=requestAnimationFrame(n),()=>{cancelAnimationFrame(s),window.removeEventListener("pointermove",b),i==null||i.disconnect(),r==null||r.disconnect()}}function S(a,o){let t=document.createElement("div");return t.style.cssText=`position:absolute;inset:0;background:linear-gradient(135deg, ${o.join(", ")});opacity:.85;`,a.appendChild(t),()=>t.remove()}var F={colors:{type:"colors",default:["#f1e7cf","#e6d2a8","#d4b384","#b98a5e"],min:2,max:5},ink:{type:"colors",default:["#6a543b","#3e3226"],min:1,max:2},bg:{type:"colors",default:["#f5efe3"],min:1,max:1},"bg-alpha":{type:"number",default:1,min:0,max:1},speed:{type:"number",default:.3,min:.02,max:2},density:{type:"number",default:24,min:6,max:60},"index-every":{type:"number",default:5,min:0,max:10},"index-weight":{type:"number",default:1,min:0,max:2},"line-weight":{type:"number",default:1,min:.4,max:2.5},tint:{type:"number",default:.55,min:0,max:1},relief:{type:"number",default:.45,min:0,max:1},scale:{type:"number",default:1.4,min:.4,max:4},warp:{type:"number",default:.55,min:0,max:1.5},paper:{type:"number",default:.5,min:0,max:1},mouse:{type:"number",default:.7,min:0,max:1}},N=`
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
