import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

/**
 * Example dashboard component for the plugin.
 * Demonstrates fetching data from dotCMS APIs.
 */
@Component({
    selector: 'plugin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="dashboard">
            <h1>Custom Portlet Dashboard</h1>

            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Content Items</h3>
                    <p class="stat-value">{{ contentCount }}</p>
                </div>

                <div class="stat-card">
                    <h3>Status</h3>
                    <p class="stat-value status-active">Active</p>
                </div>
            </div>

            <div class="actions">
                <button (click)="refreshData()">Refresh Data</button>
                <a routerLink="settings" class="settings-link">Settings</a>
            </div>
        </div>
    `,
    styles: [
        `
            .dashboard {
                max-width: 1200px;
                margin: 0 auto;
            }

            h1 {
                color: #333;
                margin-bottom: 2rem;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .stat-card {
                background: #fff;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 1.5rem;
                text-align: center;
            }

            .stat-card h3 {
                color: #666;
                font-size: 0.875rem;
                margin-bottom: 0.5rem;
            }

            .stat-value {
                font-size: 2rem;
                font-weight: bold;
                color: #333;
            }

            .status-active {
                color: #4caf50;
            }

            .actions {
                display: flex;
                gap: 1rem;
                align-items: center;
            }

            .actions button {
                background: #6366f1;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 4px;
                cursor: pointer;
            }

            .actions button:hover {
                background: #4f46e5;
            }

            .settings-link {
                color: #6366f1;
                text-decoration: none;
            }

            .settings-link:hover {
                text-decoration: underline;
            }
        `,
    ],
})
export class DashboardComponent implements OnInit {
    private http = inject(HttpClient);

    contentCount = 0;

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        // Example: Call dotCMS API to get content count
        // The host app's HttpClient interceptors will handle auth
        this.http
            .get<{ entity: { totalResults: number } }>('/api/v1/content/_search', {
                params: { limit: '0' },
            })
            .subscribe({
                next: (response) => {
                    this.contentCount = response.entity?.totalResults ?? 0;
                },
                error: (err) => {
                    console.error('Failed to load content count:', err);
                },
            });
    }

    refreshData(): void {
        this.loadData();
    }
}
