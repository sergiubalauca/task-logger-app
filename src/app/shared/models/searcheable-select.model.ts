export class SearcheableSelectModel {
	public id: string;
	public description: string;
	public value: string;
	public isSelected: boolean;
	public displayBoth: boolean;
	public group: string;

	public constructor(model: Partial<SearcheableSelectModel>) {
		this.id = model.id;
		this.description = model.description;
		this.isSelected = model.isSelected;
		this.value = model.value;
		this.displayBoth = model.displayBoth;
		this.group = model.group;
	}
}
