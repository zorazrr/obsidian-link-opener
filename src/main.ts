import { Plugin } from "obsidian";
import LinkOpenPluginSettings, { DEFAULT_SETTINGS } from "./settings";
import { LinkView, LINK_VIEW } from "./view";
import { LinkModal } from "./modal";

export let globalLink = "";

export default class LinkOpenPlugin extends Plugin {
	settings: LinkOpenPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			LINK_VIEW,
			(leaf) => new LinkView(this.app.workspace, leaf, "")
		);

		// This is a click event handler
		const clickEvt = async (evt: MouseEvent) => {
			const el = evt.target as HTMLElement;

			if (el.classList.contains("external-link")) {
				const href = el.getAttribute("linkto");

				// Open with modal
				if (this.settings.openMethod === "modal" && href) {
					new LinkModal(this.app, href).open();
				}

				// Open with browser
				else if (this.settings.openMethod === "browser" && href) {
					window.open(href);
				}

				// Open with obsidian tab
				else if (this.settings.openMethod === "tab" && href) {
					globalLink = href;

					await this.app.workspace
						.getLeaf("tab")
						.setViewState({ type: LINK_VIEW, active: true });

					this.app.workspace.revealLeaf(
						this.app.workspace.getLeavesOfType(LINK_VIEW)[0]
					);

					return;
				}
			}
		};

		// This registers a click event
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			evt.preventDefault();
			return clickEvt(evt);
		});

		// This handles removign external url defaut redirect
		const removeUrl = (evt: MouseEvent) => {
			const el = evt.target as HTMLElement;
			if (!el.classList.contains("external-link")) {
				return;
			}
			if (el.getAttribute("href") == "javascript:void(0);") {
				return;
			}
			const href = el.getAttribute("href");
			el.setAttribute("linkto", href ? href : "");
			el.setAttribute("href", "javascript:void(0);");
		};

		// This acknowledges a hover to removeUrl
		this.registerDomEvent(document, "mouseover", (evt: MouseEvent) => {
			return removeUrl(evt);
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new LinkOpenPluginSettings(this.app, this));
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(LINK_VIEW);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
