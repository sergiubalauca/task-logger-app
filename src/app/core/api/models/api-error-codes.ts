export class ApiErrorCodes {
    public static validationError = 'VALIDATION_ERROR';
    public static invalidToken = 'INVALID_TOKEN';
    public static invalidRefreshToken = 'INVALID_REFRESH_TOKEN';
    public static expiredRefreshToken = 'EXPIRED_REFRESH_TOKEN';
    public static invalidCredentials = 'INVALID_CREDENTIALS';
}


export const errorMapper = (error: string) => {
    switch (error) {
        case ApiErrorCodes.validationError:
            return 'Validation error';
        case ApiErrorCodes.invalidToken:
            return 'Invalid token';
        case ApiErrorCodes.invalidRefreshToken:
            return 'Invalid refresh token';
        case ApiErrorCodes.expiredRefreshToken:
            return 'Expired refresh token';
        case ApiErrorCodes.invalidCredentials:
            return 'Invalid credentials';
        default:
            return 'Unknown error';
    }
};