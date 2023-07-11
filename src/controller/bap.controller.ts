import { Response, Request } from "express";
import { contextBuilder } from "@/utils/contextBuilder"
import crypto from "crypto"
import { SearchRequestDto } from "@/dto/bap/SearchRequestDto";
import { createAuthorizationHeader } from "@/utils/auth";
import { config } from "@/config";
import axios from 'axios'
import { client } from "@/db";

export const EVENT = ({
    action,
}: {
    action: string
}) => async (req: Request, res: Response) => {
    const context = await contextBuilder({
        action: action,
        targetId: req.body.bpp_id,
        targetUri: req.body.bpp_uri,
        messageId: crypto.randomBytes(16).toString("hex"),
        transactionId: crypto.randomBytes(16).toString("hex"),
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

    axios.post(url, body, {
        headers: {
            'Authorization': `Bearer ${header}`,
        }
    })

    setTimeout(async () => {
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
    }, 3000);


}

export const ON_EVENT = ({
    type
}: {
    type: string
}) => async (req: Request, res: Response) => {
    const context = req.body.context;

    await client.set(`${type}:TRANSACTION:${context.transaction_id}`, JSON.stringify(req.body));
    client.expire(`${type}:TRANSACTION:${context.transaction_id}`, 10);

    res.send({
        message: {
            ACK: {
                status: 'OK',
            }
        }
    });
}