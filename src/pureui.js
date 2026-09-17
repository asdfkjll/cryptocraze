const html = String.raw
const css = String.raw

class Component extends HTMLElement {
  #shadow
  #controller = null
  #isInitialized = false

  constructor() {
    super()
    this.#shadow = this.attachShadow({ mode: 'open' })
    this.state = {}

    // Map initial attributes to state right away
    this.#attributesToState()
  }

  static observedAttributes = []

  connectedCallback() {
    this.#callCustomMethod('beforeMount')
    this.#setupStyles()
    this.render()
    this.#isInitialized = true
    this.#callCustomMethod('onMount')
  }

  disconnectedCallback() {
    this.#clearListeners()
    this.#callCustomMethod('onUnmount')
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const key = this.#kebabToCamel(name)
    if (newValue !== oldValue) {
      this.setState({ [key]: newValue })
    }
    if (this.#isInitialized) {
      this.#callCustomMethod('onChange', name, oldValue, newValue)
    }
  }

  /**
   * Compiles styles once using native adoptedStyleSheets for maximum performance
   */
  #setupStyles() {
    const cssText = this.styles()
    if (!cssText) return

    if ('adoptedStyleSheets' in Document.prototype && this.#shadow.adoptedStyleSheets) {
      const sheet = new CSSStyleSheet()
      sheet.replaceSync(cssText)
      this.#shadow.adoptedStyleSheets = [sheet]
    } else {
      // Fallback for older engines
      const styleEl = document.createElement('style')
      styleEl.textContent = cssText
      this.#shadow.appendChild(styleEl)
    }
  }

  styles() {
    return css``
  }

  template() {
    return html``
  }

  render() {
    // Keep a container wrapper so stylesheets and root structure stay intact
    let container = this.$('#__pure_root')
    if (!container) {
      container = document.createElement('div')
      container.id = '__pure_root'
      this.#shadow.appendChild(container)
    }

    container.innerHTML = this.template()
    this.#callCustomMethod('onRender')
  }

  setState(newState) {
    this.state = { ...this.state, ...newState }
    if (this.#isInitialized) {
      this.render()
    }
  }

  $(selector) {
    return this.#shadow.querySelector(selector)
  }

  $$(selector) {
    return this.#shadow.querySelectorAll(selector)
  }

  /**
   * Automatically tracked event listener cleaned up on unmount via AbortController
   * @param {string|Element} target - Selector string or element reference
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @param {AddEventListenerOptions} [options] - Optional addEventListener options
   */
  $listen(target, event, callback, options = {}) {
    if (!this.#controller) this.#controller = new AbortController()

    const element = typeof target === 'string' ? this.$(target) : target
    if (element) {
      element.addEventListener(event, callback, {
        signal: this.#controller.signal,
        ...options,
      })
    }
  }

  #clearListeners() {
    if (this.#controller) {
      this.#controller.abort()
      this.#controller = null
    }
  }

  $emit(type, detail = null) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail,
    }))
  }

  #attributesToState(defaultValues = {}) {
    this.constructor.observedAttributes.forEach(attr => {
      const keyCamel = this.#kebabToCamel(attr)
      const value = this.getAttribute(attr)
      this.state[keyCamel] = value !== null ? value : (defaultValues[attr] ?? null)
    })
  }

  #callCustomMethod(methodName, ...args) {
    if (typeof this[methodName] === 'function') {
      this[methodName](...args)
    }
  }

  #kebabToCamel(str) {
    return str.replace(/-./g, match => match.toUpperCase()[1])
  }
}

export {
  html, css,
  Component
}
