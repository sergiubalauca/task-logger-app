import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaderBuilder } from '../builders/http-headers.builder';
import { EnvironmentConfig, ENV_CONFIG } from '../environment-config.interface';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private url: string;

    public constructor(
        private http: HttpClient,
        @Inject(ENV_CONFIG) config: EnvironmentConfig
    ) {
        this.url = `${config.environment.baseUrl}`;
    }

    public makeGet<T>(
        urlPath: string,
        params?: { [name: string]: string },
        responseType: any = 'json',
        extraHeaders?: { [name: string]: string }
    ): Observable<T> {
        return this.http.get<T>(this.url + urlPath, {
            headers: this.createHeaders(extraHeaders),
            params,
            withCredentials: false,
            responseType,
        });
    }

    public makePost<T, U>(
        urlPath: string,
        body: U,
        responseType: any = 'json'
    ): Observable<T | never> {
        return this.http.post<T>(this.url + urlPath, body, {
            headers: this.createHeaders(),
            withCredentials: false,
            responseType,
        });
    }

    public makePatch<T, U>(
        urlPath: string,
        body: U,
        responseType: any = 'json'
    ): Observable<T | never> {
        return this.http.patch<T>(this.url + urlPath, body, {
            headers: this.createHeaders(),
            withCredentials: false,
            responseType,
        });
    }

    public makeDelete<T>(
        urlPath: string,
        responseType: any = 'json'
    ): Observable<T | never> {
        return this.http.delete<T>(this.url + urlPath, {
            headers: this.createHeaders(),
            withCredentials: false,
            responseType,
        });
    }

    protected createHeaders(headers?: { [name: string]: string }): HttpHeaders {
        const builder = new HttpHeaderBuilder()
            .create()
            .addHeader('Accept', 'application/json')
            .addHeader('Content-Type', 'application/json');
        if (headers) {
            for (const key in headers) {
                if (!headers.hasOwnProperty(key)) {
                    builder.addHeader(key, headers[key]);
                }
            }
        }
        return builder.build();
    }
}
