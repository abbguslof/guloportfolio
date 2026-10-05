"use strict";(()=>{var L=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;function T(a){let o=a.replace("#","");(o.length===3||o.length===4)&&(o=o.split("").map(e=>e+e).join("")),o.length===8&&(o=o.slice(0,6));let t=parseInt(o,16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function A(a,o){let t={};for(let[e,s]of Object.entries(a)){let c=o[e];if(s.type==="number"){let f=c==null?NaN:parseFloat(c);t[e]=Number.isFinite(f)?Math.min(s.max,Math.max(s.min,f)):s.default}else if(s.type==="colors"){let f=(c!=null?c:"").split(",").map(u=>u.trim()).filter(u=>L.test(u));t[e]=f.length>=s.min?f.slice(0,s.max):s.default.slice()}else s.type==="enum"?t[e]=c!=null&&s.values.includes(c)?c:s.default:t[e]=c!=null&&/^https:\/\/[^\s"'<>]+$/i.test(c)?c:s.default}return t}var P="attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.,1.);}";function M(){let a=typeof window!="undefined"?window.__AIFX_MAX_DPR__:void 0;return typeof a=="number"&&a>0?a:1.5}function X(a){try{let o=new URL(a);return o.protocol!=="https:"||o.hostname!=="cdn.aidesigner.ai"?null:`https://api.aidesigner.ai/api/v1/effects/image-proxy?url=${encodeURIComponent(a)}`}catch{return null}}function U(a,o){var E;let t=document.createElement("canvas");t.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;";let e=(E=t.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1}))!=null?E:t.getContext("experimental-webgl");if(!e)return null;function s(n,i){let r=e.createShader(n);return r?(e.shaderSource(r,i),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn("[aifx] shader compile failed:",e.getShaderInfoLog(r)),null)):null}let c=s(e.VERTEX_SHADER,P),f=s(e.FRAGMENT_SHADER,o),u=e.createProgram();if(!c||!f||!u)return null;if(e.attachShader(u,c),e.attachShader(u,f),e.linkProgram(u),!e.getProgramParameter(u,e.LINK_STATUS))return console.warn("[aifx] program link failed:",e.getProgramInfoLog(u)),null;e.useProgram(u),t.addEventListener("webglcontextlost",n=>{n.preventDefault(),a.dispatchEvent(new CustomEvent("aifx:contextlost"))});let h=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,h),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let v=e.getAttribLocation(u,"a_pos");e.enableVertexAttribArray(v),e.vertexAttribPointer(v,2,e.FLOAT,!1,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let _=new Map;function g(n){var i;return _.has(n)||_.set(n,e.getUniformLocation(u,n)),(i=_.get(n))!=null?i:null}a.appendChild(t);let b=null,x=0,y=null,p={gl:e,canvas:t,setUniform1f:(n,i)=>{let r=g(n);r&&e.uniform1f(r,i)},setUniform2f:(n,i,r)=>{let m=g(n);m&&e.uniform2f(m,i,r)},setUniform3f:(n,i,r,m)=>{let l=g(n);l&&e.uniform3f(l,i,r,m)},setColor:(n,i)=>{let[r,m,l]=T(i);p.setUniform3f(n,r,m,l)},setImage:n=>{if(n===y)return;y=n;let i=++x;if(!n){p.setUniform1f("u_hasImage",0);return}let r=(m,l)=>{let d=new Image;d.crossOrigin="anonymous";let R=()=>{if(i!==x)return;let w=l?null:X(n);if(w){r(w,!0);return}y=null,p.setUniform1f("u_hasImage",0)};d.onload=()=>{if(i!==x)return;b||(b=e.createTexture()),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,b),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,d)}catch{R();return}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);let w=g("u_image");w&&e.uniform1i(w,0),p.setUniform2f("u_imageRes",d.naturalWidth,d.naturalHeight),p.setUniform1f("u_hasImage",1)},d.onerror=R,d.src=m};r(n,!1)},draw:n=>{p.setUniform1f("u_time",n),e.drawArrays(e.TRIANGLES,0,3)},resize:()=>{let n=Math.min(window.devicePixelRatio||1,M()),i=Math.max(1,Math.round(a.clientWidth*n)),r=Math.max(1,Math.round(a.clientHeight*n));(t.width!==i||t.height!==r)&&(t.width=i,t.height=r,e.viewport(0,0,i,r),p.setUniform2f("u_res",i,r))},destroy:()=>{var n;t.remove();try{(n=e.getExtension("WEBGL_lose_context"))==null||n.loseContext()}catch{}}};return p.resize(),p}function C(a,o,t){let e=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,s=0,c=!0,f=performance.now(),u=.5,h=.5,v=.5,_=.5,g=0,b=-1e9,x=m=>{let l=a.getBoundingClientRect();l.width<1||l.height<1||(u=(m.clientX-l.left)/l.width,h=(m.clientY-l.top)/l.height,b=performance.now())};window.addEventListener("pointermove",x,{passive:!0});let y=typeof window.__AIFX_FPS_CAP__=="number"&&window.__AIFX_FPS_CAP__>0?window.__AIFX_FPS_CAP__:0,p=y>0?1e3/y-1:0,E=-1e9,n=()=>{!e&&c&&(s=requestAnimationFrame(n));let m=performance.now();if(m-E<p)return;E=m;let l=(m-f)/1e3;v+=(u-v)*.07,_+=(h-_)*.07,g+=((m-b<2500?1:0)-g)*.045;let d=a.clientWidth/Math.max(a.clientHeight,1);o.setUniform2f("u_mouse",v*d,1-_),o.setUniform1f("u_mouseAct",g),t(l),o.draw(l)},i=typeof IntersectionObserver=="function"?new IntersectionObserver(m=>{let l=m.some(d=>d.isIntersecting);l&&!c?(c=!0,s=requestAnimationFrame(n)):!l&&c&&(c=!1,cancelAnimationFrame(s))}):null;i==null||i.observe(a);let r=typeof ResizeObserver=="function"?new ResizeObserver(()=>o.resize()):null;return r==null||r.observe(a),s=requestAnimationFrame(n),()=>{cancelAnimationFrame(s),window.removeEventListener("pointermove",x),i==null||i.disconnect(),r==null||r.disconnect()}}function S(a,o){let t=document.createElement("div");return t.style.cssText=`position:absolute;inset:0;background:linear-gradient(135deg, ${o.join(", ")});opacity:.85;`,a.appendChild(t),()=>t.remove()}var F={colors:{type:"colors",default:["#93c5fd","#c4b5fd","#f9a8d4"],min:1,max:3},bg:{type:"colors",default:["#0a0a0f"],min:1,max:1},"bg-alpha":{type:"number",default:1,min:0,max:1},scale:{type:"number",default:1,min:.3,max:3},shimmer:{type:"number",default:.6,min:0,max:1},intensity:{type:"number",default:.45,min:.05,max:1},contrast:{type:"number",default:1.1,min:.5,max:2.5},speed:{type:"number",default:.4,min:.05,max:2},image:{type:"url",default:""}},D=`
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
