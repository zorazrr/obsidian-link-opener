import { App, Modal, Plugin, ItemView, WorkspaceLeaf } from "obsidian";
import LinkOpenPluginSettings, { DEFAULT_SETTINGS } from "./settings";

export default class LinkOpenPlugin extends Plugin {
	settings: LinkOpenPluginSettings;

	async onload() {
		await this.loadSettings();

		// This is a click event handler
		const clickEvt = (evt: MouseEvent) => {
			const el = evt.target as HTMLElement;

			if (el.classList.contains("external-link")) {
				// Open with modal
				if (this.settings.openMethod === "modal") {
					const href = el.getAttribute("linkto");
					href ? new LinkModal(this.app, href).open() : undefined;
					return false;
				}
				// Open with browser
				else if (this.settings.openMethod === "browser") {
					const href = el.getAttribute("linkto");
					href ? window.open(href) : undefined;
				}
				// Open with obsidian tab
				else if (this.settings.openMethod === "tab") {
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

	onunload() {}

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

// MODAL - MOVE TO ANOTHER FILE

class LinkModal extends Modal {
	link: string;

	constructor(app: App, link: string) {
		super(app);
		this.link = link;
	}

	onOpen() {
		const { contentEl } = this;
		const frame = contentEl.createEl("iframe");
		frame.src = this.link;
		frame.setAttribute("frameborder", "0");
		frame.width = "100%";
		frame.height = "100%";
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

// VIEW - MOVE TO ANOTHER FILE

export class LinkView extends ItemView {
	link: string;

	constructor(leaf: WorkspaceLeaf, link: string) {
		super(leaf);
		this.link = link;
	}

	getViewType() {
		return "link-view";
	}

	getDisplayText() {
		return "Link View";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		const frame = container.createEl("iframe");
		frame.src = this.link;
		frame.setAttribute("frameborder", "0");
		frame.width = "100%";
		frame.height = "100%";
	}

	async onClose() {}
}
