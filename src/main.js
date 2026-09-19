import './style.css'
import dashboardStyles from './dashboard.css?inline'
import { html, css, Component } from './pureui'

async function getCoinInfo(coin) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`)
    const json = await response.json()
    return json[0]
  } catch (err) {
    console.log(err)
  }
}

class Dashboard extends Component {
  static observedAttributes = ['coin']

  loaded = false

  styles() {
    return css`${dashboardStyles}`
  }

  loadingTemplate() {
    return html`
      <div class="loading-screen">
        <div class="spinner"></div>
        <span class="text">loading<span>
      </div>
    `
  }

  dashboardTemplate() {
    return html`
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
              <div class="price-change ${this.state.price_change_24h > 0 ? 'positive' : 'negative'}">
                <span>
                  ${this.state.price_change_24h > 0 ? '+' : ''}
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
                    ${this.state.market_cap_change_24h > 0 ? '+' : ''}
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
                    ${this.state.max_supply ? `(max supply: ${this.state.max_supply} <span class="coin__symbol">${this.state.symbol}</span>)` : ''}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    `
  }

  template() {
    return html`
      ${!this.loaded ? `${this.loadingTemplate()}` : `${this.dashboardTemplate()}`}
    `
  }

  loadCoinState() {
    this.loaded = false
    this.setState({})

    const keyName = `${this.state.coin}-data`
    const storage = localStorage.getItem(keyName)

    if (storage) {
      try {
        console.log('loading from local')
        const data = JSON.parse(storage)
        this.loaded = true
        this.setState(data)
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log('loading from API')
      getCoinInfo(this.state.coin).then(response => {
        if (response) {
          this.loaded = true
          this.setState(response)
          localStorage.setItem(keyName, JSON.stringify(response))
        }
      })
    }
  }

  beforeMount() {
    this.loadCoinState()
  }

  onChange() {
    this.loadCoinState()
  }

  onRender() {
    console.log('onrender', this.loaded)
    this.$listen('#search', 'submit', e => {
      e.preventDefault()
      this.setAttribute('coin', this.$('#coinId').value)
    })
  }
}

customElements.define('my-dashboard', Dashboard)
