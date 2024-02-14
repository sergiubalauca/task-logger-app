import {
    Component,
    OnInit,
    Input,
    ViewChild,
    AfterViewInit,
} from '@angular/core';
import {
    ModalController,
    IonicModule,
    IonAccordionGroup,
} from '@ionic/angular';
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { SearcheableSelectModel, SuppressTouchMoveDirective } from '@shared';
import { BehaviorSubject, map } from 'rxjs';

@Component({
    selector: 'app-search-select',
    templateUrl: './searcheable-select.component.html',
    styleUrls: ['./searcheable-select.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgIf,
        NgFor,
        NgClass,
        AsyncPipe,
        SuppressTouchMoveDirective,
    ],
})
export class SearcheableSelectComponent implements OnInit, AfterViewInit {
    @Input() public selectOptions: SearcheableSelectModel[];
    @Input() public selectedItemId: string | null = null;
    @Input() public controlLabel: string;

    @ViewChild('ionAccordionGroup')
    ionAccordionGroup: IonAccordionGroup;

    protected groups: string[] = [];
    public displayedOptions: SearcheableSelectModel[];
    public showContent = false;
    /* eslint-disable @typescript-eslint/naming-convention */
    private NUMBER_OF_ENTITIES_TO_DISPLAY_STEP = 100;
    private numberOfDisplayedEntities = this.NUMBER_OF_ENTITIES_TO_DISPLAY_STEP;
    private currentySelected: SearcheableSelectModel;
    private displayedOptionsSub$: BehaviorSubject<SearcheableSelectModel[]> =
        new BehaviorSubject([]);
    public displayedOptions$ = this.displayedOptionsSub$.asObservable();

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
        this.displayedOptions = this.selectOptions.slice(
            0,
            this.NUMBER_OF_ENTITIES_TO_DISPLAY_STEP
        );

        this.displayedOptionsSub$.next(this.displayedOptions);

        this.setInitialSelected(this.selectedItemId);
        this.groups = [
            ...new Set(
                this.selectOptions
                    .map((item) => item.group)
                    .filter((item) => item)
            ),
        ];
    }

    public ngAfterViewInit(): void {
        this.toggleAccordion();
    }

    protected filterDisplayedOptions = (group: string) => {
        // return this.displayedOptions.filter((item) => item.group === group);
        return this.displayedOptions$.pipe(
            map((items) => items.filter((item) => item.group === group))
        );
    };

    public onSearchChanged(event: any): void {
        if (!event.detail.value) {
            this.displayedOptions = this.selectOptions.slice(
                0,
                this.NUMBER_OF_ENTITIES_TO_DISPLAY_STEP
            );
            this.displayedOptionsSub$.next(this.displayedOptions);
            this.expandFoundGroup(this.currentySelected?.value);
            return;
        }

        this.displayedOptions = this.selectOptions
            .filter(
                (item) =>
                    item.description
                        .toString()
                        .toLowerCase()
                        .includes(event.detail.value.toLowerCase()) ||
                    item.value
                        .toString()
                        .toLowerCase()
                        .includes(event.detail.value.toLowerCase())
            )
            .slice(0, this.NUMBER_OF_ENTITIES_TO_DISPLAY_STEP);

        this.displayedOptionsSub$.next(this.displayedOptions);
        this.expandFoundGroup(event.detail.value);
    }

    public close(): void {
        this.modalCtrl.dismiss(null);
    }

    public onItemSelected(newSelected: SearcheableSelectModel | null): void {
        if (!newSelected) {
            newSelected = new SearcheableSelectModel({
                value: '',
                description: '',
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
        if (
            !this.selectOptions ||
            this.numberOfDisplayedEntities >= this.selectOptions.length
        ) {
            event.target.disabled = true;
            return;
        }

        const newEntitiesToDisplay = this.selectOptions.slice(
            this.numberOfDisplayedEntities,
            this.numberOfDisplayedEntities +
                this.NUMBER_OF_ENTITIES_TO_DISPLAY_STEP
        );

        this.displayedOptions.push(...newEntitiesToDisplay);
        this.numberOfDisplayedEntities +=
            this.NUMBER_OF_ENTITIES_TO_DISPLAY_STEP;

        this.displayedOptionsSub$.next(this.displayedOptions);
        event.target.complete();
    }

    private setInitialSelected(id: string | null): void {
        this.currentySelected = this.selectOptions.find(
            (item) => item.id === id
        );
        if (this.currentySelected) {
            this.currentySelected.isSelected = true;
        }
    }

    private toggleAccordion = () => {
        const nativeEl = this.ionAccordionGroup;

        if (nativeEl) {
            nativeEl.value = this.currentySelected?.group ?? undefined;
        }
    };

    private expandFoundGroup = (searchTerm: string) => {
        // expand the accordion where the search result is found
        const group = this.selectOptions.find(
            (item) =>
                item.description
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                item.value
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        )?.group;

        if (group && this.ionAccordionGroup) {
            this.ionAccordionGroup.value = group;
        }
    };
}
