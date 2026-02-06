# dotCMS Angular Portlet Plugin

A dotCMS OSGi plugin that delivers a custom Angular portlet using Webpack Module Federation. The plugin bundles an Angular frontend as a federated remote module, deploys it into dotCMS at runtime, and registers a portlet that loads the Angular app inside the dotCMS admin backend.

## How It Works

1. **Build** -- Maven builds the Angular frontend (via `frontend-maven-plugin`) and packages it alongside the Java OSGi activator into a single bundle JAR.
2. **Deploy** -- When the bundle starts, the `Activator` copies the frontend dist files from inside the JAR to `dotAdmin/plugins/ng-portlet/` and registers the portlet defined in `conf/portlet.xml`.
3. **Load** -- dotCMS loads `remoteEntry.js` via Module Federation, calls the exposed `mount()` function, and bootstraps the Angular app inside the portlet iframe.
4. **Undeploy** -- When the bundle stops, the activator unregisters the portlet and deletes the deployed frontend files.

## Project Structure

```
.
├── pom.xml                          # Maven build (OSGi bundle + frontend build)
├── src/
│   └── main/
│       ├── java/com/dotcms/ngportlet/
│       │   ├── Activator.java       # OSGi activator -- registers portlet & deploys files
│       │   └── FileMoverUtil.java   # Copies frontend assets from JAR to dotCMS filesystem
│       └── resources/conf/
│           └── portlet.xml          # Portlet descriptor (name, Module Federation config)
└── frontend/                        # Angular application (Nx workspace)
    ├── package.json
    ├── webpack.config.ts            # Webpack Module Federation setup
    ├── module-federation.config.ts
    ├── project.json                 # Nx project config (build, serve, test, lint)
    └── src/app/
        ├── remote-entry/
        │   ├── entry.routes.ts      # mount() function exposed via Module Federation
        │   └── entry.component.ts   # Shell component with router-outlet
        └── features/
            ├── dashboard/           # Dashboard feature component
            └── settings/            # Settings feature component
```

## Prerequisites

- **Java 21+**
- **Maven 3.6+**
- **Node.js 22+** (automatically installed by `frontend-maven-plugin` if not present)
- **A running dotCMS instance** (v26.01+)

## Build

```bash
mvn clean install
```

This will:
1. Install Node.js and npm (via `frontend-maven-plugin`)
2. Run `npm install` in the `frontend/` directory
3. Build the Angular app for production (`npm run build:prod`)
4. Copy the frontend dist into the bundle
5. Package the OSGi bundle JAR at `target/dotcms-ngportlet-0.2.jar`

## Deploy

Upload the generated JAR via the dotCMS **Dynamic Plugins** admin screen, or copy it to the `felix/load` directory of your dotCMS instance.

## Frontend Development

For live development with hot-reload against a running dotCMS instance:

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

This starts a dev server on `https://localhost:4201` with CORS headers enabled. To point the portlet at the dev server, update `portlet.xml`:

```xml
<value>remote:https://localhost:4201/remoteEntry.js|ng_portlet|./Routes</value>
```

When you're done developing, switch back to the production value:

```xml
<value>remote:/dotAdmin/plugins/ng-portlet/remoteEntry.js|ng_portlet|./Routes</value>
```

## Customization

### Renaming the portlet

1. Update `portlet-name` and the `angular-module` path in `src/main/resources/conf/portlet.xml`
2. Update the language key in `Activator.java`
3. Update `destDirectoryInWar` in `FileMoverUtil.java`
4. Update `output.uniqueName` and the MF `name` in `frontend/webpack.config.ts`

### Adding new feature components

1. Create a new component under `frontend/src/app/features/`
2. Wire it into the entry routes or mount logic in `frontend/src/app/remote-entry/entry.routes.ts`

## Module Federation Details

The Angular app is built as a Module Federation **remote** with the following configuration:

| Setting | Value |
|---|---|
| Remote name | `ng_portlet` |
| Library type | `window` |
| Entry file | `remoteEntry.js` |
| Exposed module | `./Routes` |

Angular core libraries and RxJS are configured as shared singletons so they are not duplicated between the dotCMS host and this remote plugin.
