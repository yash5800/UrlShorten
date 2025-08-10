import crypto from 'crypto'


// Generate hash-based shortcode
 export function generateHashedShortcode(url, length = 6) {
    const hash = crypto.createHash('md5').update(url).digest('hex');

    let shortcode = '';
    for (let i = 0; i < length && i < hash.length; i += 2) {
        const hexPair = hash.substr(i, 2);
        const num = parseInt(hexPair, 16);
        shortcode += num.toString(36);
    }
    
    return shortcode.substring(0, length);
}
