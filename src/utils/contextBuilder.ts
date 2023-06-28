import { config, mode } from "@/config";


export const contextBuilder = async ({ transactionId, messageId, action, targetId, targetUri }: {
    transactionId: string,
    messageId: string,
    action: string,
    targetId: string,
    targetUri: string,
}) => {
    let context = {};
    if (mode == 'bap')
        context = {
            domain: config.domain,
            action,
            bap_id: config.app.id,
            bap_uri: config.app.uri,
            bpp_id: targetId,
            bpp_uri: targetUri,
            timestamp: new Date(),
            ttl: config.app.ttl,
            version: '1.0.0',
            message_id: messageId,
            transaction_id: transactionId,
        };
    else {
        context = {
            domain: config.domain,
            action,
            bpp_id: config.app.id,
            bpp_uri: config.app.uri,
            bap_id: targetId,
            bap_uri: targetUri,
            timestamp: new Date(),
            ttl: config.app.ttl,
            version: '1.0.0',
            message_id: messageId,
            transaction_id: transactionId,
        };
    }

    const filteredContext = Object.fromEntries(Object.entries(context).filter(entry => entry[1] !== undefined));
    return filteredContext;
};
