import { Configuration, container } from 'webpack';

const { ModuleFederationPlugin } = container;

/**
 * Custom webpack configuration for Module Federation.
 * Exported as a function to receive and modify Angular's webpack config directly.
 */
export default (config: Configuration): Configuration => {
    // Ensure output settings are compatible with MF
    config.output = config.output || {};
    config.output.uniqueName = 'ng_portlet';
    config.output.publicPath = 'auto';
    config.output.scriptType = 'text/javascript' as const;

    // Disable ESM output if enabled by Angular
    if (config.experiments) {
        config.experiments.outputModule = false;
    }

    // CRITICAL: Inline the webpack runtime into all entry points.
    // Angular extracts the runtime to a separate runtime.js, but MF's
    // remoteEntry.js MUST contain its own runtime to be self-contained
    // when loaded on a different host page.
    config.optimization = config.optimization || {};
    config.optimization.runtimeChunk = false;

    // Add Module Federation plugin
    config.plugins = config.plugins || [];
    config.plugins.push(
        new ModuleFederationPlugin({
            name: 'ng_portlet',
            library: { type: 'window', name: 'ng_portlet' },
            filename: 'remoteEntry.js',
            exposes: {
                './Routes': './src/app/remote-entry/entry.routes.ts',
            },
            shared: {
                '@angular/core': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
                '@angular/common': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
                '@angular/common/http': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
                '@angular/router': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
                '@angular/forms': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
                '@angular/platform-browser': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
                '@angular/animations': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
                rxjs: { singleton: true, strictVersion: false, requiredVersion: 'auto' },
            },
        })
    );

    return config;
};
