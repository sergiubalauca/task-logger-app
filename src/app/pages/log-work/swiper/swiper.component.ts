import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalController, IonicModule } from '@ionic/angular';
import {
    AnimatedArrowsComponent,
    DailyWorkDoc,
    DateTimeService,
    FormCanDeactivateService,
    SearcheableSelectModel,
} from '@shared';
import {
    combineLatest,
    forkJoin,
    map,
    Observable,
    of,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { MultiStepFormService } from '../form/services/multi-step-form.service';
import { WorkItemComponent } from '../form/containers/work-item/work-item.component';
import { PacientComponent } from '../form/containers/pacient/pacient.component';
import { DoctorComponent } from '../form/containers/doctor/doctor.component';
import { FormReducer } from '../form/custom-state/reducer/form.reducer';
import { CommonModule } from '@angular/common';
import { LogWorkFacade } from '@abstraction';
import { RxDocument } from 'rxdb';
import { RxLogWorkDocumentType } from '@core';
import { TimeTrackingComponent } from '../form/containers/time-tracking/time-tracking.component';
import { FormSelector } from '../form/custom-state/selector/form.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const initSwiper = () => register();
@Component({
    selector: 'app-swiper',
    templateUrl: './swiper.component.html',
    styleUrls: ['./swiper.component.scss'],
    providers: [MultiStepFormService],
    standalone: true,
    imports: [
        IonicModule,
        DoctorComponent,
        PacientComponent,
        WorkItemComponent,
        CommonModule,
        TimeTrackingComponent,
        AnimatedArrowsComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperComponent implements OnInit, OnDestroy {
    @Input() public chosenDate: string;
    @ViewChild('swiperContainer') swiperContainer: ElementRef | undefined;

    public multiForm: Observable<FormGroup>;
    protected isDeleteButtonEnabled: boolean = true;
    public swiperPageTwoComponent: 'app-pacient' | 'app-time-tracking' = null;
    private swiperElement: any;
    public isFormValid = this.formService.getForm()?.valid ?? false;

    protected currentSlideMapper = (
        currentDoc: string,
        currentPacient: string
    ): Array<string> => {
        const currentSlideIndex = this.swiperElement.swiper.activeIndex;

        return {
            1: [`D: ${currentDoc ?? '-'}`],
            2: [`D: ${currentDoc}`, `P: ${currentPacient ?? '-'}`],
        }[currentSlideIndex];
    };

    protected breadcrumbs = [];
    private ngOnDestroy$: Subject<void> = new Subject<void>();
    private formCanDeactivateService: FormCanDeactivateService = inject(
        FormCanDeactivateService
    );

    constructor(
        private modalController: ModalController,
        private formService: MultiStepFormService,
        private formStore: FormReducer,
        private formSelectors: FormSelector,
        private logWorkFacade: LogWorkFacade,
        private readonly dateTimeService: DateTimeService
    ) {
        initSwiper();
    }

    ngOnInit() {
        this.swiperElement = document.querySelector(
            'swiper-container'
        ) as SwiperContainer;

        this.swiperElement.allowSlideNext = false;
        this.swiperElement.swiper.on('slideChange', () => this.onSlideChange());

        const dailyWorkId = this.dateTimeService.getDailyWorkId(
            new Date(this.chosenDate)
        );
        this.multiForm = this.logWorkFacade.getOne$({ id: dailyWorkId }).pipe(
            map(
                (dailyWork: DailyWorkDoc) =>
                    dailyWork as RxDocument<RxLogWorkDocumentType>
            ),
            switchMap((dailyWork) => {
                this.isDeleteButtonEnabled = !!!dailyWork;

                const form = of(this.formService.initMultiStepForm(dailyWork));
                this.isFormValid = this.formService.getForm().valid;

                return form;
            })
        );
    }

    public onSlideChange() {
        combineLatest([
            this.formSelectors.currentDoctorBreadcrumb$,
            this.formSelectors.currentPacientBreadcrumb$,
        ])
            .pipe(takeUntil(this.ngOnDestroy$))
            .subscribe(([currentDoc, currentPacient]) => {
                const currentSlide = this.currentSlideMapper(
                    currentDoc,
                    currentPacient
                );
                this.breadcrumbs = currentSlide;
            });
    }

    public onDoctorSelected(event: {
        value: SearcheableSelectModel;
        formIndex: number;
    }) {
        if (event.value && event.value.value !== '') {
            this.swiperElement.allowSlideNext = true;
            this.swiperElement.swiper.slideNext();
            this.swiperElement.allowSlideNext = false;
        }
    }

    public onGoToDoctor(index: number) {
        this.swiperPageTwoComponent = 'app-pacient';
        this.formStore.setCurrentPacient(0);
        this.swiperElement.allowSlideNext = true;
        this.swiperElement.swiper.slideNext();
        this.swiperElement.allowSlideNext = false;
    }

    public onGoToWorkItem() {
        this.swiperElement.allowSlideNext = true;
        this.swiperElement.swiper.slideNext();
        this.swiperElement.allowSlideNext = false;
    }

    public onNavigateTimeTracking() {
        this.swiperPageTwoComponent = 'app-time-tracking';
        this.swiperElement.allowSlideNext = true;
        this.swiperElement.swiper.slideNext();
        this.swiperElement.allowSlideNext = false;
    }

    public ngOnDestroy() {
        this.formStore.setCurrentPacient(0);
        this.formStore.setCurrentDoctor(0);
        this.formStore.setCurrentDoctorBreadcrumb('');
        this.formStore.setCurrentPacientBreadcrumb('');
        this.swiperPageTwoComponent = null;
        this.ngOnDestroy$.next();
    }

    public closeModal() {
        this.modalController.dismiss();
    }

    public async deleteLoggedWorkForDate() {
        return await this.modalController.dismiss({
            isDelete: true,
        });
    }

    public async save() {
        this.formStore.setCurrentPacient(0);
        this.formStore.setCurrentDoctor(0);

        const isFormValid = this.formService.getForm().valid;
        const formValue = this.formService.getForm().value;

        this.formCanDeactivateService.setCanDeactivate(true);
        return await this.modalController.dismiss({
            formValue,
            dismissed: isFormValid,
        });
    }
}
