import express, { NextFunction, Request, Response } from "express"
import { config } from '../config';
import fs from 'fs'
import serverHealth from 'server-health'
import { client } from "@/db";

export const router = express.Router();

export const utilRoutes = {
    '/' : '/',
    '/logs' : '/logs',
    '/config' : '/config',
    '/health' : '/health'
}

router.get(utilRoutes["/"], (req, res) => {
    const data = {
        config
    }
    res.render('index', {
        data,
    });
})

router.get(utilRoutes["/logs"], (req, res) => {
    const logFile = fs.readFileSync('./combined.log', 'utf-8')
    res.send(logFile)
})

router.get(utilRoutes["/config"], (req, res) => {
    res.send(config)
})

serverHealth.addConnectionCheck('redis',async () => {
    const pong =  await client.ping();

    if(pong === 'PONG') {
        return true;
    }
    return false;
})

serverHealth.exposeHealthEndpoint(router, utilRoutes["/health"]);
