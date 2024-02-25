export class ApiErrorCodes {
    public static validationError = 'VALIDATION_ERROR';
    public static invalidToken = 'INVALID_TOKEN';
    public static invalidRefreshToken = 'INVALID_REFRESH_TOKEN';
    public static expiredRefreshToken = 'EXPIRED_REFRESH_TOKEN';
    public static invalidCredentials = 'INVALID_CREDENTIALS';
    public static userAlreadyExists = 'USER_ALREADY_EXISTS';
    public static httpErrorResponse = 'HttpErrorResponse';
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
        case ApiErrorCodes.userAlreadyExists:
            return 'User already exists';
        case ApiErrorCodes.httpErrorResponse:
            return 'Server not available';
        default:
            return 'Unknown error';
    }
};
