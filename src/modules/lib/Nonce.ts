import { NONCE_CHARACTER_SET, NONCE_LENGTH } from "../../constants"


export default class Nonce {

    public static generate = (): string => {
        let nonce = "";

        for(let i = 0; i < NONCE_LENGTH; i++) {
            nonce += NONCE_CHARACTER_SET.charAt(Math.floor(Math.random() * NONCE_CHARACTER_SET.length));
        }
        return nonce;
    }
} 