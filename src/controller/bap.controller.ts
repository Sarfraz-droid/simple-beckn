import { Response, Request } from "express";
import { contextBuilder } from "@/utils/contextBuilder"
import crypto from "crypto"
import { createAuthorizationHeader } from "@/utils/auth";
import { config } from "@/config";
import axios from 'axios'
import { client } from "@/db";

export const EVENT = ({
    action,
}: {
    action: string
}) => async (req: Request, res: Response) => {

    try {
        const context = await contextBuilder({
            action: action,
            targetId: req.body.bpp_id,
            targetUri: req.body.bpp_uri,
            messageId: crypto.randomBytes(16).toString("hex"),
            transactionId: req.body.transaction_id || crypto.randomBytes(16).toString("hex"),
        });


        const body = {
            context,
            message: req.body.message
        };

        const header = await createAuthorizationHeader(body);

        console.log(`Header:  ${header}`);

        const url = `${context.bpp_uri != undefined ? context.bpp_uri : config.gateway.uri}/${context.action}`;

        console.log(`url: ${url}`);

        console.log(`Body: ${JSON.stringify(body)}`);

        await axios.post(url, body, {
            headers: {
                'Authorization': `Bearer ${header}`,
            }
        }).then((response) =>{
            console.log(response.data)
        })

        setTimeout(async () => {
            try {
                console.log(`Get data from redis: ${context.transaction_id}`)
                const data = await client.get(`${action}:TRANSACTION:${context.transaction_id}`);

                if (data == null) {
                    res.send({
                        data: []
                    })
                    return;
                }

                res.send({
                    data: JSON.parse(data || '{}')
                });
            } catch (error) {   
                console.log(error)
                res.send({
                    data: []
                })
            }
        }, 8000);

    } catch (error) {
        console.log(error)
        res.send({
            data: []
        })
    }


}

export const ON_EVENT = ({
    type
}: {
    type: string
}) => async (req: Request, res: Response) => {

    try {
        console.log(req.body)
        const context = req.body.context;

        console.log(context)

        await client.set(`${type}:TRANSACTION:${context.transaction_id}`, JSON.stringify(req.body), );
        client.expireAt(`${type}:TRANSACTION:${context.transaction_id}`, Math.floor(Date.now() / 1000) + 60 * 2);

        res.send({
            message: {
                ACK: {
                    status: 'OK',
                }
            }
        });
    } catch (error) {
        console.log(error)
        res.send({
            message: {
                ACK: {
                    status: 'ERROR',
                }
            }
        });
    }
}