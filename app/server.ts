import express from 'express';
import { createRequestHandler } from '@remix-run/express';
import dotenv from 'dotenv';
import { setupDb } from '../app/setupDb.js';
import { authorize } from '../app/config/setup.js';
import { staffStudentDataLayer } from '../app/data/initializedatalayer.server.js';
import * as build from '../build/index.js'; // Ensure this points to the correct build output
import { ServerBuild } from './types.js';

dotenv.config();

console.log("Starting server setup...");


console.log('Build object:', build);

const extendedBuild: ServerBuild = {
  ...build,
  assets: {
    ...build.assets,
    entry: {
      ...build.assets.entry,
      default: (build.assets.entry as any).default || function() {},
      imports: build.assets.entry.imports || []
    },
    routes: {
      ...build.assets.routes,
      ...Object.keys(build.assets.routes).reduce((acc, key) => {
        acc[key] = {
          ...build.assets.routes[key],
          id: build.assets.routes[key].id,
          module: build.assets.routes[key].module,
          imports: build.assets.routes[key].imports || [],
          hasLoader: build.assets.routes[key].hasLoader || false,
          hasAction: build.assets.routes[key].hasAction || false,
          hasCatchBoundary: build.assets.routes[key].hasCatchBoundary || false,
          hasErrorBoundary: build.assets.routes[key].hasErrorBoundary || false,
        };
        return acc;
      }, {} as any)
    }
  },
  mode: build.mode || 'development',
  entry: build.entry || 'entryPath',
  routes: build.routes || 'routesPath',
  publicPath: build.publicPath || 'publicPath',
  assetsBuildDirectory: build.assetsBuildDirectory || 'buildDirectory',
  future: build.future || {}, // Provide more specific future properties if available
};

const app = express();
app.use(express.static('public'));

setupDb()
  .then(() => {
    console.log('Database setup complete');
    return authorize();
  })
  .then(() => {
    console.log('Google API authorization complete');

    app.all(
      '*',
      createRequestHandler({
        build: extendedBuild,
        getLoadContext() {
          return { staffStudentDataLayer };
        },
      }),
    );

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during setup:', err);
    process.exit(1);
  });

console.log("Server setup initiated...");
