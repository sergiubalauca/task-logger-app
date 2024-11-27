/* eslint-disable arrow-body-style */
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
    Observable,
    catchError,
    iif,
    map,
    of,
    switchMap,
    throwError,
} from 'rxjs';
import { HttpHeaderBuilder } from '../builders/http-headers.builder';
import { EnvironmentConfig, ENV_CONFIG } from '../environment-config.interface';

export interface GraphQLResponse<T> {
    data: {
        [key: string]: T;
    };
    errors: any;
}

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private url: string;
    private graphQLUrl: string;

    public constructor(
        private http: HttpClient,
        @Inject(ENV_CONFIG) config: EnvironmentConfig
    ) {
        this.url = `${config.environment.baseUrl}`;
        this.graphQLUrl = `${config.environment.graphQLUrl}`;
    }

    public pingServer(): Observable<boolean> {
        return this.http.post<boolean>(this.url + 'auth/' + 'ping', null).pipe(
            map((res) => {
                return res;
            }),
            // catchError((error) => {
            //     return throwError(() => error);
            // })
        );
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
        responseType: any = 'json',
        extraHeaders?: { [name: string]: string }
    ): Observable<T | never> {
        return this.http.post<T>(this.url + urlPath, body, {
            headers: this.createHeaders(extraHeaders),
            withCredentials: false,
            responseType,
        });
    }

    public makeGraphqlPost<T, U>(
        body: U,
        responseType: any = 'json',
        extraHeaders?: { [name: string]: string }
    ): Observable<any> {
        return this.pingServer().pipe(
            switchMap((res) =>
                iif(
                    () => res,
                    this.http
                        .post<GraphQLResponse<T>>(this.graphQLUrl, body, {
                            headers: this.createHeaders(extraHeaders),
                            withCredentials: false,
                            responseType,
                        })
                        .pipe(
                            switchMap((graphQlReponse) => {
                                if (
                                    graphQlReponse.errors &&
                                    graphQlReponse.errors.length > 0
                                ) {
                                    throw new HttpErrorResponse({
                                        error: graphQlReponse.errors[0].message,
                                        status: 401,
                                        statusText:
                                            graphQlReponse.errors[0].message,
                                    });
                                }
                                return of(graphQlReponse);
                            })
                        ),
                    throwError(() => new Error('Server is not available'))
                )
            ),
            // eslint-disable-next-line arrow-body-style
            catchError((error) => {
                return throwError(() => error);
            })
        );
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
            // eslint-disable-next-line guard-for-in
            for (const key in headers) {
                // if (!headers.hasOwnProperty(key)) {
                builder.addHeader(key, headers[key]);
                // }
            }
        }
        return builder.build();
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
        // just a test ... more could would go here
        return throwError(() => err);
    }
}
