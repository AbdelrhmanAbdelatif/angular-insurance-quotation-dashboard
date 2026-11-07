import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';

/**
 * Defines the application wide configuration and dependency providers
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Registers global browser error listeners
    provideBrowserGlobalErrorListeners(),
    // Registers Angular Router using the application's route definitions
    provideRouter(routes),
    // Enables client side hydration for server rendered HTML
    provideClientHydration(),
  ],
};
