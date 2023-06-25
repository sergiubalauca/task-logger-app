import { Injectable } from '@angular/core';

@Injectable()
export class UserStorageService {
    private readonly userEmail = 'USER_EMAIL';

    public setUsername(username: string): void {
        localStorage.setItem(this.userEmail, username);
    }

    public getUsername(): string {
        return localStorage.getItem(this.userEmail);
    }
}
