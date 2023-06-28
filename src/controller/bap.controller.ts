import { Response, Request } from "express";
import { contextBuilder } from "@/utils/contextBuilder"
import crypto from "crypto"
import { SearchRequestDto } from "@/dto/bap/SearchRequestDto";
import { createAuthorizationHeader } from "@/utils/auth";
import { config } from "@/config";
import axios from 'axios'
import { client } from "@/db";

export const search = async (req: Request, res: Response) => {
    const context = await contextBuilder({
        action: 'search',
        targetId: req.body.bpp_id,
        targetUri: req.body.bpp_uri,
        messageId: crypto.randomBytes(16).toString("hex"),
        transactionId: crypto.randomBytes(16).toString("hex"),
    });

    const message = SearchRequestDto({
        name: req.body.name
    });

    const body = {
        context,
        message
    };

    const header = await createAuthorizationHeader(body);

    console.log(`Header:  ${header}`);

    const url = `${config.gateway.uri}/${context.action}`;

    console.log(`url: ${url}`);

    axios.post(url, body, {
        headers: {
            'Authorization': `Bearer ${header}`,
        }
    })

    setTimeout(async () => {
        console.log(`Get data from redis: ${context.transaction_id}`)
        const data = await client.get(`TRANSACTION:${context.transaction_id}`);
        const bppDescriptor = await client.get(`BPP:DESCRIPTOR:${context.transaction_id}`);

        if (data == null || bppDescriptor == null) {
            res.send({
                data: []
            })
        }

        res.send({
            bpp: JSON.parse(bppDescriptor || '{}'),
            data: JSON.parse(data || '{}')
        });
    }, 3000);


}

export const onSearch = async (req: Request, res: Response) => {
    const context = req.body.context;

    const message = req.body.message;

    const providers = message.catalog['bpp/providers'];

    const descriptor = message.catalog['bpp/descriptor'];

    console.log(`On_Search : ${context.transaction_id}`);

    const bppDescriptor = {
        bpp_id: context.bpp_id,
        bpp_uri: context.bpp_uri,
        descriptor: descriptor,
    }

    await client.set(`TRANSACTION:${context.transaction_id}`, JSON.stringify(providers));
    await client.set(`BPP:DESCRIPTOR:${context.transaction_id}`, JSON.stringify(bppDescriptor));
    client.expire(`TRANSACTION:${context.transaction_id}`, 10);
    client.expire(`BPP:DESCRIPTOR:${context.transaction_id}`, 10);

    res.send({
        message: {
            ACK: {
                status: 'OK',
            }
        }
    });
}