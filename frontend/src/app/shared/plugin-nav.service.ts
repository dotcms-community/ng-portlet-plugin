import { Injectable, signal } from '@angular/core';

/**
 * Simple navigation service for switching views within the plugin.
 *
 * Since the remote module runs in its own Angular runtime (separate from the
 * host's router), we use signals instead of Angular Router for internal
 * view switching. This avoids conflicts with the host application's routing.
 */
@Injectable()
export class PluginNavService {
    readonly currentView = signal<'dashboard' | 'settings'>('dashboard');

    navigate(view: 'dashboard' | 'settings'): void {
        this.currentView.set(view);
    }
}
