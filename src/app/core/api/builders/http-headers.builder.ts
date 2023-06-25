import { HttpHeaders } from '@angular/common/http';

export class HttpHeaderBuilder {
    private httpHeaders: HttpHeaders;
    private headersDictionary: { [name: string]: string | string[] };

    public create(): HttpHeaderBuilder {
        this.httpHeaders = new HttpHeaders();
        this.headersDictionary = {};
        return this;
    }

    public addHeader(
        headerKey: string,
        headerValue: string
    ): HttpHeaderBuilder {
        this.headersDictionary[headerKey] = headerValue;

        return this;
    }

    public build(): HttpHeaders {
        this.httpHeaders = new HttpHeaders(this.headersDictionary);
        return this.httpHeaders;
    }
}
