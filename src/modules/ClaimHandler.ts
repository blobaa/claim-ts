import Nonce from './lib/Nonce';
import Helpers from './lib/Helper';
import { sha256 } from 'js-sha256';
import utf8 from 'utf8';
import { IClaim, UserData, PrepareUserDataParams, Hashes } from '../types';



export default class Claim implements IClaim {

    private userData: UserData[];


    constructor(userData: UserData[]) {
        this.userData = userData;
    }


    public static prepareUserData = (params: PrepareUserDataParams): UserData[] => {
        let userDataWithNonce: UserData[] = [];
        params.userData.forEach(userDataObject => {
            userDataWithNonce.push({ name: userDataObject.name, value: userDataObject.value, nonce: Nonce.generate() });
        });
        return userDataWithNonce;
    }


    public getHashes = (): Hashes => {
        let leafHashes: string[] = [];
        
        this.userData.forEach(userDataObject => {
            let concatUserData = Helpers.concatObjectValues({ name: userDataObject.name, value: userDataObject.value, nonce: userDataObject.nonce });
            leafHashes.push(sha256(utf8.encode(concatUserData)));
        });


        let concatLeafHashes = Helpers.concatArrayElements(leafHashes);
        const rootHash = sha256(utf8.encode(concatLeafHashes));


        return { rootHash, leafHashes };
    }



}