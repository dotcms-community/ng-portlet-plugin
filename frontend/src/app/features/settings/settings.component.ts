import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Button } from 'primeng/button';

@Component({
    selector: 'plugin-settings',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        Card,
        InputText,
        ToggleSwitch,
        Button,
    ],
    template: `
        <div class="settings">
            <div class="header">
                <a routerLink="../">
                    <p-button icon="pi pi-arrow-left" label="Back to Dashboard" [text]="true" />
                </a>
                <h1>Plugin Settings</h1>
            </div>

            <p-card>
                <form (ngSubmit)="saveSettings()">
                    <div class="form-field">
                        <label for="apiKey">API Key</label>
                        <input
                            id="apiKey"
                            type="text"
                            pInputText
                            [(ngModel)]="settings.apiKey"
                            name="apiKey"
                            placeholder="Enter your API key"
                            class="w-full"
                        />
                    </div>

                    <div class="form-field toggle-field">
                        <label for="enabled">Enable Plugin</label>
                        <p-toggleSwitch
                            [(ngModel)]="settings.enabled"
                            name="enabled"
                            inputId="enabled"
                        />
                    </div>

                    <p-button
                        type="submit"
                        icon="pi pi-save"
                        label="Save Settings"
                    />
                </form>
            </p-card>
        </div>
    `,
    styles: [
        `
            .settings {
                max-width: 600px;
            }

            .header {
                margin-bottom: 1.5rem;
            }

            .header a {
                text-decoration: none;
                display: inline-block;
                margin-bottom: 0.5rem;
            }

            h1 {
                margin: 0;
                color: #1e293b;
                font-size: 1.5rem;
            }

            .form-field {
                margin-bottom: 1.5rem;
            }

            .form-field label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
                color: #334155;
            }

            .w-full {
                width: 100%;
            }

            .toggle-field {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .toggle-field label {
                margin-bottom: 0;
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
