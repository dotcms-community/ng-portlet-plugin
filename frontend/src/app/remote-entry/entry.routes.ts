/**
 * Remote entry point for Module Federation.
 *
 * Exports a `mount` function instead of Angular routes because the host
 * and remote have separate Angular runtimes. The mount function bootstraps
 * the remote's own Angular app inside a host-provided DOM element.
 */
export async function mount(
    hostElement: HTMLElement
): Promise<() => void> {
    const { createApplication } = await import('@angular/platform-browser');
    const { provideHttpClient } = await import('@angular/common/http');
    const { DashboardComponent } = await import(
        '../features/dashboard/dashboard.component'
    );

    const app = await createApplication({
        providers: [provideHttpClient()],
    });

    // Create the root element matching the component's selector
    const rootEl = document.createElement('plugin-dashboard');
    hostElement.appendChild(rootEl);

    // Bootstrap the component into the element
    app.bootstrap(DashboardComponent, rootEl);

    // Return cleanup function
    return () => {
        app.destroy();

        if (hostElement.contains(rootEl)) {
            hostElement.removeChild(rootEl);
        }
    };
}

// Default export for Module Federation
export default { mount };
