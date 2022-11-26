import { App, Modal } from "obsidian";

export class LinkModal extends Modal {
	link: string;
	width: string;
	height: string;

	constructor(app: App, link: string, width: string, height: string) {
		super(app);
		this.link = link;
		this.width = width;
		this.height = height;
	}

	onOpen() {
		// Modal Size
		const modalContainer = this.containerEl.lastChild as HTMLElement;
		modalContainer.style.width = this.width;
		modalContainer.style.height = this.height;

		// Iframe Content
		const { contentEl } = this;
		contentEl.addClass("link-modal");
		const frame = contentEl.createEl("iframe");
		frame.src = this.link;
		frame.setAttribute("frameborder", "0");
		frame.width = "100%";
		frame.height = "92%";

		// Open in Browser Button
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
