# Custom Angular Portlet Frontend

This is the Angular frontend for the custom dotCMS portlet plugin using Module Federation.

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm start
# Serves at http://localhost:4201
```

### 3. Build for Production

```bash
npm run build
# Output: dist/custom-portlet/
```

## Architecture

```
frontend/
├── src/
│   └── app/
│       ├── remote-entry/           # Module Federation entry point
│       │   ├── entry.component.ts  # Shell component
│       │   └── entry.routes.ts     # Exposed routes
│       └── features/               # Feature components
│           ├── dashboard/
│           │   └── dashboard.component.ts
│           └── settings/
│               └── settings.component.ts
├── module-federation.config.ts     # MF configuration
└── package.json
```

## How It Works

1. **Module Federation** exposes `./Routes` from `entry.routes.ts`
2. **dotCMS host app** loads `remoteEntry.js` at runtime
3. **DynamicRouteService** registers the routes under `/custom-portlet`
4. **Navigation** to `/custom-portlet` loads this remote module

## Configuration

### portlet.xml (Backend)

```xml
<init-param>
    <name>angular-module</name>
    <!-- Development -->
    <value>remote:http://localhost:4201/remoteEntry.js|customPortlet|./Routes</value>

    <!-- Production (deployed to dotCMS) -->
    <!-- <value>remote:/plugins/custom-portlet/remoteEntry.js|customPortlet|./Routes</value> -->
</init-param>
```

### module-federation.config.ts

```typescript
const config: ModuleFederationConfig = {
    name: 'customPortlet',        // Must match the remoteName in portlet.xml
    exposes: {
        './Routes': './src/app/remote-entry/entry.routes.ts',  // Must match exposedModule
    },
};
```

## Development Workflow

1. Start the Angular dev server: `npm start`
2. Deploy the OSGI plugin to dotCMS (backend portlet definition)
3. Navigate to the portlet in dotCMS admin
4. Changes to Angular code hot-reload automatically

## Production Deployment

### Option 1: Deploy to dotCMS Static Folder

```bash
# Build
npm run build

# Copy to dotCMS
cp -r dist/custom-portlet/* /path/to/dotcms/tomcat/webapps/ROOT/plugins/custom-portlet/

# Update portlet.xml to use relative path
# <value>remote:/plugins/custom-portlet/remoteEntry.js|customPortlet|./Routes</value>
```

### Option 2: Deploy to CDN/Separate Server

```bash
# Build
npm run build

# Deploy dist/custom-portlet/* to your CDN

# Update portlet.xml with full URL
# <value>remote:https://cdn.example.com/plugins/custom-portlet/remoteEntry.js|customPortlet|./Routes</value>
```

## Using dotCMS APIs

The Angular components can call dotCMS REST APIs. Authentication is handled by the host app:

```typescript
import { HttpClient } from '@angular/common/http';

@Component({...})
export class MyComponent {
    private http = inject(HttpClient);

    loadData() {
        // Relative URLs work - auth headers are added by host app
        this.http.get('/api/v1/content/_search').subscribe(data => {
            console.log(data);
        });
    }
}
```

## Troubleshooting

### CORS Errors During Development

The dev server needs CORS headers. Add to webpack dev server config:

```typescript
devServer: {
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
}
```

### "Container not found" Error

- Ensure `remoteEntry.js` URL is correct and accessible
- Check that `remoteName` in portlet.xml matches `name` in module-federation.config.ts
- Verify the Angular dev server is running

### Shared Dependency Version Mismatch

Ensure Angular versions match the dotCMS host app (currently Angular 19.x).
