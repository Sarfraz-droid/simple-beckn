import 'dotenv/config'

import express from 'express';
import { config } from './config';
import morgan from 'morgan'
import { Routes } from './routes';
import { router as utilRouter, utilRoutes } from "./routes/util.route"
import fs from 'fs'
import { logger } from './logger';
export class App {
    public app: express.Application;
    constructor() {
        this.app = express();
    }

    public async main() {
        this.middleware();

        this.app.use(utilRouter)

        Routes.getRoutes(this.app);

        this.listen();
    }

    public middleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        const blacklistedRoutes = [...Object.values(utilRoutes), '/favicon.ico']
        this.app.use((req, res, next) => {
            if (blacklistedRoutes.includes(req.originalUrl)) {
                return next();
            }
            const start = Date.now();

            res.on('finish', () => {
                const end = Date.now();
                const diff = end - start;
                console.log(`[${req.method}] ${req.originalUrl} ${res.statusCode} ${diff}ms`)
                logger.info(`[${req.method}] ${req.originalUrl} ${res.statusCode} ${diff}ms`)

            });
            next()        
        });
        this.app.set('view engine', 'ejs');

    }

    public async listen() {
        // const tunnel = await localtunnel({ port: config.port, subdomain: config.local_tunnel_subdomain });

        // console.log(`tunnel url: ${tunnel.url}`)
        // tunnel.on('error', err => {
        //     console.log(err);
        // })

        // tunnel.on('close', () => {
        //     console.log('tunnel closed');
        // })

        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        })
    }



}