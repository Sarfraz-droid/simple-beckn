import { Response, Request } from "express";
import { contextBuilder } from "@/utils/contextBuilder";
import crypto from "crypto";
import { createAuthorizationHeader } from "@/utils/auth";
import { config } from "@/config";
import axios from "axios";
import { client } from "@/db";
import { BECKN_ACTION, BECKN_STATUS } from "@/utils/constant";
import path from "path";
import { subscriberLookup } from "@/services/beckn.service";

export const EVENT =
    ({ action }: { action: string }) =>
    async (req: Request, res: Response) => {
        try {


            let paths = [];
            if (req.body.bpp_id == undefined) {
                paths = await subscriberLookup();
            } else {
                paths = [{
                    subscriber_url: req.body.bpp_uri,
                    status: BECKN_STATUS.SUBSCRIBED,
                    subscriber_id: req.body.bpp_id
                }];
            }

            const transaction_id = req.body.transaction_id || crypto.randomBytes(16).toString("hex");
            

            await Promise.all(
                paths.map(async (_path: any) => {
                    try {
                        if(_path.status != BECKN_STATUS.SUBSCRIBED) return;
                        
                        const _context = await contextBuilder({
                            action: action,
                            targetId: _path.subscriber_id,
                            targetUri: _path.subscriber_url,
                            messageId: crypto.randomBytes(16).toString("hex"),
                            transactionId: transaction_id,
                        });
                        
                        const _body = {
                            context: _context,
                            message: req.body.message,
                        };
                        
                        const header = await createAuthorizationHeader(_body);
                        
                        
                        const url = path.join(_path.subscriber_url, action);
                        console.log(`Calling ${url}`);
                        
                        const cancelToken = axios.CancelToken.source(); 

                        setTimeout(() => {
                            cancelToken.cancel();
                        }, 3000);

                        await axios.post(url, _body, {
                            headers: {
                                Authorization: `Bearer ${header}`,
                            },
                            cancelToken: cancelToken.token
                        });

                        console.log(`Called ${_path.subscriber_url}`);
                    } catch (error) {
                        // console.log(error);
                    }
                })
            );

            console.log(`Transaction id: ${transaction_id}`);

            console.log(`Waiting for data from redis: ${transaction_id}`)

            setTimeout(async () => {
                try {
                    console.log(
                        `Get data from redis: ${transaction_id}`
                    );

                    const key = `${action}:TRANSACTION:${transaction_id}`;

                    const data = await client.get(key);

                    await client.del(key);

                    if (data == null) {
                        res.send({
                            data: [],
                        });
                        return;
                    }

                    res.send({
                        data: JSON.parse(data || "{}"),
                    });
                } catch (error) {
                    console.log(error);
                    res.send({
                        data: [],
                    });
                }
            }, 8000);
        } catch (error) {
            console.log(error);
            res.send({
                data: [],
            });
        }
    };

export const ON_EVENT =
    ({ type }: { type: string }) =>
    async (req: Request, res: Response) => {
        try {
            // console.log(req.body);
            const context = req.body.context;

            // console.log(context);
            const key = `${type}:TRANSACTION:${context.transaction_id}`;
            console.log(`Saving data to redis: ${key}`);
            const data = await client.get(key);

            if (data != null) {
                const parsedData = JSON.parse(data);

                parsedData.push(req.body);

                await client.set(key, JSON.stringify(parsedData), {
                    EX: 60*60*2
                });
            } else {
                await client.set(key, JSON.stringify([req.body]),  {
                    EX: 60*60*2
                });
            }

            res.send({
                message: {
                    ACK: {
                        status: "OK",
                    },
                },
            });
        } catch (error) {
            console.log(error);
            res.send({
                message: {
                    ACK: {
                        status: "ERROR",
                    },
                },
            });
        }
    };
