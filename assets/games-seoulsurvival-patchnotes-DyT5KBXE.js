import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as u,d as m,b as f}from"./shared-common-Bh-ahcVH.js";import{g as v}from"./patchnotes.registry-FKfJoHun.js";import"./seoulsurvival-i18n-z3sVIM_M.js";import"./shared-auth-BS6hMw4s.js";const y={feature:"category-feature",fix:"category-fix",balance:"category-balance",ui:"category-ui",content:"category-content",performance:"category-performance"},h={feature:{ko:"기능",en:"Feature"},fix:{ko:"수정",en:"Fix"},balance:{ko:"밸런스",en:"Balance"},ui:{ko:"UI",en:"UI"},content:{ko:"콘텐츠",en:"Content"},performance:{ko:"성능",en:"Performance"}};function c(){const a=document.getElementById("patchnotes-container");if(!a)return;const e=localStorage.getItem("clicksurvivor_lang")||"ko";let o=v("seoulsurvival");if(o=o.sort((t,r)=>new Date(r.date)-new Date(t.date)),o.length===0){a.innerHTML=`
      <div class="empty-state">
        <p>${e==="ko"?"패치노트가 없습니다.":"No patch notes available."}</p>
      </div>
    `;return}a.innerHTML=o.map(t=>{const r=t.title[e]||t.title.ko,l=t.items.map(n=>{var s;const d=n.text[e]||n.text.ko,g=y[n.category]||"category-feature",p=((s=h[n.category])==null?void 0:s[e])||n.category;return`
            <div class="patch-item">
              <span class="patch-category ${g}">${p}</span>
              ${d}
            </div>
          `}).join("");return`
        <div class="release-note">
          <div class="release-note-header">
            <span class="release-note-version">v${t.version}</span>
            <span class="release-note-title">${r}</span>
            <span class="release-note-date">${t.date}</span>
          </div>
          <div class="release-note-content">
            ${l}
          </div>
        </div>
      `}).join("")}function i(){const a=document.getElementById("header-mount"),e=document.getElementById("footer-mount");a&&u(a),e&&m(e),f(),c(),window.addEventListener("languagechange",()=>{c()})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",i):i();
