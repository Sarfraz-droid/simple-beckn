import { mode } from '@/config';
import express from 'express';
import { router as BPPRouter } from './bpp.route';
import { router as BAPRouter } from './bap.route';


export class Routes {
    public static getRoutes(app: express.Application): void {
        if (mode === 'bap') {
            app.use(BAPRouter);
        } else {
            app.use(BPPRouter);
        }
    }
} 