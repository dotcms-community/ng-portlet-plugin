import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Shell component for the remote module.
 * This wraps the plugin's feature components.
 */
@Component({
    selector: 'plugin-remote-entry',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div class="plugin-container">
            <router-outlet></router-outlet>
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
export class RemoteEntryComponent {}
