import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideSignalFormsConfig } from '@angular/forms/signals';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { signalFormsConfig } from './signal-forms.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideSignalFormsConfig(signalFormsConfig),
  ],
};
