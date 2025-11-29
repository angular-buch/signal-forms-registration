import { SignalFormsConfig } from '@angular/forms/signals';

export const signalFormsConfig: SignalFormsConfig = {
  classes: {
    valid: (state) => state.valid(),
    error: (state) => state.touched() && state.errors().length > 0,
    pending: (state) => state.pending(),
  },
};
