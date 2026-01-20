const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./shared-auth-CIbY9wxM.js","./seoulsurvival-i18n-CiaOUQQV.js","./shared-common-RsDvjRb4.js","./shared-common-CT4ArvmX.css"])))=>i.map(i=>d[i]);
import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as C,i as b,d as v}from"./shared-common-RsDvjRb4.js";import{_}from"./seoulsurvival-i18n-CiaOUQQV.js";import"./shared-auth-CIbY9wxM.js";function f(c,u="info"){const o=document.createElement("div");o.textContent=c,o.style.cssText=`
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-panel);
    color: var(--text);
    padding: 12px 24px;
    border-radius: 8px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-size: 14px;
  `,document.body.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transition="opacity 0.3s",setTimeout(()=>o.remove(),300)},2e3)}document.addEventListener("DOMContentLoaded",async()=>{const c=document.getElementById("header-mount"),u=document.getElementById("footer-mount");c&&(C(c),await b({scope:"account-security"})),u&&v(u);const{getUser:o,signOut:g}=await _(async()=>{const{getUser:n,signOut:i}=await import("./shared-auth-CIbY9wxM.js").then(e=>e.c);return{getUser:n,signOut:i}},__vite__mapDeps([0,1,2,3]),import.meta.url),a=await o(),m=!!a;function p(){const n=document.getElementById("current-device"),i=document.getElementById("current-location"),e=document.getElementById("current-last-activity");if(!m){n&&(n.textContent="-"),i&&(i.textContent="-"),e&&(e.textContent="-");return}const l=navigator.userAgent;let r="알 수 없음";if(/Mobile|Android|iPhone|iPad/.test(l)?/iPhone/.test(l)?r="iPhone":/iPad/.test(l)?r="iPad":/Android/.test(l)?r="Android 기기":r="모바일 기기":r="데스크톱",n&&(n.textContent=r),i&&(i.textContent="현재 위치"),a!=null&&a.last_sign_in_at)try{const x=new Date(a.last_sign_in_at),y=new Date-x,s=Math.floor(y/6e4);let d="방금 전";s<1?d="방금 전":s<60?d=`${s}분 전`:s<1440?d=`${Math.floor(s/60)}시간 전`:d=`${Math.floor(s/1440)}일 전`,e&&(e.textContent=d)}catch{e&&(e.textContent="알 수 없음")}else e&&(e.textContent="방금 전")}p();const t=document.getElementById("logout-btn");t&&(m?(t.disabled=!1,t.textContent="모든 기기에서 로그아웃",t.addEventListener("click",async()=>{if(confirm("로그아웃하시겠습니까?")){t.disabled=!0,t.textContent="로그아웃 중...";try{(await g()).ok?(f("로그아웃되었습니다","success"),setTimeout(()=>{window.location.href="../../"},500)):(f("로그아웃에 실패했습니다","error"),t.disabled=!1,t.textContent="모든 기기에서 로그아웃")}catch(n){console.error("Logout error:",n),f("로그아웃 중 오류가 발생했습니다","error"),t.disabled=!1,t.textContent="모든 기기에서 로그아웃"}}})):(t.disabled=!0,t.textContent="로그인 필요"))});
