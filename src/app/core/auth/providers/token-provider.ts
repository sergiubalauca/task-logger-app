import { AuthenticationResult } from '@shared';

export abstract class TokenProvider {
    public abstract getToken(): AuthenticationResult;
    public abstract removeToken(): void;
}
