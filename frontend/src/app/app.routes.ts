import { Route } from '@angular/router';

/**
 * App routes for standalone development/testing.
 * Uses RemoteEntryComponent as the shell, which handles internal
 * view switching via PluginNavService — same as the remote module.
 */
export const appRoutes: Route[] = [
    {
        path: '**',
        loadComponent: () =>
            import('./remote-entry/entry.component').then(
                (m) => m.RemoteEntryComponent
            ),
    },
];