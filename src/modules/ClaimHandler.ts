import Nonce from './lib/Nonce';
import Helpers from './lib/Helper';
import { sha256 } from 'js-sha256';
import utf8 from 'utf8';
import { IClaim, UserData, PrepareUserDataParams, Hashes, ClaimObject } from '../types';



export default class ClaimHandler implements IClaim {

    private userData: UserData[] = [];



    public prepareUserData = (params: PrepareUserDataParams): UserData[] => {
        const userDataWithNonce: UserData[] = [];
        
        params.userData.forEach(userDataObject => {
            userDataWithNonce.push({ name: userDataObject.name, value: userDataObject.value, nonce: Nonce.generate() });
        });

        return userDataWithNonce;
    }


    public setUserData = (userData: UserData[]): void => {
        this.userData = userData;
    }


    public createHashes = (): Hashes => {
        const leafHashes = this.createLeafHashes(this.userData);
        const concatLeafHashes = Helpers.concatArrayElements([ ...leafHashes ]);
        const rootHash = this.createHash(concatLeafHashes);

        return { rootHash, leafHashes };
    }

    private createLeafHashes = (data: UserData[]): string[] => {
        const leafHashes: string[] = [];

        data.forEach(dataObject => {
            const concatData = Helpers.concatObjectValues({ name: dataObject.name, value: dataObject.value, nonce: dataObject.nonce });
            leafHashes.push(this.createHash(concatData));
        });

        return leafHashes;
    }

    private createHash = (data: string): string => {
        return sha256(utf8.encode(data));
    }


    public createClaim = (userDataNames: string[]): ClaimObject => {
        
        const claimData = this.getClaimData(userDataNames);
        const claimDataLeafHashes = this.createLeafHashes(claimData);
        const userDataHashes = this.createHashes();
        const claimLeafHashes = this.getClaimLeafHashes(userDataHashes.leafHashes, claimDataLeafHashes);

        const claimObject: ClaimObject = {
            userData: claimData,
            hashes: {
                leafHashes: claimLeafHashes,
                rootHash: userDataHashes.rootHash
            }
        }
        return claimObject;
    }

    private getClaimData = (userDataNames: string[]): UserData[] => {
        const claimData: UserData[] = [];

        userDataNames.forEach(name => {
            this.userData.forEach(userDataObject => {
                if(name === userDataObject.name) claimData.push(userDataObject);
            });
        });

        return claimData;
    }

    private getClaimLeafHashes = (userDataLeafHashes: string[], claimDataLeafHashes: string[]): string[] => {
        return userDataLeafHashes.filter(userDataLeafHash => {
            let addToClaim = true;

            claimDataLeafHashes.forEach(claimDataLeafHash => {
                if(userDataLeafHash === claimDataLeafHash) addToClaim = false;
            });

            return addToClaim;
        });
    }

}