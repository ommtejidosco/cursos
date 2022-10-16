import * as jose from './node_modules/jose/dist/browser/index.js';

async function generateKeyPair(instance){
    const { publicKey, privateKey } = await jose.generateKeyPair('RS256', { extractable: true });
    localStorage.setItem(instance, await jose.exportPKCS8(privateKey));
    console.log(await jose.exportPKCS8(privateKey))
    console.log(await jose.exportSPKI(publicKey))
    return publicKey;
}

async function signMessage(message, privateKey){
    const jws = await new jose.FlattenedSign(
        new TextEncoder().encode(JSON.stringify(message)),
    )
    .setProtectedHeader({ alg: 'RS256' })
    .sign(privateKey)
    return jws.protected + '.' + jws.payload + '.' + jws.signature;
}

async function exportSPKI(publicKey){
    return jose.exportSPKI(publicKey);
}

async function importSPKI(publicKey, alg){
    return jose.importSPKI(publicKey,alg);
}

async function importPKCS8(privateKey, alg){
    return jose.importPKCS8(privateKey,alg);
}

async function verify(jws, key){
    return await jose.jwtVerify(jws, key)
}

async function verifyResponse(jws){
    let key = await importSPKI(window.serverPublicKey, 'RS256');
    return verify(jws, key)
}

window.serverPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvEKUPvO9FYdeQKIdfsQz
7HNWCUA6sczWKL6Xh0z8He66ogsVNM/9wlEnyJ6BOXqgq7DjPg0ND0tIDwRD/k2f
f3IO3NMz3ToQz36U1UuGOM3E5V/0ZcmwJApIoiAsJIHbbUkJxBxknTEknHmAqSVI
QJjzHacyv+uEu1cm6iuDvJ4Z79aDoJTt5jMlLf8/zhu+r5oYz4UcaRBihxcKx5UM
LoEDIamoQ22oUEJRdJBfJ/v7PFQMxhbNwy8nMgW3cICIWaKCjXwgPlwy6v5DhM4m
JfCSq4huxmsUVNT/+OHcLgbqukb06tVCWzE9f+NDqXHmJ0EAyVIX24LLXO7vTPnX
MwIDAQAB
-----END PUBLIC KEY-----`;
window.verify = verify;
window.verifyResponse = verifyResponse;
window.generateKeyPair = generateKeyPair;
window.signMessage = signMessage;
window.exportSPKI = exportSPKI;
window.importPKCS8 = importPKCS8;
window.importSPKI = importSPKI;