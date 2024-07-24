// bootstrap.mjs
import { pathToFileURL } from 'url';
import { register } from 'ts-node';

// Global error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

register({
  project: './tsconfig.json',
  transpileOnly: true,
  experimentalResolver: true
});

import(pathToFileURL('./server.ts').href);
