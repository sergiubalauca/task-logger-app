export class AuthenticationResult {
    public accessToken: string;
    public refreshToken: string;

    public constructor(token: string, refreshToken: string) {
        this.accessToken = token;
        this.refreshToken = refreshToken;
    }
}
