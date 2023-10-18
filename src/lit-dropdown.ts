import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

type ListElement = {
  value: string;
  active: boolean;
};

@customElement("lit-dropdown")
export class LitDropdown extends LitElement {
  @property()
  elements: ListElement[] = [];

  @state()
  isOpen: boolean = true;

  constructor() {
    super();
    document.addEventListener("click", () => {
      console.log("clicked");
    });
  }

  render() {
    return html`
      <link
        href="https://unpkg.com/css.gg@2.0.0/icons/css/arrow-down-r.css"
        rel="stylesheet"
      />
      <button class="dropdown" @click="${this._showDropdown}">
        <slot name="name"></slot>
        <i class="gg-arrow-down-r"></i>
      </button>
      ${this.isOpen
        ? html`
            <ul class="list-container">
              ${this.elements.map((e) => {
                return html`
                  <li
                    class=${classMap({
                      active: e.active,
                      "list-element": true,
                    })}
                  >
                    <button @click=${() => this._toggleActiveState(e)}>
                      ${e.value}
                    </button>
                  </li>
                `;
              })}
            </ul>
          `
        : nothing}
    `;
  }

  private _showDropdown() {
    console.log("showing dropdown");
    console.log(this.elements);
    this.isOpen = !this.isOpen;
  }

  private _toggleActiveState(e: ListElement) {
    this.elements.forEach((el) => (el.active = false));
    e.active = !e.active;
    this.requestUpdate();
  }

  static styles = css`
    *,
    :after,
    :before {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :host {
      position: relative;
    }

    ::slotted(h1) {
    }

    button {
      border: none;
      /* background-color: var(--primary); */
      /* padding: 0.6em 1.2em; */
      font-size: inherit;
      font-weight: inherit;
      font-family: inherit;
      cursor: pointer;
      color: inherit;
    }

    .dropdown {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      gap: 1em;
      padding: 0.3em 1em;

      border-radius: 1em;

      background-color: var(--primary);
      color: var(--secondary);
    }

    .list-container {
      list-style-type: none;
      padding: 0.1rem 0;
      position: absolute;
      top: calc(100% + 0.2em);
      border-radius: 0.5em;
      left: 0;
      min-width: 100%;
      background-color: var(--secondary);
    }

    .list-container > * + * {
      margin-top: 0.5em;
    }

    .list-element {
      border: none;
      border-radius: 1em;
      padding: 0.1em 0.3em;
      /* background-color: var(--secondary); */
      color: var(--text);
    }

    .list-element.active,
    .list-element:hover {
      background-color: var(--accent);
      color: var(--secondary);
    }

    .list-element button {
      background: none;
      width: 100%;
      text-align: start;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-dropdown": LitDropdown;
  }
}
