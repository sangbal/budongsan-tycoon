import"./modulepreload-polyfill-B5Qt9EMX.js";import{c,d as l,b as d}from"./shared-common-Bh-ahcVH.js";import{g as u}from"./patchnotes.registry-FKfJoHun.js";import"./seoulsurvival-i18n-z3sVIM_M.js";import"./shared-auth-BS6hMw4s.js";const m=[{id:"seoulsurvival",slug:"seoulsurvival",featured:!0,title:{ko:"서울 생존기",en:"Seoul Survival"},subtitle:{ko:"흙수저 탈출",en:"Rags to Riches"},description:{ko:`노동으로 시드를 만들고, 투자로 가속하세요.
승진과 이벤트로 다음 목표가 열립니다.`,en:`Build seed through labor, accelerate with investments.
Promotions and events unlock your next goals.`},href:"./seoulsurvival/",status:"live",badge:"Featured"},{id:"mma-manager",slug:"mma-manager",featured:!1,title:{ko:"MMA Promotion Manager",en:"MMA Promotion Manager"},description:{ko:`선수 발굴, 매치메이킹, 흥행 관리.
동네 단체에서 글로벌 1위까지 성장시키세요.`,en:`Scout fighters, make matches, manage promotions.
Grow from local to global #1.`},href:"./mma-manager/",status:"live"},{id:"kimchi-invasion",slug:"kimchi-invasion",featured:!1,title:{ko:"Kimchi Invasion",en:"Kimchi Invasion"},description:{ko:"김치로 우주를 정복하세요.",en:"Conquer the universe with kimchi."},href:"./kimchi-invasion/",status:"prototype",badge:"Prototype"}];function p(e){return m.find(t=>t.id===e)}const r="seoulsurvival";function f(){const e=p(r);if(!e){console.error(`Game not found: ${r}`);return}const t=localStorage.getItem("clicksurvivor_lang")||"ko";h(e,t),g(e,t),k(e,t),I(e,t),x(t)}function h(e,t){var o;const n=document.getElementById("hero-capsule");(o=e.media)!=null&&o.capsuleImage?(n.src=e.media.capsuleImage,n.alt=e.title[t]):(n.src='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23222" width="800" height="450"/%3E%3Ctext x="50%25" y="50%25" fill="%23999" font-size="24" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E',n.alt="Placeholder")}function g(e,t){document.getElementById("game-title").textContent=e.title[t],e.subtitle&&(document.getElementById("game-subtitle").textContent=e.subtitle[t]);const n=document.getElementById("game-short-description");e.shortDescription&&(n.textContent=e.shortDescription[t]),v(e.tags),y(e.features,t),e.releaseDate&&(document.getElementById("release-date").textContent=e.releaseDate),e.developer&&(document.getElementById("developer").textContent=e.developer),document.getElementById("status").textContent=e.status,E(e.browserCompat)}function v(e){const t=document.getElementById("game-tags");!e||e.length===0||(t.innerHTML=e.map(n=>`<span class="tag">${n}</span>`).join(""))}function y(e,t){const n=document.getElementById("game-features");!e||e.length===0||(n.innerHTML=e.map(o=>`
    <div class="feature-item">
      <span class="feature-icon">${o.icon}</span>
      <span class="feature-text">${o.text[t]}</span>
    </div>
  `).join(""))}function E(e){const t=document.getElementById("browser-compat-list");if(!e)return;const n=[{name:"Chrome",key:"chrome"},{name:"Firefox",key:"firefox"},{name:"Safari",key:"safari"},{name:"Edge",key:"edge"}];t.innerHTML=n.filter(o=>e[o.key]).map(o=>`<span class="browser-item">${o.name} ${e[o.key]}</span>`).join("")}function k(e,t){var o;const n=document.getElementById("media-gallery");if(!((o=e.media)!=null&&o.screenshots)||e.media.screenshots.length===0){n.innerHTML='<p style="color: #999; text-align: center;">스크린샷 준비 중</p>';return}n.innerHTML=e.media.screenshots.map((a,s)=>`
    <div class="screenshot-item">
      <img src="${a}" alt="${e.title[t]} Screenshot ${s+1}" loading="lazy" />
    </div>
  `).join("")}function I(e,t){const n=document.getElementById("about-content");e.aboutContent&&(n.innerHTML=e.aboutContent[t])}function x(e){const t=document.getElementById("patchnotes-list");if(!t)return;const n=u(r,2);if(!n||n.length===0){t.innerHTML='<p style="color: #999; text-align: center;">패치노트가 없습니다.</p>';return}t.innerHTML=n.map(o=>`
    <div class="patchnote-card">
      <div class="patchnote-header">
        <div class="patchnote-title-wrapper">
          <div class="patchnote-version">v${o.version}</div>
          <h3 class="patchnote-title">${o.title[e]}</h3>
        </div>
        <div class="patchnote-date">${b(o.date,e)}</div>
      </div>
      <div class="patchnote-items">
        ${o.items.map(a=>`
          <div class="patchnote-item">
            <span class="category-badge category-badge--${a.category}">${C(a.category,e)}</span>
            <span class="patchnote-text">${a.text[e]}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("")}function C(e,t){var o;return((o={feature:{ko:"기능",en:"Feature"},fix:{ko:"수정",en:"Fix"},balance:{ko:"밸런스",en:"Balance"},ui:{ko:"UI",en:"UI"},content:{ko:"콘텐츠",en:"Content"},performance:{ko:"성능",en:"Performance"}}[e])==null?void 0:o[t])||e}function b(e,t){const n=new Date(e);return t==="ko"?`${n.getFullYear()}년 ${n.getMonth()+1}월 ${n.getDate()}일`:n.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}function i(){const e=document.getElementById("header-mount"),t=document.getElementById("footer-mount");e&&c(e),t&&l(t),f(),d()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",i):i();
