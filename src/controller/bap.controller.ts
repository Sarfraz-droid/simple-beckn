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

    providers.forEach((provider: any) => {
        client.set(`BPP:${bppDescriptor.bpp_id}:${provider.id}`, JSON.stringify(provider));
    })

    res.send({
        message: {
            ACK: {
                status: 'OK',
            }
        }
    });
}

export const select = async (req: Request, res: Response) => {
    try {
        console.log(`Select: ${JSON.stringify(req.body)}`);
        const context = await contextBuilder({
            action: 'select',
            targetId: req.body.bpp_id,
            targetUri: req.body.bpp_uri,
            messageId: req.body.message_id || crypto.randomBytes(16).toString("hex"),
            transactionId: req.body.transaction_id || crypto.randomBytes(16).toString("hex"),
        })

        console.log(`Context: ${JSON.stringify(context)}`);

        const message = {
            order: req.body.order,
        };

        const body = {
            context,
            message
        }

        const header = await createAuthorizationHeader(body);

        console.log(`Header:  ${header}`);

        const url = `${context.bpp_uri}/${context.action}`;

        console.log(`url: ${url}`);

        console.log(`Body: ${JSON.stringify(body)}`);

        await axios.post(url, body, {
            headers: {
                Authorization: `Bearer ${header}`,
            }
        });

        setTimeout(async () => {
            console.log(`Get data from redis: SELECT:TRANSACTION:${context.transaction_id}`)
            const data = await client.get(`SELECT:TRANSACTION:${context.transaction_id}`);

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
    } catch (error) {
        console.error(error);
    }
}

export const onSelect = async (req: Request, res: Response) => {
    const context = req.body.context;

    const message = req.body.message;

    const order = message.order;

    const data = {
        bpp: {
            bpp_id: context.bpp_id,
            bpp_uri: context.bpp_uri,
        },
        order: order,
    }
    await client.set(`SELECT:TRANSACTION:${context.transaction_id}`, JSON.stringify(data));
    client.expire(`SELECT:TRANSACTION:${context.transaction_id}`, 10);

    res.send({
        message: {
            ACK: {
                status: 'OK',
            }
        }
    });
}
