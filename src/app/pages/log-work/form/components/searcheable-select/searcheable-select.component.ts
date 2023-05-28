import { Component, OnInit, Input } from '@angular/core';
import { SearcheableSelectModel } from './searcheable-select.model';
import { ModalController, IonicModule } from '@ionic/angular';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
    selector: 'app-search-select',
    templateUrl: './searcheable-select.component.html',
    styleUrls: ['./searcheable-select.component.scss'],
    standalone: true,
    imports: [IonicModule, NgIf, NgFor, NgClass]
})
export class SearcheableSelectComponent implements OnInit {
	@Input() public selectOptions: SearcheableSelectModel[];
	@Input() public selectedItemId: string | null = null;
	@Input() public controlLabel: string;

	public displayedOptions: SearcheableSelectModel[];
	public showContent = false;
	/* eslint-disable @typescript-eslint/naming-convention */
	private NUMBER_OF_ENTITIES_TO_DISPLAY_STEP = 50;
	private numberOfDisplayedEntities = this.NUMBER_OF_ENTITIES_TO_DISPLAY_STEP;
	private currentySelected: SearcheableSelectModel;

	public constructor(private modalCtrl: ModalController) {}

	public ngOnInit() {
		this.selectOptions = this.selectOptions.map((selectOpts) => {
			if (
				selectOpts.value.toString().toLocaleLowerCase() ===
				selectOpts.description.toString().toLocaleLowerCase()
			) {
				selectOpts.displayBoth = false;
			}
			return selectOpts;
		});
		this.displayedOptions = this.selectOptions.slice(0, this.NUMBER_OF_ENTITIES_TO_DISPLAY_STEP);

		this.setInitialSelected(this.selectedItemId);
	}

	public onSearchChanged(event: any): void {
		if (!event.detail.value) {
			this.displayedOptions = this.selectOptions.slice(0, this.NUMBER_OF_ENTITIES_TO_DISPLAY_STEP);
			return;
		}

		this.displayedOptions = this.selectOptions
			.filter(
				(item) =>
					item.description.toString().toLowerCase().includes(event.detail.value.toLowerCase()) ||
					item.value.toString().toLowerCase().includes(event.detail.value.toLowerCase())
			)
			.slice(0, this.NUMBER_OF_ENTITIES_TO_DISPLAY_STEP);
	}

	public close(): void {
		this.modalCtrl.dismiss(null);
	}

	public onItemSelected(newSelected: SearcheableSelectModel | null): void {
		if (!newSelected) {
			newSelected = new SearcheableSelectModel({
				value: '',
				description: ''
			});
		}
		if (this.currentySelected) {
			this.currentySelected.isSelected = false;
		}

		newSelected.isSelected = true;
		this.currentySelected = newSelected;
		this.modalCtrl.dismiss(this.currentySelected);
	}

	public displayMoreEntries(event: any): void {
		if (!this.selectOptions || this.numberOfDisplayedEntities >= this.selectOptions.length) {
			event.target.disabled = true;
			return;
		}

		const newEntitiesToDisplay = this.selectOptions.slice(
			this.numberOfDisplayedEntities,
			this.numberOfDisplayedEntities + this.NUMBER_OF_ENTITIES_TO_DISPLAY_STEP
		);

		this.displayedOptions.push(...newEntitiesToDisplay);
		this.numberOfDisplayedEntities += this.NUMBER_OF_ENTITIES_TO_DISPLAY_STEP;

		event.target.complete();
	}

	private setInitialSelected(id: string | null): void {
		this.currentySelected = this.selectOptions.find((item) => item.id === id);
		if (this.currentySelected) {
			this.currentySelected.isSelected = true;
		}
	}
}
