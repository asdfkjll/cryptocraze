(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`*{box-sizing:border-box;color:#333;margin:0;padding:0;font-family:Fira Code,Consolas,Monaco,monospace}.container{max-width:1080px;margin:auto}.positive{color:green}.negative{color:red}.coin-symbol,.coin__symbol{text-transform:uppercase}span{color:inherit}header{justify-content:center;padding:15px 0;display:flex}header input,header button{all:unset;border:1px solid #d3d3d3;border-radius:25px;padding:13px 25px}header #coinId{width:500px}header #coinId:focus{border-color:#000}header button:hover{cursor:pointer;border-color:#000;font-weight:700}.coin-card{border:1px solid #d3d3d3;border-radius:15px;flex-direction:column;padding:25px;display:flex}.coin__summary{justify-content:space-between;align-items:center;padding:50px 25px;display:flex}.coin__summary .coin__title-wrapper{align-items:center;gap:15px;display:flex}.coin__summary .coin__img{width:50px}.coin__summary .current-price{font-size:1.75rem;font-weight:700}.coin__summary .last-updated{color:#999}.coin__market-data{gap:25px;padding:25px 0;font-size:.8rem;display:flex}.coin__market-data .data-group{border:1px solid #d3d3d3;border-radius:15px;flex:1;padding:25px}.coin__market-data .data-group li{color:#555;list-style:none}.coin__market-data .data-group h3{border-bottom:1px solid #d3d3d3;margin-bottom:10px;padding-bottom:5px}.coin__market-data .data-group .label{text-transform:capitalize}.coin__market-data .data-group .label:after{content:":"}.coin__market-data .data-group .value{font-weight:700}.loading-screen{color:#333;background-color:#fff;flex-direction:column;justify-content:center;align-items:center;gap:15px;width:100vw;height:100vh;margin:0;padding:0;display:flex;position:fixed;top:0;left:0}.loading-screen .spinner{border:5px solid #0000001a;border-top-color:#000;border-radius:50%;width:50px;height:50px;animation:1s linear infinite spin}.loading-screen .text{font-size:1.8rem}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}`,t=String.raw,n=String.raw,r=class extends HTMLElement{#e;#t=null;#n=!1;constructor(){super(),this.#e=this.attachShadow({mode:`open`}),this.state={},this.#a()}static observedAttributes=[];connectedCallback(){this.#o(`beforeMount`),this.#r(),this.render(),this.#n=!0,this.#o(`onMount`)}disconnectedCallback(){this.#i(),this.#o(`onUnmount`)}attributeChangedCallback(e,t,n){let r=this.#s(e);n!==t&&this.setState({[r]:n}),this.#n&&this.#o(`onChange`,e,t,n)}#r(){let e=this.styles();if(e){if(`adoptedStyleSheets`in Document.prototype&&this.#e.adoptedStyleSheets){let t=new CSSStyleSheet;t.replaceSync(e),this.#e.adoptedStyleSheets=[t]}else{let t=document.createElement(`style`);t.textContent=e,this.#e.appendChild(t)}}}styles(){return n``}template(){return t``}render(){let e=this.$(`#__pure_root`);e||(e=document.createElement(`div`),e.id=`__pure_root`,this.#e.appendChild(e)),e.innerHTML=this.template(),this.#o(`onRender`)}setState(e){this.state={...this.state,...e},this.#n&&this.render()}$(e){return this.#e.querySelector(e)}$$(e){return this.#e.querySelectorAll(e)}$listen(e,t,n,r={}){this.#t||=new AbortController;let i=typeof e==`string`?this.$(e):e;i&&i.addEventListener(t,n,{signal:this.#t.signal,...r})}#i(){this.#t&&=(this.#t.abort(),null)}$emit(e,t=null){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:t}))}#a(e={}){this.constructor.observedAttributes.forEach(t=>{let n=this.#s(t),r=this.getAttribute(t);this.state[n]=r===null?e[t]??null:r})}#o(e,...t){typeof this[e]==`function`&&this[e](...t)}#s(e){return e.replace(/-./g,e=>e.toUpperCase()[1])}};async function i(e){try{return(await(await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${e}`)).json())[0]}catch(e){console.log(e)}}var a=class extends r{static observedAttributes=[`coin`];loaded=!1;styles(){return n`${e}`}loadingTemplate(){return t`
      <div class="loading-screen">
        <div class="spinner"></div>
        <span class="text">loading<span>
      </div>
    `}dashboardTemplate(){return t`
      <header class="dashboard-header">
        <form id="search" class="search-from">
          <input id="coinId" type="text" placeholder="Search coin (e.g., bitcoin)..." autocomplete="off">
          <button type="submit">Search</button>
        </form>
      </header>

      <main class="container">
        <div class="coin-card">
          <div class="coin__summary">
            <div class="coin__title-wrapper">
              <img class="coin__img" src="${this.state.image}" alt="${this.state.name} logo">
              <h2 class="coin__name">
                ${this.state.name}
                <span class="coin__symbol">(${this.state.symbol})</span>
              </h2>
            </div>

            <div class="coin__price-wrapper">
              <div class="current-price">
                <span>$${this.state.current_price}</span>
              </div>
              <div class="price-change ${this.state.price_change_24h>0?`positive`:`negative`}">
                <span>
                  ${this.state.price_change_24h>0?`+`:``}
                  ${this.state.price_change_24h} (${this.state.price_change_percentage_24h}%) 
                </span>
              </div>
              <div class="last-updated">
                <span>last updated</span>
                <span>${new Date(this.state.last_updated).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div class="coin__market-data">
            <div class="data-group">
              <h3>Market Statistics</h3>

              <ul>
                <li>
                  <span class="label">market cap</span>
                  <span class="value">$${this.state.market_cap} (rank: #${this.state.market_cap_rank})</span>
                </li>
                <li>
                  <span class="label">fully diluted valuation (FDV)</span>
                  <span class="value">$${this.state.fully_diluted_valuation}</span>
                </li>
                <li>
                  <span class="label">24H trading valume</span>
                  <span class="value">$${this.state.total_volume}</span>
                </li>
                <li>
                  <span class="label">24H high / low</span>
                  <span class="value">$${this.state.high_24h} / $${this.state.low_24h}</span>
                </li>
                <li>
                  <span class="label">market cap change 24H</span>
                  <span class="value">
                    ${this.state.market_cap_change_24h>0?`+`:``}
                    $${this.state.market_cap_change_24h} (${this.state.market_cap_change_percentage_24h}%)
                  </span>
                </li>
              </ul>
            </div>

            <div class="data-group">
              <h3>Historical Extremes & Supply</h3>

              <ul id="historical-extremes">
                <li>
                  <span class="label">all-time high (ATH)</span>
                  <span class="value">$${this.state.ath} (${this.state.ath_change_percentage}%)</span>
                </li>
                <li>
                  <span class="label">all-time low (ATL)</span>
                  <span class="value">$${this.state.atl} (${this.state.atl_change_percentage}%)</span>
                </li>
                <li>
                  <span class="label">circulating supply</span>
                  <span class="value">
                    ${this.state.circulating_supply} 
                    ${this.state.max_supply?`(max supply: ${this.state.max_supply} <span class="coin__symbol">${this.state.symbol}</span>)`:``}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    `}template(){return t`
      ${this.loaded?`${this.dashboardTemplate()}`:`${this.loadingTemplate()}`}
    `}loadCoinState(){this.loaded=!1,this.setState({}),i(this.state.coin).then(e=>{e&&(this.loaded=!0,this.setState(e))})}beforeMount(){this.loadCoinState()}onChange(){this.loadCoinState()}onRender(){this.$listen(`#search`,`submit`,e=>{e.preventDefault(),this.setAttribute(`coin`,this.$(`#coinId`).value)})}};customElements.define(`my-dashboard`,a);