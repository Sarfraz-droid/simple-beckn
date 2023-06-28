import "module-alias/register";
import { App } from '@/app';
import { connectRedis } from "@/db"

const app = new App();


(async () => {
    await connectRedis();
    await app.main();
})()