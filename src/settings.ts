import { App, PluginSettingTab, Setting } from "obsidian";
import LinkOpenPlugin from "./main";

export interface LinkOpenPluginSettings {
	openMethod: string;
	modalWidth: string;
	modalHeight: string;
}

export const DEFAULT_SETTINGS: LinkOpenPluginSettings = {
	openMethod: "modal",
	modalWidth: "80vw",
	modalHeight: "80vh",
};

const openMethods = {
	browser: "Browser",
	modal: "Obsidian Modal",
	tab: "Obsidian Tab",
};

export default class LinkOpenSettingTab extends PluginSettingTab {
	plugin: LinkOpenPlugin;
	openMethod: string;
	modalWidth: string;
	modalHeight: string;

	constructor(app: App, plugin: LinkOpenPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h1", { text: "Link Opener Settings" });

		new Setting(containerEl)
			.setName("Open external links with")
			.addDropdown((dd) =>
				dd
					.addOptions(openMethods)
					.setValue(this.plugin.settings.openMethod)
					.onChange(async (value) => {
						this.plugin.settings.openMethod = value;
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h3", { text: "Modal Settings" });

		new Setting(containerEl)
			.setName("Modal width")
			.setDesc("Enter any valid CSS unit")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.modalWidth)
					.onChange(async (value) => {
						this.plugin.settings.modalWidth = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Modal height")
			.setDesc("Enter any valid CSS unit")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.modalHeight)
					.onChange(async (value) => {
						this.plugin.settings.modalHeight = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
