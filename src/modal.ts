import { App, Modal } from "obsidian";

export class LinkModal extends Modal {
	link: string;

	constructor(app: App, link: string) {
		super(app);
		this.link = link;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.addClass("link-modal");
		const frame = contentEl.createEl("iframe");
		frame.src = this.link;
		frame.setAttribute("frameborder", "0");
		frame.width = "100%";
		frame.height = "92%";
		const button = contentEl.createEl("button");
		button.setAttribute(
			"onclick",
			`window.open("${this.link}");this.close()`
		);
		button.innerHTML = "Open in Browser";
		button.addClass("modal-button");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
