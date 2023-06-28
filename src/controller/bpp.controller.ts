import { config } from "@/config";
import { createAuthorizationHeader } from "@/utils/auth";
import { contextBuilder } from "@/utils/contextBuilder";
import axios from "axios";
import { Response, Request } from "express";
import fs from 'fs'

export const search = async (req: Request, res: Response) => {
    console.log(req.body);

    const json = fs.readFileSync('src/sample/bpp/response.search.json', 'utf8');

    const data = JSON.parse(json);

    const context = await contextBuilder({
        action: 'on_search',
        messageId: req.body.context.message_id,
        transactionId: req.body.context.transaction_id,
        targetId: req.body.context.bap_id,
        targetUri: req.body.context.bap_uri,
    })

    data.context = {
        ...data.context,
        ...context
    }

    console.log(`Search Data Context : ${JSON.stringify(data.context)}`)

    const url = `${config.gateway.uri}/${data.context.action}`;

    console.log(`url: ${url}`);

    const header = await createAuthorizationHeader(data);

    const result = await axios.post(url, data, {
        headers: {
            'Authorization': `Bearer ${header}`,
        }
    })

    console.log(result.data);

    res.send(result.data);
}