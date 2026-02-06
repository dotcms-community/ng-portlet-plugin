import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Card } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { forkJoin } from 'rxjs';

interface ContentItem {
    title: string;
    contentType: string;
    modDate: string;
    live: boolean;
    working: boolean;
    archived: boolean;
    identifier: string;
}

interface ContentSearchResponse {
    entity: {
        jsonObjectView: {
            contentlets: ContentItem[];
        };
        resultsSize: number;
    };
}

@Component({
    selector: 'plugin-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        Card,
        ChartModule,
        TableModule,
        Tag,
        Button,
        ProgressSpinner,
    ],
    template: `
        <div class="dashboard">
            <div class="dashboard-header">
                <h1>Content Dashboard</h1>
                <div class="header-actions">
                    <p-button
                        icon="pi pi-refresh"
                        label="Refresh"
                        [outlined]="true"
                        (onClick)="refreshData()"
                        [loading]="loading"
                    />
                    <a routerLink="settings" class="settings-link">
                        <p-button icon="pi pi-cog" label="Settings" severity="secondary" [outlined]="true" />
                    </a>
                </div>
            </div>

            @if (loading && !contentItems.length) {
                <div class="loading-container">
                    <p-progressSpinner strokeWidth="4" />
                </div>
            } @else {
                <!-- Summary Cards -->
                <div class="stats-grid">
                    <p-card>
                        <div class="stat-content">
                            <i class="pi pi-file stat-icon" style="color: #6366f1"></i>
                            <div>
                                <span class="stat-label">Total Content</span>
                                <span class="stat-value">{{ totalContent }}</span>
                            </div>
                        </div>
                    </p-card>

                    <p-card>
                        <div class="stat-content">
                            <i class="pi pi-check-circle stat-icon" style="color: #22c55e"></i>
                            <div>
                                <span class="stat-label">Published</span>
                                <span class="stat-value">{{ publishedCount }}</span>
                            </div>
                        </div>
                    </p-card>

                    <p-card>
                        <div class="stat-content">
                            <i class="pi pi-pencil stat-icon" style="color: #f59e0b"></i>
                            <div>
                                <span class="stat-label">Working / Draft</span>
                                <span class="stat-value">{{ draftCount }}</span>
                            </div>
                        </div>
                    </p-card>

                    <p-card>
                        <div class="stat-content">
                            <i class="pi pi-inbox stat-icon" style="color: #ef4444"></i>
                            <div>
                                <span class="stat-label">Archived</span>
                                <span class="stat-value">{{ archivedCount }}</span>
                            </div>
                        </div>
                    </p-card>
                </div>

                <!-- Charts Row -->
                <div class="charts-grid">
                    <p-card header="Content by Type">
                        <p-chart type="bar" [data]="contentByTypeData" [options]="barOptions" />
                    </p-card>

                    <p-card header="Content by Status">
                        <p-chart type="doughnut" [data]="contentByStatusData" [options]="doughnutOptions" />
                    </p-card>
                </div>

                <!-- Recent Content Table -->
                <p-card header="Recent Content">
                    <p-table
                        [value]="contentItems"
                        [paginator]="true"
                        [rows]="10"
                        [rowsPerPageOptions]="[5, 10, 25]"
                        [showCurrentPageReport]="true"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
                        [tableStyle]="{ 'min-width': '50rem' }"
                    >
                        <ng-template #header>
                            <tr>
                                <th pSortableColumn="title">
                                    Title <p-sortIcon field="title" />
                                </th>
                                <th pSortableColumn="contentType">
                                    Content Type <p-sortIcon field="contentType" />
                                </th>
                                <th pSortableColumn="modDate">
                                    Modified <p-sortIcon field="modDate" />
                                </th>
                                <th>Status</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-item>
                            <tr>
                                <td>{{ item.title }}</td>
                                <td>{{ item.contentType }}</td>
                                <td>{{ item.modDate | date: 'medium' }}</td>
                                <td>
                                    <p-tag
                                        [value]="getStatus(item)"
                                        [severity]="getStatusSeverity(item)"
                                    />
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template #emptymessage>
                            <tr>
                                <td colspan="4" class="empty-message">No content items found.</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            }
        </div>
    `,
    styles: [
        `
            .dashboard {
                max-width: 1400px;
                margin: 0 auto;
            }

            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }

            .dashboard-header h1 {
                margin: 0;
                color: #1e293b;
                font-size: 1.5rem;
            }

            .header-actions {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }

            .settings-link {
                text-decoration: none;
            }

            .loading-container {
                display: flex;
                justify-content: center;
                padding: 4rem 0;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            .stat-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .stat-icon {
                font-size: 2rem;
            }

            .stat-label {
                display: block;
                font-size: 0.85rem;
                color: #64748b;
            }

            .stat-value {
                display: block;
                font-size: 1.75rem;
                font-weight: 700;
                color: #1e293b;
            }

            .charts-grid {
                display: grid;
                grid-template-columns: 3fr 2fr;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            .empty-message {
                text-align: center;
                padding: 2rem;
                color: #64748b;
            }

            @media (max-width: 1024px) {
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }

                .charts-grid {
                    grid-template-columns: 1fr;
                }
            }

            @media (max-width: 640px) {
                .stats-grid {
                    grid-template-columns: 1fr;
                }

                .dashboard-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                }
            }
        `,
    ],
})
export class DashboardComponent implements OnInit {
    private http = inject(HttpClient);

    loading = true;
    totalContent = 0;
    publishedCount = 0;
    draftCount = 0;
    archivedCount = 0;

    contentItems: ContentItem[] = [];

    contentByTypeData: unknown = {};
    contentByStatusData: unknown = {};

    barOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { precision: 0 },
            },
        },
    };

    doughnutOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: 'bottom' as const },
        },
    };

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;

        // Fetch recent content items
        const recentContent$ = this.http.post<ContentSearchResponse>(
            '/api/content/_search',
            {
                query: '+contentType:*',
                limit: 50,
                sort: 'modDate desc',
            }
        );

        recentContent$.subscribe({
            next: (response) => {
                const contentlets = response.entity?.jsonObjectView?.contentlets ?? [];
                this.contentItems = contentlets;
                this.totalContent = response.entity?.resultsSize ?? contentlets.length;
                this.computeStats(contentlets);
                this.buildCharts(contentlets);
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load content:', err);
                this.loading = false;
            },
        });
    }

    refreshData(): void {
        this.loadData();
    }

    getStatus(item: ContentItem): string {
        if (item.archived) return 'Archived';
        if (item.live) return 'Published';
        return 'Draft';
    }

    getStatusSeverity(item: ContentItem): 'success' | 'warn' | 'danger' | 'info' {
        if (item.archived) return 'danger';
        if (item.live) return 'success';
        return 'warn';
    }

    private computeStats(items: ContentItem[]): void {
        this.publishedCount = items.filter((i) => i.live && !i.archived).length;
        this.draftCount = items.filter((i) => !i.live && !i.archived).length;
        this.archivedCount = items.filter((i) => i.archived).length;
    }

    private buildCharts(items: ContentItem[]): void {
        // Content by type
        const typeCounts = new Map<string, number>();
        items.forEach((item) => {
            const ct = item.contentType || 'Unknown';
            typeCounts.set(ct, (typeCounts.get(ct) ?? 0) + 1);
        });

        const sortedTypes = [...typeCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        this.contentByTypeData = {
            labels: sortedTypes.map(([name]) => name),
            datasets: [
                {
                    label: 'Content Items',
                    data: sortedTypes.map(([, count]) => count),
                    backgroundColor: '#6366f1',
                    borderRadius: 4,
                },
            ],
        };

        // Content by status
        this.contentByStatusData = {
            labels: ['Published', 'Draft', 'Archived'],
            datasets: [
                {
                    data: [this.publishedCount, this.draftCount, this.archivedCount],
                    backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
                },
            ],
        };
    }
}
