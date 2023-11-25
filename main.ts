import modulealias from 'module-alias';
import path from 'path';

modulealias.addAliases({
    '@': path.join(__dirname, 'src'),
})

import { App } from '@/app';
import { connectRedis } from "@/db"

const app = new App();


(async () => {
    await connectRedis();
    await app.main();
})()