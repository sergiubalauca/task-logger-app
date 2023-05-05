import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { lazyArray } from 'src/app/shared/lazy-rendering.operator';
import { RandomUser } from 'src/app/shared/models/random-user';
import Cropper from 'cropperjs';
@Component({
    selector: 'app-home',
    templateUrl: 'playground.page.html',
    styleUrls: ['playground.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
    @ViewChild('cropperContainer') cropperContainer: ElementRef;
    // @ViewChild('image') public imageElement: ElementRef;
    public cropper: Cropper;
    public imgSrc: string | ArrayBuffer;
    public data$: Observable<any>;
    public data2$: Observable<any>;
    public results = 200;
    public data: RandomUser = {
        info: {
            results: 0,
            page: 0,
        },
        results: [],
    };

    public imageDestination: string;

    // private readonly url = 'https://randomuser.me/api/?results=${this.numberOfRecords}&page=1';
    private readonly url = `https://randomuser.me/api/?results=${this.results}&page=1`;

    constructor(private httpService: HttpClient) {}

    ngAfterViewInit() {
        const image = document.getElementById('image') as HTMLImageElement;
        this.cropper = new Cropper(image, {});

        console.log('GSB: ', this.cropper.getCanvasData().height);
    }

    getCanvasData() {
        const baseOptions: Cropper.GetCroppedCanvasOptions = {
            width: 128,
            height: 128,
            imageSmoothingEnabled: true,
        };

        // hack because of TS error when setting imageSmoothingQuality value
        const allOptions: any = {
            ...baseOptions,
            imageSmoothingQuality: 'high',
        };
        const canvasData = this.cropper.getCroppedCanvas(allOptions);

        const dataURL = canvasData.toDataURL('image/jpeg');

        // this.previewSrc = dataURL;
        // this.croppedImgSrc.emit(dataURL);
    }
    public ngOnInit(): void {
        this.data$ = this.httpService
            .get(this.url)
            .pipe(map((data: any) => data as RandomUser));
        this.data2$ = this.httpService.get(this.url).pipe(
            map((data: any) => data.results),
            lazyArray(3000, 10),
            map((data: any) => data as RandomUser)
        );
    }

    public trackById(
        index,
        item: {
            id: {
                name: string;
                value: string;
            };
        }
    ) {
        return item.id.value;
    }

    selectFile(event: any) {
        //Angular 11, for stricter type
        if (!event.target.files[0] || event.target.files[0].length == 0) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);

        reader.onload = (_event) => {
            this.imgSrc = reader.result;
        };
    }
}
