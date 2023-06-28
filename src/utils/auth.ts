import { config } from '@/config';
import _sodium, { base64_variants } from 'libsodium-wrappers';

const createSigningString = async (message: string, created?: string | undefined, expires?: string | undefined) => {
    if (!created) created = Math.floor(new Date().getTime() / 1000 - 1 * 60).toString();
    if (!expires) expires = (parseInt(created) + 1 * 60 * 60).toString();
    await _sodium.ready;
    const sodium = _sodium;
    const digest = sodium.crypto_generichash(64, sodium.from_string(message));
    const digest_base64 = sodium.to_base64(digest, base64_variants.ORIGINAL);
    const signingString = `(created): ${created}
(expires): ${expires}
digest: BLAKE-512=${digest_base64}`;
    return { signingString, expires, created };
};

const signMessage = async (signingString: string, privateKey: string) => {
    await _sodium.ready;
    const sodium = _sodium;
    const signedMessage = sodium.crypto_sign_detached(signingString, sodium.from_base64(privateKey, base64_variants.ORIGINAL));
    return sodium.to_base64(signedMessage, base64_variants.ORIGINAL);
};

const createAuthorizationHeader = async (message: any) => {
    const { signingString, expires, created } = await createSigningString(JSON.stringify(message));
    const signature = await signMessage(signingString, config.app.private_key || '');
    const subscriberId = config.app.id;
    const header = `Signature keyId="${subscriberId}|${config.app.unique_id}|ed25519",algorithm="ed25519",created="${created}",expires="${expires}",headers="(created) (expires) digest",signature="${signature}"`;
    return header;
};

export { createAuthorizationHeader };
