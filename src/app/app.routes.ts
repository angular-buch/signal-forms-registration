import { Routes } from '@angular/router';
import { Home } from './home/home';
import { RegistrationForm1 } from './registration-form-1/registration-form-1';
import { RegistrationForm2 } from './registration-form-2/registration-form-2';
import { RegistrationForm3 } from './registration-form-3/registration-form-3';
import { RegistrationForm4 } from './registration-form-4/registration-form-4';

export const routes: Routes = [
  { path: '', component: Home, title: 'Angular Signal Forms Demo' },
  { path: 'version-1', component: RegistrationForm1, title: 'Angular Signal Forms Demo | 1st version' },
  { path: 'version-2', component: RegistrationForm2, title: 'Angular Signal Forms Demo | 2nd version' },
  { path: 'version-3', component: RegistrationForm3, title: 'Angular Signal Forms Demo | 3rd version' },
  { path: 'version-4', component: RegistrationForm4, title: 'Angular Signal Forms Demo | 4th version' },
  { path: '**', redirectTo: '' },
];
