import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * Example settings component for the plugin.
 */
@Component({
    selector: 'plugin-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
        <div class="settings">
            <div class="header">
                <a routerLink="../" class="back-link">&larr; Back to Dashboard</a>
                <h1>Plugin Settings</h1>
            </div>

            <form (ngSubmit)="saveSettings()">
                <div class="form-group">
                    <label for="apiKey">API Key</label>
                    <input
                        id="apiKey"
                        type="text"
                        [(ngModel)]="settings.apiKey"
                        name="apiKey"
                        placeholder="Enter your API key"
                    />
                </div>

                <div class="form-group">
                    <label for="enabled">
                        <input
                            id="enabled"
                            type="checkbox"
                            [(ngModel)]="settings.enabled"
                            name="enabled"
                        />
                        Enable Plugin
                    </label>
                </div>

                <button type="submit">Save Settings</button>
            </form>
        </div>
    `,
    styles: [
        `
            .settings {
                max-width: 600px;
            }

            .header {
                margin-bottom: 2rem;
            }

            .back-link {
                color: #6366f1;
                text-decoration: none;
                display: inline-block;
                margin-bottom: 1rem;
            }

            .back-link:hover {
                text-decoration: underline;
            }

            h1 {
                margin: 0;
            }

            .form-group {
                margin-bottom: 1rem;
            }

            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }

            .form-group input[type='text'] {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            button[type='submit'] {
                background: #6366f1;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 1rem;
            }

            button[type='submit']:hover {
                background: #4f46e5;
            }
        `,
    ],
})
export class SettingsComponent {
    settings = {
        apiKey: '',
        enabled: true,
    };

    saveSettings(): void {
        console.log('Saving settings:', this.settings);
        // Save to backend via API
    }
}
