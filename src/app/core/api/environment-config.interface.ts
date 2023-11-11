import { InjectionToken } from '@angular/core';

export interface EnvironmentConfig {
    environment: {
        baseUrl: string;
        graphQLUrl: string;
    };
}

export const ENV_CONFIG = new InjectionToken<EnvironmentConfig>(
    'EnvironmentConfig'
);
