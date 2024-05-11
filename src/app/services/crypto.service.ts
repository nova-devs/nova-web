import * as CryptoJS from "crypto-js";
import {environment} from "../../environments/environment";

export class AESEncryptDecryptService {

    private secretKey = environment.secretKeyCrypto;

    public encrypt(value : string) : string {
        return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
    }

    public decrypt(textToDecrypt : string) : string {
        try{
            return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
        }catch (e) {
            console.error("[DECRYPT] Decryption did not occur due to invalid format");
            return "";
        }
    }
}
