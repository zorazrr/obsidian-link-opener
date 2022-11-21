import { ItemView, Workspace, WorkspaceLeaf } from "obsidian";

export const LINK_VIEW = "link-view";

export class LinkView extends ItemView {
	link: string;
	workspace: Workspace;

	constructor(workspace: Workspace, leaf: WorkspaceLeaf, link: string) {
		super(leaf);
		this.workspace = workspace;
		this.link = link;
	}

	getViewType() {
		return LINK_VIEW;
	}

	getDisplayText() {
		return "Link View";
	}

	setLink(link: string) {
		this.link = link;
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		const frame = container.createEl("iframe");
		frame.src = this.link;
		frame.setAttribute("frameborder", "0");
		frame.width = "100%";
	}

	async onClose() {
		console.log(this.workspace);
		this.workspace.detachLeavesOfType(LINK_VIEW);
	}
}
