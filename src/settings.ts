import { App, PluginSettingTab, Setting } from "obsidian";
import LinkOpenPlugin from "./main";

export interface LinkOpenPluginSettings {
	openMethod: string;
}

export const DEFAULT_SETTINGS: LinkOpenPluginSettings = {
	openMethod: "modal",
};

const openMethods = {
	browser: "Browser",
	modal: "Obsidian Modal",
	tab: "Obsidian Tab",
};

export default class LinkOpenSettingTab extends PluginSettingTab {
	plugin: LinkOpenPlugin;
	openMethod: string;

	constructor(app: App, plugin: LinkOpenPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Link Opener Settings" });

		new Setting(containerEl).setName("Open Link with").addDropdown((dd) =>
			dd
				.addOptions(openMethods)
				.setValue(this.plugin.settings.openMethod)
				.onChange(async (value) => {
					this.plugin.settings.openMethod = value;
					await this.plugin.saveSettings();
				})
		);
	}
}
