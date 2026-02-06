/**
 * Remote entry point for Module Federation.
 *
 * Exports a `mount` function instead of Angular routes because the host
 * and remote have separate Angular runtimes. The mount function bootstraps
 * the remote's own Angular app inside a host-provided DOM element.
 *
 * Internal view switching (e.g. dashboard ↔ settings) uses PluginNavService
 * signals rather than Angular Router, since the remote's router would
 * conflict with the host application's URL-based routing.
 */
export async function mount(
    hostElement: HTMLElement
): Promise<() => void> {
    const { createApplication } = await import('@angular/platform-browser');
    const { provideHttpClient } = await import('@angular/common/http');
    const { provideAnimationsAsync } = await import(
        '@angular/platform-browser/animations/async'
    );
    const { providePrimeNG } = await import('primeng/config');
    const Aura = (await import('@primeng/themes/aura')).default;
    const { RemoteEntryComponent } = await import('./entry.component');

    const app = await createApplication({
        providers: [
            provideHttpClient(),
            provideAnimationsAsync(),
            providePrimeNG({
                theme: {
                    preset: Aura,
                },
            }),
        ],
    });

    // Create the root element matching the shell component's selector
    const rootEl = document.createElement('plugin-remote-entry');
    hostElement.appendChild(rootEl);

    // Bootstrap the shell component which manages view switching internally
    app.bootstrap(RemoteEntryComponent, rootEl);

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
