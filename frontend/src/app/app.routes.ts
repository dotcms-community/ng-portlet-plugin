import { Route } from '@angular/router';

/**
 * App routes for standalone development/testing.
 * When loaded as a remote module via MF, entry.routes.ts mount() is used instead.
 */
export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: () =>
            import('./features/dashboard/dashboard.component').then(
                (m) => m.DashboardComponent
            ),
    },
    {
        path: 'settings',
        loadComponent: () =>
            import('./features/settings/settings.component').then(
                (m) => m.SettingsComponent
            ),
    },
];
