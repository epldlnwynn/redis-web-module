import CryptoJS from "crypto-js"

// 16个字符的密钥
const SECRET_KEY = "0123456789987654"

export default {

    md5(content: string) {
        return CryptoJS.MD5(content).toString().toLocaleUpperCase()
    },

    encrypt(content: any, secretKey = SECRET_KEY) {
        if (typeof(content) !== "string") content = JSON.stringify(content);

        const sk = typeof(secretKey) === "string" ? CryptoJS.enc.Utf8.parse(secretKey) : secretKey
        return CryptoJS.AES.encrypt(content, sk, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString()
    },

    decrypt(content: string, secretKey = SECRET_KEY) {

        const sk = typeof(secretKey) === "string" ? CryptoJS.enc.Utf8.parse(secretKey) : secretKey
        return CryptoJS.AES.decrypt(content, sk, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8)
    },

    encodeBase64(content: any) {
        const originalText = typeof(content) === "string" ? content : JSON.stringify(content)
        const words = CryptoJS.enc.Utf8.parse(originalText)
        return CryptoJS.enc.Base64.stringify(words)
    },

    decodeBase64(content: string) {
        return CryptoJS.enc.Base64.parse(content).toString(CryptoJS.enc.Utf8)
    },

    encodeHex(content: any) {
        const originalText = typeof(content) === "string" ? content : JSON.stringify(content)
        const words = CryptoJS.enc.Utf8.parse(originalText)
        return CryptoJS.enc.Hex.stringify(words)
    },

    decodeHex(content: string) {
        if (content.startsWith("0x")) content = content.substring(2)
        return CryptoJS.enc.Hex.parse(content).toString(CryptoJS.enc.Utf8)
    },

    binary(binary: any) {
        return CryptoJS.enc.Utf8.stringify(binary)
    }

}
