import { Component, inject } from '@angular/core';

import { DashboardComponent } from '../features/dashboard/dashboard.component';
import { SettingsComponent } from '../features/settings/settings.component';
import { PluginNavService } from '../shared/plugin-nav.service';

/**
 * Shell component for the remote module.
 * Switches between views using the PluginNavService signal.
 */
@Component({
    selector: 'plugin-remote-entry',
    standalone: true,
    imports: [DashboardComponent, SettingsComponent],
    providers: [PluginNavService],
    template: `
        <div class="plugin-container">
            @if (nav.currentView() === 'settings') {
                <plugin-settings />
            } @else {
                <plugin-dashboard />
            }
        </div>
    `,
    styles: [
        `
            .plugin-container {
                padding: 1rem;
                height: 100%;
            }
        `,
    ],
})
export class RemoteEntryComponent {
    protected nav = inject(PluginNavService);
}
