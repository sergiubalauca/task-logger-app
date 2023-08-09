import { Injectable } from '@angular/core';
import { HttpService } from '@core';

@Injectable()
export class UserProvider {
    private readonly apiURL = '/user/';
    constructor(private httpService: HttpService) {}

    public getUserById(id: string) {
        return this.httpService.makeGet(`${this.apiURL}/getById/${id}`);
    }
}
