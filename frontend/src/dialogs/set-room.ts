import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "../switch-manager-dialog";
import { notifyDialogClosed } from "../helpers";

@customElement("switch-manager-dialog-set-room")
export class SwitchManagerDialogSetRoom extends LitElement {
  @state() private _params?: any;
  @state() private _area = "";

  public showDialog(params: any) {
    this._params = params;
    this._area = params.config?.area || "";
  }

  public closeDialog() {
    if (!this._params) return;
    this._params = undefined;
    notifyDialogClosed(this);
  }

  render() {
    if (!this._params) return html``;
    const areas = Object.values(this._params.areas || {}).sort(
      (a: any, b: any) => String(a.name).localeCompare(String(b.name))
    ) as { area_id: string; name: string }[];
    // A room that was deleted in Home Assistant is still shown so it can be cleared.
    const known = areas.some((a) => a.area_id === this._area);
    return html`
      <switch-manager-dialog @closed=${this.closeDialog} heading="Room">
        <select
          class="select"
          .value=${this._area}
          @change=${(e: Event) =>
            (this._area = (e.target as HTMLSelectElement).value)}
        >
          <option value="" ?selected=${this._area === ""}>No room</option>
          ${this._area && !known
            ? html`<option value=${this._area} selected>
                ${this._area} (unknown)
              </option>`
            : ""}
          ${areas.map(
            (a) => html`<option
              value=${a.area_id}
              ?selected=${a.area_id === this._area}
            >
              ${a.name}
            </option>`
          )}
        </select>
        <button slot="actions" @click=${this.closeDialog}>Cancel</button>
        <button slot="actions" @click=${this._save}>Save</button>
      </switch-manager-dialog>
    `;
  }

  private _save() {
    this._params?.update?.({ area: this._area || null });
    this.closeDialog();
  }

  static styles = css`
    .select {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
      border-radius: 6px;
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
    }
    .select:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  `;
}
