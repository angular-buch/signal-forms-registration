import { SignalFormsConfig } from '@angular/forms/signals';
import { NG_STATUS_CLASSES } from '@angular/forms/signals/compat';

export const signalFormsConfig: SignalFormsConfig = {
  classes: {
    ...NG_STATUS_CLASSES,
    error: (field) => field.state().touched() && field.state().errors().length > 0,
  },
};
