import { ModuleFederationConfig } from '@nx/webpack';

/**
 * Module Federation configuration for the custom dotCMS portlet plugin.
 * This exposes the plugin's routes to be loaded by the dotCMS host application.
 */
const config: ModuleFederationConfig = {
    name: 'custom_portlet',
    exposes: {
        './Routes': './src/app/remote-entry/entry.routes.ts',
    },
    shared: (libraryName, sharedConfig) => {
        // Share Angular core libraries as singletons
        if (libraryName.startsWith('@angular/')) {
            return {
                ...sharedConfig,
                singleton: true,
                strictVersion: false,
                requiredVersion: 'auto',
            };
        }

        // Share RxJS
        if (libraryName === 'rxjs') {
            return {
                ...sharedConfig,
                singleton: true,
                strictVersion: false,
            };
        }

        return sharedConfig;
    },
};

export default config;
