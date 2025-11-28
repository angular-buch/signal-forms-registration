import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideSignalFormsConfig } from '@angular/forms/signals';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideSignalFormsConfig({
        classes: {
            valid: (state) => state.valid(),
            error: (state) => state.touched() && state.errors().length > 0,
            pending: (state) => state.pending(),
        },
    }),
  ],
};
