import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

window.addEventListener('error', (event: ErrorEvent) => {
  if (event.message?.includes('ResizeObserver loop completed with undelivered notifications') ||
      event.error?.message?.includes('ResizeObserver loop completed with undelivered notifications')) {
    event.preventDefault();
    return false;
  }
  console.error('Window error:', event.error);
  return true;
});

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', event.reason);
});

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
