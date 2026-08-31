import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },
    // This site doesn't use Astro sessions; point the adapter's default
    // session binding at the same KV namespace so it never needs a second
    // one to be created.
    sessionKVBindingName: 'LEADS'
  }),
});
