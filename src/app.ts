import 'dotenv/config'

import express from 'express';
import { config } from './config';
import morgan from 'morgan'
import { Routes } from './routes';
export class App {
    public app: express.Application;
    constructor() {
        this.app = express();
    }

    public async main() {
        this.middleware();
        this.app.get('/', (req, res) => {
            res.send('Hello World!');
        });

        Routes.getRoutes(this.app);

        this.listen();
    }

    public middleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morgan('dev'));
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