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

  @property({ attribute: "horizontal-align" })
  align: "left" | "right" = "left";

  @property({ attribute: "vertical-align" })
  verticalAlign: "top" | "bottom" = "bottom";

  @property()
  disabled: boolean = false;

  @state()
  isOpen: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this._windowClickHandler.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this._windowClickHandler);
  }

  private _windowClickHandler(e: MouseEvent) {
    const path = e.composedPath() as Element[];
    const isInsideListContainer = path.some((p) => {
      return p.nodeName?.toLowerCase().includes("lit-dropdown");
    });
    if (!isInsideListContainer) {
      this.isOpen = false;
    }
  }

  render() {
    return html`
      <link
        href="https://unpkg.com/css.gg@2.0.0/icons/css/arrow-down-r.css"
        rel="stylesheet"
      />
      <button
        class="dropdown"
        disabled=${this.disabled}
        @click="${this._toggleDropdown}"
      >
        <slot name="name"></slot>
        <i class="gg-arrow-down-r"></i>
      </button>
      ${this.isOpen
        ? html`
            <ul
              class=${classMap({
                "list-container": true,
                "left-align": this.align === "left",
                "right-align": this.align === "right",
                "bottom-align": this.verticalAlign === "bottom",
                "top-align": this.verticalAlign === "top",
              })}
            >
              ${this.elements.map((e) => {
                return html`
                  <li
                    class=${classMap({
                      active: e.active,
                      "list-element": true,
                    })}
                  >
                    <button @click=${() => this._handleElementClick(e)}>
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

  private _toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  private _handleElementClick(e: ListElement) {
    this.elements.forEach((el) => (el.active = false));
    e.active = !e.active;
    this.isOpen = false;

    this.dispatchEvent(
      new CustomEvent("elementclick", {
        detail: e,
      })
    );
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

    :host[disabled] {
      opacity: 0.5;
    }

    ::slotted(h1) {
    }

    button {
      border: none;
      font-size: inherit;
      font-weight: inherit;
      font-family: inherit;
      cursor: pointer;
      color: inherit;
    }
    button[disabled="true"] {
      opacity: 0.5;
      cursor: auto;
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
      border-radius: 0.5em;

      min-width: 100%;
      background-color: var(--secondary);

      display: flex;
    }

    .list-container.left-align {
      left: 0;
    }
    .list-container.right-align {
      right: 0;
    }

    .list-container.top-align {
      bottom: calc(100% + 0.2em);
      flex-direction: column-reverse;
    }
    .list-container.bottom-align {
      top: calc(100% + 0.2em);
      flex-direction: column;
    }

    .list-container > * + * {
      margin-top: 0.5em;
    }

    .list-element {
      border: none;
      border-radius: 1em;
      padding: 0.1em 0.3em;
      white-space: nowrap;
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
