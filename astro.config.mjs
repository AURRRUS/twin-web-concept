import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({ base: process.env.TWIN_BASE_PATH || '/', integrations: [react()], devToolbar: { enabled: false } });
